import React from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type?: AlertType
  title: string
  message?: string
  onClose?: () => void
  dismissible?: boolean
}

const typeConfig: Record<AlertType, { icon: React.ReactNode; bgColor: string; borderColor: string; titleColor: string }> = {
  success: {
    icon: <CheckCircle size={20} />,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    titleColor: 'text-green-900',
  },
  error: {
    icon: <AlertCircle size={20} />,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    titleColor: 'text-red-900',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    titleColor: 'text-yellow-900',
  },
  info: {
    icon: <Info size={20} />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    titleColor: 'text-blue-900',
  },
}

export function Alert({ type = 'info', title, message, onClose, dismissible = true }: AlertProps) {
  const config = typeConfig[type]

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex gap-4`}>
      <div className={`flex-shrink-0 ${config.titleColor}`}>{config.icon}</div>
      <div className="flex-1">
        <h3 className={`font-medium ${config.titleColor}`}>{title}</h3>
        {message && <p className="text-sm text-gray-700 mt-1">{message}</p>}
      </div>
      {dismissible && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.titleColor} hover:opacity-75 transition-opacity`}
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}
