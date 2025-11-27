import { toast, ToastOptions } from 'react-toastify'

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

export const toastService = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options })
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options })
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options })
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options })
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options })
  },

  update: (toastId: string | number, options: ToastOptions) => {
    toast.update(toastId, options)
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },

  handleResponse: (response: any, successMessage?: string) => {
    if (response?.success) {
      toastService.success(successMessage || response?.message || 'Thành công!')
      return true
    } else {
      toastService.error(response?.message || 'Có lỗi xảy ra!')
      return false
    }
  },

  handleError: (error: any, errorMessage?: string) => {
    const message = errorMessage || error?.response?.data?.message || error?.message || 'Có lỗi xảy ra!'
    toastService.error(message)
  },

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
