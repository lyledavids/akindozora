import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { connectWallet } from "../lib/viem";

function Navbar({ account, setAccount }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const addr = await connectWallet();
      setAccount(addr);
    } catch (error) {
      alert(error.message);
    }
    setIsConnecting(false);
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.write(account);
      alert("Address copied!");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Fire
      </Link>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          City
        </NavLink>
        <NavLink to="/trade" className={({ isActive }) => (isActive ? "active" : "")}>
          Trade
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
          Profile
        </NavLink>
      </div>
      <div className="navbar-wallet">
        {account ? (
          <button onClick={copyAddress}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </button>
        ) : (
          <button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            City
          </NavLink>
          <NavLink to="/trade" onClick={() => setIsMobileMenuOpen(false)}>
            Trade
          </NavLink>
          <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
            Profile
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;