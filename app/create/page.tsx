"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Image, Link } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function CreatePostPage() {
  const [content, setContent] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      // Here you would typically send the post data to your backend
      console.log("Submitting post:", content)
      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
      })
      router.push('/')  // Redirect to home page after posting
    }
  }

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
                <AvatarImage src="/placeholder-user.jpg" alt="Your avatar" />
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button type="button" variant="outline" size="icon">
                <Image className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon">
                <Link className="h-4 w-4" />
              </Button>
            </div>
            <Button type="submit" disabled={!content.trim()}>Post</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

