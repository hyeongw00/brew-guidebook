import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "검색 — brewing." }] }),
  component: () => (
    <MobileShell>
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-black">검색</h1>
        <p className="mt-1 text-sm text-muted-foreground">원두, 추출 방식, 그라인더로 찾아보세요</p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="예: 예가체프, V60, 콜드브루" />
        </div>
        <div className="mt-8 grid place-items-center rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
          곧 만나요 ☕
        </div>
      </div>
    </MobileShell>
  ),
});
