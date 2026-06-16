import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/components/predictions/nav-bar'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { MOCK_LEADERBOARD } from '@/lib/mock-data'

async function LeaderboardContent() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  // TODO: Replace MOCK_LEADERBOARD with Supabase query
  const entries = MOCK_LEADERBOARD

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar userEmail={data.claims.email as string} />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
        <LeaderboardTable
          entries={entries}
          currentUserId={data.claims.sub as string}
        />
      </main>
    </div>
  )
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={null}>
      <LeaderboardContent />
    </Suspense>
  )
}
