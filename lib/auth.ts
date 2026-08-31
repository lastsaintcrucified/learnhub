import { betterAuth } from "better-auth"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const originFrom = (value?: string) => {
  if (!value) return undefined
  return value.startsWith("http") ? value : `https://${value}`
}

const trustedOrigins = [
  "http://localhost:3000",
  ...[
    process.env.V0_RUNTIME_URL,
    process.env.V0_DEV_APP_URL,
    process.env.V0_BUILD_URL,
    process.env.V0_SANDBOX_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ].map(originFrom).filter((value): value is string => Boolean(value)),
]

export const auth = betterAuth({
  database: pool,
  emailAndPassword: { enabled: true },
  baseURL:
    originFrom(process.env.BETTER_AUTH_URL) ??
    originFrom(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    originFrom(process.env.VERCEL_URL) ??
    originFrom(process.env.V0_RUNTIME_URL),
  trustedOrigins,
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})
