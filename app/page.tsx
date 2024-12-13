'use client'

import { useEffect, useState } from 'react'
import { getAllPosts, createNewPost } from '@/services/postServices'
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, ImageIcon, X } from 'lucide-react'
import Loading from '@/components/Loading'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { extractUserIdFromToken } from '@/services/jwtServices'
import { toast } from 'react-toastify'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPostFormOpen, setIsPostFormOpen] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = sessionStorage.getItem('user')
        if (!userData) throw new Error('No user data found')

        const parsedData = JSON.parse(userData)
        if (!parsedData.data.token) throw new Error('No token found')

        const userId = await extractUserIdFromToken(parsedData.data.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
        setCurrentUserId(userId)
      } catch (error) {
        console.error('Failed to get user ID:', error)
      }
    }

    getUserId()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts()
      console.log('Posts:', response.data)

      // Sort posts by createdAt in descending order (newest first)
      const sortedPosts = response.data.result.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setPosts(sortedPosts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewPostImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setNewPostImage(null)
    setImagePreview(null)
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    const userData = sessionStorage.getItem('user')
    if (!userData) throw new Error('No user data found')

    const parsedData = JSON.parse(userData)
    if (!parsedData.data.token) throw new Error('No token found')

    // Get user ID from token
    const userId = await extractUserIdFromToken(parsedData.data.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
    if (newPostContent.trim() || newPostImage) {
      try {
        const newPost = {
          userId,
          content: newPostContent,
          imageUrl: newPostImage
        }

        const response = await createNewPost(newPost)
        setPosts([response.result, ...posts])
        setNewPostContent('')
        setNewPostImage(null)
        toast.success('Post created successfully')
      } catch (error) {
        console.error('Failed to create post:', error)
        toast.error('Failed to create post')
      }
    } else {
      toast.error('Post content or image is required')
    }
  }

  const handlePostDeleted = (deletedPostId: number) => {
    setPosts(posts.filter(post => post.id !== deletedPostId))
  }

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div className="sticky top-0 bg-background pt-4 pb-2 z-10">
        {!isPostFormOpen ? (
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsPostFormOpen(true)}
          >
            <Input
              placeholder="What's on your mind?"
              className="flex-grow"
              readOnly
            />
            <Button type="button">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post
            </Button>
          </div>
        ) : (
          <Card>
            <form onSubmit={handleSubmitPost}>
              <CardContent className="pt-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                  className="w-full mb-4"
                />
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button type="button" variant="outline" size="icon" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="h-4 w-4" />
                    </label>
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsPostFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!newPostContent.trim() && !newPostImage}>
                    Post
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              content: post.content,
              likes: post.likesCount,
              comments: post.commentsCount,
              timestamp: new Date(post.createdAt).toLocaleString(),
              imageUrl: post.imageUrl,
              userId: post.user.id // Add this line
            }}
            username={post.user.username}
            userAvatar={post.user.avatarUrl}
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </div>
    </div>
  )
}

