export function MenSvg() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* Generate multiple small human figures */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = 10 + (i % 5) * 18
          const y = 10 + Math.floor(i / 5) * 30
          const color = `hsl(${210 + Math.random() * 40}, 70%, ${50 + Math.random() * 20}%)`
          return (
            <g key={i} transform={`translate(${x}, ${y}) scale(0.15)`}>
              {/* Head */}
              <circle cx="50" cy="30" r="20" fill={color} />

              {/* Body */}
              <line x1="50" y1="50" x2="50" y2="100" stroke={color} strokeWidth="10" />

              {/* Arms */}
              <line x1="50" y1="60" x2="20" y2="80" stroke={color} strokeWidth="8" />
              <line x1="50" y1="60" x2="80" y2="80" stroke={color} strokeWidth="8" />

              {/* Legs */}
              <line x1="50" y1="100" x2="30" y2="140" stroke={color} strokeWidth="8" />
              <line x1="50" y1="100" x2="70" y2="140" stroke={color} strokeWidth="8" />
            </g>
          )
        })}

        {/* Text label */}
        <text x="50" y="95" textAnchor="middle" fontSize="12" fontWeight="bold">
          100 Men
        </text>
      </g>
    </svg>
  )
}
