import React from 'react'
import Messages from '../pages/ChatPage'

function RightHome() {
  return (
    <div className='w-[25%] hidden min-h-screen lg:block bg-black border-l-2 border-gray-900'>
      <Messages/>
    </div>
  )
}

export default RightHome
