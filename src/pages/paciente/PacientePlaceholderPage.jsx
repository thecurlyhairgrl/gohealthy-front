/**
 * Página placeholder para las secciones del paciente que aún no tienen implementación.
 * Se reemplazará por la página real cuando se implemente cada spec individual.
 */
function PacientePlaceholderPage({ titulo }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {titulo}
      </h1>
      <p className="mt-2 text-sm">
        Esta sección está en desarrollo.
      </p>
    </div>
  )
}

export default PacientePlaceholderPage
