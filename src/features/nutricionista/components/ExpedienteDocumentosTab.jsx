import { useState } from 'react'
import { FileText, Download, Eye, UploadCloud, CheckCircle2, FileCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Pestaña de Documentos y Estudios Clínicos del Paciente.
 * Lista los archivos aportados (análisis de laboratorio, bitácoras, etc.)
 * y permite simular su descarga o previsualización.
 */
export default function ExpedienteDocumentosTab({ documentos = [] }) {
  const [descargandoId, setDescargandoId] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const handleDescargar = (doc) => {
    setDescargandoId(doc.id)
    setTimeout(() => {
      setDescargandoId(null)
      setMensaje(`Descargando "${doc.nombre}"...`)
      setTimeout(() => setMensaje(null), 3500)
    }, 600)
  }

  const handleVer = (doc) => {
    setMensaje(`Abriendo vista previa de "${doc.nombre}"...`)
    setTimeout(() => setMensaje(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con acción */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold font-heading">Documentos y Estudios Clínicos</h2>
          <p className="text-xs text-muted-foreground">
            Expediente de análisis clínicos, bitácoras de comidas y resultados de laboratorio
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-[#2F6B4E]/30 text-[#2F6B4E] hover:bg-[#2F6B4E]/10 w-fit"
          onClick={() => {
            setMensaje('La carga de nuevos documentos por parte del nutriólogo estará disponible próximamente.')
            setTimeout(() => setMensaje(null), 4000)
          }}
        >
          <UploadCloud className="size-4" />
          <span>Subir Documento</span>
        </Button>
      </div>

      {mensaje && (
        <div className="flex items-center gap-2 rounded-lg bg-[#2F6B4E]/10 border border-[#2F6B4E]/20 p-3 text-xs font-medium text-[#2F6B4E]">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{mensaje}</span>
        </div>
      )}

      {/* Lista de Documentos */}
      {documentos.length === 0 ? (
        <Card className="border-dashed border-2 border-border/80">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="size-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-foreground">No hay documentos registrados</p>
            <p className="text-xs text-muted-foreground mt-1">
              El paciente aún no ha cargado estudios clínicos o recetas a su expediente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {documentos.map((doc) => (
            <Card
              key={doc.id}
              className="border-border/60 bg-card/80 transition-colors hover:border-[#2F6B4E]/30 hover:bg-muted/30"
            >
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <FileCheck className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {doc.nombre}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>Subido el {doc.fecha}</span>
                      <span>•</span>
                      <span>{doc.tamano}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVer(doc)}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="size-3.5" />
                    <span className="hidden sm:inline">Vista previa</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargar(doc)}
                    disabled={descargandoId === doc.id}
                    className="gap-1.5 text-xs border-border hover:bg-[#2F6B4E]/10 hover:text-[#2F6B4E]"
                  >
                    <Download className="size-3.5" />
                    <span>{descargandoId === doc.id ? 'Descargando...' : 'Descargar'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
