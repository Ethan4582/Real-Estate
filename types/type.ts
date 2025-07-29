export type PropertyWithMessages = {
  id: number
  title: string
  address: string
  latestMessage?: {
    content: string
    createdAt: string
    sender: {
      id: number
      name: string
    }
    senderId: number
  }
  unreadCount: number
  userId: number
}