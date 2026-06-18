import { NavBar } from "@/components/predictions/nav-bar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      {children}
    </div>
  );
}
