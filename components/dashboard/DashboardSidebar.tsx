"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  MessageSquare,
  History,
  Settings,
  Bookmark,
  Globe,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "News", icon: MessageSquare },
  { href: "/dashboard/public", label: "Публичные", icon: Globe },
  { href: "/dashboard/favorites", label: "Избранное", icon: Bookmark },
  { href: "/dashboard/history", label: "История", icon: History },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
];

interface DashboardSidebarProps {
  user: { name?: string | null; image?: string | null };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-slate-100 border-r border-sky-100/80 shrink-0">
      <div className="p-6 border-b border-sky-200/50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-sky-200 ring-2 ring-white shadow-sm">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sky-600 text-xl font-medium">
                {(user.name ?? "?")[0]}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-slate-700 truncate max-w-full px-2 text-center">
            {user.name ?? "Пользователь"}
          </span>
        </div>
      </div>
      <nav className="flex-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-100 text-sky-800 shadow-sm"
                  : "text-slate-600 hover:bg-sky-50/80 hover:text-slate-800"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
