import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { mockRecipes } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "프로필 — brewing." }] }),
  component: () => (
    <MobileShell>
      <div className="px-5 pt-8">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--cream)] text-2xl font-black text-[var(--bean)]">
            B
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black">barista_jun</h1>
            <p className="text-xs text-muted-foreground">매일 한 잔, 매일 다른 한 잔</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
          {[
            { l: "레시피", v: mockRecipes.length },
            { l: "저장됨", v: 14 },
            { l: "팔로워", v: 312 },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-lg font-black text-foreground">{s.v}</div>
              <div className="text-[11px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <Row k="선호하는 맛" v="산미 · 깔끔함" />
          <Row k="메인 그라인더" v="Comandante C40" />
          <Row k="메인 드리퍼" v="Hario V60" />
        </div>

        <h2 className="mt-7 text-sm font-bold">내가 올린 레시피</h2>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {mockRecipes.map((r) => (
            <img
              key={r.id}
              src={r.image}
              alt={r.title}
              loading="lazy"
              className="aspect-square w-full rounded-lg object-cover"
            />
          ))}
        </div>
      </div>
    </MobileShell>
  ),
});

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{k}</span>
      <span className="text-xs font-semibold text-foreground">{v}</span>
    </div>
  );
}
