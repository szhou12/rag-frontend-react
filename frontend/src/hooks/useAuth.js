import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

// TODO: openapi auto-generate: UsersService, LoginService

/**
 * Check if the user is logged in. Used to decide whether to fetch the current user's data (readUserMe)
 * @returns {boolean}
 * 
 * TODO: localStorage is a globally accessible object. Not a safe practice.
 *       Switch to HTTP-only cookies for tokens in production!
 */
const isLoggedIn = () => {
    return localStorage.getItem("access_token") !== null
}


 const useAuth = () => {
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { showErrorToast } = useCustomToast()

    /**
     * Fetch the currently logged-in user's data.
     *  `queryKey`: A unique key ("currentUser") used for caching and tracking this query.
     *  `queryFn`: The actual API call (`UsersService.readUserMe`) that fetches user data.
     *  `enabled`: The query ONLY runs if `isLoggedIn()` returns true (meaning there's an access token present).
     * Data (`user`) will be `undefined` until the query completes. On success, `user` contains the current user's profile info.
     */
    const { data: user } = useQuery({
        queryKey: ["currentUser"],
        queryFn: UsersService.readUserMe,
        enabled: isLoggedIn(),
    })

    /**
     * Calls registerUser to register a new user.
     * On success: Redirect to /login.
     * On error: Display an error toast notification.
     * On settle (regardless of success/fail): Invalidate users cache (probably to refresh the user list).
     */
    const signUpMutation = useMutation({
        // data: <UserRegister>
        mutationFn: (data) => 
            UsersService.registerUser({ requestBody: data }),

        onSuccess: () => {
            navigate({ to: "/login" })
        },

        // err: <ApiError>
        onError: (err) => {
            handleError(err, showErrorToast)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })

    /**
     * Calls loginAccessToken to get a token.
     * Saves token to localStorage.
     * @param {Body_login_login_access_token} data 
     */
    const login = async (data) => {
        const response = await LoginService.loginAccessToken({
            formData: data,
        })
        // TODO: replace localStorage
        localStorage.setItem("access_token", response.access_token)
    }

    /**
     * Wraps the login function in a mutation.
     * On success: Redirect to home page.
     * On error: Display an error toast notification.
     */
    const loginMutation = useMutation({
        mutationFn: login,

        onSuccess: () => {
            // TODO: redirect to role-based home page - client->chat, staff->dashboard
            navigate({ to: "/" })
        },

        // err: <ApiError>
        onError: (err) => {
            handleError(err, showErrorToast)
        },     
    })

    /**
     * Clears token and redirects to login page.
     */
    const logout = () => {
        // TODO: replace localStorage
        localStorage.removeItem("access_token")
        navigate({ to: "/login" })
    }

    return {
        signUpMutation,
        loginMutation,
        logout,
        user,
        error,
        resetError: () => setError(null),
    }

 }
    

 export { isLoggedIn }
 export default useAuth