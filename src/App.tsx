import { useState } from 'react'

function App() {
  const [message, setMessage] = useState('Welcome to Code Tutor!')

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          Code Tutor
        </h1>
        <p className="text-lg text-gray-300 mb-8">{message}</p>
        <button
          onClick={() => setMessage('Let\'s start learning!')}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
