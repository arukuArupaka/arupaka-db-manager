"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    action: "added a new textbook",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    action: "updated their profile",
    time: "3 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MJ",
    },
    action: "sent a notification",
    time: "5 hours ago",
  },
  {
    id: 4,
    user: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    action: "updated a class schedule",
    time: "1 day ago",
  },
  {
    id: 5,
    user: {
      name: "Alex Brown",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AB",
    },
    action: "added a new room",
    time: "1 day ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}

