import { Controller } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Select de shadcn conectado a React Hook Form con <Controller>.
// options es un objeto { valor que se guarda: texto que se muestra }
export function FormSelect({ control, name, id, options, placeholder = 'Elige una opción', invalid }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select items={options} value={field.value || null} onValueChange={field.onChange}>
          <SelectTrigger id={id} className="w-full" aria-invalid={invalid} onBlur={field.onBlur}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(options).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
