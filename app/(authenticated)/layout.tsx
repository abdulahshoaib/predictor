import { NavBar } from "@/components/nav-bar";
import { Providers } from "@/provider";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {" "}
      <NavBar />
      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </Providers>
  );
}
