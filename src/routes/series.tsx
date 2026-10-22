import { createFileRoute } from "@tanstack/react-router";
import { Discover } from "@/components/discover";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/series")({
  head: () =>
    seo({
      path: "/series",
      title: "Hindi, Telugu & English Web Series to Binge | BingeKaro",
      description:
        "Comedy, drama and romance web series in Hindi, Telugu and English. Find a series to binge this weekend on BingeKaro.",
    }),
  component: () => <Discover view="Series" />,
});
