import type { TasteProfile as TP } from "@/lib/mock-data";

const labels: { key: keyof TP; label: string }[] = [
  { key: "acidity", label: "산미" },
  { key: "sweetness", label: "단맛" },
  { key: "body", label: "바디" },
  { key: "bitterness", label: "쓴맛" },
  { key: "cleanliness", label: "깔끔함" },
];

export function TasteProfileView({ taste, compact = false }: { taste: TP; compact?: boolean }) {
  return (
    <div className={compact ? "grid grid-cols-5 gap-2" : "grid grid-cols-1 gap-2"}>
      {labels.map(({ key, label }) => {
        const v = taste[key];
        return (
          <div key={key} className={compact ? "text-center" : "flex items-center gap-3"}>
            <span className={compact ? "block text-[11px] text-muted-foreground mb-1" : "w-12 text-xs text-muted-foreground"}>
              {label}
            </span>
            <div className={compact ? "flex justify-center gap-[3px]" : "flex gap-1"}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="inline-block rounded-full"
                  style={{
                    width: compact ? 5 : 7,
                    height: compact ? 5 : 7,
                    background: i <= v ? "var(--roast)" : "var(--muted)",
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
