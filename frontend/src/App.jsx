import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './config/reactQuery'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './providers/AuthProvider'
import { Provider as StoreProvider } from 'react-redux'
import { store } from './store/app'
import { ToastContainer } from 'react-toastify'
import router from './config/reactRouter'
import { ThemeProvider } from './providers/ThemeProvider'

function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="course-management-ui-theme"
    >
      <QueryClientProvider client={queryClient}>
        <StoreProvider store={store}>
          <AuthProvider>
            <RouterProvider router={router} />
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </StoreProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
