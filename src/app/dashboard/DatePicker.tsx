"use client";

import { useRouter, usePathname } from "next/navigation";

export default function DatePicker({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    router.push(`${pathname}?date=${e.target.value}`);
  }

  return (
    <input
      type="date"
      value={value}
      onChange={handleChange}
      className="border rounded px-3 py-1.5 text-sm"
    />
  );
}
