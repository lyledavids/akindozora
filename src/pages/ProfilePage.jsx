import { useState, useEffect } from "react";
import DistrictCard from "../components/DistrictCard";
import { fetchProfile } from "../lib/zora";

function ProfilePage({ account }) {
  const [districts, setDistricts] = useState([]);
  const [cityValue, setCityValue] = useState(0);

  useEffect(() => {
    if (account) {
      const loadProfile = async () => {
        const profile = await fetchProfile(account);
        const coins = profile.coins || [];
        setDistricts(coins);
        const totalValue = coins.reduce(
          (sum, coin) => sum + (coin.volume || 0),
          0
        );
        setCityValue(totalValue);
      };
      loadProfile();
    } else {
      setDistricts([]);
      setCityValue(0); // Clear data if no account
    }
  }, [account]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "1rem" }}>
        Profile
      </h1>
      {account ? (
        <>
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>Wallet:</strong> {account}
          </p>
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>City Value:</strong> {cityValue ? `${cityValue} ETH` : "N/A"}
          </p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Your Districts
          </h2>
          {districts.length === 0 ? (
            <p style={{ color: "var(--gray)" }}>No districts yet.</p>
          ) : (
            <div className="city-grid">
              {districts.map((district) => (
                <DistrictCard key={district.coinAddress} district={district} />
              ))}
            </div>
          )}
        </>
      ) : (
        <p style={{ color: "var(--gray)" }}>
          Please connect your wallet to view your profile.
        </p>
      )}
    </div>
  );
}

export default ProfilePage;