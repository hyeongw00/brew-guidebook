import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { RecipeCard } from "@/components/RecipeCard";
import { useSavedRecipes } from "@/lib/store";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "저장 — brewing." }] }),
  component: SavedPage,
});

function SavedPage() {
  const saved = useSavedRecipes();
  return (
    <MobileShell>
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-black">저장한 레시피</h1>
        <p className="mt-1 text-sm text-muted-foreground">다시 내려보고 싶은 레시피 모음 · {saved.length}개</p>
      </div>
      <main className="space-y-5 px-4 pt-5">
        {saved.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            <Bookmark className="h-6 w-6 text-[var(--bean)]" />
            <p>아직 저장한 레시피가 없어요.<br/>마음에 드는 레시피의 저장 버튼을 눌러보세요.</p>
          </div>
        ) : (
          saved.map((r) => <RecipeCard key={r.id} recipe={r} />)
        )}
      </main>
    </MobileShell>
  );
}
