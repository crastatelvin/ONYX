import { motion } from "framer-motion";

export default function PrivacyBadge() {
  return (
    <motion.div
      animate={{ boxShadow: ["0 0 8px rgba(57,255,20,0.25)", "0 0 18px rgba(57,255,20,0.45)", "0 0 8px rgba(57,255,20,0.25)"] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="privacy-badge mono"
    >
      <span className="badge-dot" />
      ZERO DATA LEAVES YOUR DEVICE
    </motion.div>
  );
}
