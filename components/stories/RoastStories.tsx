"use client"

import { useState } from "react"
import { BookOpen, ChevronLeft, ChevronRight, Play, Share2 } from "lucide-react"

interface StoryItem {
  id: string
  user: string
  avatar: string
  score: number
  stackName: string
  caption: string
  timeAgo: string
}

interface RoastStoriesProps {
  locale?: string
}

const mockStories: StoryItem[] = [
  {
    id: "1",
    user: "Security_Ninja",
    avatar: "🥷",
    score: 92,
    stackName: "Kubernetes + Istio",
    caption: "Just roasted my K8s cluster! 🔥",
    timeAgo: "2h ago",
  },
  {
    id: "2",
    user: "DevOps_Pro",
    avatar: "🚀",
    score: 78,
    stackName: "PostgreSQL + Redis",
    caption: "Fixed 5 critical issues! 💪",
    timeAgo: "4h ago",
  },
  {
    id: "3",
    user: "Cloud_Guardian",
    avatar: "☁️",
    score: 85,
    stackName: "AWS + Terraform",
    caption: "New personal best! 🏆",
    timeAgo: "6h ago",
  },
  {
    id: "4",
    user: "ZeroTrust_Expert",
    avatar: "🔒",
    score: 89,
    stackName: "Vault + Consul",
    caption: "Zero Trust achieved! 🎉",
    timeAgo: "8h ago",
  },
  {
    id: "5",
    user: "AI_Security",
    avatar: "🤖",
    score: 76,
    stackName: "LangChain + Pinecone",
    caption: "AI stack secured! 🧠",
    timeAgo: "10h ago",
  },
]

export function RoastStories({ locale = "de" }: RoastStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewingStory, setViewingStory] = useState<string | null>(null)
  const isDE = locale === "de"

  const currentStory = mockStories[currentIndex]
  const viewingStoryData = viewingStory ? mockStories.find(s => s.id === viewingStory) : null

  const content = {
    de: {
      title: "Roast Stories",
      view: "Ansehen",
      share: "Teilen",
    },
    en: {
      title: "Roast Stories",
      view: "View",
      share: "Share",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  if (viewingStoryData) {
    return (
      <div className="w-full bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {/* Progress Bar */}
        <div className="flex gap-1 p-2">
          {mockStories.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index < mockStories.indexOf(viewingStoryData)
                  ? "bg-cyan-500"
                  : index === mockStories.indexOf(viewingStoryData)
                    ? "bg-cyan-400"
                    : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Story Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{viewingStoryData.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-100">{viewingStoryData.user}</div>
              <div className="text-xs text-zinc-500">{viewingStoryData.timeAgo}</div>
            </div>
            <button
              onClick={() => setViewingStory(null)}
              className="text-zinc-500 hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Stack Card */}
          <div className="bg-gray-900 rounded-lg p-6 mb-4">
            <div className="text-sm text-zinc-500 mb-2">{viewingStoryData.stackName}</div>
            <div className="text-5xl font-bold text-cyan-400 mb-2">{viewingStoryData.score}</div>
            <div className="text-gray-300">{viewingStoryData.caption}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium text-white transition-colors">
              {t.view}
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-300 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between p-4 border-t border-gray-700">
          <button
            onClick={() => {
              const prevIndex = (mockStories.indexOf(viewingStoryData) - 1 + mockStories.length) % mockStories.length
              setViewingStory(mockStories[prevIndex].id)
            }}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-500" />
          </button>
          <button
            onClick={() => {
              const nextIndex = (mockStories.indexOf(viewingStoryData) + 1) % mockStories.length
              setViewingStory(mockStories[nextIndex].id)
            }}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-cyan-400" />
        <h3 className="font-semibold text-gray-100">{t.title}</h3>
      </div>

      {/* Story Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {mockStories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => setViewingStory(story.id)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="relative">
              <div
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-2xl
                  transition-all
                  ${index === currentIndex ? "ring-2 ring-cyan-500" : "ring-2 ring-gray-700"}
                  group-hover:ring-cyan-400
                `}
              >
                {story.avatar}
              </div>
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Play className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
            <div className="text-xs text-zinc-500 max-w-16 truncate">{story.user}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
