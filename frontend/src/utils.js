import { z } from "zod"
import { EventSourceParserStream } from 'eventsource-parser/stream';

/**
 * Handle API errors by displaying a toast notification with the error message.
 * @param {ApiError} err 
 * @param {Function} showErrorToast - A useCustomToast hook
 */
export const handleError = (err, showErrorToast) => {

    const errDetail = err.body?.detail
    let errorMessage = errDetail || "Something went wrong!"
    if (Array.isArray(errDetail) && errDetail.length > 0) {
        errorMessage = errDetail[0].msg
    }
    showErrorToast(errorMessage)
}

/**
 * Object for Email validation pattern
 */
export const emailPattern = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address",
}


/**
 * Generates validation rules for a password field.
 *
 * @param {boolean} [isRequired=true] - Whether the password field is required.
 * @returns {Object} Validation rules for react-hook-form's `register()` function.
 */
export const passwordRules = (isRequired = true) => {
    const rules = {
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
        },
    }

    if (isRequired) {
        rules.required = "Password is required"
    }

    return rules
}


/**
 * Creates validation rules for password confirmation fields
 * 
 * @param {Function} getValues - React Hook Form's getValues function to access form values
 * @param {boolean} [isRequired=true] - Whether the confirmation field is required
 * @returns {Object} Validation rules object for React Hook Form
 * 
 * @example
 * // In a form component
 * const { register, getValues } = useForm();
 * 
 * // Then in JSX
 * <Input {...register("confirmPassword", confirmPasswordRules(getValues))} />
 */
export const confirmPasswordRules = (getValues, isRequired = true) => {
    const rules = {
        validate: (value) => {
            const password = getValues().password || getValues().new_password
            return value === password ? true : "Passwords do not match"
        },
    }

    if (isRequired) {
        rules.required = "Password confirmation is required"
    }

    return rules
}

/**
 * Validate URL using Built-in Browser Validation
 */
export const urlPattern = {
    validate: (value) => {
        try {
            new URL(value);
            return true;
        } catch (error) {
            return "Please enter a valid URL";
        }
    }
}

/**
 * 
 * Take page parameter from URL ("/admin?page=2") and DO 2 things:
 * 1. Validate: validate if page param's value a number
 * 2. Convert: 
 *      if not a number, convert to a number {page: "2"} -> {page: 2}; 
 *      if missing or invalid, set to default: {page: "abc"} -> {page: 1}
 * 
 */
export const pageSearchSchema = z.object({
    page: z.number().catch(1),
})

/**
 * Pipeline to streamline HTTP response from server (your backend or OpenAI API)
 * 1. Read from a streaming HTTP response
 * 2. Decode it (binary -> text)
 * 3. Parse it as SSE (text -> structured SSE events)
 * 4. Yield just the useful .data fields
 * 
 * async function* = asynchronous generator function
 * so it can yield data and you can call this fcn by `for await {each chunk of fcn}`
 */
export async function* parseSSEStream(stream) {
    // stream: A ReadableStream from the Response.body (binary chunks). In SSE format.
    // TextDecoderStream: Convert binary chunks to text
    // EventSourceParserStream: Parses the text stream into structured SSE events. i.e. clean JavaScript payloads (valid JSON) so can reliably extract each meaningful message (.data)
    // getReader: Returns a reader to manually pull each parsed event
    const sseReader = stream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .getReader();

    while (true) {
        const {done, value} = await sseReader.read();
        if (done) break;

        if (!value) continue;
        let payload = value.data;

        // Server sends JSON-wrapped chunks so newline characters survive SSE transport
        if (typeof payload === 'string') {
            try {
                const parsed = JSON.parse(payload);
                if (parsed && typeof parsed === 'object' && 'chunk' in parsed) {
                    payload = parsed.chunk;
                }
            } catch (err) {
                // Non-JSON payloads fall back to raw string
            }
        }

        if (payload !== undefined && payload !== null) {
            yield payload;
        }
    }
}
