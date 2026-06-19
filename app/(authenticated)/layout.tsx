import Footer from "@/components/footer";
import { NavBar } from "@/components/predictions/nav-bar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground">
      <NavBar />
      {children}
    </div>
  );
}
