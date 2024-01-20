"use client";
import { Form } from "@prisma/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { ImShare } from "react-icons/im";
import { toast } from "./ui/use-toast";

export default function FormLinkShare({ shareUrl }: { shareUrl: Form['shareUrl'] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <div className="flex flex-grow gap-4 items-center">
      <Input
        value={shareLink}
        readOnly
      />

      <Button className="w-[250px]" onClick={() => {
        navigator.clipboard.writeText(shareLink);
        toast({
          title: "Copied!",
          description: "Link copied to clipboard",
        })
      }}>
        <ImShare className="mr-2 w-4 h-4" />
        Share link
      </Button>
    </div>
  )
}