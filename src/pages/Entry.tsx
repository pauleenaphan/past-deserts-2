import { useLocation, useNavigate } from 'react-router-dom'
import { Entry as EntryType } from '../api/entry'
import { FaRegCalendarAlt, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa'
import { PiCactusFill } from 'react-icons/pi'

export const Entry = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const entry = location.state?.entry as EntryType | null

  if (!entry) {
    return <div>No entry found</div>
  }

  return (
    <div className="w-full md:max-w-1/2 mx-auto px-8">
      <button 
        onClick={() => navigate('/Entries')}
        className="flex items-center gap-2 mb-12 text-gray-600 hover:text-headingcolor transition-colors cursor-pointer"
      >
        <FaArrowLeft />
        Back to Entries
      </button>
      <div className="space-y-8">
        <div>
          <div className="flex flex-wrap gap-2">
            {entry.labels.map((label, index) => (
              <span 
                key={index}
                className="inline-block bg-buttonsecondary px-3 py-1 rounded-md text-sm font-medium capitalize"
              >
                {label}
              </span>
            ))}
          </div>
          <h1 className="text-6xl font-bold mt-4">{entry.name}</h1>
        </div>
        <div className="flex items-center gap-8 text-lg flex-wrap">
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt className="text-headingcolor"/>
            <span>{entry.date}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <PiCactusFill className="text-accentcolor text-2xl"/>
            <span>{entry.rating} Cactus</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Difficulty:</span>
            <span className="capitalize">{entry.difficulty}</span>
          </div>
          {entry.link && (
          <a 
            href={entry.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg hover:underline cursor-pointer"
          >
            <FaExternalLinkAlt className="text-headingcolor" />
            Link to Original Recipe
          </a>
        )}
        </div>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-2xl">
            {entry.summary}
          </div>
        </div>

        {entry.images && entry.images.length >= 1 && (
          <div className="mt-8 pb-12 flex flex-wrap gap-4 flex-1">
            {entry.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${entry.name} - Image ${index + 1}`}
                className="max-w-sm h-auto object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
