/**
 * Centralised business constants. Single source of truth for brand identity,
 * contact details, navigation, and filter option sets. Keeping these here means
 * the entire site updates from one place.
 */

export const BRAND = {
  name: 'Car Japan',
  tagline: 'Premium Japanese Vehicles, Honestly Sold',
  established: 2015,
  description:
    "Pakistan's trusted home for hand-selected, fully inspected Japanese vehicles.",
};

export const CONTACT = {
  phone: '+92 321 9439646',
  phoneHref: 'tel:+923219439646',
  whatsapp: '+92 321 9439646',
  whatsappNumber: '923219439646',
  email: 'carjapan786@gmail.com',
  emailHref: 'mailto:carjapan786@gmail.com',
  address: {
    line1: 'Block A, Phase 1, Johar Town',
    line2: 'Lahore 54770',
    city: 'Lahore',
    country: 'Pakistan',
  },
  // Precise showroom coordinates (Johar Town, Lahore) decoded from the Google
  // Plus Code "8J3PF893+9Q2" — used by the 3D globe marker and the map.
  coordinates: { lat: 31.4684, lng: 74.3044 },
  mapEmbed: 'https://www.google.com/maps?q=31.4684,74.3044&output=embed',
  mapLink: 'https://maps.google.com/?q=31.4684,74.3044',
};

export const HOURS = [
  { day: 'Monday – Saturday', time: '10:20 AM – 9:00 PM' },
  { day: 'Sunday', time: '12:00 PM – 8:00 PM' },
];

export const SOCIAL = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
};

/** Build a deep-linked WhatsApp message for a specific vehicle. */
export const buildWhatsAppLink = (message) =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    message || `Hi ${BRAND.name}, I'd like to know more about your inventory.`
  )}`;

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', to: '/admin', icon: 'LayoutDashboard', end: true },
  { label: 'Vehicles', to: '/admin/cars', icon: 'Car' },
  { label: 'Add Vehicle', to: '/admin/cars/new', icon: 'PlusCircle' },
  { label: 'Inquiries', to: '/admin/inquiries', icon: 'MessageSquare' },
  { label: 'Reviews', to: '/admin/reviews', icon: 'Star' },
  { label: 'Settings', to: '/admin/settings', icon: 'Settings' },
];

export const MAKES = [
  'Toyota',
  'Honda',
  'Suzuki',
  'Kia',
  'Hyundai',
  'Land Cruiser',
];

export const TRANSMISSIONS = ['Automatic', 'Manual'];
export const FUEL_TYPES = ['Petrol', 'Hybrid', 'Diesel'];
export const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Crossover'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Newest Year' },
  { value: 'mileage-asc', label: 'Lowest Mileage' },
];

export const PRICE_BOUNDS = { min: 1500000, max: 90000000, step: 500000 };
export const YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i);
