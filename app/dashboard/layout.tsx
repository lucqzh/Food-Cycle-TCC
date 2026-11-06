import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#071B17] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      <DashboardSidebar />
      <main className="lg:pl-72">
        <div className="min-h-screen p-4 pt-20 lg:p-10 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
