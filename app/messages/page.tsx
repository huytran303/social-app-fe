"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react'

// Mock conversation data
const conversations = [
  { id: 1, username: "janedoe", avatar: "https://i.pravatar.cc/150?img=5", lastMessage: "Hey, how's it going?", timestamp: "10:30 AM" },
  { id: 2, username: "bobsmith", avatar: "https://i.pravatar.cc/150?img=8", lastMessage: "Did you see the latest update?", timestamp: "Yesterday" },
  { id: 3, username: "alicejohnson", avatar: "https://i.pravatar.cc/150?img=9", lastMessage: "Let's catch up soon!", timestamp: "Monday" },
  { id: 4, username: "mikebrown", avatar: "https://i.pravatar.cc/150?img=10", lastMessage: "Thanks for your help!", timestamp: "Sunday" },
  { id: 5, username: "sarahlee", avatar: "https://i.pravatar.cc/150?img=11", lastMessage: "Can you send me that file?", timestamp: "Last week" },
]

// Mock messages for a conversation
const mockMessages = [
  { id: 1, sender: "janedoe", content: "Hey, how's it going?", timestamp: "2023-05-10T10:30:00Z" },
  { id: 2, sender: "currentUser", content: "Hi Jane! I'm doing well, thanks. How about you?", timestamp: "2023-05-10T10:32:00Z" },
  { id: 3, sender: "janedoe", content: "I'm great! Just working on a new project.", timestamp: "2023-05-10T10:35:00Z" },
  { id: 4, sender: "currentUser", content: "That sounds exciting! What kind of project is it?", timestamp: "2023-05-10T10:37:00Z" },
  { id: 5, sender: "janedoe", content: "It's a new app for task management. I'll tell you more about it when we meet!", timestamp: "2023-05-10T10:40:00Z" },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "currentUser",
        content: newMessage,
        timestamp: new Date().toISOString(),
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Conversation Sidebar */}
      <div className="w-1/3 border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-73px)]">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center space-x-4 p-4 hover:bg-accent cursor-pointer ${selectedConversation.id === conv.id ? "bg-accent" : ""
                }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <Avatar>
                <AvatarImage src={conv.avatar} alt={conv.username} />
                <AvatarFallback>{conv.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold truncate">{conv.username}</p>
                  <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Message Content */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-border flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.username} />
                <AvatarFallback>{selectedConversation.username[0]}</AvatarFallback>
              </Avatar>
              <h2 className="font-semibold text-lg">{selectedConversation.username}</h2>
            </div>
            <ScrollArea className="flex-grow p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.sender === "currentUser" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "currentUser"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                      }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}

