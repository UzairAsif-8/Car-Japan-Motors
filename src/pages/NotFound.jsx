import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-white px-6">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/5 blur-3xl" />

      <div className="absolute left-1/2 top-8 -translate-x-1/2">
        <Logo />
      </div>

      <div className="relative text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(6rem,22vw,14rem)] font-extrabold leading-none tracking-tightest text-ink"
        >
          4<span className="text-brand">0</span>4
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl"
        >
          This road leads nowhere.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mx-auto mt-3 max-w-md text-ink-500"
        >
          The page you’re looking for has moved or never existed. Let’s get you back on track.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button to="/" variant="dark" icon={Home}>
            Back Home
          </Button>
          <Button to="/inventory" variant="outline" icon={Search}>
            Browse Inventory
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
