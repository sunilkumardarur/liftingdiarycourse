export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Lifting Diary</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Track your workouts. Sign in to get started.
        </p>
      </div>
    </div>
  );
}
