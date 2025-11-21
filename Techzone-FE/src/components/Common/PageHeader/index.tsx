import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, showBackButton = false, action }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Quay lại</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </div>
  )
}
