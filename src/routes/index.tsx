import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { RecipeCard } from "@/components/RecipeCard";
import { mockRecipes } from "@/lib/mock-data";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "브루잉 — 커피 레시피 커뮤니티" },
      { name: "description", content: "재현 가능한 커피 레시피를 발견하고, 원두와 도구를 기록하고, 나만의 추출 노트를 모아보세요." },
      { property: "og:title", content: "브루잉 — 커피 레시피 커뮤니티" },
      { property: "og:description", content: "재현 가능한 커피 레시피를 발견하고, 원두와 도구를 기록하고, 나만의 추출 노트를 모아보세요." },
    ],
  }),
  component: Index,
});

function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-background/85 px-5 py-4 backdrop-blur">
      <div>
        <h1 className="text-xl font-black tracking-tight text-[var(--bean)]">brewing.</h1>
        <p className="text-[11px] text-muted-foreground">오늘의 커피 레시피</p>
      </div>
      <button
        className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground"
        aria-label="알림"
      >
        <Bell className="h-4 w-4" />
      </button>
    </header>
  );
}

function CategoryStrip() {
  const cats = ["전체", "푸어오버", "에스프레소", "콜드브루", "라떼", "Hot", "Iced"];
  return (
    <div className="flex gap-2 overflow-x-auto px-5 pb-3 [&::-webkit-scrollbar]:hidden">
      {cats.map((c, i) => (
        <button
          key={c}
          className={
            "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors " +
            (i === 0
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground")
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function Index() {
  return (
    <MobileShell header={<><Header /><CategoryStrip /></>}>
      <main className="space-y-5 px-4 pb-8">
        {mockRecipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </main>
    </MobileShell>
  );
}
