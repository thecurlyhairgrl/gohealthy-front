import { useState, useMemo } from 'react'
import {
  citasCalendarioMock,
  pacientesMock,
} from '@/features/nutricionista/data/mock-data'
import { CalendarioHeader } from '@/features/nutricionista/components/CalendarioHeader'
import { CalendarioMensual } from '@/features/nutricionista/components/CalendarioMensual'
import { CalendarioSemanal } from '@/features/nutricionista/components/CalendarioSemanal'
import { CalendarioDiaSheet } from '@/features/nutricionista/components/CalendarioDiaSheet'
import { AgendarCitaModal } from '@/features/nutricionista/components/AgendarCitaModal'

/**
 * Página principal del Calendario de Citas del Nutriólogo.
 * Permite alternar entre vista mensual y semanal, ver citas por día en un panel deslizante,
 * y agendar nuevas consultas médicas.
 */
export function NutricionistaCalendarioPage() {
  // Fecha actual de navegación (iniciando en Septiembre 2026 para alinear con los mock data)
  const [fechaReferencia, setFechaReferencia] = useState(new Date(2026, 8, 14))
  const [vista, setVista] = useState('mes') // 'mes' | 'semana'
  const [citas, setCitas] = useState(citasCalendarioMock)

  // Estado del Sheet lateral de detalle del día
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Estado del Modal para Agendar Cita
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fechaParaAgendar, setFechaParaAgendar] = useState('')

  // Título del período actual
  const tituloPeriodo = useMemo(() => {
    if (vista === 'mes') {
      return fechaReferencia.toLocaleDateString('es-MX', {
        month: 'long',
        year: 'numeric',
      })
    }

    // Para la vista semanal: calcular rango de la semana (Lunes a Domingo)
    const d = new Date(fechaReferencia)
    const diaSemana = d.getDay()
    const difAlLunes = diaSemana === 0 ? -6 : 1 - diaSemana
    const lunes = new Date(d.setDate(d.getDate() + difAlLunes))
    const domingo = new Date(lunes)
    domingo.setDate(lunes.getDate() + 6)

    const diaLunes = lunes.getDate()
    const diaDom = domingo.getDate()
    const mesLunes = lunes.toLocaleDateString('es-MX', { month: 'short' })
    const mesDom = domingo.toLocaleDateString('es-MX', { month: 'short' })
    const anio = domingo.getFullYear()

    if (mesLunes === mesDom) {
      return `${diaLunes} - ${diaDom} de ${mesLunes} ${anio}`
    }
    return `${diaLunes} ${mesLunes} - ${diaDom} ${mesDom} ${anio}`
  }, [fechaReferencia, vista])

  // Navegación temporal
  const handlePeriodoAnterior = () => {
    setFechaReferencia((prev) => {
      const nueva = new Date(prev)
      if (vista === 'mes') {
        nueva.setMonth(nueva.getMonth() - 1)
      } else {
        nueva.setDate(nueva.getDate() - 7)
      }
      return nueva
    })
  }

  const handlePeriodoSiguiente = () => {
    setFechaReferencia((prev) => {
      const nueva = new Date(prev)
      if (vista === 'mes') {
        nueva.setMonth(nueva.getMonth() + 1)
      } else {
        nueva.setDate(nueva.getDate() + 7)
      }
      return nueva
    })
  }

  const handleIrAHoy = () => {
    // Apunta al día actual de la app (14 de Septiembre 2026)
    setFechaReferencia(new Date(2026, 8, 14))
  }

  // Interacción de selección de día (Abre el Sheet lateral)
  const handleSeleccionarDia = (fechaStr) => {
    setDiaSeleccionado(fechaStr)
    setIsSheetOpen(true)
  }

  // Citas pertenecientes al día seleccionado en el Sheet
  const citasDelDiaSeleccionado = useMemo(() => {
    if (!diaSeleccionado) return []
    return citas.filter((c) => c.fecha === diaSeleccionado)
  }, [citas, diaSeleccionado])

  // Abrir modal de agendar con fecha preseleccionada
  const handleAgendarEnFecha = (fechaStr) => {
    setFechaParaAgendar(fechaStr)
    setIsModalOpen(true)
  }

  // Abrir modal de agendar sin fecha preseleccionada específica
  const handleAbrirAgendarGeneral = () => {
    const hoyStr = `${fechaReferencia.getFullYear()}-${String(
      fechaReferencia.getMonth() + 1
    ).padStart(2, '0')}-${String(fechaReferencia.getDate()).padStart(2, '0')}`
    setFechaParaAgendar(hoyStr)
    setIsModalOpen(true)
  }

  // Guardar nueva cita agendada
  const handleGuardarCita = (nuevaCita) => {
    setCitas((prev) => [...prev, nuevaCita])
  }

  return (
    <div className="space-y-6">
      {/* Cabecera del Calendario */}
      <CalendarioHeader
        tituloPeriodo={tituloPeriodo}
        vista={vista}
        onCambiarVista={setVista}
        onPeriodoAnterior={handlePeriodoAnterior}
        onPeriodoSiguiente={handlePeriodoSiguiente}
        onIrAHoy={handleIrAHoy}
        onAbrirAgendarCita={handleAbrirAgendarGeneral}
      />

      {/* Vista Activa (Mes o Semana) */}
      {vista === 'mes' ? (
        <CalendarioMensual
          fechaReferencia={fechaReferencia}
          citas={citas}
          onSeleccionarDia={handleSeleccionarDia}
          onAgendarEnFecha={handleAgendarEnFecha}
        />
      ) : (
        <CalendarioSemanal
          fechaReferencia={fechaReferencia}
          citas={citas}
          onSeleccionarDia={handleSeleccionarDia}
          onAgendarEnFecha={handleAgendarEnFecha}
        />
      )}

      {/* Sheet Lateral con el detalle de citas del día */}
      <CalendarioDiaSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        fechaSeleccionada={diaSeleccionado}
        citas={citasDelDiaSeleccionado}
        onAgendarEnFecha={handleAgendarEnFecha}
      />

      {/* Modal para agendar nueva cita */}
      <AgendarCitaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fechaInicial={fechaParaAgendar}
        pacientes={pacientesMock}
        onGuardarCita={handleGuardarCita}
      />
    </div>
  )
}
