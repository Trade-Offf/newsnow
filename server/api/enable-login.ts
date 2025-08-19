import process from "node:process"

export default defineEventHandler(async (event) => {
  const providers = []

  if (process.env.G_CLIENT_ID && process.env.G_CLIENT_SECRET) {
    providers.push({
      name: "github",
      url: `https://github.com/login/oauth/authorize?client_id=${process.env.G_CLIENT_ID}`,
    })
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${getRequestURL(event).origin}/api/oauth/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
    })
    providers.push({
      name: "google",
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    })
  }

  return {
    enable: providers.length > 0,
    providers,
    // 保持向后兼容
    url: providers.find(p => p.name === "github")?.url || providers[0]?.url,
  }
})
