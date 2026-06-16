import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ErrorSearchParams = Promise<{ error?: string }>

function ErrorCardFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sorry, something went wrong.</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Loading error details.</p>
      </CardContent>
    </Card>
  )
}

async function ErrorCard({ searchParams }: { searchParams: ErrorSearchParams }) {
  const params = await searchParams

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sorry, something went wrong.</CardTitle>
      </CardHeader>
      <CardContent>
        {params?.error ? (
          <p className="text-sm text-muted-foreground">Code error: {params.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function Page({ searchParams }: { searchParams: ErrorSearchParams }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Suspense fallback={<ErrorCardFallback />}>
            <ErrorCard searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
