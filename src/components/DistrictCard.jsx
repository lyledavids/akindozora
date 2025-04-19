function DistrictCard({ district }) {
    // SVG icons for district types (simplified for MVP)
    const getIcon = (symbol) => {
      const color = symbol.includes("PARK")
        ? "var(--lime)"
        : symbol.includes("TECH")
        ? "var(--violet)"
        : "var(--coral)";
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill={color} />
          <path
            d={symbol.includes("PARK") ? "M20 10L30 30H10L20 10Z" : "M10 10H30V30H10V10Z"}
            fill="white"
          />
        </svg>
      );
    };
  
    return (
      <div className="district-card">
        {district.image ? (
          <img src={district.image} alt={district.name} />
        ) : (
          getIcon(district.symbol)
        )}
        <h3>{district.name}</h3>
        <p>{district.symbol}</p>
        <p>Volume: {district.volume ? `${district.volume} ETH` : "N/A"}</p>
      </div>
    );
  }
  
  export default DistrictCard;