import { useEffect, useState, useRef, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { AchievementNotification as AchievementNotificationType, TIER_CONFIG } from '@/lib/achievements'
import { useAppStore } from '@/lib/store'

// Polling configuration with exponential backoff
const MIN_POLL_INTERVAL = 5000  // 5 seconds minimum
const MAX_POLL_INTERVAL = 30000 // 30 seconds maximum
const BACKOFF_MULTIPLIER = 1.5  // Increase by 50% each time

export function AchievementNotificationManager() {
  const [notifications, setNotifications] = useState<AchievementNotificationType[]>([])
  const [currentNotification, setCurrentNotification] = useState<AchievementNotificationType | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Refs to track active timers for cleanup
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollIntervalRef = useRef(MIN_POLL_INTERVAL)

  const currentUserId = useAppStore((state) => state.currentUserId)

  // Cleanup function to clear all timers
  const clearAllTimers = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current)
      autoHideTimerRef.current = null
    }
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  // Schedule next poll with current interval
  const scheduleNextPoll = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
    }
    pollTimerRef.current = setTimeout(checkForNotificationsWithBackoff, pollIntervalRef.current)
  }, [])

  // Check for notifications with exponential backoff
  const checkForNotificationsWithBackoff = useCallback(async () => {
    if (!currentUserId) return

    try {
      const pending = await invoke<AchievementNotificationType[]>(
        'get_pending_achievement_notifications',
        { userId: currentUserId }
      )
      if (pending.length > 0) {
        setNotifications(pending)
        // Reset to minimum interval when notifications found
        pollIntervalRef.current = MIN_POLL_INTERVAL
      } else {
        // Increase interval with exponential backoff (capped at MAX)
        pollIntervalRef.current = Math.min(
          pollIntervalRef.current * BACKOFF_MULTIPLIER,
          MAX_POLL_INTERVAL
        )
      }
    } catch (err) {
      console.error('Failed to check for achievement notifications:', err)
      // On error, use slower polling to avoid hammering the backend
      pollIntervalRef.current = MAX_POLL_INTERVAL
    }

    // Schedule next poll
    scheduleNextPoll()
  }, [currentUserId, scheduleNextPoll])

  // Poll for new notifications with exponential backoff
  useEffect(() => {
    if (currentUserId) {
      // Reset interval on user change
      pollIntervalRef.current = MIN_POLL_INTERVAL
      checkForNotificationsWithBackoff()
      return () => clearAllTimers()
    }
    return () => clearAllTimers()
  }, [currentUserId, clearAllTimers, checkForNotificationsWithBackoff])

  // Show next notification when queue changes
  useEffect(() => {
    if (!currentNotification && notifications.length > 0 && !isVisible) {
      showNextNotification()
    }
  }, [notifications, currentNotification, isVisible])

  const showNextNotification = () => {
    if (notifications.length === 0) return

    const [next, ...rest] = notifications
    setCurrentNotification(next)
    setNotifications(rest)
    setIsVisible(true)

    // Clear any existing auto-hide timer
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current)
    }

    // Auto-hide after 5 seconds
    autoHideTimerRef.current = setTimeout(() => {
      hideNotification(next.id)
    }, 5000)
  }

  const hideNotification = async (notificationId: number) => {
    setIsVisible(false)

    // Clear auto-hide timer
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current)
      autoHideTimerRef.current = null
    }

    // Mark as shown in database
    try {
      await invoke('mark_achievement_notification_shown', { notificationId })
    } catch (err) {
      console.error('Failed to mark notification as shown:', err)
    }

    // Clear any existing animation timer
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
    }

    // Wait for animation to complete before clearing
    animationTimerRef.current = setTimeout(() => {
      setCurrentNotification(null)
    }, 300)
  }

  if (!currentNotification || !isVisible) return null

  return (
    <AchievementNotification
      notification={currentNotification}
      onClose={() => hideNotification(currentNotification.id)}
    />
  )
}

interface AchievementNotificationProps {
  notification: AchievementNotificationType
  onClose: () => void
}

function AchievementNotification({ notification, onClose }: AchievementNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const achievement = notification.achievement
  const tierConfig = TIER_CONFIG[achievement.tier]

  useEffect(() => {
    // Start animation after mount
    const timer = setTimeout(() => setIsAnimating(true), 10)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 pointer-events-auto ${
          isAnimating ? 'opacity-70' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Notification Card */}
      <div
        className={`relative bg-gradient-to-br from-navy-800 via-navy-900 to-navy-800 rounded-2xl shadow-2xl border-2 max-w-md w-full mx-4 pointer-events-auto transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'
        } ${tierConfig.bgColor} border-${achievement.tier === 'bronze' ? 'orange' : achievement.tier === 'silver' ? 'gray' : achievement.tier === 'gold' ? 'yellow' : achievement.tier === 'platinum' ? 'cyan' : 'purple'}-500/50`}
      >
        {/* Animated glow effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tierConfig.gradient} opacity-20 animate-pulse`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-xl font-bold text-accent-400 mb-2 animate-bounce">
              🎉 ACHIEVEMENT UNLOCKED! 🎉
            </div>
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${tierConfig.bgColor} ${tierConfig.color} border-2 border-current`}>
              {tierConfig.label.toUpperCase()}
            </div>
          </div>

          {/* Icon and Title */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-8xl mb-4 animate-bounce-slow">{achievement.icon}</div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              {achievement.name}
            </h2>
            <p className="text-gray-300 text-center text-lg">{achievement.description}</p>
          </div>

          {/* Rewards */}
          <div className="bg-navy-800/50 rounded-xl p-6 backdrop-blur-sm border border-navy-700">
            <div className="text-center text-sm text-gray-400 mb-3 font-semibold">REWARDS</div>
            <div className="flex justify-center items-center gap-6">
              {achievement.xp_reward > 0 && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    +{achievement.xp_reward}
                  </div>
                  <div className="text-xs text-gray-400 uppercase">XP</div>
                </div>
              )}

              {achievement.gold_reward > 0 && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">
                    +{achievement.gold_reward}
                  </div>
                  <div className="text-xs text-gray-400 uppercase">Gold</div>
                </div>
              )}

              {achievement.gem_reward > 0 && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">
                    +{achievement.gem_reward}
                  </div>
                  <div className="text-xs text-gray-400 uppercase">Gems</div>
                </div>
              )}
            </div>

            {achievement.unlock_item_id && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/50 rounded-lg">
                  <span className="text-2xl">🎁</span>
                  <span className="text-purple-300 font-semibold">Item Unlocked!</span>
                </div>
              </div>
            )}
          </div>

          {/* Motivational message */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 italic">
              {getMotivationalMessage(achievement.tier)}
            </p>
          </div>
        </div>

        {/* Decorative particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-${achievement.tier === 'bronze' ? 'orange' : achievement.tier === 'silver' ? 'gray' : achievement.tier === 'gold' ? 'yellow' : achievement.tier === 'platinum' ? 'cyan' : 'purple'}-400 rounded-full opacity-70 animate-float-particle`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function getMotivationalMessage(tier: string): string {
  const messages = {
    bronze: 'Every journey begins with a single step!',
    silver: 'Your dedication is paying off!',
    gold: 'Excellence is your standard!',
    platinum: 'You are a true master!',
    secret: 'You discovered something special!',
  }
  return messages[tier as keyof typeof messages] || 'Great job!'
}

// Add these custom animations to your global CSS file
const animationStyles = `
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-100px) translateX(50px) scale(1.5);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) translateX(0) scale(0.5);
    opacity: 0;
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

.animate-float-particle {
  animation: float-particle 3s infinite;
}
`
