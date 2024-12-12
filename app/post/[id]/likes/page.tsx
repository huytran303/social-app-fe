\`\`\`tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// This would typically come from a database
const posts = [
  { 
    id: 1, 
    likes: [
      { id: 1, username: 'LikerA' },
      { id: 2, username: 'LikerB' },
      { id: 3, username: 'LikerC' },
      { id: 4, username: 'LikerD' },
      { id: 5, username: 'LikerE' },
      { id: 6, username: 'LikerF' },
      { id: 7, username: 'LikerG' },
      { id: 8, username: 'LikerH' },
    ]
  },
  // ... other posts
]

export default function PostLikesPage({ params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === parseInt(params.id))

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Link href={`/post/${params.id}`} className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to post
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Likes ({post.likes.length})</h1>
      
      <div className="space-y-4">
        {post.likes.map((like) => (
          <div key={like.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?img=${like.id}`} alt={like.username} />
                <AvatarFallback>{like.username[0]}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{like.username}</p>
            </div>
            <Button variant="outline" size="sm">Follow</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

