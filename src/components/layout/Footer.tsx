import { Link } from "react-router-dom";
import { nav } from "@/content";
import type { NavItem } from "@/content/types";

export function Footer() {
  const year = new Date().getFullYear();
  const platformColumn: NavItem[] = [...nav.FOOTER_NAV[0]!.items, nav.FOOTER_USE_CASES_LINK];

  return (
    <footer className="border-t border-ivory/10 bg-obsidian text-ivory">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-gutter py-section-xs">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          <FooterColumn heading={nav.FOOTER_NAV[0]!.heading} items={platformColumn} />
          {nav.FOOTER_NAV.slice(1).map((group) => (
            <FooterColumn key={group.heading} heading={group.heading} items={group.items} />
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-body text-xs text-ivory/50">&copy; {year} SmartCycleAI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {nav.FOOTER_SOCIAL_LINKS.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="font-body text-xs uppercase tracking-widest text-ivory/60 transition-colors hover:text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ heading, items }: { heading: string; items: NavItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-xs uppercase tracking-widest text-champagne">{heading}</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="font-body text-sm text-ivory/70 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
