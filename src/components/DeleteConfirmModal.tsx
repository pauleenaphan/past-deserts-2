import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { Entry } from '../api/entry'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  entry: Entry | null
  onConfirm: () => void
}

export const DeleteConfirmModal = ({ isOpen, onOpenChange, entry, onConfirm }: DeleteConfirmModalProps) => {
  const [password, setPassword] = useState<string>('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (password === adminPassword) {
      onConfirm()
      setPassword('')
    } else {
      alert('Incorrect password. Access denied.')
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50 shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Confirm Delete
          </Dialog.Title>
          
          <Dialog.Description className="text-gray-600 mb-6">
            Are you sure you want to delete "{entry?.name}"? This action cannot be undone.
          </Dialog.Description>

          <form id="delete-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          <div className="flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button 
                type="button"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button 
              type="submit"
              form="delete-form"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>

          <Dialog.Close asChild>
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
