"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const user = {
  username: "janedoe",
  avatar: "https://i.pravatar.cc/150?img=5",
  bio: "UX Designer | Nature lover | Yoga enthusiast",
  followers: 2345,
  following: 678,
  posts: 102,
}

// Mock posts data
const posts = [
  {
    id: 1,
    content: "Just finished a new design project! Can't wait to share it with you all.",
    likes: 89,
    comments: 12,
    timestamp: "1h ago",
  },
  {
    id: 2,
    content: "Morning yoga session with a beautiful view. Starting the day right!",
    likes: 156,
    comments: 23,
    timestamp: "1d ago",
  },
  {
    id: 3,
    content: "What's your favorite UX design tool? I'm thinking of trying something new.",
    likes: 45,
    comments: 31,
    timestamp: "2d ago",
  },
]

export default function OtherProfilePage({ params }: { params: { username: string } }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(user.followers)
  const { toast } = useToast()

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1)
    toast({
      title: isFollowing ? "Unfollowed" : "Followed",
      description: isFollowing ? `You have unfollowed ${user.username}` : `You are now following ${user.username}`,
    })
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pink-400 to-purple-500"></div>
        <CardContent className="pt-0 relative">
          <Avatar className="h-24 w-24 absolute -top-12 ring-4 ring-background">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
            <p className="text-muted-foreground mb-4">{user.bio}</p>
            <div className="flex justify-center space-x-4 mb-4">
              <div>
                <span className="font-bold">{followerCount}</span> followers
              </div>
              <div>
                <span className="font-bold">{user.following}</span> following
              </div>
              <div>
                <span className="font-bold">{user.posts}</span> posts
              </div>
            </div>
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? "outline" : "default"}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
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
            <PostCard key={post.id} post={post} username={user.username} userAvatar={user.avatar} />
          ))}
        </TabsContent>
        <TabsContent value="media">Media content here</TabsContent>
        <TabsContent value="likes">Liked posts here</TabsContent>
      </Tabs>
    </div>
  )
}

