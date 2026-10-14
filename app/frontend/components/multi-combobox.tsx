import { Plus, X } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
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
import { matches, normalize } from '@/lib/text'

const CREATE_VALUE = '__create__'

type MultiComboboxProps = {
  id: string
  addLabel: string
  placeholder: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  invalid?: boolean
}

// Pick several names from a list, or type a new one to create it.
export function MultiCombobox({
  id,
  addLabel,
  placeholder,
  options,
  value,
  onChange,
  invalid,
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = new Set(value.map(normalize))
  const available = options.filter((option) => !selected.has(normalize(option)))
  const typed = search.trim().replace(/\s+/g, ' ')
  const exists =
    selected.has(normalize(typed)) ||
    options.some((option) => normalize(option) === normalize(typed))

  const add = (name: string) => {
    onChange([...value, name])
    setSearch('')
  }

  const remove = (name: string) =>
    onChange(value.filter((item) => item !== name))

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {value.map((name) => (
            <li key={name}>
              <Badge variant="secondary" className="gap-1 pr-1">
                {name}
                <button
                  type="button"
                  className="rounded-sm opacity-60 hover:opacity-100"
                  onClick={() => remove(name)}
                  aria-label={`Quitar ${name}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setSearch('')
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            aria-invalid={invalid}
          >
            <Plus />
            {addLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command filter={(item, query) => (item === CREATE_VALUE ? 1 : matches(item, query))}>
            <CommandInput
              placeholder={placeholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>Escribí un nombre para crearlo.</CommandEmpty>
              {typed && !exists && (
                <CommandGroup>
                  <CommandItem
                    value={CREATE_VALUE}
                    onSelect={() => add(typed)}
                  >
                    <Plus />
                    Crear “{typed}”
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandGroup>
                {available.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => add(option)}
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
