import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar user={session.user} />
      <main className="flex-1 min-w-0 bg-white px-4 md:px-8">
        {children}
      </main>
    </div>
  );
}
