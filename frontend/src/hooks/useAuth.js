import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { jwtDecode } from "jwt-decode"

import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

// TODO: DELETE when frontend OpenAPI auto-generation is ready!!!
import axios from 'axios';

const API_URL = 'http://localhost:8001'; // allow backend URL

const loginUser = async (credentials) => {

    try {
        const params = new URLSearchParams();
        for (const key in credentials) {
            params.append(key, credentials[key]);
        }

        // // Map roles to their corresponding scopes
        // const scopeMap = {
        //     'client': 'chat',
        //     'staff': 'chat dashboard',
        //     'admin': 'chat dashboard dashboard:admin'
        // };

        // // Basic credentials
        // params.append('username', credentials.username);
        // params.append('password', credentials.password);
        
        // // Add scopes based on role
        // const scope = scopeMap[credentials.role] || 'chat';  // Default to 'chat' if role not found
        // params.append('scope', scope);  // Note: using 'scope' (singular) as required by OAuth2


        // POST request goes to backend/demo/auth.py
        // TODO: change to /login/token for formal endpoint
        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        // response.data = { access_token: ..., token_type: "bearer"}
        return response.data
    } catch (error) {
        console.error("Login error: ", error);
        throw error;
    }
};

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);

        console.log('Registration data saved to DB:', response.data);

    } catch (error) {
        console.error("Register error: ", error);
        throw error;
    }
};

const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/users/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error: ", error);
        throw error;
    }
};

// TODO: openapi auto-generate: UsersService, LoginService

