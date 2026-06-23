import { Suspense } from 'react'
import { AppRoutes } from './app/routes/AppRoutes'
import { useTokenRefresh } from './shared/hooks/useTokenRefresh'
import { ToastContainer } from './shared/components/Toast'
import { SocketProvider } from './shared/contexts/SocketContext'

function App() {
  useTokenRefresh()

  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-slate-50">
          <div className="size-6 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" aria-label="Cargando aplicacion" />
        </div>
      }
    >
      <SocketProvider>
        <AppRoutes />
        <ToastContainer />
      </SocketProvider>
    </Suspense>
  )
}

export default App
