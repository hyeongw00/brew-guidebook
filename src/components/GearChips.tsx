import type { Gear } from "@/lib/mock-data";
import { Coffee, Settings2, Droplet, Scale } from "lucide-react";

const iconFor = (t: Gear["type"]) => {
  switch (t) {
    case "dripper": return Coffee;
    case "grinder": return Settings2;
    case "kettle": return Droplet;
    case "scale": return Scale;
  }
};

const labelFor = (t: Gear["type"]) => {
  switch (t) {
    case "dripper": return "드리퍼";
    case "grinder": return "그라인더";
    case "kettle": return "케틀";
    case "scale": return "스케일";
  }
};

export function GearChips({ gear }: { gear: Gear[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {gear.map((g, i) => {
        const Icon = iconFor(g.type);
        return (
          <div
            key={i}
            className="flex items-center gap-2 rounded-full bg-secondary pl-2 pr-3 py-1.5"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-card">
              <Icon className="h-3.5 w-3.5 text-[var(--bean)]" />
            </span>
            <div className="leading-tight">
              <div className="text-[10px] text-muted-foreground">{labelFor(g.type)}</div>
              <div className="text-xs font-medium text-foreground">{g.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
