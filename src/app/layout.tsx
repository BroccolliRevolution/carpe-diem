"use client"
import "./globals.css"
import styles from "./page.module.css"
import { SessionProvider } from "next-auth/react"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query"
import Auth from "@/components/auth/auth"

// Create a client
const queryClient = new QueryClient()

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body style={{ background: "#ffd" }}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider session={session}>
            <Auth>
              <main>{children}</main>
            </Auth>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
