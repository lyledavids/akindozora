interface AttackAnimationProps {
  attacker: "men" | "gorilla"
  attackType: "normal" | "special" | "defend"
}

export function AttackAnimation({ attacker, attackType }: AttackAnimationProps) {
  if (attacker === "men") {
    if (attackType === "normal") {
      return <MenNormalAttack />
    } else if (attackType === "special") {
      return <MenSpecialAttack />
    } else {
      return <MenDefend />
    }
  } else {
    if (attackType === "normal") {
      return <GorillaSwipeAttack />
    } else if (attackType === "special") {
      return <GorillaChargeAttack />
    } else {
      return <GorillaDefend />
    }
  }
}

function MenNormalAttack() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      <defs>
        <radialGradient id="attackGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(0, 100, 255, 0.8)" />
          <stop offset="100%" stopColor="rgba(0, 100, 255, 0)" />
        </radialGradient>
      </defs>

      {/* Attack effect */}
      <g className="attack-effect">
        <circle cx="70" cy="50" r="30" fill="url(#attackGlow)" opacity="0.7">
          <animate attributeName="r" values="5;30;20" dur="0.5s" repeatCount="1" />
          <animate attributeName="opacity" values="0.9;0.7;0.1" dur="0.5s" repeatCount="1" />
        </circle>

        {/* Attack lines */}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => (
          <line
            key={i}
            x1="70"
            y1="50"
            x2={70 + 40 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
            stroke="rgba(0, 100, 255, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <animate
              attributeName="x2"
              values={`70;${70 + 40 * Math.cos((angle * Math.PI) / 180)};${70 + 30 * Math.cos((angle * Math.PI) / 180)}`}
              dur="0.5s"
              repeatCount="1"
            />
            <animate
              attributeName="y2"
              values={`50;${50 + 40 * Math.sin((angle * Math.PI) / 180)};${50 + 30 * Math.sin((angle * Math.PI) / 180)}`}
              dur="0.5s"
              repeatCount="1"
            />
            <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="1" />
          </line>
        ))}
      </g>
    </svg>
  )
}

function MenSpecialAttack() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      <defs>
        <radialGradient id="specialAttackGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(0, 150, 255, 0.9)" />
          <stop offset="100%" stopColor="rgba(0, 100, 255, 0)" />
        </radialGradient>
      </defs>

      {/* Special attack wave effect */}
      <g className="special-attack-effect">
        <circle cx="70" cy="50" r="40" fill="url(#specialAttackGlow)" opacity="0.8">
          <animate attributeName="r" values="10;40;30" dur="0.7s" repeatCount="1" />
          <animate attributeName="opacity" values="0.9;0.8;0.1" dur="0.7s" repeatCount="1" />
        </circle>

        {/* Multiple attack waves */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="70"
            cy="50"
            r={20 + i * 10}
            fill="none"
            stroke="rgba(0, 150, 255, 0.6)"
            strokeWidth="2"
            opacity={0.8 - i * 0.2}
          >
            <animate
              attributeName="r"
              values={`${5 + i * 5};${40 + i * 10};${30 + i * 10}`}
              dur="0.7s"
              repeatCount="1"
              begin={`${i * 0.1}s`}
            />
            <animate attributeName="opacity" values="0.8;0.6;0" dur="0.7s" repeatCount="1" begin={`${i * 0.1}s`} />
          </circle>
        ))}

        {/* Attack particles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) % 360
          return (
            <circle key={i} cx="70" cy="50" r="2" fill="rgba(100, 200, 255, 0.9)">
              <animate
                attributeName="cx"
                values={`70;${70 + 50 * Math.cos((angle * Math.PI) / 180)}`}
                dur="0.7s"
                repeatCount="1"
              />
              <animate
                attributeName="cy"
                values={`50;${50 + 50 * Math.sin((angle * Math.PI) / 180)}`}
                dur="0.7s"
                repeatCount="1"
              />
              <animate attributeName="opacity" values="1;0" dur="0.7s" repeatCount="1" />
            </circle>
          )
        })}
      </g>
    </svg>
  )
}

function MenDefend() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      {/* Shield effect */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="8">
        <animate attributeName="r" values="30;40;35" dur="1s" repeatCount="1" />
        <animate attributeName="opacity" values="0;0.8;0.3" dur="1s" repeatCount="1" />
      </circle>

      <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(100, 200, 255, 0.2)" strokeWidth="4">
        <animate attributeName="r" values="25;35;30" dur="1s" repeatCount="1" />
        <animate attributeName="opacity" values="0;0.6;0.2" dur="1s" repeatCount="1" />
      </circle>

      {/* Shield symbol */}
      <path
        d="M50,20 L70,30 L70,50 C70,65 60,75 50,80 C40,75 30,65 30,50 L30,30 Z"
        fill="none"
        stroke="rgba(100, 200, 255, 0.8)"
        strokeWidth="2"
      >
        <animate attributeName="opacity" values="0;1;0.5" dur="1s" repeatCount="1" />
      </path>
    </svg>
  )
}

