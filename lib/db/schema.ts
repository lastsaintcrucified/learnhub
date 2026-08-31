import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  bio: text("bio"),
  title: text("title"),
  website: text("website"),
  twitter: text("twitter"),
  linkedin: text("linkedin"),
  github: text("github"),
  image: text("image"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey().notNull(),
  courseUpdates: boolean("course_updates").default(true).notNull(),
  newLessons: boolean("new_lessons").default(true).notNull(),
  comments: boolean("comments").default(true).notNull(),
  promotions: boolean("promotions").default(false).notNull(),
  courseReminders: boolean("course_reminders").default(true).notNull(),
  newFeatures: boolean("new_features").default(true).notNull(),
  achievementNotifications: boolean("achievement_notifications").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
