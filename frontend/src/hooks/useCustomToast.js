"use client"

import { toaster } from "@/components/ui/toaster"

const useCustomToast = () => {
    
    const showSuccessToast = (description) => {
        toaster.create({
            title: "Success!",
            description,
            type: "success",
        })
    }

    const showErrorToast = (description) => {
        toaster.create({
            title: "Error!",
            description,
            type: "error",
        })
    }

    const showLoadingToast = (description) => {
        toaster.create({
            description,
            type: "loading",
        })
    }

    return { showSuccessToast, showErrorToast, showLoadingToast }
    
}

export default useCustomToast