import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark min-h-screen bg-[#071B17] text-[#F8FAFC]">
      <DashboardSidebar />
      <main className="lg:pl-72">
        <div className="min-h-screen p-4 pt-20 lg:p-10 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
