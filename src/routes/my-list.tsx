import { createFileRoute } from "@tanstack/react-router";
import { Discover } from "@/components/discover";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/my-list")({
  head: () =>
    seo({
      path: "/my-list",
      title: "My List | BingeKaro",
      description: "The stories you saved on BingeKaro.",
      noindex: true,
    }),
  component: () => <Discover view="My List" />,
});