function GorillaSwipeAttack() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      <defs>
        <radialGradient id="swipeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(255, 100, 0, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 100, 0, 0)" />
        </radialGradient>
      </defs>

      {/* Swipe effect */}
      <g className="swipe-effect">
        <path
          d="M30,50 Q40,30 60,20 Q70,40 80,50"
          fill="none"
          stroke="rgba(255, 100, 0, 0.8)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.8"
        >
          <animate
            attributeName="d"
            values="M50,50 Q50,50 50,50 Q50,50 50,50;M30,50 Q40,30 60,20 Q70,40 80,50;M30,50 Q40,30 60,20 Q70,40 80,50"
            dur="0.5s"
            repeatCount="1"
          />
          <animate attributeName="opacity" values="0;0.8;0" dur="0.5s" repeatCount="1" />
        </path>

        {/* Claw marks */}
        {[1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1={30 + i * 15}
              y1={40 + i * 3}
              x2={40 + i * 15}
              y2={30 + i * 3}
              stroke="rgba(255, 100, 0, 0.9)"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="1" begin={`${i * 0.1}s`} />
            </line>
          </g>
        ))}
      </g>
    </svg>
  )
}

function GorillaChargeAttack() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      <defs>
        <radialGradient id="chargeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(255, 50, 0, 0.9)" />
          <stop offset="100%" stopColor="rgba(255, 50, 0, 0)" />
        </radialGradient>
      </defs>

      {/* Charge effect */}
      <g className="charge-effect">
        <circle cx="30" cy="50" r="40" fill="url(#chargeGlow)" opacity="0.8">
          <animate attributeName="r" values="10;40;30" dur="0.7s" repeatCount="1" />
          <animate attributeName="opacity" values="0.9;0.8;0.1" dur="0.7s" repeatCount="1" />
        </circle>

        {/* Impact waves */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="30"
            cy="50"
            r={20 + i * 10}
            fill="none"
            stroke="rgba(255, 50, 0, 0.7)"
            strokeWidth="3"
            opacity={0.8 - i * 0.2}
          >
            <animate
              attributeName="r"
              values={`${5 + i * 5};${40 + i * 10};${30 + i * 10}`}
              dur="0.7s"
              repeatCount="1"
              begin={`${i * 0.1}s`}
            />
            <animate attributeName="opacity" values="0.8;0.6;0" dur="0.7s" repeatCount="1" begin={`${i * 0.1}s`} />
          </circle>
        ))}

        {/* Dust particles */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36) % 360
          const radius = 2 + Math.random() * 3
          return (
            <circle key={i} cx="30" cy="50" r={radius} fill="rgba(255, 200, 150, 0.9)">
              <animate
                attributeName="cx"
                values={`30;${30 + 40 * Math.cos((angle * Math.PI) / 180)}`}
                dur="0.7s"
                repeatCount="1"
              />
              <animate
                attributeName="cy"
                values={`50;${50 + 40 * Math.sin((angle * Math.PI) / 180)}`}
                dur="0.7s"
                repeatCount="1"
              />
              <animate attributeName="opacity" values="1;0" dur="0.7s" repeatCount="1" />
            </circle>
          )
        })}

        {/* Charge lines */}
        <line x1="10" y1="30" x2="50" y2="30" stroke="rgba(255, 100, 0, 0.8)" strokeWidth="3" strokeDasharray="5,3">
          <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="1" />
        </line>
        <line x1="10" y1="70" x2="50" y2="70" stroke="rgba(255, 100, 0, 0.8)" strokeWidth="3" strokeDasharray="5,3">
          <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="1" />
        </line>
      </g>
    </svg>
  )
}

function GorillaDefend() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      {/* Defense aura */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 150, 0, 0.3)" strokeWidth="8">
        <animate attributeName="r" values="30;40;35" dur="1s" repeatCount="1" />
        <animate attributeName="opacity" values="0;0.8;0.3" dur="1s" repeatCount="1" />
      </circle>

      <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255, 150, 0, 0.2)" strokeWidth="4">
        <animate attributeName="r" values="25;35;30" dur="1s" repeatCount="1" />
        <animate attributeName="opacity" values="0;0.6;0.2" dur="1s" repeatCount="1" />
      </circle>

      {/* Crossed arms symbol */}
      <path d="M30,40 L70,60" fill="none" stroke="rgba(255, 150, 0, 0.8)" strokeWidth="8" strokeLinecap="round">
        <animate attributeName="opacity" values="0;1;0.5" dur="1s" repeatCount="1" />
      </path>
      <path d="M30,60 L70,40" fill="none" stroke="rgba(255, 150, 0, 0.8)" strokeWidth="8" strokeLinecap="round">
        <animate attributeName="opacity" values="0;1;0.5" dur="1s" repeatCount="1" />
      </path>
    </svg>
  )
}
