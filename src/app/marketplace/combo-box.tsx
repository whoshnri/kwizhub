"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getTutors } from "../actions/peripheral"



export function ComboboxDemo({value, setValue}: {value: string, setValue: (value: string) => void}) {
  const [open, setOpen] = React.useState(false)
  
const [valuePairs, setValuePairs] = React.useState<{value: string, label: string}[]>([])

    React.useEffect(() => {
        const fetchTutors = async() => {
            const tutors = await getTutors()
            setValuePairs(tutors.data as {value: string, label: string}[] ?? [])
        }
        fetchTutors()
    },[])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? valuePairs.find((pair) => pair.value === value)?.label
            : "Select tutor..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 w-full">
        <Command>
          <CommandInput placeholder="Search Tutor..." className="h-9" />
          <CommandList>
            <CommandEmpty>No tutor found.</CommandEmpty>
            <CommandGroup>
              {valuePairs.map((pair) => (
                <CommandItem
                  key={pair.value}
                  value={pair.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {pair.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === pair.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
