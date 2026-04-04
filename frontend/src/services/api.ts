import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api"
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle 401 with refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          { refreshToken }
        )

        const newAccessToken = res.data.accessToken

        // Save new token
        localStorage.setItem("accessToken", newAccessToken)

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)

      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  }
)

export default api