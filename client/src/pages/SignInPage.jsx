"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function LoginForm() {
  const { login, verifyOtp, loading, requiresOtp } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  })
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loginMethod, setLoginMethod] = useState("email")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const loginData = {
      password: formData.password,
    }

    if (loginMethod === "email") {
      loginData.email = formData.email
    } else {
      loginData.username = formData.username
    }

    const result = await login(loginData)

    if (result.success && result.requiresOtp) {
      setSuccess(result.message)
    } else if (!result.success) {
      setError(result.message)
    }
  }

  const handleOtpVerification = async (e) => {
    e.preventDefault()
    setError("")
    const result = await verifyOtp(otp)
    if (result.success) {
      setSuccess(result.message)
    } else {
      setError(result.message)
    }
  }

  if (requiresOtp) {
    return (
      <div style={styles.card}>
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit code sent to your email</p>
        <form onSubmit={handleOtpVerification} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <div>
            <label htmlFor="otp">OTP Code</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2>Sign In</h2>
      <p>Enter your credentials to access your account</p>
      <form onSubmit={handleLogin} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <div style={styles.toggle}>
          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            style={{
              ...styles.toggleButton,
              backgroundColor: loginMethod === "email" ? "#ccc" : "#f9f9f9",
            }}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("username")}
            style={{
              ...styles.toggleButton,
              backgroundColor: loginMethod === "username" ? "#ccc" : "#f9f9f9",
            }}
          >
            Username
          </button>
        </div>
        {loginMethod === "email" ? (
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
        )}
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}

const styles = {
  card: {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 0 8px rgba(0,0,0,0.05)",
    background: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "0.6rem",
    fontSize: "1rem",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  toggle: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  toggleButton: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    background: "#f9f9f9",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
  success: {
    color: "green",
    fontSize: "0.9rem",
  },
}
