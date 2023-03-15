import Layout from "@/components/layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import type { AppType } from "next/app"
import { trpc } from "../utils/trpc"

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const queryClient = new QueryClient()

  return (
    // <QueryClientProvider client={queryClient}>
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  )
}
export default trpc.withTRPC(MyApp)
