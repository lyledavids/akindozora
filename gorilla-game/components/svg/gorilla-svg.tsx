export function GorillaSvg() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bodyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#5D4A3C" />
          <stop offset="70%" stopColor="#3A2E26" />
          <stop offset="100%" stopColor="#2A201C" />
        </radialGradient>
        <radialGradient id="faceGradient" cx="50%" cy="30%" r="70%" fx="50%" fy="30%">
          <stop offset="0%" stopColor="#5D4A3C" />
          <stop offset="90%" stopColor="#2A201C" />
        </radialGradient>
      </defs>

      {/* Shadows */}
      <ellipse cx="50" cy="85" rx="25" ry="5" fill="rgba(0,0,0,0.2)" />

      {/* Legs */}
      <path d="M35,65 Q30,80 28,95" stroke="#3A2E26" strokeWidth="10" fill="#3A2E26" strokeLinecap="round" />
      <path d="M65,65 Q70,80 72,95" stroke="#3A2E26" strokeWidth="10" fill="#3A2E26" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="50" cy="50" rx="25" ry="20" fill="url(#bodyGradient)" />

      {/* Chest */}
      <path d="M40,45 Q50,55 60,45" fill="#5D4A3C" />

      {/* Arms */}
      <path
        d="M25,45 Q15,60 20,80 Q22,85 25,85"
        stroke="#3A2E26"
        strokeWidth="10"
        fill="#3A2E26"
        strokeLinecap="round"
      />
      <path
        d="M75,45 Q85,60 80,80 Q78,85 75,85"
        stroke="#3A2E26"
        strokeWidth="10"
        fill="#3A2E26"
        strokeLinecap="round"
      />

      {/* Hands */}
      <ellipse cx="25" cy="85" rx="6" ry="4" fill="#2A201C" transform="rotate(-10,25,85)" />
      <ellipse cx="75" cy="85" rx="6" ry="4" fill="#2A201C" transform="rotate(10,75,85)" />

      {/* Neck */}
      <path d="M45,30 Q50,35 55,30" fill="#3A2E26" />

      {/* Head */}
      <ellipse cx="50" cy="22" rx="15" ry="13" fill="url(#faceGradient)" />

      {/* Face details */}
      <ellipse cx="50" cy="25" rx="10" ry="7" fill="#2A201C" fillOpacity="0.5" />

      {/* Eyes */}
      <g>
        <ellipse cx="43" cy="18" rx="3" ry="2.5" fill="#2A201C" />
        <ellipse cx="57" cy="18" rx="3" ry="2.5" fill="#2A201C" />
        <circle cx="42" cy="17.5" r="1" fill="#000" />
        <circle cx="56" cy="17.5" r="1" fill="#000" />
        <circle cx="42.5" cy="17" r="0.5" fill="#FFF" />
        <circle cx="56.5" cy="17" r="0.5" fill="#FFF" />
      </g>

      {/* Brow */}
      <path d="M38,15 Q43,13 48,15" stroke="#2A201C" strokeWidth="1.5" fill="none" />
      <path d="M52,15 Q57,13 62,15" stroke="#2A201C" strokeWidth="1.5" fill="none" />

      {/* Nose */}
      <path d="M47,22 Q50,24 53,22" stroke="#000" strokeWidth="1.5" fill="#2A201C" />

      {/* Mouth */}
      <path d="M43,28 Q50,32 57,28" stroke="#000" strokeWidth="1" fill="#1A1410" />

      {/* Ears */}
      <ellipse cx="35" cy="15" rx="3" ry="4" fill="#2A201C" />
      <ellipse cx="65" cy="15" rx="3" ry="4" fill="#2A201C" />

      {/* Fur details */}
      <path d="M35,10 Q40,5 50,8 Q60,5 65,10" stroke="#3A2E26" strokeWidth="0.5" fill="none" />
      <path d="M30,45 Q35,42 40,45" stroke="#5D4A3C" strokeWidth="0.5" fill="none" />
      <path d="M60,45 Q65,42 70,45" stroke="#5D4A3C" strokeWidth="0.5" fill="none" />

      {/* Chest beating effect (optional) */}
      <g className="chest-beat" opacity="0.8">
        <path d="M45,45 Q50,48 55,45" stroke="#FFF" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M43,47 Q50,50 57,47" stroke="#FFF" strokeWidth="0.3" fill="none" opacity="0.2" />
      </g>
    </svg>
  )
}
