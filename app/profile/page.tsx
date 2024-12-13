'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { extractUserIdFromToken } from '@/services/jwtServices'
import { getUserProfile } from '@/services/userServices'
import { toast } from 'react-toastify'
import Loading from '@/components/Loading'
import axios from '@/setup/axios'
import { getPostByUserId, deletePost } from '@/services/postServices'

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    try {
      await axios.post('/users/logout');
      sessionStorage.clear();

      toast.success('Logout successful');

      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear session and redirect on error
      sessionStorage.clear();
      router.push('/login');
    }
  }, [router]);

  const fetchUserData = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        const userData = sessionStorage.getItem('user')
        if (!userData) throw new Error('No user data found')

        const parsedData = JSON.parse(userData)
        if (!parsedData.data.token) throw new Error('No token found')

        const userId = await extractUserIdFromToken(parsedData.data.token, process.env.NEXT_PUBLIC_JWT_SIGNED_KEY)
        console.log('User ID from profile:', userId)

        const response = await getUserProfile(userId)
        if (!response?.result) throw new Error('Failed to fetch user data')
        console.log('User data:', response.result)
        setUserData(response.result)

        const postsResponse = await getPostByUserId(userId)
        if (!postsResponse?.result) throw new Error('Failed to fetch posts')
        console.log('Posts:', postsResponse.result)

        const sortedPosts = postsResponse.result.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        setPosts(sortedPosts)
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  // const handleDeletePost = useCallback(async (postId: number) => {
  //   try {
  //     await deletePost(postId)
  //     setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
  //     toast.success('Post deleted successfully')
  //   } catch (error) {
  //     console.error('Failed to delete post:', error)
  //     toast.error('Failed to delete post')
  //   }
  // }, [])
  const handleDeletePost = (deletedPostId: number) => {
    setPosts(posts.filter(post => post.id !== deletedPostId))
  }

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
              post={{
                id: post.id,
                content: post.content,
                likes: post.likesCount,
                comments: post.commentsCount,
                timestamp: new Date(post.createdAt).toLocaleString(),
                imageUrl: post.imageUrl,
                userId: post.user.id
              }}
              username={userData.username}
              userAvatar={userData.avatarUrl}
              currentUserId={userData.id}
              onPostDeleted={handleDeletePost}
            />
          ))}
        </TabsContent>
        <TabsContent value="media">Media content here</TabsContent>
        <TabsContent value="likes">Liked posts here</TabsContent>
      </Tabs>
    </div>
  )
}

