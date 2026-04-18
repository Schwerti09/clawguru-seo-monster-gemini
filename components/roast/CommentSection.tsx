"use client"

import { useState } from "react"
import { MessageCircle, Send, User } from "lucide-react"

interface Comment {
  id: string
  author: string
  avatar?: string
  text: string
  timestamp: string
  likes: number
  isLiked?: boolean
}

interface CommentSectionProps {
  roastId?: string
  locale?: string
}

export function CommentSection({ roastId, locale = "de" }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "DevOpsMike",
      text: locale === "de" 
        ? "Dieser Roast hat mich zum Handeln gebracht. Score war 34, jetzt 78. Danke! 🔥"
        : "This roast made me take action. Score was 34, now 78. Thanks! 🔥",
      timestamp: "2h ago",
      likes: 23,
    },
    {
      id: "2",
      author: "SecuritySarah",
      text: locale === "de"
        ? "Die API-Key Leaks waren bei uns auch überall. Fix in 15 Min mit dem Runbook."
        : "API key leaks were everywhere for us too. Fixed in 15 min with the runbook.",
      timestamp: "5h ago",
      likes: 45,
    },
    {
      id: "3",
      author: "CTO_Founder",
      text: locale === "de"
        ? "Habe es im Team-Slack gepostet. Alle haben ihren Stack gecheckt. 😅"
        : "Posted in team Slack. Everyone checked their stack. 😅",
      timestamp: "1d ago",
      likes: 67,
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [showAll, setShowAll] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: "Anonymous",
      text: newComment,
      timestamp: "just now",
      likes: 0,
    }
    setComments([comment, ...comments])
    setNewComment("")
    // TODO: POST /api/roast/comment { roastId, text }
  }

  const handleLike = (id: string) => {
    setComments(prev => prev.map(c => 
      c.id === id 
        ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
        : c
    ))
  }

  const displayedComments = showAll ? comments : comments.slice(0, 3)

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-gray-100">
          {locale === "de" ? `Community (${comments.length})` : `Community (${comments.length})`}
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={locale === "de" ? "Dein Kommentar..." : "Your comment..."}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-cyan-900/50 border border-cyan-700/50 rounded-lg hover:bg-cyan-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-3 bg-gray-900 rounded-lg border border-gray-700/50">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-cyan-400">{comment.author}</span>
                <span className="text-xs text-zinc-500">{comment.timestamp}</span>
              </div>
              <p className="text-sm text-gray-300">{comment.text}</p>
              <button
                onClick={() => handleLike(comment.id)}
                className={`mt-2 text-xs flex items-center gap-1 transition-colors ${
                  comment.isLiked ? "text-pink-400" : "text-zinc-500 hover:text-pink-400"
                }`}
              >
                ❤️ {comment.likes}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      {comments.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {showAll 
            ? (locale === "de" ? "Weniger anzeigen ↑" : "Show less ↑")
            : (locale === "de" ? `Alle ${comments.length} Kommentare anzeigen ↓` : `Show all ${comments.length} comments ↓`)
          }
        </button>
      )}
    </div>
  )
}
