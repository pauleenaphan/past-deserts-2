import { useState, useEffect } from 'react'

import { AddEntryModal } from '../components/AddEntryModal'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import { EditEntryModal } from '../components/EditEntryModal'
import { getEntries, Entry, deleteEntry, editEntry } from '../api/entry'

export const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [entryToEdit, setEntryToEdit] = useState<Entry | null>(null)

  useEffect(() => {
    getEntries().then(data => setEntries(data as Entry[]))
  }, [entries])

  const handleDeleteClick = (entry: Entry) => {
    setEntryToDelete(entry)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (entryToDelete?.id) {
      try {
        await deleteEntry(entryToDelete.id)
        setEntries(entries.filter(entry => entry.id !== entryToDelete.id))
        setDeleteModalOpen(false)
        setEntryToDelete(null)
      } catch (error) {
        console.error('Error deleting entry:', error)
        alert('Failed to delete entry')
      }
    }
  }

  const handleEditClick = (entry: Entry) => {
    setEntryToEdit(entry)
    setEditModalOpen(true)
  }

  const handleEditSave = async (updatedEntry: Entry) => {
    try {
      await editEntry(updatedEntry)
      setEntries(entries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ))
      setEditModalOpen(false)
      setEntryToEdit(null)
    } catch (error) {
      console.error('Error updating entry:', error)
      alert('Failed to update entry')
    }
  }

  return(
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mb-6"
      >
        Add Entry
      </button>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Current Entries</h2>
        <p className="text-gray-600">List of entries here, click to edit/delete one</p>
        {entries.map((entry, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <h3>{entry.name}</h3>
            <p>{entry.date}</p>
            <p>{entry.rating}</p>
            <p>{entry.difficulty}</p>
            {entry.images && entry.images.length > 0 ? (
              <img src={entry.images[0]} alt={entry.name} className="w-10 h-10 object-cover rounded-md"/>
            ) : (
              <p>No images</p>
            )}
            <button 
              onClick={() => handleDeleteClick(entry)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => handleEditClick(entry)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <AddEntryModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        entry={entryToDelete}
        onConfirm={confirmDelete}
      />

      <EditEntryModal
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        entry={entryToEdit}
        onSave={handleEditSave}
      />
    </div>
  )
}
