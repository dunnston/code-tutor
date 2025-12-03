import { useState } from 'react'
import { ProfileHeader } from './dashboard/ProfileHeader'
import { ActiveCourseCard } from './dashboard/ActiveCourseCard'
import { StatsGrid } from './dashboard/StatsGrid'
import { GamificationWidget } from './dashboard/GamificationWidget'
import { PuzzleWidget } from './dashboard/PuzzleWidget'
import { PlaygroundWidget } from './dashboard/PlaygroundWidget'
import { CourseCatalog } from './dashboard/CourseCatalog'
import { DungeonWidget, TownHub, CharacterSheet } from './rpg'
import { useAppStore } from '@/lib/store'
import type { CourseCategory } from '@/types/course'

interface DashboardProps {
  onLogout?: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dungeonOpen, setDungeonOpen] = useState(false)
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false)
  const { currentUserId } = useAppStore()

  return (
    <div className="min-h-screen bg-navy-900 text-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <ProfileHeader
          onLogout={onLogout}
          onOpenCharacterSheet={() => setCharacterSheetOpen(true)}
        />

        {/* Playground Widget */}
        <section className="mt-6">
          <PlaygroundWidget />
        </section>

        {/* Active Courses Section */}
        <section className="mt-8">
          <ActiveCourseCard />
        </section>

        {/* Stats Grid */}
        <section className="mt-8">
          <StatsGrid />
        </section>

        {/* Gamification Widget - Shop, Inventory, Quests */}
        <section className="mt-8">
          <GamificationWidget />
        </section>

        {/* RPG Dungeon Widget */}
        {currentUserId && (
          <section className="mt-8">
            <DungeonWidget
              userId={currentUserId}
              onEnterDungeon={() => setDungeonOpen(true)}
            />
          </section>
        )}

        {/* Puzzle Widget */}
        <section className="mt-8">
          <PuzzleWidget />
        </section>

        {/* Course Catalog */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Explore Courses</h2>

            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-accent-500 transition-colors"
              />

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CourseCategory | 'all')}
                className="px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-accent-500 transition-colors"
              >
                <option value="all">All Categories</option>
                <option value="backend">Backend</option>
                <option value="frontend">Frontend</option>
                <option value="game-dev">Game Development</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          <CourseCatalog
            category={selectedCategory === 'all' ? undefined : selectedCategory}
            searchQuery={searchQuery}
          />
        </section>
      </div>

      {/* RPG Town Hub Modal */}
      {dungeonOpen && currentUserId && (
        <TownHub
          userId={currentUserId}
          onClose={() => setDungeonOpen(false)}
        />
      )}

      {/* Character Sheet Modal */}
      {currentUserId && (
        <CharacterSheet
          userId={currentUserId}
          isOpen={characterSheetOpen}
          onClose={() => setCharacterSheetOpen(false)}
        />
      )}
    </div>
  )
}
