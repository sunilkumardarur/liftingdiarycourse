"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, TimerIcon, DumbbellIcon } from "lucide-react";
import type { WorkoutRow } from "./actions";

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const muscleGroupColors: Record<string, string> = {
  chest: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  back: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300",
  legs: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
  shoulders: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
  arms: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  biceps: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  triceps: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300",
  core: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  glutes: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300",
  cardio: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300",
};

function getMuscleGroupColor(group: string): string {
  return muscleGroupColors[group.toLowerCase()] ?? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
}

const setTypeColors: Record<string, string> = {
  working: "bg-primary/10 text-primary",
  warmup: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  drop: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  failure: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function getSetTypeColor(type: string): string {
  return setTypeColors[type.toLowerCase()] ?? "bg-muted text-muted-foreground";
}

export function WorkoutCard({ workout }: { workout: WorkoutRow }) {
  const [expanded, setExpanded] = useState(false);

  const totalSets = workout.workoutExercises.reduce((s, we) => s + we.sets.length, 0);

  return (
    <Card className="shadow-sm overflow-hidden border-0 ring-1 ring-border">
      {/* Card header */}
      <CardHeader className="bg-gradient-to-r from-primary/8 to-violet-500/8 border-b pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-base font-semibold">
              {workout.workoutExercises.length} exercise{workout.workoutExercises.length !== 1 ? "s" : ""}
              &nbsp;·&nbsp;
              {totalSets} set{totalSets !== 1 ? "s" : ""}
            </CardTitle>

            {/* Time row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {workout.startedAt && (
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" />
                  Start: <span className="text-foreground font-medium ml-0.5">{formatTime(workout.startedAt)}</span>
                </span>
              )}
              {workout.endedAt && (
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" />
                  End: <span className="text-foreground font-medium ml-0.5">{formatTime(workout.endedAt)}</span>
                </span>
              )}
              {workout.duration !== null && (
                <span className="flex items-center gap-1">
                  <TimerIcon className="h-3.5 w-3.5" />
                  Duration: <span className="text-foreground font-medium ml-0.5">{formatDuration(workout.duration)}</span>
                </span>
              )}
            </div>

            {/* Muscle group badges */}
            {workout.workoutExercises.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {Array.from(
                  new Set(workout.workoutExercises.map((we) => we.exercise.muscleGroup))
                ).map((group) => (
                  <Badge
                    key={group}
                    variant="outline"
                    className={`text-xs capitalize ${getMuscleGroupColor(group)}`}
                  >
                    {group.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 gap-1.5 text-xs"
          >
            {expanded ? (
              <>
                <ChevronUpIcon className="h-4 w-4" /> Hide Details
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4" /> Show Details
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {/* Collapsible details */}
      {expanded && (
        <CardContent className="p-0">
          {workout.workoutExercises.length === 0 ? (
            <p className="text-sm text-muted-foreground px-4 py-4">No exercises logged.</p>
          ) : (
            <div className="divide-y">
              {workout.workoutExercises
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((we, i) => (
                  <div key={we.id} className="px-4 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <DumbbellIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-semibold text-sm">{we.exercise.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${getMuscleGroupColor(we.exercise.muscleGroup)}`}
                      >
                        {we.exercise.muscleGroup.replace("_", " ")}
                      </Badge>
                      {we.sets.length > 0 && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {we.sets.length} set{we.sets.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {we.sets.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="h-8 text-xs w-12">Set</TableHead>
                            <TableHead className="h-8 text-xs">Type</TableHead>
                            <TableHead className="h-8 text-xs">Reps</TableHead>
                            <TableHead className="h-8 text-xs">Weight</TableHead>
                            <TableHead className="h-8 text-xs">RPE</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {we.sets
                            .sort((a, b) => a.setNumber - b.setNumber)
                            .map((set) => (
                              <TableRow key={set.id} className="text-sm">
                                <TableCell className="py-2 font-medium">{set.setNumber}</TableCell>
                                <TableCell className="py-2">
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs capitalize ${getSetTypeColor(set.setType)}`}
                                  >
                                    {set.setType}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-2">{set.reps ?? "—"}</TableCell>
                                <TableCell className="py-2">
                                  {set.weightKg ? (
                                    <span className="font-medium">
                                      {set.weightKg}{" "}
                                      <span className="text-muted-foreground font-normal text-xs">kg</span>
                                    </span>
                                  ) : "—"}
                                </TableCell>
                                <TableCell className="py-2">{set.rpe ?? "—"}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}

                    {i < workout.workoutExercises.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
