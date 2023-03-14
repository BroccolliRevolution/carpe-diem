import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

export default withAuth(async function middleware(req) {}, {
  callbacks: {
    authorized: async ({ req }) => {
      const token = await getToken({
        req: req,
        secret: process.env.JWT_SECRET,
      })

      // TODO @Peto: use for future cypress testing - so there will no need to login for cypress runner
      // if (process.env.NODE_ENV === "development") return true

      const whiteListedEmails = process.env.WHITE_LIST?.split(",")
      return Boolean(whiteListedEmails?.includes(token?.email ?? ""))
    },
  },
})
