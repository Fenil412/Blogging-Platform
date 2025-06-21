import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function SignUpPage() {
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    avatar: null,
    coverImage: null,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }))

      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "avatar") {
          setAvatarPreview(e.target.result)
        } else {
          setCoverPreview(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.avatar) {
      setError("Avatar image is required")
      return
    }

    const result = await register(formData)

    if (result.success) {
      setSuccess(result.message)
      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: "",
        avatar: null,
        coverImage: null,
      })
      setAvatarPreview(null)
      setCoverPreview(null)
    } else {
      setError(result.message)
    }
  }

  return (
    <div style={styles.card}>
      <h2>Create Account</h2>
      <p style={styles.description}>Fill in your details to create a new account</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label htmlFor="avatar">Avatar Image *</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "avatar")}
            required
            style={styles.input}
          />
          {avatarPreview && (
            <div style={styles.avatarPreviewContainer}>
              <img src={avatarPreview} alt="Avatar preview" style={styles.avatarImage} />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="coverImage">Cover Image (Optional)</label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "coverImage")}
            style={styles.input}
          />
          {coverPreview && (
            <div style={styles.coverPreviewContainer}>
              <img src={coverPreview} alt="Cover preview" style={styles.coverImage} />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  )
}

const styles = {
  card: {
    maxWidth: "500px",
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
    marginTop: "0.25rem",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
  success: {
    color: "green",
    fontSize: "0.9rem",
  },
  description: {
    marginBottom: "1rem",
    color: "#555",
  },
  avatarPreviewContainer: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid #ccc",
    marginTop: "0.5rem",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverPreviewContainer: {
    width: "100%",
    height: "96px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #ccc",
    marginTop: "0.5rem",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}
