import Footer from "@/components/footer";
import { NavBar } from "@/components/predictions/nav-bar";
import { PredictionsProvider } from "@/components/predictions/predictions-provider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground">
      <NavBar />
      <PredictionsProvider>{children}</PredictionsProvider>
    </div>
  );
}
