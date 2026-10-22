import { createFileRoute } from "@tanstack/react-router";
import { Discover } from "@/components/discover";
import { seo, jsonLd, organizationSchema, websiteSchema } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      path: "/",
      title: "BingeKaro: Hindi, Telugu & English Web Series and Movies",
      description:
        "Stream original Hindi, Telugu and English web series, movies and thrillers on BingeKaro. Browse by genre, language or mood. Launching soon.",
    }),
    scripts: [jsonLd(organizationSchema), jsonLd(websiteSchema)],
  }),
  component: () => <Discover view="Home" />,
});
