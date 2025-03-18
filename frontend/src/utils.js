import { z } from "zod"

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
 * Take page parameter from URL ("/admin?page=2") and Do 2 things:
 * 1. Validate: validate if page param's value a number
 * 2. Convert: 
 *      if not a number, convert to a number {page: "2"} -> {page: 2}; 
 *      if missing or invalid, set to default: {page: "abc"} -> {page: 1}
 * 
 */
export const pageSearchSchema = z.object({
    page: z.number().catch(1),
})