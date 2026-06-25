import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { mockNotifications } from "@/lib/mock-data";
import { ArrowLeft, Bookmark, UserPlus, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "알림 — brewing." }] }),
  component: NotificationsPage,
});

const iconFor = (t: (typeof mockNotifications)[number]["type"]) =>
  t === "save" ? Bookmark : t === "follow" ? UserPlus : MessageCircle;

function NotificationsPage() {
  return (
    <MobileShell
      header={
        <header className="sticky top-0 z-40 flex items-center gap-3 bg-background/85 px-4 py-3 backdrop-blur">
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="뒤로">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-sm font-bold">알림</h1>
        </header>
      }
    >
      <ul className="divide-y divide-border/60 px-4">
        {mockNotifications.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <li key={n.id} className="flex items-center gap-3 py-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--cream)] text-[var(--bean)]">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{n.actor}</span>
                  <span className="text-muted-foreground">{n.text}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{n.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </MobileShell>
  );
}
