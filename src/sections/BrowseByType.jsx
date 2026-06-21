import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { RevealGroup, revealItem } from '../components/ui/Reveal';
import { motion } from 'framer-motion';
import Image from '../components/ui/Image';
import SectionHeading from '../components/ui/SectionHeading';

const CATEGORIES = [
  {
    type: 'SUV',
    label: 'SUVs & 4x4',
    desc: 'Land Cruiser, Prado, Fortuner',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
  },
  {
    type: 'Sedan',
    label: 'Sedans',
    desc: 'Corolla, Civic, City',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
  },
  {
    type: 'Crossover',
    label: 'Crossovers',
    desc: 'Sportage, Tucson, BR-V',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    type: 'Hatchback',
    label: 'Hatchbacks',
    desc: 'Swift, Cultus, Alto',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function BrowseByType() {
  return (
    <section className="mx-auto max-w-8xl container-px section-py">
      <SectionHeading
        eyebrow="Start your search"
        title="Browse by body type"
        description="However you drive, there’s a perfectly inspected match waiting. Pick a category to jump straight in."
      />

      <RevealGroup className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.type} variants={revealItem}>
            <Link
              to={`/inventory?bodyType=${encodeURIComponent(cat.type)}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-ink-900 shadow-soft sm:aspect-[4/4.4]"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                className="h-full w-full"
                imgClassName="opacity-90 transition-transform duration-[1400ms] ease-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{cat.label}</h3>
                    <p className="mt-0.5 text-sm text-white/70">{cat.desc}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 translate-y-2 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
