'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { extractUserIdFromToken } from '@/services/jwtServices'
import { getUserProfile } from '@/services/userServices'
import Loading from '@/components/Loading'

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const userData = sessionStorage.getItem('user')
          if (!userData) throw new Error('No user data found')

          const parsedData = JSON.parse(userData)
          if (!parsedData.token) throw new Error('No token found')

          const userId = await extractUserIdFromToken(parsedData.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
          console.log('User ID:', userId)

          const response = await getUserProfile(userId)
          if (!response?.result) throw new Error('Failed to fetch user data')
          console.log('User data:', response.result)
          setUserData(response.result)
          setPosts(response.result.posts || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (isLoading) return <Loading />
  if (error) return <div className="text-center text-red-500">{error}</div>
  if (!userData) return <div className="text-center">No user data found</div>

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <CardContent className="pt-0 relative">
          <Avatar className="h-24 w-24 absolute -top-12 ring-4 ring-background">
            <AvatarImage src={userData.avatarUrl} alt={userData.username} />
            <AvatarFallback>{userData.username?.[0]}</AvatarFallback>
          </Avatar>
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold mb-2">{userData.lastName + " " + userData.firstName}</h1>
            <p className="text-muted-foreground mb-4">{userData.bio}</p>
            <div className="flex justify-center space-x-4 mb-4">
              <div>
                <span className="font-bold">{userData.followersCount}</span> followers
              </div>
              <div>
                <span className="font-bold">{userData.followingCount}</span> following
              </div>
              <div>
                <span className="font-bold">{posts.length}</span> posts
              </div>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <Button className="sm:w-auto" onClick={() => router.push('/profile/edit')}>Edit Profile</Button>
              <Button className="sm:w-auto" variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              username={userData.username}
              userAvatar={userData.avatar}
            />
          ))}
        </TabsContent>
        <TabsContent value="media">Media content here</TabsContent>
        <TabsContent value="likes">Liked posts here</TabsContent>
      </Tabs>
    </div>
  )
}