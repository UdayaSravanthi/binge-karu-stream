import { createFileRoute } from "@tanstack/react-router";
import { Discover } from "@/components/discover";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/movies")({
  head: () =>
    seo({
      path: "/movies",
      title: "Hindi, Telugu & English Movies to Stream | BingeKaro",
      description:
        "Thriller and action movies in Hindi, Telugu and English. Explore the BingeKaro movie collection and save your next watch to My List.",
    }),
  component: () => <Discover view="Movies" />,
});
