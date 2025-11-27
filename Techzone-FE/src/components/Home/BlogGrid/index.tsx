import React from 'react'
import { Calendar, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  author: string
}

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
        >
          {}
          <div className="relative h-48 overflow-hidden bg-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {}
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Calendar size={14} />
              {post.date}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Bởi {post.author}</span>
              <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
