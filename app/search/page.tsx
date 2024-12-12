"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post-card"
import { Search } from 'lucide-react'

// Mock data for users and posts
const users = [
  { id: 1, username: "janedoe", name: "Jane Doe", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 2, username: "johndoe", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: 3, username: "alicesmith", name: "Alice Smith", avatar: "https://i.pravatar.cc/150?img=9" },
]

const posts = [
  { id: 1, username: "janedoe", content: "Just launched my new project!", likes: 42, comments: 7, timestamp: "2h ago" },
  { id: 2, username: "johndoe", content: "Beautiful day for a walk!", likes: 23, comments: 3, timestamp: "4h ago" },
  { id: 3, username: "alicesmith", content: "Who's up for a coding challenge?", likes: 15, comments: 10, timestamp: "6h ago" },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("users")

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="flex space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Search users or posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <Card key={user.id}>
                  <CardContent className="flex items-center space-x-4 py-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                    <Button className="ml-auto" variant="outline">Follow</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-4">No users found</p>
          )}
        </TabsContent>
        <TabsContent value="posts">
          {filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  username={post.username}
                  userAvatar={users.find(u => u.username === post.username)?.avatar || ""}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-4">No posts found</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

