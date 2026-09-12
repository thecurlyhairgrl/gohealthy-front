import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

// Punto único para envolver la app con providers globales (TanStack Query,
// y a futuro cualquier otro: theming, i18n, etc.).
function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default Providers
