import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { RecipeCard } from "@/components/RecipeCard";
import { useRecipes } from "@/lib/store";
import { Link } from "@tanstack/react-router";
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

type CatKey = "all" | "pourover" | "espresso" | "coldbrew" | "latte" | "hot" | "iced";
const cats: { key: CatKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pourover", label: "푸어오버" },
  { key: "espresso", label: "에스프레소" },
  { key: "coldbrew", label: "콜드브루" },
  { key: "latte", label: "라떼" },
  { key: "hot", label: "Hot" },
  { key: "iced", label: "Iced" },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-background/85 px-5 py-4 backdrop-blur">
      <div>
        <h1 className="text-xl font-black tracking-tight text-[var(--bean)]">brewing.</h1>
        <p className="text-[11px] text-muted-foreground">오늘의 커피 레시피</p>
      </div>
      <Link
        to="/notifications"
        className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground"
        aria-label="알림"
      >
        <Bell className="h-4 w-4" />
      </Link>
    </header>
  );
}

function Index() {
  const recipes = useRecipes();
  const [cat, setCat] = useState<CatKey>("all");

  const filtered = recipes.filter((r) => {
    if (cat === "all") return true;
    if (cat === "hot") return r.temperature === "hot";
    if (cat === "iced") return r.temperature === "iced";
    if (cat === "latte") return /라떼|latte/i.test(r.method);
    return r.category === cat;
  });

  return (
    <MobileShell
      header={
        <>
          <Header />
          <div className="flex gap-2 overflow-x-auto px-5 pb-3 [&::-webkit-scrollbar]:hidden">
            {cats.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors " +
                  (cat === c.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground")
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </>
      }
    >
      <main className="space-y-5 px-4 pb-8">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            이 카테고리에는 아직 레시피가 없어요
          </div>
        ) : (
          filtered.map((r) => <RecipeCard key={r.id} recipe={r} />)
        )}
      </main>
    </MobileShell>
  );
}
