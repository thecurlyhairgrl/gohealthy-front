import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup } from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Spinner } from '@/components/ui/spinner'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { DatePicker } from '@/components/DatePicker'
import { usePatients } from '@/context/PatientsContext'
import { useAppointments } from '@/context/AppointmentsContext'
import { useDayAppointments } from '@/hooks/useDayAppointments'
import { getDaySlots } from '@/lib/schedule'
import { toDateInput } from '@/lib/dates'
import { fullName } from '@/lib/labels'
import { appointmentSchema } from '@/schemas/appointments'

/**
 * Diálogo para agendar una cita nueva o reprogramar una existente.
 * - initialDate: fecha y hora elegidas en el calendario (opcional)
 * - patientId: paciente ya elegido, por ejemplo desde su expediente (opcional)
 * - appointment: la cita que se va a reprogramar (opcional)
 */
function AgendarCitaModal({ open, onOpenChange, initialDate, patientId, appointment }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {/* El formulario se monta cada vez que se abre, así empieza limpio */}
        {open && (
          <AgendarCitaForm
            initialDate={initialDate}
            patientId={patientId}
            appointment={appointment}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function AgendarCitaForm({ initialDate, patientId, appointment, onClose }) {
  const { patients } = usePatients()
  const { addAppointment, editAppointment } = useAppointments()
  const [apiError, setApiError] = useState(null)
  const isReschedule = Boolean(appointment)
  const activePatients = patients.filter((patient) => patient.active)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: appointment?.patient._id || patientId || '',
      day: initialDate ? toDateInput(initialDate) : '',
      // Si se eligió una hora en el calendario, ya viene seleccionada
      dateTime: initialDate ? initialDate.toISOString() : '',
      modality: appointment?.modality || 'in-person',
      reason: appointment?.reason || '',
    },
  })

  // Al elegir el día, pedimos sus citas para saber qué horarios están ocupados
  const day = useWatch({ control, name: 'day' })
  const selectedDateTime = useWatch({ control, name: 'dateTime' })
  const { appointments: dayAppointments, loading: loadingSlots } = useDayAppointments(day)
  const slots = day ? getDaySlots(new Date(`${day}T00:00:00`), dayAppointments, appointment?._id) : []

  async function onSubmit(formData) {
    setApiError(null)
    // La hora elegida en el calendario puede chocar con la siguiente cita, porque dura una hora
    const slot = slots.find((item) => item.dateTime === formData.dateTime)
    if (!slot || !slot.available) {
      setApiError('Ese horario ya no está disponible. Elige otro.')
      return
    }
    const appointmentData = { dateTime: formData.dateTime, modality: formData.modality, reason: formData.reason }
    try {
      if (isReschedule) {
        await editAppointment(appointment._id, appointmentData)
        toast.add({ title: 'Cita reprogramada', description: 'Le avisamos al paciente por correo', type: 'success' })
      } else {
        await addAppointment({ ...appointmentData, patientId: formData.patientId })
        toast.add({ title: 'Cita agendada', description: 'Le avisamos al paciente por correo', type: 'success' })
      }
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">{isReschedule ? 'Reprogramar cita' : 'Agendar cita'}</DialogTitle>
        <DialogDescription>
          {isReschedule
            ? `Elige el nuevo horario para ${fullName(appointment.patient)}.`
            : 'Elige al paciente, el día y uno de los horarios libres. Las citas duran una hora.'}
        </DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        {/* Paciente con búsqueda. Al reprogramar no se puede cambiar */}
        {!isReschedule && (
          <FormField label="Paciente" htmlFor="patientId" error={errors.patientId}>
            <Controller
              control={control}
              name="patientId"
              render={({ field }) => (
                <Combobox
                  items={activePatients}
                  itemToStringLabel={(patient) => fullName(patient)}
                  value={activePatients.find((patient) => patient._id === field.value) || null}
                  onValueChange={(patient) => field.onChange(patient?._id || '')}
                >
                  <ComboboxInput id="patientId" placeholder="Busca por nombre..." aria-invalid={Boolean(errors.patientId)} className="w-full" />
                  <ComboboxContent>
                    <ComboboxEmpty>No se encontró ningún paciente</ComboboxEmpty>
                    <ComboboxList>
                      {(patient) => (
                        <ComboboxItem key={patient._id} value={patient}>
                          {fullName(patient)}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
          </FormField>
        )}

        <FormField label="Día" htmlFor="day" error={errors.day}>
          <Controller
            control={control}
            name="day"
            render={({ field }) => (
              <DatePicker
                id="day"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value)
                  // Al cambiar de día, el horario se vuelve a elegir
                  setValue('dateTime', '')
                }}
                invalid={Boolean(errors.day)}
                fromDate={new Date()}
              />
            )}
          />
        </FormField>

        {/* Horarios del día: los ocupados o pasados aparecen deshabilitados */}
        {day && (
          <FormField label="Horario" htmlFor="dateTime" error={errors.dateTime}>
            {loadingSlots ? (
              <Spinner />
            ) : (
              <div id="dateTime" className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((slot) => (
                  <Button
                    key={slot.dateTime}
                    type="button"
                    size="sm"
                    variant={selectedDateTime === slot.dateTime ? 'default' : 'outline'}
                    disabled={!slot.available}
                    onClick={() => setValue('dateTime', slot.dateTime, { shouldValidate: true })}
                    className="font-mono"
                  >
                    {slot.label}
                  </Button>
                ))}
              </div>
            )}
          </FormField>
        )}

        <FormField label="Modalidad" htmlFor="modality" error={errors.modality}>
          <Controller
            control={control}
            name="modality"
            render={({ field }) => (
              <ToggleGroup
                id="modality"
                variant="outline"
                value={[field.value]}
                onValueChange={(values) => values.length > 0 && field.onChange(values[0])}
              >
                <ToggleGroupItem value="in-person">Presencial</ToggleGroupItem>
                <ToggleGroupItem value="video-call">En línea</ToggleGroupItem>
              </ToggleGroup>
            )}
          />
        </FormField>

        <FormField label="Motivo (opcional)" htmlFor="reason" error={errors.reason}>
          <Textarea id="reason" placeholder="Ej. Revisión de avance mensual" {...register('reason')} />
        </FormField>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : isReschedule ? 'Reprogramar' : 'Agendar cita'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default AgendarCitaModal
