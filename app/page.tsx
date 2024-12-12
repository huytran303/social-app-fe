import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'

const posts = [
  {
    id: 1,
    content: "Just launched my new project! Check it out at example.com",
    likes: 42,
    comments: 7,
    timestamp: "2h ago",
    username: "johndoe",
    userAvatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    content: "Enjoying a beautiful sunset. Life is good!",
    likes: 103,
    comments: 12,
    timestamp: "1d ago",
    username: "janedoe",
    userAvatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    content: "Learning a new programming language is always exciting. Any recommendations?",
    likes: 28,
    comments: 15,
    timestamp: "3d ago",
    username: "bobsmith",
    userAvatar: "https://i.pravatar.cc/150?img=3"
  },
]

export default function HomePage() {

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div className="sticky top-0 bg-background pt-4 pb-2 z-10">
        <form className="flex items-center space-x-2">
          <Input
            placeholder="What's on your mind?"
            className="flex-grow"
          />
          <Button type="submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post
          </Button>
        </form>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} username={post.username} userAvatar={post.userAvatar} />
        ))}
      </div>
    </div>
  )
}

