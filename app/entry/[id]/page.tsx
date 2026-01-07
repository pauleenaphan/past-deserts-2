import { getEntries, Entry } from '@/lib/entry'
import { EntryClient } from './EntryClient'
import { notFound } from 'next/navigation'

interface EntryPageProps {
  params: Promise<{ id: string }>
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { id } = await params
  
  // Fetch all entries and find the one we need
  const entries = await getEntries()
  const entry = entries.find(e => e.id === id)
  
  if (!entry) {
    notFound()
  }

  return <EntryClient entry={entry} />
}

// Generate static params for all entries (optional - for static generation)
export async function generateStaticParams() {
  const entries = await getEntries()
  
  return entries.map((entry) => ({
    id: entry.id,
  }))
}

