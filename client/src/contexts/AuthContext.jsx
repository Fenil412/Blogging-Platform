import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
axios.defaults.withCredentials = true // Important for cookies
axios.defaults.timeout = 10000

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requiresOtp, setRequiresOtp] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState("")

  const navigate = useNavigate()

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/api/v1/users/current-user")
      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      console.log("Not authenticated")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData) => {
    try {
      setLoading(true)

      // Create FormData for file uploads
      const uploadData = new FormData()
      uploadData.append("fullName", formData.fullName)
      uploadData.append("email", formData.email)
      uploadData.append("username", formData.username)
      uploadData.append("password", formData.password)

      if (formData.avatar) {
        uploadData.append("avatar", formData.avatar)
      }
      if (formData.coverImage) {
        uploadData.append("coverImage", formData.coverImage)
      }

      const response = await axios.post("/api/v1/users/register", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return {
        success: true,
        message: response.data.message || "Registration successful",
        data: response.data.data,
      }
    } catch (error) {
      console.error("Registration failed:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, username, password }) => {
    try {
      setLoading(true)

      const loginData = { password }
      if (email) loginData.email = email
      if (username) loginData.username = username

      const response = await axios.post("/api/v1/users/login", loginData)

      if (response.data.data?.requiresOtp) {
        setRequiresOtp(true)
        setEmailForOtp(email || username)
        return {
          success: true,
          requiresOtp: true,
          message: response.data.data.message || "OTP sent to your email",
        }
      }

      return {
        success: false,
        message: "Unexpected login response",
      }
    } catch (error) {
      console.error("Login failed:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (otp) => {
    try {
      setLoading(true)

      const response = await axios.post("/api/v1/users/verify-otp", {
        email: emailForOtp,
        otp,
      })

      if (response.data.success) {
        setUser(response.data.data.user)
        setRequiresOtp(false)
        setEmailForOtp("")

        return {
          success: true,
          message: response.data.message || "Login successful",
        }
      }

      return {
        success: false,
        message: "OTP verification failed",
      }
    } catch (error) {
      console.error("OTP verification failed:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Invalid OTP. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axios.post("/api/v1/users/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setRequiresOtp(false)
      setEmailForOtp("")
      navigate("/login")
    }
  }

  const refreshToken = async () => {
    try {
      const response = await axios.post("/api/v1/users/refresh-token")
      return response.data.success
    } catch (error) {
      console.error("Token refresh failed:", error)
      logout()
      return false
    }
  }

  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      const response = await axios.post("/api/v1/users/change-password", {
        oldPassword,
        newPassword,
      })

      return {
        success: true,
        message: response.data.message || "Password changed successfully",
      }
    } catch (error) {
      console.error("Password change failed:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to change password",
      }
    }
  }

  const updateAccountDetails = async ({ fullName, email }) => {
    try {
      const response = await axios.patch("/api/v1/users/update-account", {
        fullName,
        email,
      })

      if (response.data.success) {
        setUser(response.data.data)
        return {
          success: true,
          message: response.data.message || "Account updated successfully",
        }
      }

      return {
        success: false,
        message: "Failed to update account",
      }
    } catch (error) {
      console.error("Account update failed:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update account",
      }
    }
  }

  const updateAvatar = async (avatarFile) => {
    try {
      const formData = new FormData()
      formData.append("avatar", avatarFile)

      const response = await axios.patch("/api/v1/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        setUser(response.data.data)
        return {
          success: true,
          message: response.data.message || "Avatar updated successfully",
        }
      }

      return {
        success: false,
        message: "Failed to update avatar",
      }
    } catch (error) {
      console.error("Avatar update failed:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update avatar",
      }
    }
  }

  const updateCoverImage = async (coverImageFile) => {
    try {
      const formData = new FormData()
      formData.append("coverImage", coverImageFile)

      const response = await axios.patch("/api/v1/users/cover-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        setUser(response.data.data)
        return {
          success: true,
          message: response.data.message || "Cover image updated successfully",
        }
      }

      return {
        success: false,
        message: "Failed to update cover image",
      }
    } catch (error) {
      console.error("Cover image update failed:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update cover image",
      }
    }
  }

  const getUserChannelProfile = async (username) => {
    try {
      const response = await axios.get(`/api/v1/users/c/${username}`)

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        }
      }

      return {
        success: false,
        message: "Failed to fetch channel profile",
      }
    } catch (error) {
      console.error("Failed to fetch channel profile:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch channel profile",
      }
    }
  }

  const getWatchHistory = async () => {
    try {
      const response = await axios.get("/api/v1/users/history")

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        }
      }

      return {
        success: false,
        message: "Failed to fetch watch history",
      }
    } catch (error) {
      console.error("Failed to fetch watch history:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch watch history",
      }
    }
  }

  // Setup axios interceptor for automatic token refresh
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && user) {
          // Try to refresh token
          const refreshed = await refreshToken()
          if (refreshed) {
            // Retry the original request
            return axios.request(error.config)
          }
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [user])

  const value = {
    user,
    loading,
    requiresOtp,
    emailForOtp,
    isAuthenticated: !!user,
    register,
    login,
    verifyOtp,
    logout,
    refreshToken,
    changePassword,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
