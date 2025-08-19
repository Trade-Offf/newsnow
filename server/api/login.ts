import process from "node:process"

export default defineEventHandler(async (event) => {
  const provider = getQuery(event).provider as string || "github"

  if (provider === "google" && process.env.GOOGLE_CLIENT_ID) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${getRequestURL(event).origin}/api/oauth/google`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
    })
    sendRedirect(event, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
  } else if (provider === "github" && process.env.G_CLIENT_ID) {
    sendRedirect(event, `https://github.com/login/oauth/authorize?client_id=${process.env.G_CLIENT_ID}`)
  } else {
    throw createError({ statusCode: 400, statusMessage: "Invalid provider or missing configuration" })
  }
})
