import DocumentosLaboratorio from '@/components/documentos/DocumentosLaboratorio'

/**
 * Documentos de laboratorio del paciente: los que sube él y los que sube su nutriólogo.
 * Es el mismo componente que usa el expediente, sin patientId.
 */
function PacienteDocumentosPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <DocumentosLaboratorio />
    </div>
  )
}

export default PacienteDocumentosPage
