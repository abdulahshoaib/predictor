import { NavBar } from '@/components/predictions/nav-bar'
import { MatchList } from '@/components/predictions/match-list'

export default function PredictionsPreview() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar userEmail="preview@demo.com" />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-bold mb-6">Match Predictions</h1>
        <MatchList />
      </main>
    </div>
  )
}
