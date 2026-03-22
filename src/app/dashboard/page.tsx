import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import WorkoutCalendar from "./DatePicker";
import { WorkoutCard } from "./WorkoutCard";
import { getWorkoutsForDate } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function toLocalDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatWorkoutHeading(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d
    .toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const date = params.date ?? toLocalDateString(new Date());
  const workoutList = await getWorkoutsForDate(date);

  const totalExercises = workoutList.reduce((s, w) => s + w.workoutExercises.length, 0);
  const totalSets = workoutList.reduce(
    (s, w) => s + w.workoutExercises.reduce((ss, we) => ss + we.sets.length, 0),
    0
  );
  const totalDuration = workoutList.reduce((s, w) => s + (w.duration ?? 0), 0);

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/20 min-h-0">

      {/* Page header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg">🏋️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workout Dashboard</h1>
            <p className="text-sm text-muted-foreground">{formatDisplayDate(date)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Calendar panel */}
        <aside className="w-64 shrink-0 border-r bg-background/60 dark:bg-background/40 backdrop-blur-sm p-4 flex flex-col gap-3 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Select Date
          </p>
          <Card className="shadow-sm">
            <CardContent className="p-3 flex justify-center">
              <WorkoutCalendar value={date} />
            </CardContent>
          </Card>
        </aside>

        {/* Right: Workout content */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* Stats row */}
          {workoutList.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Exercises</p>
                  <p className="text-3xl font-bold text-primary">{totalExercises}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-violet-500/5 to-violet-500/10 border-violet-200 dark:border-violet-800 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Sets</p>
                  <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{totalSets}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-200 dark:border-emerald-800 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Duration</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {totalDuration > 0 ? formatDuration(totalDuration) : "—"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Workout cards or empty state */}
          {workoutList.length === 0 ? (
            <Card className="border-dashed border-2 shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="text-5xl">💪</span>
                <p className="font-semibold text-foreground">No workouts logged</p>
                <p className="text-sm text-muted-foreground text-center">
                  No workouts found for this date. Select a different date from the calendar.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Workouts for {formatWorkoutHeading(date)}
              </h2>
              {workoutList.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
