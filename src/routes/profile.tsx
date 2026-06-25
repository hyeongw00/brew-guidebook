import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useProfile, useMyRecipes, useSavedRecipes, updateProfile } from "@/lib/store";
import { Settings, X } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "프로필 — brewing." }] }),
  component: ProfilePage,
});

type Tab = "recipes" | "saved";

function ProfilePage() {
  const profile = useProfile();
  const myRecipes = useMyRecipes();
  const saved = useSavedRecipes();
  const [tab, setTab] = useState<Tab>("recipes");
  const [editing, setEditing] = useState(false);

  const items = tab === "recipes" ? myRecipes : saved;

  return (
    <MobileShell>
      <div className="px-5 pt-8">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--cream)] text-2xl font-black text-[var(--bean)]">
            {profile.username[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black">{profile.username}</h1>
            <p className="text-xs text-muted-foreground">{profile.bio}</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary"
            aria-label="설정"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
          {[
            { l: "레시피", v: myRecipes.length },
            { l: "팔로워", v: profile.followers },
            { l: "팔로잉", v: profile.following },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-lg font-black text-foreground">{s.v}</div>
              <div className="text-[11px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <Row k="선호하는 맛" v={profile.favoriteTaste} />
          <Row k="메인 그라인더" v={profile.mainGrinder} />
          <Row k="메인 드리퍼" v={profile.mainDripper} />
        </div>

        <div className="mt-6 flex gap-2 border-b border-border">
          {([
            { k: "recipes" as Tab, label: `내 레시피 ${myRecipes.length}` },
            { k: "saved" as Tab, label: `저장 ${saved.length}` },
          ]).map((t) => (
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

        {items.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            {tab === "recipes" ? (
              <>
                아직 올린 레시피가 없어요.{" "}
                <Link to="/create" className="font-semibold text-[var(--bean)] underline">
                  첫 레시피 작성하기
                </Link>
              </>
            ) : (
              "저장한 레시피가 없어요"
            )}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-1.5 pb-6">
            {items.map((r) => (
              <Link key={r.id} to="/recipe/$id" params={{ id: r.id }}>
                <img
                  src={r.image}
                  alt={r.title}
                  loading="lazy"
                  className="aspect-square w-full rounded-lg object-cover"
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {editing && <EditProfileSheet onClose={() => setEditing(false)} />}
    </MobileShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{k}</span>
      <span className="text-xs font-semibold text-foreground">{v}</span>
    </div>
  );
}

function EditProfileSheet({ onClose }: { onClose: () => void }) {
  const profile = useProfile();
  const [form, setForm] = useState(profile);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-[480px] rounded-t-3xl bg-background p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">프로필 편집</h2>
          <button onClick={onClose} aria-label="닫기">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          {(
            [
              { k: "username", label: "닉네임" },
              { k: "bio", label: "소개" },
              { k: "favoriteTaste", label: "선호하는 맛" },
              { k: "mainGrinder", label: "메인 그라인더" },
              { k: "mainDripper", label: "메인 드리퍼" },
            ] as const
          ).map((f) => (
            <label key={f.k} className="block">
              <div className="mb-1 text-xs font-semibold">{f.label}</div>
              <input
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm focus:border-[var(--bean)] focus:outline-none"
                value={form[f.k] as string}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <button
          onClick={() => {
            updateProfile(form);
            onClose();
          }}
          className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          저장
        </button>
      </div>
    </div>
  );
}
