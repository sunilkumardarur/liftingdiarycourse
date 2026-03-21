"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type SetRow = {
  id: number;
  setNumber: number;
  setType: string;
  reps: number | null;
  weightKg: string | null;
  rpe: string | null;
};

export type WorkoutExerciseRow = {
  id: number;
  orderIndex: number;
  exercise: { id: number; name: string; muscleGroup: string };
  sets: SetRow[];
};

export type WorkoutRow = {
  id: number;
  date: string;
  startedAt: Date | null;
  endedAt: Date | null;
  duration: number | null;
  workoutExercises: WorkoutExerciseRow[];
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function getWorkoutsForDate(date: string): Promise<WorkoutRow[]> {
  // Throws a 401 redirect if the user is not authenticated — never silently fails
  const { userId } = await auth.protect();

  // Reject anything that isn't a strict YYYY-MM-DD date before it reaches the DB
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) {
    throw new Error("Invalid date");
  }

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutDate: workouts.date,
      startedAt: workouts.startedAt,
      endedAt: workouts.endedAt,
      duration: workouts.duration,
      weId: workoutExercises.id,
      orderIndex: workoutExercises.orderIndex,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      muscleGroup: exercises.muscleGroup,
      setId: sets.id,
      setNumber: sets.setNumber,
      setType: sets.setType,
      reps: sets.reps,
      weightKg: sets.weightKg,
      rpe: sets.rpe,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)));

  // Group flat rows into nested structure
  const workoutMap = new Map<number, WorkoutRow>();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        date: row.workoutDate,
        startedAt: row.startedAt,
        endedAt: row.endedAt,
        duration: row.duration,
        workoutExercises: [],
      });
    }
    const workout = workoutMap.get(row.workoutId)!;

    if (row.weId === null) continue;

    let we = workout.workoutExercises.find((x) => x.id === row.weId);
    if (!we) {
      we = {
        id: row.weId,
        orderIndex: row.orderIndex ?? 1,
        exercise: {
          id: row.exerciseId!,
          name: row.exerciseName!,
          muscleGroup: row.muscleGroup!,
        },
        sets: [],
      };
      workout.workoutExercises.push(we);
    }

    if (row.setId !== null) {
      we.sets.push({
        id: row.setId,
        setNumber: row.setNumber!,
        setType: row.setType!,
        reps: row.reps,
        weightKg: row.weightKg,
        rpe: row.rpe,
      });
    }
  }

  return Array.from(workoutMap.values());
}
