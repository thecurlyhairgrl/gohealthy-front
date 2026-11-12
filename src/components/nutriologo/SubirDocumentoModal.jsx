import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { DatePicker } from '@/components/DatePicker'
import { uploadLabDocumentRequest } from '@/api/lab-documents'

const MAX_SIZE = 10 * 1024 * 1024

/**
 * Diálogo para subir un documento de laboratorio al expediente.
 * Un archivo no se puede manejar fácil con React Hook Form, así que usamos useState
 */
function SubirDocumentoModal({ open, onOpenChange, patientId, onUploaded }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && <SubirDocumentoForm patientId={patientId} onUploaded={onUploaded} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function SubirDocumentoForm({ patientId, onUploaded, onClose }) {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [studyDate, setStudyDate] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    if (!file) {
      setError('Elige un archivo')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('El archivo pesa más de 10 MB')
      return
    }

    // Los archivos se mandan con FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('patientId', patientId)
    if (description) formData.append('description', description)
    if (studyDate) formData.append('studyDate', studyDate)

    setIsSubmitting(true)
    try {
      await uploadLabDocumentRequest(formData)
      toast.add({ title: 'Documento subido', type: 'success' })
      onUploaded()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Subir documento</DialogTitle>
        <DialogDescription>PDF, JPG o PNG de hasta 10 MB.</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <FormField label="Archivo" htmlFor="file" error={error ? { message: error } : undefined}>
          <Input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setFile(event.target.files[0] || null)} />
        </FormField>
        <FormField label="Descripción (opcional)" htmlFor="description">
          <Input id="description" placeholder="Química sanguínea" value={description} onChange={(event) => setDescription(event.target.value)} />
        </FormField>
        <FormField label="Fecha del estudio (opcional)" htmlFor="studyDate">
          <DatePicker id="studyDate" value={studyDate} onChange={setStudyDate} toDate={new Date()} />
        </FormField>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Subiendo...' : 'Subir'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default SubirDocumentoModal
