import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Heart, MessageSquare, Send, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// This would typically come from a database
const posts = [
  {
    id: 1,
    username: 'User1',
    content: 'This is the first post content.',
    likes: [
      { id: 1, username: 'LikerA' },
      { id: 2, username: 'LikerB' },
      { id: 3, username: 'LikerC' },
      { id: 4, username: 'LikerD' },
      { id: 5, username: 'LikerE' },
    ],
    comments: 5
  },
  { id: 2, username: 'User2', content: 'This is the second post content.', likes: 15, comments: 3 },
  { id: 3, username: 'User3', content: 'This is the third post content.', likes: 7, comments: 1 },
]

export default function PostPage({ params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === parseInt(params.id))

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to feed
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${post.id}`} alt={post.username} />
              <AvatarFallback>{post.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.username}</p>
              <p className="text-sm text-muted-foreground">2h ago</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>{post.content}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="flex justify-between w-full mb-4">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{post.likes.length} likes • {post.comments} comments</p>
          </div>
          <div className="w-full">
            <h3 className="text-sm font-semibold mb-2">Liked by</h3>
            <ScrollArea className="h-20">
              {post.likes.map((like, index) => (
                <div key={like.id} className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${like.id}`} alt={like.username} />
                    <AvatarFallback>{like.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{like.username}</span>
                </div>
              ))}
            </ScrollArea>
            {post.likes.length > 5 && (
              <Link href={`/post/${post.id}/likes`} className="text-sm text-primary flex items-center mt-2">
                View all likes
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder-user.jpg" alt="Your avatar" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <p className="font-semibold">You</p>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Write a comment..." />
          </CardContent>
          <CardFooter>
            <Button>Post Comment</Button>
          </CardFooter>
        </Card>

        {[...Array(post.comments)].map((_, index) => (
          <Card key={index} className="mb-4">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 10}`} alt={`Commenter ${index + 1}`} />
                <AvatarFallback>U{index + 1}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">User{index + 1}</p>
            </CardHeader>
            <CardContent>
              <p>This is a sample comment. It can be much longer and may include multiple sentences.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

