import { Link } from "@tanstack/react-router";
import { Home, Search, PlusSquare, Bookmark, User } from "lucide-react";

const items = [
  { to: "/", label: "홈", icon: Home },
  { to: "/search", label: "검색", icon: Search },
  { to: "/create", label: "작성", icon: PlusSquare, primary: true },
  { to: "/saved", label: "저장", icon: Bookmark },
  { to: "/profile", label: "프로필", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
      <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, icon: Icon, primary }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-[var(--bean)]" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-1 py-2.5"
            >
              {primary ? (
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                  <Icon className="h-5 w-5" />
                </span>
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
