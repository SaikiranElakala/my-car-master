type SocialLinksProps = { tone?: "light" | "dark" };

const socialLinks = [
  {
    name: "YouTube",
    href: "https://youtube.com/chiruautomobilevlogs",
    hover: "hover:bg-[#ff0033]",
    icon: <><path d="M21.58 7.19a2.99 2.99 0 0 0-2.1-2.12C17.62 4.56 12 4.56 12 4.56s-5.62 0-7.48.51a2.99 2.99 0 0 0-2.1 2.12A31.2 31.2 0 0 0 1.9 12a31.2 31.2 0 0 0 .52 4.81 2.99 2.99 0 0 0 2.1 2.12c1.86.51 7.48.51 7.48.51s5.62 0 7.48-.51a2.99 2.99 0 0 0 2.1-2.12A31.2 31.2 0 0 0 22.1 12a31.2 31.2 0 0 0-.52-4.81Z" /><path d="m10 15.5 5.2-3.5L10 8.5v7Z" /></>,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/chiruautomobilevlogs",
    hover: "hover:bg-gradient-to-br hover:from-[#feda75] hover:via-[#d62976] hover:to-[#4f5bd5]",
    icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6.5" r=".75" fill="currentColor" stroke="none" /></>,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/chiruautomobilevlogs",
    hover: "hover:bg-[#1877f2]",
    icon: <><circle cx="12" cy="12" r="10" /><path d="M13.4 20v-7.1h2.4l.4-2.8h-2.8V8.3c0-.8.3-1.4 1.4-1.4h1.5V4.4c-.7-.1-1.4-.2-2.2-.2-2.3 0-3.8 1.4-3.8 3.9v2h-2.5v2.8h2.5V20" fill="currentColor" stroke="none" /></>,
  },
];

export function SocialLinks({ tone = "light" }: SocialLinksProps) {
  const color = tone === "light" ? "border-white/25 bg-white/10 text-white" : "border-line bg-white text-ink";

  return (
    <nav aria-label="Social media" className="flex items-center gap-3">
      {socialLinks.map(({ name, href, hover, icon }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit My Car Master on ${name}`} title={name} className={`grid h-11 w-11 place-items-center rounded-full border shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:scale-105 hover:border-white/50 ${color} ${hover}`}>
          <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
        </a>
      ))}
    </nav>
  );
}
