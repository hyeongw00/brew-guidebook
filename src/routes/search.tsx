import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { RecipeCard } from "@/components/RecipeCard";
import { useRecipes, useBeans, useUsers } from "@/lib/store";
import { Search as SearchIcon, X, Coffee } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "검색 — brewing." }] }),
  component: SearchPage,
});

type Tab = "recipes" | "beans";

const trending = ["예가체프", "V60", "콜드브루", "게이샤", "에스프레소", "콜롬비아"];

function SearchPage() {
  const recipes = useRecipes();
  const beans = useBeans();
  const users = useUsers();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("recipes");

  const ql = q.trim().toLowerCase();

  const recipeResults = useMemo(() => {
    if (!ql) return recipes;
    return recipes.filter((r) => {
      const author = users[r.authorId];
      return [
        r.title,
        r.beanName,
        r.roastery,
        r.method,
        r.grinder,
        r.grindSize,
        author?.username ?? r.author ?? "",
        author?.displayName ?? "",
        ...r.gear.flatMap((g) => [g.type, g.name]),
        ...r.tastingNotes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(ql);
    });
  }, [recipes, ql, users]);

  const beanResults = useMemo(() => {
    if (!ql) return beans;
    return beans.filter((b) =>
      [b.name, b.roastery, b.origin, b.region ?? "", b.process, ...b.tastingNotes]
        .join(" ")
        .toLowerCase()
        .includes(ql),
    );
  }, [beans, ql]);

  return (
    <MobileShell>
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-black">검색</h1>
        <p className="mt-1 text-sm text-muted-foreground">레시피, 원두, 도구, 로스터리 어디서든</p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="예: 예가체프, V60, 콜드브루"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="지우기">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {!q && (
          <div className="mt-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              인기 검색어
            </div>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="rounded-full bg-[var(--cream)] px-3 py-1.5 text-xs font-medium text-[var(--bean)]"
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2 border-b border-border">
          {([
            { k: "recipes", label: `레시피 ${recipeResults.length}` },
            { k: "beans", label: `원두 ${beanResults.length}` },
          ] as const).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={
                "relative -mb-px px-1 pb-2.5 text-sm font-semibold transition-colors " +
                (tab === t.k ? "text-foreground" : "text-muted-foreground")
              }
            >
              {t.label}
              {tab === t.k && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[var(--bean)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pt-4 pb-8">
        {tab === "recipes" && (
          <div className="space-y-4">
            {recipeResults.length === 0 ? (
              <EmptyState text={`'${q}'에 해당하는 레시피가 없어요`} />
            ) : (
              recipeResults.map((r) => <RecipeCard key={r.id} recipe={r} />)
            )}
          </div>
        )}

        {tab === "beans" && (
          <div className="grid grid-cols-2 gap-3">
            {beanResults.length === 0 ? (
              <div className="col-span-2">
                <EmptyState text={`'${q}'에 해당하는 원두가 없어요`} />
              </div>
            ) : (
              beanResults.map((b) => (
                <Link
                  key={b.id}
                  to="/bean/$id"
                  params={{ id: b.id }}
                  className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]"
                >
                  <img
                    src={b.image}
                    alt={b.name}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="space-y-1 p-3">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Coffee className="h-3 w-3" />
                      {b.roastery}
                    </div>
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground">
                      {b.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                        {b.origin}
                      </span>
                      <span className="rounded-full bg-[var(--cream)] px-2 py-0.5 text-[10px] text-[var(--bean)]">
                        {b.roastLevel}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </MobileShell>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
      {text}
    </div>
  );
}
