import { useState } from "react";
import type { Recipe } from "@/lib/mock-data";
import { TasteProfileView } from "./TasteProfile";
import { GearChips } from "./GearChips";
import { Bookmark, Thermometer, Droplets, Scale as ScaleIcon, Timer, Coffee } from "lucide-react";

function Spec({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <Icon className="h-4 w-4 text-[var(--bean)]" />
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [saved, setSaved] = useState(!!recipe.saved);
  const [saveCount, setSaveCount] = useState(recipe.saves);

  const toggle = () => {
    setSaved((s) => {
      setSaveCount((c) => c + (s ? -1 : 1));
      return !s;
    });
  };

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--cream)] text-xs font-bold text-[var(--bean)]">
            {recipe.author[0].toUpperCase()}
          </div>
          <span className="truncate text-sm font-medium">{recipe.author}</span>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
          {recipe.temperature === "hot" ? "HOT" : "ICED"} · {recipe.method}
        </span>
      </div>

      {/* Image */}
      <div className="px-4 pt-3">
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full rounded-2xl object-cover"
        />
      </div>

      {/* Title + bean */}
      <div className="px-4 pt-4">
        <h2 className="text-lg font-bold leading-snug text-foreground">{recipe.title}</h2>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Coffee className="h-3.5 w-3.5" />
          <span className="truncate">
            {recipe.beanName} · <span className="text-foreground/70">{recipe.roastery}</span>
          </span>
        </div>
      </div>

      {/* Spec strip — the reproducible recipe at a glance */}
      <div className="mx-4 mt-4 grid grid-cols-5 rounded-2xl bg-[var(--cream)]/60">
        <Spec icon={Coffee} label="원두" value={`${recipe.dose}g`} />
        <Spec icon={Droplets} label="물" value={`${recipe.water}g`} />
        <Spec icon={Thermometer} label="온도" value={`${recipe.waterTemp}°`} />
        <Spec icon={Timer} label="시간" value={recipe.brewTime} />
        <Spec icon={ScaleIcon} label="분쇄도" value={recipe.grindSize} />
      </div>

      {/* Grinder line */}
      <div className="px-4 pt-3 text-xs text-muted-foreground">
        그라인더 · <span className="text-foreground font-medium">{recipe.grinder}</span>
      </div>

      {/* Gear */}
      <div className="px-4 pt-3">
        <GearChips gear={recipe.gear} />
      </div>

      {/* Taste profile */}
      <div className="mx-4 mt-4 rounded-2xl border border-border/60 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">맛 프로파일</span>
          <span className="text-[11px] text-muted-foreground">
            {recipe.tastingNotes.join(" · ")}
          </span>
        </div>
        <TasteProfileView taste={recipe.taste} compact />
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between px-4 py-4">
        <p className="line-clamp-1 pr-3 text-xs text-muted-foreground">{recipe.review}</p>
        <button
          onClick={toggle}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-primary-foreground transition-colors active:bg-[var(--bean)]"
          aria-label="저장"
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          <span className="text-xs font-semibold">{saveCount}</span>
        </button>
      </div>
    </article>
  );
}
