"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { profiles, userSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function getAccountData() {
  const userId = await getUserId()
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)
  return { profile: profile ?? null, settings: settings ?? null }
}

export async function saveProfile(data: Omit<typeof profiles.$inferInsert, "userId" | "updatedAt">) {
  const userId = await getUserId()
  await db.insert(profiles).values({ ...data, userId }).onConflictDoUpdate({ target: profiles.userId, set: { ...data, updatedAt: new Date() } })
}

export async function saveSettings(data: Omit<typeof userSettings.$inferInsert, "userId" | "updatedAt">) {
  const userId = await getUserId()
  await db.insert(userSettings).values({ ...data, userId }).onConflictDoUpdate({ target: userSettings.userId, set: { ...data, updatedAt: new Date() } })
}
