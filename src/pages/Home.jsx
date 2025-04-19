import { useState, useEffect } from "react";
import MintModal from "../components/MintModal";
import DistrictCard from "../components/DistrictCard";
import { fetchProfile } from "../lib/zora";

function Home({ account, addNotification }) {
  const [isMintOpen, setIsMintOpen] = useState(false);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (account) {
      const loadDistricts = async () => {
        const profile = await fetchProfile(account);
        setDistricts(profile.coins || []);
      };
      loadDistricts();
    } else {
      setDistricts([]); // Clear districts if no account
    }
  }, [account]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 600 }}>Your City</h1>
        <button
          onClick={() => setIsMintOpen(true)}
          style={{
            background: "var(--teal)",
            color: "var(--white)",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            border: "none",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.background = "var(--violet)")}
          onMouseOut={(e) => (e.target.style.background = "var(--teal)")}
        >
          Mint District
        </button>
      </div>
      {districts.length === 0 ? (
        <p style={{ color: "var(--gray)" }}>No districts yet. Mint one to start building!</p>
      ) : (
        <div className="city-grid">
          {districts.map((district) => (
            <DistrictCard key={district.coinAddress} district={district} />
          ))}
        </div>
      )}
      {isMintOpen && (
        <MintModal
          account={account}
          onClose={() => setIsMintOpen(false)}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}

export default Home;