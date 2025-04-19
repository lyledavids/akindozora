import { useState, useEffect } from "react";
import { fetchCoin, tradeDistrict } from "../lib/zora";

function Trade({ account, addNotification }) {
  const [coins, setCoins] = useState([]);
  const [amount, setAmount] = useState("");

  // Mock coin list for MVP (replace with real fetch after wavehacks)
  useEffect(() => {
    const loadCoins = async () => {
      const mockCoins = [
        {
          coinAddress: "0x123...abc",
          name: "Tech Hub",
          ticker: "$TECH",
          price: "0.01 ETH",
          volume: "10 ETH",
        },
        {
          coinAddress: "0x456...def",
          name: "City Park",
          ticker: "$PARK",
          price: "0.005 ETH",
          volume: "5 ETH",
        },
      ];
      setCoins(mockCoins);
    };
    loadCoins();
  }, []);

  const handleTrade = async (coinAddress, isBuy) => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      await tradeDistrict({ account, coinAddress, amount: parseFloat(amount), isBuy });
      addNotification(`Successfully ${isBuy ? "bought" : "sold"} ${amount} coins!`);
    } catch (error) {
      alert(error.message);
      addNotification("Trade failed", "error");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "1rem" }}>
        Trade Districts   (two are Mock coins for MVP (will remove after wavehacks))
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {coins.map((coin) => (
          <div
            key={coin.coinAddress}
            className="district-card"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h3>{coin.name}</h3>
              <p>{coin.ticker}</p>
              <p>Price: {coin.price}</p>
              <p>Volume: {coin.volume}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: "6rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem" }}
              />
              <button
                onClick={() => handleTrade(coin.coinAddress, true)}
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
                Buy
              </button>
              <button
                onClick={() => handleTrade(coin.coinAddress, false)}
                style={{
                  background: "var(--coral)",
                  color: "var(--white)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.target.style.background = "var(--violet)")}
                onMouseOut={(e) => (e.target.style.background = "var(--coral)")}
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trade;