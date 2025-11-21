import { toast, ToastOptions } from 'react-toastify'

/**
 * Centralized Toast Service for all notifications
 * Usage: toastService.success('Thành công!'), toastService.error('Lỗi!')
 */

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

export const toastService = {
  /**
   * Success notification
   */
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options })
  },

  /**
   * Error notification
   */
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options })
  },

  /**
   * Warning notification
   */
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options })
  },

  /**
   * Info notification
   */
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options })
  },

  /**
   * Loading notification (returns ID for update)
   */
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options })
  },

  /**
   * Update existing toast
   */
  update: (toastId: string | number, options: ToastOptions) => {
    toast.update(toastId, options)
  },

  /**
   * Dismiss notification
   */
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },

  /**
   * API Response handler - automatically shows appropriate toast
   */
  handleResponse: (response: any, successMessage?: string) => {
    if (response?.success) {
      toastService.success(successMessage || response?.message || 'Thành công!')
      return true
    } else {
      toastService.error(response?.message || 'Có lỗi xảy ra!')
      return false
    }
  },

  /**
   * API Error handler - automatically shows error toast
   */
  handleError: (error: any, errorMessage?: string) => {
    const message = errorMessage || error?.response?.data?.message || error?.message || 'Có lỗi xảy ra!'
    toastService.error(message)
  },

  /**
   * Promise handler - shows loading, then success/error
   */
  async promise<T>(
    promise: Promise<T>,
    messages: {
      pending?: string
      success?: string
      error?: string
    }
  ): Promise<T> {
    return toast.promise(
      promise,
      {
        pending: {
          render: messages.pending || 'Đang xử lý...',
          icon: '🔄',
        },
        success: {
          render: messages.success || 'Thành công! ✓',
          icon: '✓',
        },
        error: {
          render: messages.error || 'Lỗi! ✕',
          icon: '✕',
        },
      },
      defaultOptions
    )
  },
}
