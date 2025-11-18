import { useState } from 'react'
import type { LanguageId } from '@/types/language'

interface WelcomeScreenProps {
  onComplete: (selectedLanguage: LanguageId) => void
}

const LANGUAGES = [
  {
    id: 'python' as LanguageId,
    name: 'Python',
    icon: '🐍',
    description: 'Great for beginners. Clean syntax and versatile.',
    difficulty: 'Beginner Friendly',
  },
  {
    id: 'javascript' as LanguageId,
    name: 'JavaScript',
    icon: '⚡',
    description: 'Powers the web. Essential for frontend development.',
    difficulty: 'Beginner Friendly',
  },
  {
    id: 'gdscript' as LanguageId,
    name: 'GDScript',
    icon: '🎮',
    description: 'Made for Godot game development. Python-like syntax.',
    difficulty: 'Beginner Friendly',
  },
  {
    id: 'csharp' as LanguageId,
    name: 'C#',
    icon: '⚙️',
    description: 'Powerful and versatile. Used in Unity and .NET.',
    difficulty: 'Intermediate',
  },
  {
    id: 'ruby' as LanguageId,
    name: 'Ruby',
    icon: '💎',
    description: 'Elegant and expressive. Popular for web development.',
    difficulty: 'Beginner Friendly',
  },
]

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId | null>(null)
  const [step, setStep] = useState<'welcome' | 'language'>('welcome')

  const handleStart = () => {
    setStep('language')
  }

  const handleLanguageSelect = (language: LanguageId) => {
    setSelectedLanguage(language)
  }

  const handleContinue = () => {
    if (selectedLanguage) {
      onComplete(selectedLanguage)
    }
  }

  if (step === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto p-8 bg-navy-800 rounded-lg shadow-2xl border border-navy-700">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-accent-500 mb-4">
              Welcome to Code Tutor
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your interactive journey to mastering programming starts here
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
              <div className="p-6 bg-navy-700 rounded-lg">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Learn by Doing
                </h3>
                <p className="text-sm text-gray-400">
                  Write real code and get instant feedback on every lesson
                </p>
              </div>

              <div className="p-6 bg-navy-700 rounded-lg">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  AI Tutor
                </h3>
                <p className="text-sm text-gray-400">
                  Get personalized hints and guidance when you're stuck
                </p>
              </div>

              <div className="p-6 bg-navy-700 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Track Progress
                </h3>
                <p className="text-sm text-gray-400">
                  Earn XP, unlock badges, and level up as you learn
                </p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Get Started
            </button>

            <p className="mt-6 text-sm text-gray-500">
              No sign-up required • Free forever • Works offline
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-8 bg-navy-800 rounded-lg shadow-2xl border border-navy-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Choose Your Language
          </h2>
          <p className="text-gray-400">
            Select a programming language to start your learning journey
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Don't worry, you can explore other languages later!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageSelect(lang.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selectedLanguage === lang.id
                  ? 'border-accent-500 bg-accent-500/10'
                  : 'border-navy-600 bg-navy-700 hover:border-accent-400'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{lang.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {lang.name}
                  </h3>
                  <span className="text-xs text-accent-400 font-medium">
                    {lang.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{lang.description}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep('welcome')}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className={`px-8 py-3 font-semibold rounded-lg transition-colors ${
              selectedLanguage
                ? 'bg-accent-500 hover:bg-accent-600 text-white'
                : 'bg-navy-600 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
