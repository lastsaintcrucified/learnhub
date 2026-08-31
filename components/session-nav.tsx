"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function SessionNav() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null
  if (!session?.user) return <><Button asChild variant="outline" size="sm"><Link href="/login">Login</Link></Button><Button asChild size="sm"><Link href="/signup">Sign Up</Link></Button></>

  return <><Button asChild variant="ghost" size="sm"><Link href="/dashboard">Dashboard</Link></Button><Button variant="outline" size="sm" onClick={async () => { await authClient.signOut(); router.refresh() }}>Log out</Button></>
}
