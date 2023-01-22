import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
export default NextAuth(authOptions)
