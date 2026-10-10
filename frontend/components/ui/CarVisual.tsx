/**
 * Original abstract vehicle illustration (placeholder for real client photography).
 * Replace with real, licensed or client-owned photographs before launch. Not a real photo of any vehicle.
 */
export function CarVisual({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const body = tone === "dark" ? "#2B2E33" : "#16171A";
  const glass = tone === "dark" ? "#3A3E45" : "#2B2E33";
  return (
    <svg viewBox="0 0 900 340" className={className} role="img" aria-label="Stylised vehicle illustration (placeholder)">
      <defs>
        <linearGradient id="shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ground" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="450" cy="300" rx="380" ry="22" fill="url(#ground)" />
      <path d="M70 250 C70 215 90 200 140 192 L270 170 C310 120 360 96 440 96 L570 96 C640 100 690 140 730 178 L800 196 C835 204 850 222 850 250 L850 262 L70 262 Z" fill={body} />
      <path d="M300 172 C335 132 375 112 440 112 L560 112 C615 116 655 146 690 178 Z" fill={glass} />
      <path d="M470 112 L478 176" stroke={body} strokeWidth="6" />
      <path d="M120 232 L840 232" stroke="#E11D48" strokeWidth="3" opacity=".9" />
      <path d="M140 200 L800 200 L760 150 L200 190 Z" fill="url(#shine)" opacity=".5" />
      <rect x="796" y="206" width="38" height="12" rx="6" fill="#E11D48" />
      <rect x="76" y="212" width="26" height="10" rx="5" fill="#E11D48" opacity=".7" />
      {[220, 700].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="262" r="52" fill="#0E0F11" />
          <circle cx={cx} cy="262" r="32" fill="#4A4E55" />
          <circle cx={cx} cy="262" r="12" fill="#16171A" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line key={a} x1={cx} y1="262" x2={cx + 30 * Math.cos((a * Math.PI) / 180)} y2={262 + 30 * Math.sin((a * Math.PI) / 180)} stroke="#16171A" strokeWidth="5" />
          ))}
        </g>
      ))}
    </svg>
  );
}
