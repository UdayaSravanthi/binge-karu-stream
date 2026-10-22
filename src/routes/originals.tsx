import { createFileRoute } from "@tanstack/react-router";
import { Discover } from "@/components/discover";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/originals")({
  head: () =>
    seo({
      path: "/originals",
      title: "BingeKaro Originals: Exclusive Hindi Web Series",
      description:
        "Stories made only for BingeKaro, like the Hindi drama series Ek Nayi Subah. Explore every BingeKaro Original.",
    }),
  component: () => <Discover view="Originals" />,
});
