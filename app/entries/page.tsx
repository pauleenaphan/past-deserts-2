import { getEntries } from '@/lib/entry'
import { EntriesClient } from './EntriesClient'

// Server Component - fetches data on server (no flash!)
export default async function EntriesPage() {
  const entries = await getEntries()
  
  // Sort by date (newest first)
  const sortedEntries = entries.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Pass pre-fetched data to client component
  return <EntriesClient entries={sortedEntries} />
}
