import Link from 'next/link'
import { MoreHorizontal, Heart, MessageSquare, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface PostCardProps {
  post: {
    id: number;
    content: string;
    likes: number;
    comments: number;
    timestamp: string;
  };
  username: string;
  userAvatar: string;
}

export function PostCard({ post, username, userAvatar }: PostCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Link href={`/profile/${username}`} className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{username}</p>
            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
          </div>
        </Link>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground hover:underline">
          {post.likes} likes • {post.comments} comments
        </Link>
      </CardFooter>
    </Card>
  )
}

