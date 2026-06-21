import { motion } from 'framer-motion';

/** Wraps each page for a subtle, premium fade/rise transition. */
export default function PageTransition({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