// TODO: DELETE when backend is ready!!!
const UsersService = {
    readUserMe: async () => {
        // return the user from localStorage if it exists
        // console.log("triggering UsersService.readUserMe...")
        // const user = localStorage.getItem("user")
        // console.log('user from localStorage:', user)
        // if (user) {
        //     return JSON.parse(user)
        // }
        // return null
        try {
            const token = localStorage.getItem("access_token")

            const response = await axios.get(
                `${API_URL}/users/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log('user from UsersService.readUserMe:', response.data);
            return response.data;
        } catch (error) {
            console.error("Fetch user profile error: ", error);
            throw error;
        }
    }
};

/**
 * Utility function (NOT a hook)
 * Check if the user is logged in (if token exists in localStorage). Used to direct users to the web pages.
 * @returns {boolean}
 * 
 * TODO: localStorage is a globally accessible object. Not a safe practice.
 *       Switch to HTTP-only cookies for tokens in production!
 */
const isLoggedIn = () => {
    const token = localStorage.getItem("access_token")
    if (!token) return false
    
    try {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decodedToken.exp < currentTime) {
            // token expired
            localStorage.removeItem("access_token")
            return false
        }

        return true
    } catch (error) {
        localStorage.removeItem("access_token");
        return false
    }
        
}

const getUserRole = async () => {
    if (!isLoggedIn()) {
        return null
    }

    try {
        const response = await UsersService.readUserMe()
        return response?.role || null
    } catch (error) {
        console.error("Error getting user role:", error)
        return null
    }
}


/**
 * TODO: DELETE when access_token expiration is implemented!!!
 */
// const isLoggedIn = () => {
//     const token = localStorage.getItem("access_token");
//     const expiresAt = localStorage.getItem("expires_at");
    
//     if (!token || !expiresAt) {
//         return false;
//     }
    
//     // Check if token has expired
//     const now = new Date().getTime();
//     if (now > parseInt(expiresAt)) {
//         // Token expired, clean up localStorage
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("expires_at");
//         localStorage.removeItem("user");
//         return false;
//     }
    
//     return true;
// }



/**
 * React Hook that manages user authentication state and actions.
 * 
 * @returns {Object} An object containing:
 *   - signUpMutation: A mutation for user registration.
 *   - loginMutation: A mutation for user login.
 *   - logout: A function to log out the user.
 *   - user: The currently logged-in user's profile data.
 *   - error: The error state for the authentication process.
 */
const useAuth = () => {
    const { showSuccessToast, showErrorToast } = useCustomToast()
    
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    /**
     * Sign Up Process
     */
    // ONLY used for Sign Up process. Has nothing to do with useQuery()
    const queryClient = useQueryClient()
    

    /**
     * Mock implementation of user registration
     * Simulates backend validation and response
     */
    // const mockRegisterUser = async (data) => {
    //     console.log('Registration attempt with:', data);
        
    //     // Simulate network delay
    //     await new Promise(resolve => setTimeout(resolve, 800));
        
    //     // Mock validation checks
    //     if (data.email.includes('exists')) {
    //         throw new Error('Email already exists');
    //     }
        
    //     if (data.password.length < 8) {
    //         throw new Error('Password must be at least 8 characters');
    //     }
        
    //     // Simulate successful registration
    //     return {
    //         id: Math.random().toString(36).substring(2, 15),
    //         email: data.email,
    //         password: data.password,
    //         createdAt: new Date().toISOString()
    //     };
    // };

    const mockRegisterUser = async (data) => {

        try {
            await registerUser(data);

        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }



    }

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

    /**
     * Log In Process
     */


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

    const login = async (data) => {
        // LoginForm passed in data = { email, password }
        
        // Step 1: POST request to authenticate input email & password, return JWT token
        // TODO: replace with LoginService.loginAccessToken by OpenAPI
         const response = await loginUser({
            username: data.email, // map email to username as OAuth2PasswordRequestForm requires username
            password: data.password,
        });

        // Step 2: Store JWT token in localStorage
        localStorage.setItem("access_token", response.access_token);

    }



    /**
     * Wraps the login function in a mutation.
     * On success: Redirect to home page.
     * On error: Display an error toast notification.
     */
    const loginMutation = useMutation({
        mutationFn: login,

        onSuccess: () => {
            // // Step 3: Invalidate currentUser info in React Query cache
            // queryClient.invalidateQueries({ queryKey: ["currentUser"] });

            // // Step 4: Explicitly fetch newly logged-in user info from DB, store in cache
            // const newUserData = await queryClient.fetchQuery({
            //     queryKey: ["currentUser"],
            //     queryFn: UsersService.readUserMe,
            // });

            // // Step 5: Redirect based on newly fetched user role
            // if (newUserData.role === 'client') {
            //     navigate({ to: "/chat" });
            // } else {
            //     navigate({ to: "/dashboard/index" });
            // }

            // Step 3: Once login succeeds, navigate to Chat page for all roles
            navigate({ to: "/chat" })


        },

        // err: <ApiError>
        onError: (err) => {
            handleError(err, showErrorToast)
        },     
    })

    /**
     * Log Out Process
     * Clears token and redirects to login page.
     */
    const logout = () => {
        // TODO: replace localStorage
        localStorage.removeItem("access_token")
        queryClient.clear() // clear all data in the global cache
        navigate({ to: "/" })
    }

    /**
     * Post-Login Process: Fetch the currently logged-in user's data.
     */

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
     * what this function means:
     * 1. enabled: this function only runs if user is logged in (has access token)
     * 2. queryFn: useQuery calls UsersService.readUserMe to get user's profile data. Expects a Promise so needs async fcn.
     * 3. queryKey: user's profile data is stored in React Query's cache under the name ["currentUser"]
     * 4. data: queryUser: user's profile data is returned under the name "queryUser"
     */
    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: UsersService.readUserMe,
        enabled: isLoggedIn(),
    })
    // Step 2. Gets user from localStorage as fallback
    // const userFromStorage = isLoggedIn() 
    //     ? JSON.parse(localStorage.getItem("user") || "null") 
    //     : null;
    // // Step 3. Construct returned user object by using React Query data if available, falls back to localStorage
    // const user = queryUser || userFromStorage;
    console.log('UserResponse from useQuery:', user);

    const isAdmin = () => {
        return user?.role === 'admin';
    }

    return {
        signUpMutation,
        loginMutation,
        logout,
        user, // currently logged-in user from useQuery()
        isLoadingUser,
        error,
        resetError: () => setError(null),
        isAdmin,
    }
}
    
export { isLoggedIn, getUserRole }
export default useAuth