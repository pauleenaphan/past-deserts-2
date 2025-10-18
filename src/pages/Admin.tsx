import { useState, useEffect } from 'react'
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";

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
    <div className="flex flex-col w-4/5 md:w-1/2 mx-auto pb-8 gap-4">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold">Current Entries</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="primary-btn"
        >
          Add Entry
        </button>
      </div>
      <div className="border-2"></div>
      <div className="flex flex-col gap-4">
        {entries.map((entry, index) => (
          <div key={index} className="flex justify-between items-center gap-4">
            <div>
              <p className="text-lg font-semibold">{entry.name}</p>
              <p>{entry.date}</p>
            </div>
            <div className="text-3xl flex items-center gap-2">
              <FaRegEdit
                onClick={() => handleEditClick(entry)}
                className="cursor-pointer hover:text-black"
              >
              </FaRegEdit>
              <FaRegTrashAlt
                onClick={() => handleDeleteClick(entry)}
                className="cursor-pointer hover:text-black"
              >
              </FaRegTrashAlt>
            </div>
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
