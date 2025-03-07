
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