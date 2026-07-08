import React from 'react'

export default function SearchBar() {
  return (
    <div className='mx-1 my-4 flex justify-center'>
      <input type="text" placeholder='🔎 Search your notes'
        className='rounded bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 dark:text-gray-300 w-full px-2 py-1 text-sm' />
    </div>
  )
}
