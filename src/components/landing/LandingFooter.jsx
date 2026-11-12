export function LandingFooter() {
  return (
    <footer className="bg-secondary px-4 py-14 text-secondary-foreground">
      <div className="mx-auto grid max-w-5xl gap-8 text-center text-sm sm:grid-cols-3">
        <p>© {new Date().getFullYear()} GoHealthy. Todos los derechos reservados.</p>
        <p>Aviso de privacidad y términos y condiciones disponibles próximamente.</p>
        <p>¿Dudas? Escríbenos a hola@gohealthy.com</p>
      </div>
    </footer>
  )
}
