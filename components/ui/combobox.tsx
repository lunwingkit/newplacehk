"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxProps {
  items: { label: string; value: string }[]
  onSelect: (value: string) => void
  onAddCustom: (value: string) => void
  placeholder?: string
  className?: string
  selectedItems?: string[]
}

export function Combobox({ items, onSelect, onAddCustom, placeholder, className, selectedItems = [] }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchValue, setSearchValue] = React.useState("")

  const handleAddCustom = () => {
    if (searchValue && !selectedItems.includes(searchValue)) {
      onAddCustom(searchValue)
      setSearchValue("")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value ? items.find((item) => item.value === value)?.label : placeholder || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3 relative">
            <CommandInput
              placeholder="Search..."
              className="w-full pr-8"
              value={searchValue}
              onValueChange={setSearchValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCustom()
                }
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={handleAddCustom}
              disabled={!searchValue}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const isSelected = selectedItems.includes(item.value)
                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      if (!isSelected) {
                        onSelect(item.value)
                        setValue(item.value)
                        setOpen(false)
                      }
                    }}
                    disabled={isSelected}
                  >
                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    {item.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

