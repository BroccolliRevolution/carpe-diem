import Layout from "@/components/layout"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient()
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </QueryClientProvider>
    </Layout>
  )
}
