import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  date,
  timestamp,
  pgEnum,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const muscleGroupEnum = pgEnum("muscle_group", [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "core",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "full_body",
  "cardio",
  "other",
]);

export const equipmentEnum = pgEnum("equipment", [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "bodyweight",
  "kettlebell",
  "band",
  "other",
]);

export const setTypeEnum = pgEnum("set_type", [
  "warmup",
  "working",
  "dropset",
  "failure",
  "backoff",
]);

// ─── Exercise Catalog ─────────────────────────────────────────────────────────

export const exercises = pgTable(
  "exercises",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    muscleGroup: muscleGroupEnum("muscle_group").notNull(),
    equipment: equipmentEnum("equipment").notNull().default("other"),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [unique("exercises_name_unique").on(t.name)]
);

// ─── Workouts ─────────────────────────────────────────────────────────────────

export const workouts = pgTable(
  "workouts",
  {
    id: serial("id").primaryKey(),
    // Clerk user ID — intentionally a plain string, no FK to a local users table
    userId: text("user_id").notNull(),
    date: date("date").notNull(),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    // Duration in seconds — populated by app layer from startedAt/endedAt
    duration: integer("duration"),
  },
  (t) => [
    index("workouts_user_id_idx").on(t.userId),
    index("workouts_date_idx").on(t.date),
  ]
);

// ─── Workout ↔ Exercise Junction ──────────────────────────────────────────────

export const workoutExercises = pgTable(
  "workout_exercises",
  {
    id: serial("id").primaryKey(),
    workoutId: integer("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: integer("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),
    // Display order within the workout (1-based)
    orderIndex: integer("order_index").notNull().default(1),
  },
  (t) => [
    unique("workout_exercises_unique").on(t.workoutId, t.exerciseId),
    index("workout_exercises_workout_id_idx").on(t.workoutId),
  ]
);

// ─── Sets ─────────────────────────────────────────────────────────────────────

export const sets = pgTable(
  "sets",
  {
    id: serial("id").primaryKey(),
    workoutExerciseId: integer("workout_exercise_id")
      .notNull()
      .references(() => workoutExercises.id, { onDelete: "cascade" }),
    setNumber: integer("set_number").notNull(),
    setType: setTypeEnum("set_type").notNull().default("working"),
    reps: integer("reps"),
    // Stored in kg; convert to lbs in the application layer if needed
    weightKg: numeric("weight_kg", { precision: 6, scale: 2 }),
    // Rate of Perceived Exertion (1–10)
    rpe: numeric("rpe", { precision: 3, scale: 1 }),
  },
  (t) => [index("sets_workout_exercise_id_idx").on(t.workoutExerciseId)]
);

// ─── Relations (for Drizzle relational query API) ─────────────────────────────

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(sets),
  })
);

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));
