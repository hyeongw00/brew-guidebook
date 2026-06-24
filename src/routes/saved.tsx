import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { RecipeCard } from "@/components/RecipeCard";
import { mockRecipes } from "@/lib/mock-data";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "저장 — brewing." }] }),
  component: () => {
    const saved = mockRecipes.filter((r) => r.saved);
    return (
      <MobileShell>
        <div className="px-5 pt-6">
          <h1 className="text-2xl font-black">저장한 레시피</h1>
          <p className="mt-1 text-sm text-muted-foreground">다시 내려보고 싶은 레시피 모음</p>
        </div>
        <main className="space-y-5 px-4 pt-5">
          {saved.length === 0 ? (
            <div className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
              아직 저장한 레시피가 없어요
            </div>
          ) : (
            saved.map((r) => <RecipeCard key={r.id} recipe={r} />)
          )}
        </main>
      </MobileShell>
    );
  },
});
