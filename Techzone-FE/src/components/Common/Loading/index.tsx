import React from 'react'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

export function LoadingSkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  )
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeletonCard key={i} />
      ))}
    </div>
  )
}
