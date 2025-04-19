import { useState } from "react";
import { motion } from "framer-motion";
import { mintDistrict } from "../lib/zora";

function MintModal({ account, onClose, addNotification }) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [useManual, setUseManual] = useState(false);
  const [manualAccount, setManualAccount] = useState("");
  const [payoutRecipient, setPayoutRecipient] = useState(account || "");
  const [platformReferrer, setPlatformReferrer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadToPinata = async (file, isJson = false) => {
    try {
      const formData = new FormData();
      if (isJson) {
        const blob = new Blob([JSON.stringify(file)], { type: "application/json" });
        formData.append("file", blob, "metadata.json");
      } else {
        formData.append("file", file);
      }
      formData.append("pinataMetadata", JSON.stringify({ name: isJson ? "metadata.json" : file.name }));
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Pinata API error: ${response.statusText}`);
      }
      const data = await response.json();
      return `ipfs://${data.IpfsHash}`;
    } catch (error) {
      console.error("Pinata upload failed:", error);
      throw new Error("Failed to upload to IPFS");
    }
  };

  const handleMint = async () => {
    if (!name || !symbol || !imageFile) {
      alert("Please fill all required fields and select an image");
      return;
    }
    setLoading(true);
    try {
      const finalAccount = useManual ? manualAccount : account;
      if (!finalAccount) {
        throw new Error("No account provided");
      }
      const imageUri = await uploadToPinata(imageFile);
      const metadata = {
        name,
        description: `District coin for ${name}`,
        image: imageUri,
      };
      const metadataUri = await uploadToPinata(metadata, true);
      const mintParams = {
        account: finalAccount,
        payoutRecipient: payoutRecipient || finalAccount,
        platformReferrer: platformReferrer || "0x0000000000000000000000000000000000000000",
        name,
        symbol,
        uri: metadataUri,
      };
      console.log("Mint params:", mintParams);
      await mintDistrict(mintParams);
      addNotification("District minted successfully!");
      onClose();
    } catch (error) {
      console.error("Mint error:", error);
      alert(`Minting failed: ${error.message || "Contract reverted (check console)"}`);
      addNotification("Minting failed", "error");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="modal"
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Mint New District</h2>
        <input
          type="text"
          placeholder="District Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Symbol (e.g., $TECH)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <div>
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: "0.5rem" }} />
        </div>
        <label style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
          <input
            type="checkbox"
            checked={useManual}
            onChange={() => setUseManual(!useManual)}
            style={{ marginRight: "0.5rem" }}
          />
          Use Manual Addresses
        </label>
        {useManual && (
          <>
            <input
              type="text"
              placeholder="Account Address (0x...)"
              value={manualAccount}
              onChange={(e) => setManualAccount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Payout Recipient (0x...)"
              value={payoutRecipient}
              onChange={(e) => setPayoutRecipient(e.target.value)}
            />
            <input
              type="text"
              placeholder="Platform Referrer (0x..., optional)"
              value={platformReferrer}
              onChange={(e) => setPlatformReferrer(e.target.value)}
            />
          </>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn-secondary" style={{ marginRight: "0.5rem" }}>
            Cancel
          </button>
          <button onClick={handleMint} disabled={loading} className="btn-primary">
            {loading ? "Minting..." : "Mint"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default MintModal;