import { useState } from 'react';
import { motion } from 'framer-motion';

/** Minimal branded loader shown while a lazy route chunk is fetched. */
export default function RouteLoader() {
  const [error, setError] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {error ? (
            <motion.span
              className="grid h-12 w-20 place-items-center rounded-2xl bg-brand font-display font-bold text-white"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              CJ
            </motion.span>
          ) : (
            <motion.img
              src="/logo.png"
              alt="Car Japan Motors"
              onError={() => setError(true)}
              className="h-12 w-auto object-contain"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-mist-300">
          <motion.div
            className="h-full w-1/2 rounded-full bg-brand"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}
