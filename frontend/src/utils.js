
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