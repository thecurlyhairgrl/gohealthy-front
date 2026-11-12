import { useMemo } from 'react'
import { Plus, Video, MapPin } from 'lucide-react'

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

/**
 * Cuadrícula de calendario en vista mensual.
 * Renderiza los días de la semana y las celdas con sus respectivas citas.
 */
export function CalendarioMensual({
  fechaReferencia,
  citas = [],
  onSeleccionarDia,
  onAgendarEnFecha,
}) {
  const anio = fechaReferencia.getFullYear()
  const mes = fechaReferencia.getMonth()

  // Formato YYYY-MM-DD para comparar hoy
  const hoyStr = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`
  }, [])

  // Agrupar citas por fecha 'YYYY-MM-DD'
  const citasPorFecha = useMemo(() => {
    const mapa = {}
    citas.forEach((c) => {
      if (!mapa[c.fecha]) mapa[c.fecha] = []
      mapa[c.fecha].push(c)
    })
    return mapa
  }, [citas])

  // Generar la matriz de días para el mes
  const celdasMes = useMemo(() => {
    const primerDiaMes = new Date(anio, mes, 1)
    const ultimoDiaMes = new Date(anio, mes + 1, 0)

    // Día de la semana (0 = Dom, 1 = Lun, ..., 6 = Sáb) convertido a base Lunes (0 = Lun, ..., 6 = Dom)
    let diaInicio = primerDiaMes.getDay() - 1
    if (diaInicio === -1) diaInicio = 6 // Domingo

    const diasTotalesMes = ultimoDiaMes.getDate()
    const celdas = []

    // Días del mes anterior para rellenar
    const ultimoDiaMesAnterior = new Date(anio, mes, 0).getDate()
    for (let i = diaInicio - 1; i >= 0; i--) {
      const diaNum = ultimoDiaMesAnterior - i
      const mesAnt = mes === 0 ? 11 : mes - 1
      const anioAnt = mes === 0 ? anio - 1 : anio
      const fechaStr = `${anioAnt}-${String(mesAnt + 1).padStart(2, '0')}-${String(
        diaNum
      ).padStart(2, '0')}`
      celdas.push({
        numero: diaNum,
        fechaStr,
        esMesActual: false,
      })
    }

    // Días del mes actual
    for (let d = 1; d <= diasTotalesMes; d++) {
      const fechaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(
        2,
        '0'
      )}`
      celdas.push({
        numero: d,
        fechaStr,
        esMesActual: true,
      })
    }

    // Días del mes siguiente para completar cuadrícula (múltiplo de 7)
    const resto = celdas.length % 7
    if (resto > 0) {
      const faltan = 7 - resto
      for (let n = 1; n <= faltan; n++) {
        const mesSig = mes === 11 ? 0 : mes + 1
        const anioSig = mes === 11 ? anio + 1 : anio
        const fechaStr = `${anioSig}-${String(mesSig + 1).padStart(2, '0')}-${String(
          n
        ).padStart(2, '0')}`
        celdas.push({
          numero: n,
          fechaStr,
          esMesActual: false,
        })
      }
    }

    return celdas
  }, [anio, mes])

  return (
    <div className="rounded-xl border border-border/70 bg-card shadow-xs overflow-hidden">
      {/* Encabezado de los días de la semana */}
      <div className="grid grid-cols-7 border-b border-border/70 bg-muted/40 text-center text-xs font-semibold text-muted-foreground py-2.5">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="uppercase tracking-wider">
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
        {celdasMes.map((celda, idx) => {
          const citasDelDia = citasPorFecha[celda.fechaStr] || []
          const esHoy = celda.fechaStr === hoyStr
          const citasVisibles = citasDelDia.slice(0, 2)
          const restantes = citasDelDia.length - citasVisibles.length

          return (
            <div
              key={`${celda.fechaStr}-${idx}`}
              onClick={() => onSeleccionarDia(celda.fechaStr)}
              className={`group relative min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 transition-colors cursor-pointer flex flex-col justify-between ${
                celda.esMesActual
                  ? 'bg-card hover:bg-muted/30'
                  : 'bg-muted/15 text-muted-foreground/50 hover:bg-muted/30'
              }`}
            >
              {/* Encabezado de la celda: Número de día y botón de añadir */}
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-xs sm:text-sm font-semibold inline-flex size-6 sm:size-7 items-center justify-center rounded-full transition-colors ${
                    esHoy
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : celda.esMesActual
                      ? 'text-foreground'
                      : 'text-muted-foreground/60'
                  }`}
                >
                  {celda.numero}
                </span>

                {/* Botón rápido para agregar cita en este día */}
                <button
                  type="button"
                  aria-label={`Agendar cita el ${celda.fechaStr}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onAgendarEnFecha(celda.fechaStr)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-muted-foreground hover:bg-primary/20 hover:text-primary"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              {/* Lista de citas del día */}
              <div className="mt-1 space-y-1 overflow-hidden">
                {citasVisibles.map((cita) => (
                  <div
                    key={cita.id}
                    title={`${cita.hora} - ${cita.pacienteNombre} (${cita.modalidad})`}
                    className="truncate rounded px-1.5 py-0.5 text-[10px] sm:text-xs font-medium border border-border/50 bg-secondary/70 text-secondary-foreground flex items-center gap-1 hover:border-primary/60 transition-colors"
                  >
                    {cita.modalidad === 'Online' ? (
                      <Video className="size-2.5 shrink-0 text-blue-500" />
                    ) : (
                      <MapPin className="size-2.5 shrink-0 text-primary" />
                    )}
                    <span className="font-mono font-semibold shrink-0">
                      {cita.hora}
                    </span>
                    <span className="truncate">{cita.pacienteNombre}</span>
                  </div>
                ))}

                {/* Indicador de más citas */}
                {restantes > 0 && (
                  <div className="text-[10px] sm:text-xs font-semibold text-primary px-1 font-mono">
                    +{restantes} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
