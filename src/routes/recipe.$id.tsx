import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { mockRecipes } from "@/lib/mock-data";
import { TasteProfileView } from "@/components/TasteProfile";
import { GearChips } from "@/components/GearChips";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  Coffee,
  Droplets,
  Thermometer,
  Timer,
  Scale as ScaleIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recipe/$id")({
  head: ({ params }) => {
    const r = mockRecipes.find((x) => x.id === params.id);
    const title = r ? `${r.title} — brewing.` : "레시피 — brewing.";
    const desc = r?.review ?? "커피 레시피 상세";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(r ? [{ property: "og:image", content: r.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const recipe = mockRecipes.find((r) => r.id === params.id);
    if (!recipe) throw notFound();
    return { recipe };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-sm text-muted-foreground">레시피를 찾을 수 없어요.</p>
        <Link to="/" className="mt-3 inline-block text-sm font-semibold text-[var(--bean)] underline">
          홈으로
        </Link>
      </div>
    </div>
  ),
  component: RecipeDetail,
});

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <Icon className="h-4 w-4 text-[var(--bean)]" />
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function RecipeDetail() {
  const { recipe } = Route.useLoaderData() as { recipe: (typeof mockRecipes)[number] };
  const [saved, setSaved] = useState(!!recipe.saved);
  const [liked, setLiked] = useState(false);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("링크를 복사했어요");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background">
      {/* Top bar over image */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="aspect-square w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Link
            to="/"
            className="grid h-9 w-9 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur"
            aria-label="뒤로"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            onClick={onShare}
            className="grid h-9 w-9 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur"
            aria-label="공유"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
          {recipe.temperature === "hot" ? "HOT" : "ICED"} · {recipe.method}
        </span>
      </div>

      {/* Author / title */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--cream)] text-xs font-bold text-[var(--bean)]">
            {recipe.author[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{recipe.author}</p>
            <p className="text-[11px] text-muted-foreground">{recipe.saves} saves</p>
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-bold leading-snug text-foreground">{recipe.title}</h1>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Coffee className="h-3.5 w-3.5" />
          <span className="truncate">
            {recipe.beanName} · <span className="text-foreground/70">{recipe.roastery}</span>
          </span>
        </div>
      </div>

      {/* Recipe specs */}
      <section className="px-5 pt-5">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          레시피
        </h2>
        <div className="grid grid-cols-5 rounded-2xl bg-[var(--cream)]/60">
          <Stat icon={Coffee} label="원두" value={`${recipe.dose}g`} />
          <Stat icon={Droplets} label="물" value={`${recipe.water}g`} />
          <Stat icon={Thermometer} label="온도" value={`${recipe.waterTemp}°`} />
          <Stat icon={Timer} label="시간" value={recipe.brewTime} />
          <Stat icon={ScaleIcon} label="분쇄도" value={recipe.grindSize} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          그라인더 · <span className="font-medium text-foreground">{recipe.grinder}</span>
        </p>
      </section>

      {/* Steps */}
      <section className="px-5 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          단계별 추출
        </h2>
        <ol className="space-y-2.5">
          {recipe.steps.map((s, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--bean)] text-[11px] font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Taste */}
      <section className="px-5 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          맛 프로파일
        </h2>
        <div className="rounded-2xl border border-border/60 p-4">
          <TasteProfileView taste={recipe.taste} />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {recipe.tastingNotes.map((n) => (
              <span
                key={n}
                className="rounded-full bg-[var(--cream)] px-2.5 py-1 text-[11px] font-medium text-[var(--bean)]"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Gear */}
      <section className="px-5 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          사용 도구
        </h2>
        <GearChips gear={recipe.gear} />
      </section>

      {/* Review */}
      <section className="px-5 pt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          노트
        </h2>
        <p className="rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed text-foreground">
          {recipe.review}
        </p>
      </section>

      <div className="h-28" />

      {/* Sticky bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground"
            aria-label="좋아요"
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground"
            aria-label="댓글"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setSaved((v) => !v);
              toast.success(saved ? "저장 해제" : "내 레시피에 저장했어요");
            }}
            className="ml-auto flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground"
          >
            <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
            <span className="text-sm font-semibold">{saved ? "저장됨" : "저장"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
