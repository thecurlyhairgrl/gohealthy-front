import { useState } from 'react'
import { format } from 'date-fns'
import { es as dateFnsEs } from 'date-fns/locale'
import { es } from 'react-day-picker/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// "2000-04-20" -> fecha local (sin que la zona horaria la mueva un día)
const toDate = (text) => {
  if (!text) return undefined
  const [year, month, day] = text.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Selector de fecha con el calendario de shadcn.
// Recibe y regresa la fecha como texto "yyyy-MM-dd", igual que un <input type="date">
export function DatePicker({ id, value, onChange, placeholder = 'Elige una fecha', invalid, startYear = 1920, endDate = new Date() }) {
  const [open, setOpen] = useState(false)
  const selected = toDate(value)

  function handleSelect(date) {
    onChange(date ? format(date, 'yyyy-MM-dd') : '')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={invalid}
            className="w-full justify-start border-transparent bg-input/50 font-normal hover:bg-input/70 data-[empty=true]:text-muted-foreground"
            data-empty={!selected}
          />
        }
      >
        <CalendarIcon />
        {selected ? format(selected, "d 'de' MMMM 'de' yyyy", { locale: dateFnsEs }) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          captionLayout="dropdown"
          selected={selected}
          onSelect={handleSelect}
          defaultMonth={selected || new Date(2000, 0)}
          startMonth={new Date(startYear, 0)}
          endMonth={endDate}
          disabled={{ after: endDate }}
        />
      </PopoverContent>
    </Popover>
  )
}
