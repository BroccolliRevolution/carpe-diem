"use client"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query"
import "./globals.css"

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
            <main>{children}</main>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
