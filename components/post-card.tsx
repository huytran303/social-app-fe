import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Heart, MessageSquare, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { likePost, unlikePost, getPostLikeStatus, deletePost } from '@/services/postServices'
import { extractUserIdFromToken } from '@/services/jwtServices'
import { toast } from 'react-toastify'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PostCardProps {
  post: {
    id: number;
    content: string;
    imageUrl?: string;
    likes: number;
    comments: number;
    timestamp: string;
    userId: number;
  };
  username: string;
  userAvatar: string;
  onPostDeleted?: (postId: number) => void;
}

export function PostCard({ post, username, userAvatar, onPostDeleted }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const userData = sessionStorage.getItem('user')
        if (!userData) throw new Error('No user data found')

        const parsedData = JSON.parse(userData)
        if (!parsedData.data.token) throw new Error('No token found')

        // Get user ID from token
        let userId = await extractUserIdFromToken(parsedData.data.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
        console.log(">>>check userId", userId)
        setCurrentUserId(userId)
        const liked = await getPostLikeStatus(post.id, userId)
        setIsLiked(liked)
      } catch (error) {
        console.error('Failed to check like status:', error)
      }
    }

    checkLikeStatus()
  }, [post.id])

  const handleLike = async () => {
    if (loading) return;  // Prevent multiple clicks while loading
    setLoading(true)
    try {
      const userData = sessionStorage.getItem('user')
      if (!userData) throw new Error('No user data found')

      const parsedData = JSON.parse(userData)
      if (!parsedData.data.token) throw new Error('No token found')
      console.log("postid", post)
      // Get user ID from token
      const userId = await extractUserIdFromToken(parsedData.data.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
      console.log('User ID:', userId)

      if (isLiked) {
        await unlikePost(post.id, userId)
        setLikes(prevLikes => prevLikes - 1)
      } else {
        await likePost(post.id, userId)
        setLikes(prevLikes => prevLikes + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Failed to update like count:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id)
      window.location.reload()
      toast.success('Post deleted successfully')
      if (onPostDeleted) {
        onPostDeleted(post.id)
      }
      // Reload the page after deleting the post

    } catch (error) {
      console.error('Failed to delete post:', error)
      toast.error('Failed to delete post')
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{username}</p>
            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {post.userId === currentUserId && (
              <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete Post
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePost}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post image" className="mt-4 rounded-lg max-w-full h-auto" />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleLike} disabled={loading}>
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground hover:underline">
          {likes} likes • {post.comments} comments
        </Link>
      </CardFooter>
    </Card>
  )
}

