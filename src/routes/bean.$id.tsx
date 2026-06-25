import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { RecipeCard } from "@/components/RecipeCard";
import { useBean, useRecipesByBean } from "@/lib/store";
import { mockBeans } from "@/lib/mock-data";
import { ArrowLeft, MapPin, Sprout, Flame, Mountain } from "lucide-react";

export const Route = createFileRoute("/bean/$id")({
  head: ({ params }) => {
    const b = mockBeans.find((x) => x.id === params.id);
    const title = b ? `${b.name} — brewing.` : "원두 — brewing.";
    return {
      meta: [
        { title },
        { name: "description", content: b?.description ?? "원두 상세" },
        ...(b ? [{ property: "og:image", content: b.image }] : []),
      ],
    };
  },
  loader: ({ params }) => ({ id: params.id }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-sm text-muted-foreground">원두를 찾을 수 없어요.</p>
        <Link to="/search" className="mt-3 inline-block text-sm font-semibold text-[var(--bean)] underline">
          검색으로
        </Link>
      </div>
    </div>
  ),
  component: BeanDetail,
});

function Row({ icon: Icon, k, v }: { icon: React.ComponentType<{ className?: string }>; k: string; v?: string }) {
  if (!v) return null;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--cream)]">
        <Icon className="h-3.5 w-3.5 text-[var(--bean)]" />
      </span>
      <div className="flex-1 text-xs text-muted-foreground">{k}</div>
      <div className="text-sm font-semibold text-foreground">{v}</div>
    </div>
  );
}

function BeanDetail() {
  const { id } = Route.useLoaderData();
  const bean = useBean(id);
  const recipes = useRecipesByBean(id);
  if (!bean) throw notFound();

  return (
    <MobileShell>
      <div className="relative">
        <img src={bean.image} alt={bean.name} className="aspect-square w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Link
            to="/search"
            className="grid h-9 w-9 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur"
            aria-label="뒤로"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          {bean.community && (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-[var(--bean)] backdrop-blur">
              커뮤니티 원두
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="text-xs text-muted-foreground">{bean.roastery}</div>
        <h1 className="mt-1 text-2xl font-bold leading-snug text-foreground">{bean.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{bean.description}</p>
      </div>

      <section className="px-5 pt-5">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
          <Row icon={MapPin} k="원산지" v={bean.region ? `${bean.origin} · ${bean.region}` : bean.origin} />
          <Row icon={Sprout} k="가공" v={bean.process} />
          <Row icon={Sprout} k="품종" v={bean.variety} />
          <Row icon={Flame} k="로스팅" v={bean.roastLevel} />
          <Row icon={Mountain} k="고도" v={bean.altitude} />
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">테이스팅 노트</h2>
        <div className="flex flex-wrap gap-1.5">
          {bean.tastingNotes.map((n) => (
            <span
              key={n}
              className="rounded-full bg-[var(--cream)] px-3 py-1.5 text-xs font-medium text-[var(--bean)]"
            >
              {n}
            </span>
          ))}
        </div>
      </section>

      <section className="px-5 pt-7">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          이 원두로 만든 레시피 · {recipes.length}
        </h2>
      </section>
      <div className="space-y-5 px-4 pb-8">
        {recipes.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            아직 이 원두로 등록된 레시피가 없어요.
          </div>
        ) : (
          recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
        )}
      </div>
    </MobileShell>
  );
}
