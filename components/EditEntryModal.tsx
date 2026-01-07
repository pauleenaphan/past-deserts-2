'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Entry } from '@/lib/entry'
import { CustomSelect } from './CustomSelect'

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
  const [isLoading, setIsLoading] = useState(false)
  const [labelInput, setLabelInput] = useState<string>('')

  // Convert date from MM/DD/YYYY to YYYY-MM-DD for date input
  const convertDateForInput = (dateString: string): string => {
    if (!dateString) return ''
    if (dateString.includes('-')) return dateString
    const [month, day, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // Populate form when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        name: entry.name || '',
        date: convertDateForInput(entry.date || ''),
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
    
    if (!entry?.id) {
      return
    }

    // Check password
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (formData.password !== adminPassword) {
      alert('Incorrect password. Access denied.')
      return
    }

    setIsLoading(true)

    try {
      // Format date to MM/DD/YYYY format for storage
      const formattedFormData = {
        ...formData,
        date: new Date(formData.date).toLocaleDateString('en-US')
      }
      
      const updatedEntry: Entry = {
        ...entry,
        ...formattedFormData
      }
      
      await onSave(updatedEntry)
      
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
    } finally {
      setIsLoading(false)
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

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        
        try {
          let base64String: string
          if (file.size > 500000) {
            console.log(`Compressing large image: ${file.name}`)
            base64String = await compressImage(file, 800, 0.7)
          } else {
            base64String = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = (event) => resolve(event.target?.result as string)
              reader.onerror = reject
              reader.readAsDataURL(file)
            })
          }
          
          if (base64String.length > 1000000) {
            alert(`Image "${file.name}" is too large even after compression. Please use a smaller image.`)
            continue
          }
          
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, base64String]
          }))
        } catch (error) {
          console.error('Error processing file:', error)
          alert(`Error processing image "${file.name}". Please try a different image.`)
        }
      }
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50"/>
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-bgcolor rounded-lg p-12 w-full max-w-3xl z-50 shadow-xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-3xl font-bold mb-2">
            Edit Entry
          </Dialog.Title>
          
          <Dialog.Description className="mb-4">
            Update the details for &quot;{entry?.name}&quot;
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Recipe Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter recipe name"
                required
              />
            </div>

            <div>
              <label className="label">Date Made</label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Rating (1-5 Stars)</label>
                <CustomSelect
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}
                  options={[
                    { value: '1', label: '1 Star' },
                    { value: '2', label: '2 Stars' },
                    { value: '3', label: '3 Stars' },
                    { value: '4', label: '4 Stars' },
                    { value: '5', label: '5 Stars' }
                  ]}
                  placeholder="Select rating"
                />
              </div>

              <div>
                <label className="label">Difficulty</label>
                <CustomSelect
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  options={[
                    { value: 'Easy', label: 'Easy' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Hard', label: 'Hard' }
                  ]}
                  placeholder="Select difficulty"
                />
              </div>
            </div>

            <div>
              <label className="label">Recipe Link</label>
              <input 
                type="url" 
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="input"
                placeholder="https://example.com/recipe"
              />
            </div>

            <div>
              <label className="label">Summary & Thoughts</label>
              <textarea 
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                className="input"
                rows={4}
                placeholder="Your process, thoughts, and outcome of the recipe"
                required
              />
            </div>

            <div>
              <label className="label">Labels/Tags</label>
              
              {formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-buttonsecondary"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input 
                type="text" 
                value={labelInput}
                onChange={handleLabelInputChange}
                onKeyPress={handleLabelKeyPress}
                className="input"
                placeholder="Type a label and press Enter to add it"
              />
              <p className="text-xs mt-1">
                Type a label and press Enter to add it. Click × to remove labels.
              </p>
            </div>

            <div>
              <label className="label">Images</label>
              
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative inline-flex items-center">
                      <div className="flex items-center bg-buttonsecondary rounded-md px-2 py-1 text-sm">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-4 h-4 object-cover rounded mr-1"
                        />
                        <span className="text-gray-700">Image {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="ml-1 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="input"
              />
              <p className="text-xs mt-1">
                Your first image will be used as the main image for the entry.
                Upload images of your recipe and outcome. You can select multiple images at once.
              </p>
            </div>

            <div>
              <label className="label">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className="input"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2">
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                type="submit"
                className="primary-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Entry'}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button 
              className="absolute top-4 right-4 hover:text-gray-600"
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

