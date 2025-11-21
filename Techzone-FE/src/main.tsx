import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './app/globals.css'
import "flag-icons/css/flag-icons.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import 'react-toastify/dist/ReactToastify.css';
import { ClerkProvider } from '@clerk/clerk-react'

// Import Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn('Clerk Publishable Key not found. OAuth features will be disabled.')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
