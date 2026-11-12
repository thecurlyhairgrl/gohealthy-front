import { Field, FieldError, FieldLabel } from '@/components/ui/field'

export function FormField({ label, htmlFor, error, children }) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      <FieldError errors={error ? [error] : undefined} />
    </Field>
  )
}