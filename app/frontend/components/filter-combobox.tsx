import { ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Option } from '@/types'

const ALL_OPTIONS = 'Todas las opciones'

// Case and accent insensitive, so "garcia" finds "García".
const normalize = (text: string) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const filter = (value: string, search: string) =>
  normalize(value).includes(normalize(search)) ? 1 : 0

type FilterComboboxProps = {
  label: string
  placeholder: string
  options: Option[]
  value: number | null
  onChange: (value: number | null) => void
}

export function FilterCombobox({
  label,
  placeholder,
  options,
  value,
  onChange,
}: FilterComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.id === value)

  const select = (id: number | null) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          className="w-full justify-between font-normal sm:w-52"
        >
          <span className={selected ? 'truncate' : 'truncate text-muted-foreground'}>
            {selected ? selected.name : label}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command filter={filter}>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={ALL_OPTIONS}
                data-checked={value === null}
                onSelect={() => select(null)}
              >
                {ALL_OPTIONS}
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  data-checked={option.id === value}
                  onSelect={() => select(option.id)}
                >
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
