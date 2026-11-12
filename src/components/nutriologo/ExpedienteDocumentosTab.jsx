import { useState } from 'react'
import { Download, FileText, Trash2, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import SubirDocumentoModal from '@/components/nutriologo/SubirDocumentoModal'
import { useAuth } from '@/context/AuthContext'
import { useLabDocuments } from '@/hooks/useLabDocuments'
import { deleteLabDocumentRequest } from '@/api/lab-documents'
import { downloadFile } from '@/api/client'
import { formatDate, formatDateOnly } from '@/lib/dates'

// 1536000 -> "1.5 MB"
const formatSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`)

/**
 * Documentos de laboratorio del paciente: los sube él o el nutriólogo.
 * Solo quien subió un documento lo puede borrar.
 */
export default function ExpedienteDocumentosTab({ patientId }) {
  const { user } = useAuth()
  const { documents, loading, error, reload } = useLabDocuments(patientId)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  // Un <a href> no manda el token, por eso se descarga con downloadFile
  async function handleDownload(document) {
    try {
      await downloadFile(`/lab-documents/${document._id}/file`, document.originalName)
    } catch (err) {
      toast.add({ title: err.message, type: 'error' })
    }
  }

  async function handleDelete() {
    try {
      await deleteLabDocumentRequest(toDelete._id)
      toast.add({ title: 'Documento eliminado', type: 'success' })
      reload()
    } catch (err) {
      toast.add({ title: 'No se pudo eliminar', description: err.message, type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <FileText className="size-5 text-primary" />
            Documentos y estudios
          </h2>
          <p className="text-xs text-muted-foreground">PDF, JPG o PNG de hasta 10 MB</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload data-icon="inline-start" />
          Subir documento
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : documents.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No hay documentos</EmptyTitle>
            <EmptyDescription>Aquí aparecen los estudios que suban tú o el paciente.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-3">
          {documents.map((document) => {
            const isMine = document.uploadedBy === user.id
            return (
              <Card key={document._id} className="border-border/60">
                <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{document.originalName}</p>
                      {document.description && <p className="truncate text-xs">{document.description}</p>}
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {isMine ? 'Lo subiste tú' : 'Lo subió el paciente'} el {formatDate(document.createdAt)}
                        {document.studyDate && ` · Estudio del ${formatDateOnly(document.studyDate)}`} · {formatSize(document.sizeBytes)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 self-end sm:self-center">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(document)}>
                      <Download data-icon="inline-start" />
                      Descargar
                    </Button>
                    {isMine && (
                      <Button variant="ghost" size="icon-sm" aria-label="Eliminar documento" onClick={() => setToDelete(document)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <SubirDocumentoModal open={isUploadOpen} onOpenChange={setIsUploadOpen} patientId={patientId} onUploaded={reload} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="¿Eliminar el documento?"
        description={toDelete?.originalName}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  )
}
