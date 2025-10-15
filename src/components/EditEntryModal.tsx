import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Entry } from '../api/entry'

interface EditEntryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  entry: Entry | null
  onSave: (entry: Entry) => void
}

interface FormData {
  name: string
  date: string
  rating: number
  difficulty: string
  link: string
  summary: string
  images: string[]
  labels: string[]
  password: string
}

export const EditEntryModal = ({ isOpen, onOpenChange, entry, onSave }: EditEntryModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: '',
    rating: 1,
    difficulty: 'Easy',
    link: '',
    summary: '',
    images: [],
    labels: [],
    password: ''
  })

  const [labelInput, setLabelInput] = useState<string>('')

  // Populate form when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        name: entry.name || '',
        date: entry.date || '',
        rating: entry.rating || 1,
        difficulty: entry.difficulty || 'Easy',
        link: entry.link || '',
        summary: entry.summary || '',
        images: entry.images || [],
        labels: entry.labels || [],
        password: ''
      })
    }
  }, [entry])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    if (!entry?.id) return

    // Check password
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (formData.password !== adminPassword) {
      alert('Incorrect password. Access denied.')
      return
    }

    try {
      const updatedEntry: Entry = {
        ...entry,
        ...formData
      }
      
      await onSave(updatedEntry)
      console.log('Entry updated successfully:', updatedEntry)
      
      // Reset form
      setFormData({ 
        name: '', 
        date: '', 
        rating: 1, 
        difficulty: 'Easy', 
        link: '', 
        summary: '', 
        images: [], 
        labels: [],
        password: ''
      })
      
      // Close modal
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating entry:', error)
      alert('Failed to update entry. Please try again.')
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleLabelInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLabelInput(e.target.value)
  }

  const handleLabelKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newLabel = labelInput.trim()
      if (newLabel && !formData.labels.includes(newLabel)) {
        setFormData(prev => ({
          ...prev,
          labels: [...prev.labels, newLabel]
        }))
        setLabelInput('')
      }
    }
  }

  const removeLabel = (labelToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }))
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const imageUrls = fileArray.map(file => URL.createObjectURL(file))
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }))
    }
  }

  const removeImage = (imageToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }))
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl z-50 shadow-xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Edit Entry
          </Dialog.Title>
          
          <Dialog.Description className="text-gray-600 mb-4">
            Update the details for "{entry?.name}".
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Name
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter recipe name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Made
              </label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5 Stars)
                </label>
                <select 
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select 
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Link
              </label>
              <input 
                type="url" 
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/recipe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary & Thoughts
              </label>
              <textarea 
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                className="w-full h-[30%] resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Your process, thoughts, and outcome of the recipe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Labels/Tags
              </label>
              
              {/* Selected Labels Display */}
              {formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Label Input */}
              <input 
                type="text" 
                value={labelInput}
                onChange={handleLabelInputChange}
                onKeyPress={handleLabelKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a label and press Enter to add it"
              />
              <p className="text-xs text-gray-500 mt-1">
                Type a label and press Enter to add it. Click × to remove labels.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              
              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative inline-flex items-center">
                      <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-4 h-4 object-cover rounded mr-1"
                        />
                        <span className="text-gray-700">Image {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="ml-1 text-red-500 hover:text-red-700 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* File Upload */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your first image will be used as the main image for the entry.
                Upload images of your recipe and outcome. You can select multiple images at once.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Update Entry
              </button>
            </div>
          </form>

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
