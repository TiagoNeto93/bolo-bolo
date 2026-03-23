export default function OvenAnimation() {
  return (
    <div className="oven-shake mx-auto w-fit">
      <svg
        viewBox="0 0 100 115"
        width="130"
        height="130"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="oven-glow-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffdd88" />
            <stop offset="100%" stopColor="#ff8c00" />
          </radialGradient>
        </defs>

        {/* Steam */}
        <path
          className="oven-steam-1"
          d="M 33 18 C 30 12 36 8 33 2"
          stroke="#D4A853"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="oven-steam-2"
          d="M 50 16 C 47 10 53 6 50 0"
          stroke="#D4A853"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="oven-steam-3"
          d="M 67 18 C 64 12 70 8 67 2"
          stroke="#D4A853"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Oven body */}
        <rect x="8" y="20" width="84" height="82" rx="8" fill="#2c1a0e" />

        {/* Top control panel */}
        <rect x="8" y="20" width="84" height="26" rx="8" fill="#3d2414" />
        <rect x="8" y="38" width="84" height="8" fill="#3d2414" />

        {/* Knobs */}
        <circle cx="24" cy="33" r="5" fill="#C4653A" />
        <circle cx="24" cy="33" r="2.5" fill="#D4A853" />
        <circle cx="50" cy="33" r="5" fill="#C4653A" />
        <circle cx="50" cy="33" r="2.5" fill="#D4A853" />
        <circle cx="76" cy="33" r="5" fill="#C4653A" />
        <circle cx="76" cy="33" r="2.5" fill="#D4A853" />

        {/* Door */}
        <rect x="14" y="48" width="72" height="48" rx="5" fill="#3d2414" />

        {/* Window dark backing */}
        <rect x="22" y="54" width="56" height="34" rx="6" fill="#1a0f08" />

        {/* Window glow */}
        <rect
          className="oven-glow"
          x="24"
          y="56"
          width="52"
          height="30"
          rx="5"
          fill="url(#oven-glow-gradient)"
        />

        {/* Door handle */}
        <rect x="37" y="90" width="26" height="5" rx="2.5" fill="#C9917A" />

        {/* Feet */}
        <rect x="16" y="100" width="12" height="10" rx="3" fill="#1a0f08" />
        <rect x="72" y="100" width="12" height="10" rx="3" fill="#1a0f08" />
      </svg>
    </div>
  );
}
