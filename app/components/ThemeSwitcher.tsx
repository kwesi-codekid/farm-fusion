// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Sun, Moon } from "~/assets/icons";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button
        size="sm"
        isIconOnly
        radius="full"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`${
          theme === "light"
            ? "bg-slate-950/10 text-slate-700"
            : "bg-slate-800/70 text-slate-300"
        }`}
      >
        {theme === "dark" ? <Sun size="5" /> : <Moon size="5" />}
      </Button>
    </div>
  );
}
