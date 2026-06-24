import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TasteProfileView } from "@/components/TasteProfile";
import type { TasteProfile } from "@/lib/mock-data";
import { ArrowLeft, Camera, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "레시피 작성 — brewing." },
      { name: "description", content: "원두, 도구, 추출 데이터로 1분 만에 재현 가능한 커피 레시피를 작성하세요." },
    ],
  }),
  component: CreatePage,
});

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--bean)] focus:outline-none";

function TasteSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className="h-7 w-7 rounded-full transition-colors"
            style={{ background: i <= value ? "var(--roast)" : "var(--muted)" }}
            aria-label={`${label} ${i}`}
          />
        ))}
      </div>
    </div>
  );
}

function CreatePage() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [bean, setBean] = useState("");
  const [roastery, setRoastery] = useState("");
  const [method, setMethod] = useState("V60 푸어오버");
  const [temp, setTemp] = useState<"hot" | "iced">("hot");
  const [dose, setDose] = useState("15");
  const [water, setWater] = useState("240");
  const [waterTemp, setWaterTemp] = useState("92");
  const [grinder, setGrinder] = useState("");
  const [grindSize, setGrindSize] = useState("");
  const [brewTime, setBrewTime] = useState("2:45");
  const [steps, setSteps] = useState("");
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState("");
  const [shareBean, setShareBean] = useState(true);

  const [taste, setTaste] = useState<TasteProfile>({
    acidity: 3, sweetness: 3, body: 3, bitterness: 2, cleanliness: 3,
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  const aiSuggest = () => {
    if (!bean) {
      toast.error("원두 이름을 먼저 입력해주세요");
      return;
    }
    // Mock AI: vary slightly by bean name length
    const seed = bean.length;
    setTaste({
      acidity: ((seed * 3) % 5) + 1,
      sweetness: ((seed * 7) % 5) + 1,
      body: ((seed * 5) % 5) + 1,
      bitterness: ((seed * 2) % 5) + 1,
      cleanliness: ((seed * 11) % 5) + 1,
    });
    toast.success("AI가 맛 프로파일을 제안했어요. 자유롭게 수정해보세요.");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("레시피가 저장되었습니다 ☕");
    setTimeout(() => navigate({ to: "/" }), 600);
  };

  return (
    <MobileShell
      header={
        <header className="sticky top-0 z-40 flex items-center justify-between bg-background/85 px-4 py-3 backdrop-blur">
          <button onClick={() => navigate({ to: "/" })} className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="뒤로">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-bold">레시피 작성</h1>
          <button form="recipe-form" type="submit" className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            공유
          </button>
        </header>
      }
    >
      <form id="recipe-form" onSubmit={submit} className="space-y-5 px-4 pb-6">
        {/* Photo */}
        <label className="flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[var(--cream)]/70">
          {photo ? (
            <img src={photo} alt="추출 사진" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera className="h-7 w-7" />
              <span className="text-xs">사진을 추가해주세요</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>

        {/* Basics */}
        <div className="space-y-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <Field label="레시피 제목">
            <input className={inputCls} placeholder="예: 에티오피아 라이트 V60 1인분" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="원두 이름">
              <input className={inputCls} placeholder="예: 예가체프 콩가" value={bean} onChange={(e) => setBean(e.target.value)} />
            </Field>
            <Field label="로스터리">
              <input className={inputCls} placeholder="예: 프릳츠 커피" value={roastery} onChange={(e) => setRoastery(e.target.value)} />
            </Field>
          </div>
          <Field label="원두 등록 옵션" hint="커뮤니티 원두 DB에 공유하면 다른 사람도 자동완성으로 찾을 수 있어요">
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: false, label: "이 레시피에만 사용" },
                { v: true, label: "커뮤니티에 공유" },
              ].map((o) => (
                <button
                  key={String(o.v)}
                  type="button"
                  onClick={() => setShareBean(o.v)}
                  className={
                    "rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors " +
                    (shareBean === o.v
                      ? "border-[var(--bean)] bg-[var(--cream)] text-[var(--bean)]"
                      : "border-border bg-card text-muted-foreground")
                  }
                >
                  {shareBean === o.v && <Check className="mr-1 inline h-3 w-3" />}
                  {o.label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Brew specs */}
        <div className="space-y-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="text-xs font-bold text-foreground">추출 정보</div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="추출 방식">
              <input className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)} />
            </Field>
            <Field label="HOT / ICED">
              <div className="grid grid-cols-2 gap-2">
                {(["hot", "iced"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemp(t)}
                    className={
                      "rounded-xl px-3 py-2.5 text-xs font-semibold uppercase " +
                      (temp === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="원두 (g)"><input className={inputCls} inputMode="decimal" value={dose} onChange={(e) => setDose(e.target.value)} /></Field>
            <Field label="물 (g)"><input className={inputCls} inputMode="decimal" value={water} onChange={(e) => setWater(e.target.value)} /></Field>
            <Field label="온도 (°C)"><input className={inputCls} inputMode="decimal" value={waterTemp} onChange={(e) => setWaterTemp(e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="그라인더"><input className={inputCls} placeholder="예: 코만단테 C40" value={grinder} onChange={(e) => setGrinder(e.target.value)} /></Field>
            <Field label="분쇄도"><input className={inputCls} placeholder="예: 22 클릭" value={grindSize} onChange={(e) => setGrindSize(e.target.value)} /></Field>
          </div>
          <Field label="추출 시간"><input className={inputCls} placeholder="예: 2:45" value={brewTime} onChange={(e) => setBrewTime(e.target.value)} /></Field>
        </div>

        {/* Steps */}
        <div className="space-y-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <Field label="레시피 단계" hint="한 줄에 한 단계씩">
            <textarea
              rows={4}
              className={inputCls + " resize-none"}
              placeholder={"0:00 30g 뜸들이기\n0:30 120g까지 푸어\n..."}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
          </Field>
          <Field label="테이스팅 노트" hint="쉼표로 구분">
            <input className={inputCls} placeholder="자스민, 복숭아, 베르가못" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <Field label="한줄 리뷰">
            <input className={inputCls} placeholder="이 레시피를 한 문장으로" value={review} onChange={(e) => setReview(e.target.value)} />
          </Field>
        </div>

        {/* Taste profile */}
        <div className="space-y-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-foreground">맛 프로파일</div>
            <button
              type="button"
              onClick={aiSuggest}
              className="flex items-center gap-1.5 rounded-full bg-[var(--cream)] px-3 py-1.5 text-[11px] font-semibold text-[var(--bean)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI 추천
            </button>
          </div>
          <div className="space-y-2.5">
            <TasteSlider label="산미" value={taste.acidity} onChange={(v) => setTaste({ ...taste, acidity: v })} />
            <TasteSlider label="단맛" value={taste.sweetness} onChange={(v) => setTaste({ ...taste, sweetness: v })} />
            <TasteSlider label="바디" value={taste.body} onChange={(v) => setTaste({ ...taste, body: v })} />
            <TasteSlider label="쓴맛" value={taste.bitterness} onChange={(v) => setTaste({ ...taste, bitterness: v })} />
            <TasteSlider label="깔끔함" value={taste.cleanliness} onChange={(v) => setTaste({ ...taste, cleanliness: v })} />
          </div>
          <div className="mt-3 rounded-xl bg-[var(--cream)]/50 p-3">
            <div className="mb-2 text-[10px] font-semibold text-muted-foreground">미리보기</div>
            <TasteProfileView taste={taste} compact />
          </div>
        </div>
      </form>
    </MobileShell>
  );
}
