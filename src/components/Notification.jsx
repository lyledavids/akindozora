import { useEffect } from "react";
import { motion } from "framer-motion";

function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`notification ${type}`}
    >
      {message}
      <button onClick={onClose}>✕</button>
    </motion.div>
  );
}

export default Notification;