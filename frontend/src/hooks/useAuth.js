import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

// TODO: openapi auto-generate: UsersService, LoginService

// TODO: DELETE when backend is ready!!!
const UsersService = {
    readUserMe: async () => {
        // return the user from localStorage if it exists
        console.log("triggering UsersService.readUserMe...")
        const user = localStorage.getItem("user")
        console.log('user from localStorage:', user)
        if (user) {
            return JSON.parse(user)
        }
        return null
    }
};

/**
 * TODO: Comment off when access_token expiration is implemented!!!
 * Check if the user is logged in. Used to decide whether to fetch the current user's data (readUserMe)
 * @returns {boolean}
 * 
 * TODO: localStorage is a globally accessible object. Not a safe practice.
 *       Switch to HTTP-only cookies for tokens in production!
 */
// const isLoggedIn = () => {
//     return localStorage.getItem("access_token") !== null
// }


/**
 * TODO: DELETE when access_token expiration is implemented!!!
 */
const isLoggedIn = () => {
    const token = localStorage.getItem("access_token");
    const expiresAt = localStorage.getItem("expires_at");
    
    if (!token || !expiresAt) {
        return false;
    }
    
    // Check if token has expired
    const now = new Date().getTime();
    if (now > parseInt(expiresAt)) {
        // Token expired, clean up localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("user");
        return false;
    }
    
    return true;
}


const useAuth = () => {
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    const { showSuccessToast, showErrorToast } = useCustomToast()


    /**
     * Fetch the currently logged-in user's data.
     *  `queryKey`: Tthis query has a name "currentUser". Helps React Query track and update the data under this name.
     *  `queryFn`: The actual API call (`UsersService.readUserMe`) that fetches user data.
     *  `enabled`: This query ONLY runs if `isLoggedIn()` returns true (meaning there's an access token present).
     * Data (`user`) will be `undefined` until the query completes. On success, `user` contains the current user's profile info.
     */

    // TODO: Comment off when u manage to make queryFn execute!!!
    // const { data: user } = useQuery({
    //     queryKey: ["currentUser"],
    //     queryFn: UsersService.readUserMe,
    //     enabled: isLoggedIn(),
    // })

    /**
     * TODO: DELETE when u manage to make queryFn execute!!!
     * Step 1. Attempts to get user from React Query
     */
    const { data: queryUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: UsersService.readUserMe,
        enabled: isLoggedIn(),
    })
    // Step 2. Gets user from localStorage as fallback
    const userFromStorage = isLoggedIn() 
        ? JSON.parse(localStorage.getItem("user") || "null") 
        : null;
    // Step 3. Construct returned user object by using React Query data if available, falls back to localStorage
    const user = queryUser || userFromStorage;

    /**
     * Mock implementation of user registration
     * Simulates backend validation and response
     */
    const mockRegisterUser = async (data) => {
        console.log('Registration attempt with:', data);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock validation checks
        if (data.email.includes('exists')) {
            throw new Error('Email already exists');
        }
        
        if (data.password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }
        
        // Simulate successful registration
        return {
            id: Math.random().toString(36).substring(2, 15),
            email: data.email,
            password: data.password,
            createdAt: new Date().toISOString()
        };
    };

    /**
     * Calls registerUser to register a new user.
     * NOTE: register NOT async.
     * On success: Redirect to /login.
     * On error: Display an error toast notification.
     * On settle (regardless of success/fail): Invalidate users cache (probably to refresh the user list).
     */
    const signUpMutation = useMutation({
        // TODO: Comment off when backend is ready!!!
        // data: <UserRegister>
        // mutationFn: (data) => 
        //     UsersService.registerUser({ requestBody: data }),

        mutationFn: mockRegisterUser, // TODO: DELETE when backend is ready!!!

        onSuccess: () => {
            showSuccessToast('Account created! You can now log in with your credentials')
            
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

    // TODO: Comment off when backend is ready!!!
    /**
     * Calls loginAccessToken to get a token.
     * Saves token to localStorage.
     * NOTE: login needs async because it needs to wait for API response (token) from backend
     * @param {Body_login_login_access_token} data 
     */
    // const login = async (data) => {
    //     const response = await LoginService.loginAccessToken({
    //         formData: data,
    //     })
    //     // TODO: replace localStorage
    //     localStorage.setItem("access_token", response.access_token)
    // }

    /**
     * TODO: DELETE when backend is ready!!!
     * Simulates a successful login API call for frontend testing
     */
    const login = async (data) => {
        console.log('login attempt:', data);

        // Login type: client, staff, admin

        // Check login endpoint type (regular login vs staff login)
        let role = data.loginType === 'staff' ? (data.isAdmin ? 'admin' : 'staff') : 'client';

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Set expiration time (e.g., 30s from now)
        const expiresAt = new Date().getTime() + (30 * 1000);

        if (data.email === "abc@email.com" && data.password === "11111111") {
            const mockResponse = {
                access_token: 'mock-jwt-token-client',
                user: {
                    id: '001',
                    email: data.email,
                    name: 'Test client',
                    role: 'client'
                }
            };
            // Store token in localStorage
            localStorage.setItem("access_token", mockResponse.access_token);
            localStorage.setItem("expires_at", expiresAt.toString());
            // Optionally store user data
            localStorage.setItem("user", JSON.stringify(mockResponse.user));
            return mockResponse;
        } 
        else if (data.email === "staff@email.com" && data.password === "11111111") {
            const mockResponse = {
                access_token: 'mock-jwt-token-staff',
                user: {
                    id: '002',
                    email: data.email,
                    name: 'Test Staff',
                    role: role
                }
            };

            localStorage.setItem("access_token", mockResponse.access_token);
            localStorage.setItem("expires_at", expiresAt.toString());
            localStorage.setItem("user", JSON.stringify(mockResponse.user));
            return mockResponse;
        }
        else {
            // For testing different credentials, still return success
            // In a real implementation, you might want to throw an error for invalid credentials
            const mockResponse = {
                access_token: `mock-token-for-${role}-${data.email}`,
                user: {
                    id: Math.random().toString(36).substring(2, 15),
                    email: data.email,
                    name: `Generic ${role.charAt(0).toUpperCase() + role.slice(1)}`,
                    role: role
                }
            };
            localStorage.setItem("access_token", mockResponse.access_token);
            localStorage.setItem("expires_at", expiresAt.toString());
            localStorage.setItem("user", JSON.stringify(mockResponse.user));

            return mockResponse;
        }

        // Uncomment to simulate login failure for testing error handling
        // throw new Error('Invalid credentials');
    }


    /**
     * Wraps the login function in a mutation.
     * On success: Redirect to home page.
     * On error: Display an error toast notification.
     */
    const loginMutation = useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            // Get user role from the response or from localStorage
            const user = data.user || JSON.parse(localStorage.getItem("user"));
            const role = user?.role || 'client';
            
            // Redirect based on role
            if (role === 'client') {
                navigate({ to: "/chat" });
            } else {
                navigate({ to: "/dashboard" });
            }
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
        navigate({ to: "/" })
    }

    const isAdmin = () => {
        return user?.role === 'admin';
    }

    return {
        signUpMutation,
        loginMutation,
        logout,
        user, // currently logged-in user from useQuery()
        error,
        resetError: () => setError(null),
        isAdmin,
    }
}
    
export { isLoggedIn }
export default useAuth