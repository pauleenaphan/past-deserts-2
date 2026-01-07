import { EntriesClient } from './EntriesClient'
import { getEntries } from '@/lib/entry'

export default async function EntriesPage() {
  // Get entries from firebase
  const entries = await getEntries()
  
  // Sort entries by date (newest to oldest)
  const sortedEntries = entries.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return <EntriesClient entries={sortedEntries} />
}

