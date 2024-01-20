"use client";
import { Form } from "@prisma/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function VisitBtn({ shareUrl }: { shareUrl: Form['shareUrl'] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <Button className="w-[200px]" onClick={() => window.open(shareLink, "_blank")}>
      Visit
    </Button>
  )
}