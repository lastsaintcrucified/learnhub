"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { saveSettings } from "@/app/actions/account"

const fields = [
  ["courseUpdates", "Course updates", "Updates to courses you are enrolled in."],
  ["newLessons", "New lessons", "When a lesson is added to an enrolled course."],
  ["comments", "Comments", "Replies and comments on your courses."],
  ["promotions", "Promotions", "Discounts and new course announcements."],
  ["courseReminders", "Course reminders", "Reminders to continue your learning."],
  ["newFeatures", "New features", "News about LearnHub improvements."],
  ["achievementNotifications", "Achievements", "When you earn a new achievement."],
] as const

type Settings = Record<(typeof fields)[number][0], boolean>

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({ courseUpdates: true, newLessons: true, comments: true, promotions: false, courseReminders: true, newFeatures: true, achievementNotifications: true })
  const [saved, setSaved] = useState(false)
  return <div className="flex flex-col gap-6"><div><h1 className="text-3xl font-bold tracking-tight">Settings</h1><p className="text-muted-foreground">Control your notifications and learning preferences.</p></div><Card><CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose which updates you receive from LearnHub.</CardDescription></CardHeader><CardContent className="space-y-5">{fields.map(([key, label, description]) => <div key={key} className="flex items-center justify-between gap-4"><div><Label htmlFor={key}>{label}</Label><p className="text-sm text-muted-foreground">{description}</p></div><Switch id={key} checked={settings[key]} onCheckedChange={(checked) => setSettings((current) => ({ ...current, [key]: checked }))} /></div>)}</CardContent><CardFooter className="flex items-center gap-3"><Button onClick={async () => { await saveSettings(settings); setSaved(true) }}>Save settings</Button>{saved && <span className="text-sm text-muted-foreground">Settings saved.</span>}</CardFooter></Card></div>
}
