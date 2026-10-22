import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Crown, Menu, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { track, INSTAGRAM_URL } from "@/lib/analytics";
import brandIcon from "@/assets/brand_icon.png";

export const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Series", to: "/series" },
  { label: "Originals", to: "/originals" },
  { label: "My List", to: "/my-list" },
] as const;

// The logo image is decorative: the brand name is written right next to it.
export function Brand() {
  return (
    <span className="brand">
      <img src={brandIcon} alt="" width={30} height={34} />
      <span>
        Binge<em>Karo</em>
      </span>
    </span>
  );
}

function FollowLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      className={className}
      href={INSTAGRAM_URL}
      onClick={() => track("instagram_clicked")}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export function LaunchBanner() {
  return (
    <div className="launch-banner" role="note">
      <span>BingeKaro launches soon. Be first to watch.</span>
      <FollowLink className="launch-link">Follow @bingekaro for launch news</FollowLink>
    </div>
  );
}

export function SiteHeader({ onSearch }: { onSearch?: () => void }) {
  const [mobile, setMobile] = useState(false);
  const [premium, setPremium] = useState(false);
  return (
    <>
      <LaunchBanner />
      <header className="site-header">
        <Link to="/" aria-label="BingeKaro home">
          <Brand />
        </Link>
        <nav aria-label="Main navigation" className={`main-nav ${mobile ? "mobile-open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <Button key={item.to} asChild variant="nav">
              <Link
                to={item.to}
                activeOptions={{ exact: true }}
                activeProps={{ "data-active": true } as Record<string, unknown>}
                onClick={() => setMobile(false)}
              >
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="header-actions">
          {onSearch ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search titles"
              title="Search titles"
              onClick={onSearch}
            >
              <Search size={20} />
            </Button>
          ) : (
            <Button asChild variant="ghost" size="icon">
              <Link to="/" aria-label="Search titles" title="Search titles">
                <Search size={20} />
              </Link>
            </Button>
          )}
          <Button
            variant="glass"
            className="premium-button"
            onClick={() => {
              setPremium(true);
              track("premium_interest");
            }}
          >
            <Crown className="text-foreground" />
            Go Premium
          </Button>
          <span className="profile" title="Guest viewer">
            BK
          </span>
          <Button
            className="mobile-menu"
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setMobile(!mobile)}
          >
            <Menu />
          </Button>
        </div>
      </header>
      <Dialog open={premium} onOpenChange={setPremium}>
        <DialogContent>
          <Crown className="text-highlight" size={28} />
          <DialogTitle>A little more BingeKaro.</DialogTitle>
          <DialogDescription>
            Premium plans are coming soon. Subscription details and pricing will be shared when
            BingeKaro launches.
          </DialogDescription>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="cinema">
              <FollowLink>Get launch updates</FollowLink>
            </Button>
            <Button variant="glass" onClick={() => setPremium(false)}>
              Keep exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <Brand />
      <nav aria-label="Footer" className="footer-nav">
        <Link to="/movies">Movies</Link>
        <Link to="/series">Series</Link>
        <Link to="/originals">Originals</Link>
        <Link to="/about">About BingeKaro</Link>
      </nav>
      <FollowLink className="social-link">
        <Instagram size={16} />
        <span>@bingekaro</span>
      </FollowLink>
      <span>© 2026 BingeKaro</span>
    </footer>
  );
}
