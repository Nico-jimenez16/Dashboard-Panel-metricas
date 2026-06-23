import { Sidebar } from '@/components/layout';

export default function DashboardGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="ml-60 flex flex-1 flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
