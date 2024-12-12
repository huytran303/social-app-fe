import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageSquare, UserPlus } from 'lucide-react'

// Mock notification data
const notifications = [
  { id: 1, type: 'like', user: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=5' }, content: 'liked your post', timestamp: '2 hours ago' },
  { id: 2, type: 'comment', user: { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=8' }, content: 'commented on your post', timestamp: '4 hours ago' },
  { id: 3, type: 'follow', user: { name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=9' }, content: 'started following you', timestamp: '1 day ago' },
  { id: 4, type: 'like', user: { name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?img=10' }, content: 'liked your comment', timestamp: '2 days ago' },
]

export default function NotificationsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="flex items-center space-x-4 py-4">
              <Avatar>
                <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p>
                  <span className="font-semibold">{notification.user.name}</span>{' '}
                  {notification.content}
                </p>
                <p className="text-sm text-muted-foreground">{notification.timestamp}</p>
              </div>
              {notification.type === 'like' && <Heart className="h-5 w-5 text-red-500" />}
              {notification.type === 'comment' && <MessageSquare className="h-5 w-5 text-blue-500" />}
              {notification.type === 'follow' && <UserPlus className="h-5 w-5 text-green-500" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

