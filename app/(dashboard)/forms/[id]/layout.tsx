import { PropsWithChildren } from "react";

export default function BuilderLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-grow mx-auto flex-col">
      {children}
    </div>
  )
}