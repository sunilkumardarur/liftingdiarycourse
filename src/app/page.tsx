export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-950 dark:via-indigo-950/40 dark:to-violet-950/30">
      <div className="max-w-lg w-full text-center space-y-8">

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Track every rep. Own every lift.
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Your Personal<br />
            <span className="text-primary">Lifting Diary</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Log workouts, track progress, and see how far you&apos;ve come — all in one place.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Sign in or create an account using the buttons in the top right to get started.
        </p>

      </div>
    </main>
  );
}
