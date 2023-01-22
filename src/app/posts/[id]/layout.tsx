export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main style={{ background: "green" }}>{children}</main>
}
