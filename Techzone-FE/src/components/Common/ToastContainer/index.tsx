import React from 'react'
import { ToastContainer as ReactToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export function ToastContainer() {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  )
}
