import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Catch-all for SPA sections to prevent routing warnings */}
            <Route path="/:section" element={<App />} />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

// PWA: Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.error('SW registration failed: ', err);
    });
  });
}
