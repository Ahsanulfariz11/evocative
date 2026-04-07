import React, { Suspense, lazy } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import { HeroSkeleton } from './components/Skeletons'

// PERFORMANCE PROTOCOL: Lazy Loading Admin & App for < 100ms FCP
const App = lazy(() => import('./App.jsx'))
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <Suspense fallback={<HeroSkeleton />}>
            <Routes>
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/:section?" element={<App />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
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
