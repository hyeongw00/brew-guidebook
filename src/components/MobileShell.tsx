import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function MobileShell({ children, header }: { children: ReactNode; header?: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-background pb-24">
        {header}
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
