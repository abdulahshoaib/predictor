import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/components/predictions/nav-bar'
import { MatchList } from '@/components/predictions/match-list'

async function PredictionsContent() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar userEmail={data.claims.email as string} />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-bold mb-6">Match Predictions</h1>
        <MatchList />
      </main>
    </div>
  )
}

export default function PredictionsPage() {
  return (
    <Suspense fallback={null}>
      <PredictionsContent />
    </Suspense>
  )
}
