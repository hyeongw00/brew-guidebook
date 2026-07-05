import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { RecipeCard } from "@/components/RecipeCard";
import {
  useFollowingUsers,
  useMyRecipes,
  useProfile,
  useSavedRecipes,
  updateProfile,
} from "@/lib/store";
import { getRecipesByUser } from "@/lib/recipes-api";
import type { Recipe } from "@/lib/mock-data";
import { loginWithGoogle, logout, refreshSupabaseSession, useSupabaseAuth } from "@/lib/supabase";
import { Settings, UserPlus, Users, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "프로필 — brewing." }] }),
  component: ProfilePage,
});

type Tab = "recipes" | "saved";
type PeopleSheet = "followers" | "following";

const followerPreview = [
  "wave_pour",
  "morning_cup",
  "espresso_lab",
  "slow_bloom",
  "daily_cupping",
];

function ProfilePage() {
  const profile = useProfile();
  const auth = useSupabaseAuth();
  const myRecipes = useMyRecipes();
  const [dbMyRecipes, setDbMyRecipes] = useState<Recipe[]>([]);
  const saved = useSavedRecipes();
  const followingUsers = useFollowingUsers();
  const [tab, setTab] = useState<Tab>("recipes");
  const [editing, setEditing] = useState(false);
  const [peopleSheet, setPeopleSheet] = useState<PeopleSheet | null>(null);

  const visibleMyRecipes = dbMyRecipes.length > 0 ? dbMyRecipes : myRecipes;
  const items = tab === "recipes" ? visibleMyRecipes : saved;
  const authProfileName =
    auth.profile?.full_name ??
    auth.profile?.username ??
    auth.user?.user_metadata?.full_name ??
    auth.user?.user_metadata?.name ??
    auth.user?.email ??
    null;
  const displayedProfile = auth.user
    ? {
        ...profile,
        displayName: authProfileName ?? profile.displayName,
        username: auth.profile?.username ?? auth.user.email ?? profile.username,
        avatarUrl:
          auth.profile?.avatar_url ??
          auth.user.user_metadata?.avatar_url ??
          auth.user.user_metadata?.picture ??
          profile.avatarUrl,
        bio: auth.profile?.bio ?? auth.user.email ?? profile.bio,
      }
    : profile;
  const profileName = displayedProfile.displayName || displayedProfile.username;
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "?";
  const followingList = useMemo(() => [...followingUsers].sort(), [followingUsers]);

  useEffect(() => {
    void refreshSupabaseSession("profile");
    const retry = window.setTimeout(() => {
      void refreshSupabaseSession("profile-retry");
    }, 800);

    return () => window.clearTimeout(retry);
  }, []);

  useEffect(() => {
    if (!auth.user) {
      setDbMyRecipes([]);
      return;
    }

    let active = true;
    getRecipesByUser(auth.user.id)
      .then((nextRecipes) => {
        if (active) setDbMyRecipes(nextRecipes);
      })
      .catch((error) => {
        console.error("[Supabase recipes] Falling back to local profile recipes", error);
        if (active) setDbMyRecipes([]);
      });

    return () => {
      active = false;
    };
  }, [auth.user]);

  return (
    <MobileShell>
      <div className="px-5 pt-8">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--cream)] text-2xl font-black text-[var(--bean)]">
            {profileInitial}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black">{profileName}</h1>
            <p className="text-xs text-muted-foreground">{displayedProfile.bio}</p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary"
            aria-label="설정"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
          {([
            { l: "레시피", v: visibleMyRecipes.length, action: null },
            { l: "팔로워", v: profile.followers, action: "followers" as const },
            { l: "팔로잉", v: followingList.length, action: "following" as const },
          ].map((s) => (
            <button
              key={s.l}
              type="button"
              onClick={() => s.action && setPeopleSheet(s.action)}
              className="text-center"
            >
              <div className="text-lg font-black text-foreground">{s.v}</div>
              <div className="text-[11px] text-muted-foreground">{s.l}</div>
            </button>
          )))}
        </div>

        <AuthStatusCard auth={auth} />

        <div className="mt-5 space-y-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <Row k="선호하는 맛" v={displayedProfile.favoriteTasteProfile} />
          <Row k="메인 그라인더" v={displayedProfile.mainGrinder} />
          <Row k="메인 드리퍼" v={displayedProfile.mainDripper} />
        </div>

        <div className="mt-6 flex gap-2 border-b border-border">
          {([
            { k: "recipes" as Tab, label: `내 레시피 ${visibleMyRecipes.length}` },
            { k: "saved" as Tab, label: `저장 ${saved.length}` },
          ]).map((t) => (
            <button
              type="button"
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
        ) : tab === "saved" ? (
          <div className="mt-4 space-y-5 pb-6">
            {saved.map((r) => <RecipeCard key={r.id} recipe={r} />)}
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
      {peopleSheet && (
        <PeopleListSheet
          type={peopleSheet}
          followers={followerPreview}
          following={followingList}
          onClose={() => setPeopleSheet(null)}
        />
      )}
    </MobileShell>
  );
}

function AuthStatusCard({ auth }: { auth: ReturnType<typeof useSupabaseAuth> }) {
  const sessionUser = auth.user ?? auth.session?.user ?? null;
  const userLabel =
    auth.profile?.full_name ??
    auth.profile?.username ??
    sessionUser?.user_metadata?.full_name ??
    sessionUser?.user_metadata?.name ??
    sessionUser?.email ??
    "로그인됨";
  const isLoggedIn = Boolean(sessionUser);

  const handleLogin = async () => {
    const { error } = await loginWithGoogle();
    if (error) {
      toast.error("Supabase 설정을 확인해주세요");
    }
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast.error("로그아웃하지 못했어요");
      return;
    }
    toast.success("로그아웃했어요");
  };

  return (
    <div className="mt-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold text-foreground">Supabase Auth</div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {!auth.isConfigured
              ? "환경변수 미설정"
              : auth.isLoading
                ? "로그인 상태 확인 중"
                : isLoggedIn
                  ? userLabel
                  : "Google 로그인 준비됨"}
          </p>
        </div>
        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground"
          >
            로그아웃
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogin}
            disabled={!auth.isConfigured || auth.isLoading}
            className="shrink-0 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            Google 로그인
          </button>
        )}
      </div>
    </div>
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
    <div className="fixed inset-0 z-[60] flex items-end bg-black/40" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-[480px] rounded-t-3xl bg-background p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">프로필 편집</h2>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          {(
            [
              { k: "displayName", label: "닉네임" },
              { k: "bio", label: "소개" },
              { k: "favoriteTasteProfile", label: "선호하는 맛" },
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
          type="button"
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

function PeopleListSheet({
  type,
  followers,
  following,
  onClose,
}: {
  type: PeopleSheet;
  followers: string[];
  following: string[];
  onClose: () => void;
}) {
  const list = type === "followers" ? followers : following;
  const title = type === "followers" ? "팔로워" : "팔로잉";
  const empty = type === "followers" ? "아직 표시할 팔로워가 없어요" : "아직 팔로잉한 사용자가 없어요";

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-black/40" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-[480px] rounded-t-3xl bg-background p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X className="h-5 w-5" />
          </button>
        </div>
        {list.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            {empty}
          </div>
        ) : (
          <ul className="space-y-2">
            {list.map((user) => (
              <li key={user} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--cream)] text-sm font-bold text-[var(--bean)]">
                  {user.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{user}</p>
                  <p className="text-[11px] text-muted-foreground">커피 레시피 커뮤니티</p>
                </div>
                {type === "followers" ? (
                  <Users className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
