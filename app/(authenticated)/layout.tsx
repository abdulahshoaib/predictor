import { NavBar } from "@/components/nav-bar";
import { Providers } from "@/provider";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground">
      <Providers>
        {" "}
        <NavBar />
        {children}
      </Providers>
    </div>
  );
}
