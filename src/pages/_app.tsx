import Layout from "@/components/layout"
import { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query"
import Auth from "@/components/auth/auth"

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient()
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </SessionProvider>
      </QueryClientProvider>
    </Layout>
  )
}
