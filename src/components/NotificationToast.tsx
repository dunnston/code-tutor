import { useEffect } from 'react'
import { useAppStore, type Notification } from '@/lib/store'

interface NotificationToastProps {
  notification: Notification
}

export function NotificationToast({ notification }: NotificationToastProps) {
  const dismissNotification = useAppStore((state) => state.dismissNotification)

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dismissNotification(notification.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification.id, dismissNotification])

  const bgColor = {
    'level-up': 'bg-gradient-to-r from-orange-500 to-orange-600',
    badge: 'bg-gradient-to-r from-purple-500 to-purple-600',
    streak: 'bg-gradient-to-r from-red-500 to-orange-500',
  }[notification.type]

  const icon = {
    'level-up': '⬆️',
    badge: '🏅',
    streak: '🔥',
  }[notification.type]

  return (
    <div
      className={`${bgColor} rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] animate-slide-in`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{notification.title}</h3>
          <p className="text-white/90 text-sm mt-1">{notification.message}</p>
        </div>
        <button
          onClick={() => dismissNotification(notification.id)}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export function NotificationContainer() {
  const notifications = useAppStore((state) => state.notifications)

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
