import { NavBar } from '@/components/predictions/nav-bar'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { MOCK_LEADERBOARD } from '@/lib/mock-data'

export default function LeaderboardPreview() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar userEmail="preview@demo.com" />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
        <LeaderboardTable entries={MOCK_LEADERBOARD} currentUserId="u3" />
      </main>
    </div>
  )
}
