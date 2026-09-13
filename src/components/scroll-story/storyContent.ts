/**
 * Derives the scroll-story's three stage panels (Build / Govern / Deploy)
 * straight from sourced homepage content — never separately authored copy —
 * so the 3D narrative stays tied to the real product story (SmartCycle
 * Studio, the Execution & Evidence Fabric, and the integration ecosystem)
 * rather than reading as decoration around a generic 3D object.
 */
import { home } from "@/content";

export interface StoryPanel {
  key: "build" | "govern" | "deploy";
  label: string;
  accent: "ember" | "iris" | "neutral";
  eyebrow: string;
  heading: string;
  body: string;
  chips: string[];
}

export function getStoryPanels(): StoryPanel[] {
  const { studio, eef } = home.platformSection;
  const integrations = home.integrationEcosystem;

  return [
    {
      key: "build",
      label: "Build",
      accent: "ember",
      eyebrow: studio.tagline.value,
      heading: studio.name.value,
      body: studio.features[0]?.description.value ?? "",
      chips: studio.features.slice(1, 4).map((f) => f.name.value),
    },
    {
      key: "govern",
      label: "Govern",
      accent: "iris",
      eyebrow: eef.tagline.value,
      heading: eef.name.value,
      body: eef.features[0]?.description.value ?? "",
      chips: eef.features.slice(1, 4).map((f) => f.name.value),
    },
    {
      key: "deploy",
      label: "Deploy",
      accent: "neutral",
      eyebrow: integrations.eyebrow.value,
      heading: integrations.headingLines.value.join(" "),
      body: integrations.intro.value,
      chips: integrations.items.slice(0, 4).map((item) => item.name.value),
    },
  ];
}
