"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Image, Link, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { createNewPost } from '@/services/postServices'
import { extractUserIdFromToken } from '@/services/jwtServices'
import { getUserProfile } from '@/services/userServices'
import { toast } from 'react-toastify'
export default function CreatePostPage() {
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      let userData = sessionStorage.getItem('user')
      if (!userData) throw new Error('No user data found')

      const parsedData = JSON.parse(userData)
      userData = parsedData
      if (!parsedData.data.token) throw new Error('No token found')
      console.log(">>>parsedData", parsedData.data.token)
      const userId = await extractUserIdFromToken(parsedData.data.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
      const getUserData = await getUserProfile(userId)
      setUserData(getUserData.result)
    }
    fetchUserData()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userData = sessionStorage.getItem('user')
    if (!userData) throw new Error('No user data found')
    const parsedData = JSON.parse(userData)
    console.log(">>>parsedData", parsedData)
    if (!parsedData.data.token) throw new Error('No token found')

    // Get user ID from token
    const userId = await extractUserIdFromToken(parsedData.data.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
    if (content.trim() || image) {
      try {
        const newPost = {
          userId,
          content,
          imageUrl: image
        }

        await createNewPost(newPost)
        toast.success('Post created successfully')
        router.push('/')  // Redirect to home page after posting
      } catch (error) {
        console.error('Failed to create post:', error)
        toast.error('Failed to create post')
      }
    } else {
      toast.error('Please enter some content or upload an image')
    }
  }

  if (!userData) return <div>Loading...</div>

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={userData.avatarUrl || "/placeholder-user.jpg"} alt="Your avatar" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>
            {image && (
              <div className="relative mt-4">
                <img src={image} alt="Post image" className="rounded-lg max-w-full h-auto" />
                <Button
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
              <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById('post-image-input')?.click()}>
                <Image className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon">
                <Link className="h-4 w-4" />
              </Button>
            </div>
            <Button type="submit" disabled={!content.trim() && !image}>Post</Button>
          </CardFooter>
        </form>
        <input
          id="post-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </Card>
    </div>
  )
}