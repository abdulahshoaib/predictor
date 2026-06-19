import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 mt-auto">
      <div className="max-w-3xl mx-auto px-5 py-6 flex items-center justify-between text-xs text-muted-foreground">
        <p>
          {"checkout other cool stuff by "}
          <Button variant="link" className="p-0 m-0 text-foreground">
            <a href="https://abdullahshoaib.dev">@abdullah</a>
          </Button>
        </p>
        <div className="flex items-center gap-2">
          <span className="hidden dark:inline text-[10px] text-muted-foreground/80">
            (just how i like it)
          </span>
          <span className="inline dark:hidden text-[10px] text-muted-foreground/80">
            (my eyes 😭)
          </span>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
