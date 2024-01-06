"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BuilderError({ error }: { error: Error }) {
  console.log(error);
  return (
    <div className="flex items-center justify-center gap-4 w-full h-full flex-col">
      <h3 className="text-destructive text-4xl">Something went wrong!</h3>
      <Button asChild>
        <Link href="/">Go back to home</Link>
      </Button>
    </div>
  )
}