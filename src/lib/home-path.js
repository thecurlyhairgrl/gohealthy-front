export const getHomePath = (user) => {
    if (!user) {
        return '/auth/login'
    }
    if (user.role === 'nutritionist') {
        return '/nutriologo'
    }
    if (user.mustChangePassword) {
        return '/primer-ingreso/contrasena'
    }
    if (!user.onboardingCompleted) {
        return '/primer-ingreso/datos'
    }
    return '/paciente'
}