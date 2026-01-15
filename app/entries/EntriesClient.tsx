'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaRegCalendarAlt, FaArrowRight } from "react-icons/fa"
import { PiCactusFill } from "react-icons/pi"
import { Entry } from '@/lib/entry'

interface EntriesClientProps {
  entries: Entry[]
}

export const EntriesClient = ({ entries }: EntriesClientProps) => {
  return (
    <div className="flex flex-col w-4/5 md:w-3/4 mx-auto pb-8 gap-4">
      <h1 className="text-3xl font-bold">All Entries</h1>
      <h2 className="text-2xl font-bold"> Total Entries: {entries.length}</h2>
      <div className="flex flex-wrap gap-6">
        {entries.map((entry, index) => (
          <div key={entry.id || index} className="border border-[#D4C4A8] rounded-br-md rounded-bl-md flex-grow bg-white w-full md:w-1/4 max-w-md shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
            <div className="w-full h-64 bg-gray-200 relative overflow-hidden">
              {entry.images && entry.images.length > 0 ? (
                <Image 
                  src={entry.images[0]} 
                  alt={entry.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-center"
                  unoptimized
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col gap-6 justify-between flex-1">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {entry.labels.map((label, labelIndex) => (
                    <span 
                      key={labelIndex}
                      className="inline-block bg-buttonsecondary px-3 py-1 rounded-md text-sm font-medium capitalize"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <p className="font-bold text-3xl">{entry.name}</p>
                <p className="text-gray-600 line-clamp-3 mb-8">{entry.summary}</p>
              </div>
              <div>
                <div className="flex justify-end">
                  <Link 
                    href={`/entry/${entry.id}`}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer mb-4"
                  >
                    <span>Read More</span>
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
                <div className="flex items-center gap-2 justify-between border-t-2 border-gray-200 pt-4 text-xl">
                  <div className="flex items-center gap-2">
                    <FaRegCalendarAlt className="text-headingcolor"/>
                    <p className="">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <PiCactusFill className="text-accentcolor text-2xl"/>
                    <p className=" ">{entry.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

