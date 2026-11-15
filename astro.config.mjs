import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "Code Mortis",
      description: "Website and documentation for Code Mortis.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/code-mortis/mortis-engine",
        },
      ],
      sidebar: [{ label: "Documentation", link: "/docs/" }],
      customCss: ["./src/styles/docs.css"],
      components: {
        ThemeProvider: "./src/components/DarkTheme.astro",
        ThemeSelect: "./src/components/Empty.astro",
        Search: "./src/components/Empty.astro",
      },
    }),
  ],
});
