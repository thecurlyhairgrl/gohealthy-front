import { useMemo } from 'react'
import { Plus, Video, MapPin, Clock } from 'lucide-react'

const HORAS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

/**
 * Cuadrícula de calendario en vista semanal por franjas horarias.
 */
export function CalendarioSemanal({
  fechaReferencia,
  citas = [],
  onSeleccionarDia,
  onAgendarEnFecha,
}) {
  // Formato YYYY-MM-DD para comparar hoy
  const hoyStr = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`
  }, [])

  // Calcular los 7 días de la semana actual (de Lunes a Domingo)
  const diasSemana = useMemo(() => {
    const d = new Date(fechaReferencia)
    const diaSemana = d.getDay()
    // Distancia al lunes anterior (o mismo día si es lunes)
    const difAlLunes = diaSemana === 0 ? -6 : 1 - diaSemana
    const lunes = new Date(d.setDate(d.getDate() + difAlLunes))

    const dias = []
    const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    for (let i = 0; i < 7; i++) {
      const fechaDia = new Date(lunes)
      fechaDia.setDate(lunes.getDate() + i)

      const fechaStr = `${fechaDia.getFullYear()}-${String(
        fechaDia.getMonth() + 1
      ).padStart(2, '0')}-${String(fechaDia.getDate()).padStart(2, '0')}`

      dias.push({
        nombre: nombresDias[i],
        numero: fechaDia.getDate(),
        fechaStr,
        fechaObj: fechaDia,
      })
    }
    return dias
  }, [fechaReferencia])

  // Agrupar citas por fecha
  const citasPorFecha = useMemo(() => {
    const mapa = {}
    citas.forEach((c) => {
      if (!mapa[c.fecha]) mapa[c.fecha] = []
      mapa[c.fecha].push(c)
    })
    return mapa
  }, [citas])

  return (
    <div className="rounded-xl border border-border/70 bg-card shadow-xs overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Encabezado con los 7 días de la semana */}
        <div className="grid grid-cols-8 border-b border-border/70 bg-muted/40 text-center py-3">
          <div className="text-xs font-semibold text-muted-foreground flex items-center justify-center">
            <Clock className="size-3.5" />
          </div>
          {diasSemana.map((dia) => {
            const esHoy = dia.fechaStr === hoyStr
            return (
              <div
                key={dia.fechaStr}
                onClick={() => onSeleccionarDia(dia.fechaStr)}
                className="cursor-pointer flex flex-col items-center gap-1 group"
              >
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {dia.nombre}
                </span>
                <span
                  className={`font-mono text-sm font-semibold inline-flex size-7 items-center justify-center rounded-full transition-all ${
                    esHoy
                      ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                      : 'text-foreground group-hover:bg-muted'
                  }`}
                >
                  {dia.numero}
                </span>
              </div>
            )
          })}
        </div>

        {/* Franjas horarias */}
        <div className="divide-y divide-border/50">
          {HORAS.map((hora) => (
            <div key={hora} className="grid grid-cols-8 min-h-[64px]">
              {/* Columna de la hora */}
              <div className="border-r border-border/50 p-2 text-right text-xs font-mono text-muted-foreground flex items-start justify-end">
                {hora}
              </div>

              {/* 7 Columnas de días */}
              {diasSemana.map((dia) => {
                const citasDelDia = citasPorFecha[dia.fechaStr] || []
                // Citas que caen en esta hora (comparando HH)
                const horaNum = parseInt(hora.split(':')[0], 10)
                const citasEnHora = citasDelDia.filter((c) => {
                  const [h] = c.hora.split(':')
                  return parseInt(h, 10) === horaNum
                })

                return (
                  <div
                    key={`${dia.fechaStr}-${hora}`}
                    onClick={() => onSeleccionarDia(dia.fechaStr)}
                    className="border-r border-border/40 last:border-r-0 p-1 hover:bg-muted/30 transition-colors cursor-pointer group relative"
                  >
                    {/* Botón flotante para agregar cita en esta celda */}
                    <button
                      type="button"
                      aria-label={`Agendar cita a las ${hora}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAgendarEnFecha(dia.fechaStr)
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-muted-foreground hover:bg-primary/20 hover:text-primary z-10"
                    >
                      <Plus className="size-3" />
                    </button>

                    {/* Citas programadas en esta hora */}
                    <div className="space-y-1">
                      {citasEnHora.map((cita) => (
                        <div
                          key={cita.id}
                          className="rounded-md border border-primary/30 bg-primary/10 p-1.5 text-xs text-foreground hover:shadow-xs transition-shadow"
                        >
                          <div className="flex items-center gap-1 font-semibold text-[11px] text-primary">
                            {cita.modalidad === 'Online' ? (
                              <Video className="size-3 text-blue-500" />
                            ) : (
                              <MapPin className="size-3 text-primary" />
                            )}
                            <span className="font-mono">{cita.hora}</span>
                          </div>
                          <p className="font-medium text-[11px] truncate mt-0.5">
                            {cita.pacienteNombre}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
