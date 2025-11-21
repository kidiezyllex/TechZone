import React from 'react'

interface SectionProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Section({ title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section className={className}>
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
