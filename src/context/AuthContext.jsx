import { createContext, useContext, useState } from 'react'
import { loginRequest, registerRequest, getMeRequest } from '@/api/auth'

const AuthContext = createContext(null)

const readSavedUser = () => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readSavedUser)

    function saveSession(data) {
        localStorage.setItem('token', data.token)
        saveUser(data.user)
    }

    function saveUser(nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser))
        setUser(nextUser)
    }

    async function login(email, password) {
        const data = await loginRequest({ email, password })
        saveSession(data)
        return data.user
    }

    async function register(formData) {
        const data = await registerRequest(formData)
        saveSession(data)
        return data.user
    }

    // Después de cambiar la contraseña, el onboarding o el perfil
    async function refreshUser() {
        const freshUser = await getMeRequest()
        saveUser(freshUser)
        return freshUser
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const value = { user, isAuthenticated: Boolean(user), login, register, refreshUser, saveUser, logout }

    return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}