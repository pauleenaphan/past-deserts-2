import React from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

interface CustomSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  name?: string
}

export const CustomSelect = ({ value, onValueChange, options, placeholder, name }: CustomSelectProps) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger 
        className="input flex items-center justify-between text-base"
        aria-label={placeholder}
      >
        <Select.Value placeholder={placeholder} className="text-base" />
        <Select.Icon className="text-[#4B4037]">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-[#FFF7E6] rounded-md shadow-lg border-2 border-[#D4C4A8] z-50">
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-[#FFF7E6] text-[#4B4037] cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="text-base leading-none text-[#4B4037] rounded-sm flex items-center h-8 px-3 relative select-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-[#F9C784] data-[highlighted]:text-[#4B4037] cursor-pointer"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-[#FFF7E6] text-[#4B4037] cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
