import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 mt-auto">
      <div className="max-w-3xl mx-auto px-5 py-6 flex items-center justify-between text-xs text-muted-foreground">
        <p>
          {"checkout other cool stuff by "}
          <Button variant="link" className="p-0 m-0 text-foreground">
            <a href="abdullahshoaib.dev">@abdullah</a>
          </Button>
        </p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
