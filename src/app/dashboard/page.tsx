import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DatePicker from "./DatePicker";
import { getWorkoutsForDate } from "./actions";

function toLocalDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
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

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <DatePicker value={date} />
      </div>

      {workoutList.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No workouts logged for this date.
        </p>
      ) : (
        <div className="space-y-6">
          {workoutList.map((workout) => (
            <div key={workout.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Workout #{workout.id}</h2>
                <div className="text-sm text-muted-foreground space-x-3">
                  {workout.startedAt && (
                    <span>
                      {new Date(workout.startedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  {workout.duration !== null && (
                    <span>{formatDuration(workout.duration)}</span>
                  )}
                </div>
              </div>

              {workout.workoutExercises.length === 0 ? (
                <p className="text-sm text-muted-foreground">No exercises logged.</p>
              ) : (
                <div className="space-y-3">
                  {workout.workoutExercises
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((we) => (
                      <div key={we.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {we.exercise.name}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {we.exercise.muscleGroup.replace("_", " ")}
                          </span>
                        </div>

                        {we.sets.length > 0 && (
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-muted-foreground border-b">
                                <th className="text-left py-1 pr-3">Set</th>
                                <th className="text-left py-1 pr-3">Type</th>
                                <th className="text-left py-1 pr-3">Reps</th>
                                <th className="text-left py-1 pr-3">Weight</th>
                                <th className="text-left py-1">RPE</th>
                              </tr>
                            </thead>
                            <tbody>
                              {we.sets
                                .sort((a, b) => a.setNumber - b.setNumber)
                                .map((set) => (
                                  <tr key={set.id} className="border-b last:border-0">
                                    <td className="py-1 pr-3">{set.setNumber}</td>
                                    <td className="py-1 pr-3 capitalize">{set.setType}</td>
                                    <td className="py-1 pr-3">{set.reps ?? "—"}</td>
                                    <td className="py-1 pr-3">
                                      {set.weightKg ? `${set.weightKg} kg` : "—"}
                                    </td>
                                    <td className="py-1">{set.rpe ?? "—"}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
