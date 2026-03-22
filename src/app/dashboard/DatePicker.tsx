"use client";

import { useRouter } from "next/navigation";
import { parseISO, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function WorkoutCalendar({ value }: { value: string }) {
  const router = useRouter();
  const selected = parseISO(value);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
  }

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      captionLayout="dropdown"
      showOutsideDays={false}
    />
  );
}
