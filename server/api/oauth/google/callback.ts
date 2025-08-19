import process from "node:process"
import { SignJWT } from "jose"
import { UserTable } from "#/database/user"

export default defineEventHandler(async (event) => {
  try {
    console.log("🚀 Google OAuth callback started")

    const db = useDatabase()
    const userTable = db ? new UserTable(db) : undefined
    if (!userTable) throw new Error("db is not defined")
    if (process.env.INIT_TABLE !== "false") await userTable.init()

    const code = getQuery(event).code as string
    if (!code) throw createError({ statusCode: 400, statusMessage: "Missing authorization code" })

    console.log("✅ Database and code validation passed")

    // 获取Google access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${getRequestURL(event).origin}/api/oauth/google/callback`,
    })

    const tokenResponse: {
      access_token: string
      token_type: string
      expires_in: number
      scope: string
    } = await myFetch(
      `https://oauth2.googleapis.com/token`,
      {
        method: "POST",
        body: tokenParams.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    )

    // 获取Google用户信息
    const userInfo: {
      id: string
      email: string
      name: string
      picture: string
      verified_email: boolean
    } = await myFetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    })

    if (!userInfo.verified_email) {
      throw createError({ statusCode: 400, statusMessage: "Email not verified" })
    }

    const userID = `google_${userInfo.id}`
    await userTable.addUser(userID, userInfo.email, "google")

    const jwtToken = await new SignJWT({
      id: userID,
      type: "google",
    })
      .setExpirationTime("60d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!))

    const params = new URLSearchParams({
      login: "google",
      jwt: jwtToken,
      user: JSON.stringify({
        avatar: userInfo.picture,
        name: userInfo.name,
      }),
    })
    return sendRedirect(event, `/?${params.toString()}`)
  } catch (error) {
    console.error("❌ Google OAuth callback error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    throw createError({
      statusCode: 500,
      statusMessage: "OAuth callback failed",
      data: { error: errorMessage },
    })
  }
})
