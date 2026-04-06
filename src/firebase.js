import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getDatabase,
  ref as dRef,
  onValue,
  push,
  update,
  remove,
  get,
  set as dbSet,
  runTransaction,
} from 'firebase/database';
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

// =============================================
// FIREBASE CONFIG — Evocative Space
// =============================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// =============================================
// SEED DATA
// =============================================
export const SEED_SETTINGS = {
  theme: {
    primary: '#000000',
    accent: '#ffffff',
    font: 'Inter, sans-serif'
  },
  hero: {
    title: "Fast. Raw. Caffeine.",
    description: "The fastest coffee bar in Tarakan. Pendekatan industrialis, ekstraksi presisi, tanpa basa-basi.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1920",
    stats: [
      { label: 'Delivery', value: '< 15s' },
      { label: 'Menu Items', value: '20+' },
      { label: 'Rating', value: '5.0 ★' },
    ]
  },
  about: {
    title: "Not a cafe. A caffeine dispensary.",
    description: "Evocative Space dirancang dengan satu metrik utama: Kecepatan tanpa mengorbankan kualitas ekstraksi. Kami memangkas basa-basi hospitaliti tradisional menjadi efisiensi industrial murni.",
    specs: [
      { label: 'Primary Hardware', value: 'Modded 9-Bar Pump / Nitro Tap' },
      { label: 'Output Workflow', value: '< 15s Draft / < 45s Bar' },
      { label: 'Core Beans', value: 'Washed / Natural / Anaerobic' },
      { label: 'Operating Hours', value: '10:00 – 23:00 WITA' },
    ]
  },
  contact: {
    address: "Jl. Slamet Riady No. 24, Tarakan, Kalimantan Utara",
    city: "Tarakan",
    hours: "10:00 – 23:00 WITA",
    whatsapp: "6282154443194",
    instagram: "evocative.space",
    coordinates: { lat: 3.3214, lng: 117.5855 },
    email: "evocative.space@gmail.com"
  },
  spaceStats: [
    { id: 1, label: 'SEATING SECTOR A', value: 'INDOOR / AC' },
    { id: 2, label: 'ROASTING FACILITY', value: 'PROBAT G45' },
    { id: 3, label: 'EXTERIOR FACADE', value: 'METAL / GLASS' },
  ]
};

export const SEED_SPACE = [
  { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200', alt: 'MAIN BREW BAR', desc: 'Area utama ekstraksi & nitro tap.' },
  { id: 2, img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800', alt: 'SEATING SECTOR A', desc: 'Zona kerja dengan pencahayaan alami.' },
  { id: 3, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800', alt: 'ROASTING FACILITY', desc: 'Fasilitas roasting premium on-site.' },
  { id: 4, img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1200', alt: 'EXTERIOR FACADE', desc: 'Fasad industrial Jl. Slamet Riady.' },
  { id: 5, img: 'https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&q=80&w=800', alt: 'WORK ZONE', desc: 'Meja berdiri & area coworking.' },
];

export const SEED_MENU = [
  { name: 'Evocative Speed Draft', category: 'Signature', price: '35K', img: 'https://images.unsplash.com/photo-1599317311145-2394ae9e8751?auto=format&fit=crop&q=80&w=400', desc: 'Nitro-infused cold brew. Disajikan dalam 15 detik.' },
  { name: 'Rustic Caramel Latte', category: 'Signature', price: '38K', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=400', desc: 'Espresso dengan karamel buatan rumah & sea salt.' },
  { name: 'Classic Espresso', category: 'Kopi', price: '20K', img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400', desc: 'Ekstraksi presisi tinggi, crema sempurna.' },
  { name: 'V60 Pour Over', category: 'Kopi', price: '30K', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400', desc: 'Pilihan biji kopi single origin musiman.' },
  { name: 'Kyoto Matcha', category: 'Non-Kopi', price: '35K', img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=400', desc: 'Matcha grade seremonial dari Jepang.' },
  { name: 'Artisan Chocolate', category: 'Non-Kopi', price: '32K', img: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=400', desc: 'Cokelat hitam pekat dengan steamed milk.' },
  { name: 'Butter Croissant', category: 'Pastry', price: '25K', img: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&q=80&w=400', desc: 'Flaky, buttery, dipanggang segar setiap pagi.' },
  { name: 'Almond Danish', category: 'Pastry', price: '28K', img: 'https://images.unsplash.com/photo-1623315622176-59b159f42771?auto=format&fit=crop&q=80&w=400', desc: 'Krim almond manis dengan taburan kacang panggang.' },
  { name: 'Truffle Fries', category: 'Makanan', price: '30K', img: 'https://images.unsplash.com/photo-1530016555861-3d1f3f5fd94b?auto=format&fit=crop&q=80&w=400', desc: 'Kentang goreng renyah dengan minyak truffle & parmesan.' },
  { name: 'Classic Spaghetti', category: 'Makanan', price: '45K', img: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?auto=format&fit=crop&q=80&w=400', desc: 'Saus bolognese lambat-masak, resep autentik.' },
];

export const SEED_EVENTS = [
  { title: 'Latte Art Throwdown', date: '15 Mei 2026', type: 'Tournament' },
  { title: 'Manual Brew 101', date: '22 Mei 2026', type: 'Workshop' },
];

export const SEED_TABLES = [
  { name: 'WINDOW_01', capacity: 2, category: 'Window Side' },
  { name: 'WINDOW_02', capacity: 2, category: 'Window Side' },
  { name: 'CENTRAL_01', capacity: 4, category: 'Indoor' },
  { name: 'CENTRAL_02', capacity: 4, category: 'Indoor' },
  { name: 'VIP_BOOTH', capacity: 6, category: 'Private' },
  { name: 'BAR_STOOL_01', capacity: 1, category: 'Bar' },
];

export const SEED_REVIEWS = [
  { name: 'Budi S.', text: 'Benar-benar The Fastest Coffee Bar. Kopi saya siap sebelum saya selesai bayar, dan rasanya premium.', rating: 5 },
  { name: 'Siti A.', text: 'Ambience rustic-nya dapet banget. Cocok buat kerja atau sekadar nongkrong sore di Tarakan.', rating: 5 },
];

export const SEED_GALLERY = [
  { img: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=600', cam: 'CAM_01', desc: 'EXTRACTION_PORT' },
  { img: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=600', cam: 'CAM_02', desc: 'OPERATOR_1' },
  { img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600', cam: 'CAM_03', desc: 'POUR_DYNAMICS' },
  { img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600', cam: 'CAM_04', desc: 'RAW_MATERIAL' },
];

// =============================================
// SEED FUNCTION
// =============================================
export async function seedDatabase() {
  // Cek apakah sudah ada data
  const snapshot = await get(dRef(db, 'settings'));
  if (snapshot.exists()) return { skipped: true };

  const promises = [];

  // Settings
  promises.push(dbSet(dRef(db, 'settings'), SEED_SETTINGS));

  // Space
  SEED_SPACE.forEach(item => {
    promises.push(push(dRef(db, 'space'), { ...item, createdAt: Date.now() }));
  });

  // Menu, Events, Reviews, Gallery
  SEED_MENU.forEach(item => {
    promises.push(push(dRef(db, 'menu'), { ...item, createdAt: Date.now() }));
  });
  SEED_EVENTS.forEach(item => {
    promises.push(push(dRef(db, 'events'), { ...item, createdAt: Date.now() }));
  });
  SEED_REVIEWS.forEach(item => {
    promises.push(push(dRef(db, 'reviews'), { ...item, createdAt: Date.now(), approved: true }));
  });
  SEED_GALLERY.forEach(item => {
    promises.push(push(dRef(db, 'gallery'), { ...item, createdAt: Date.now() }));
  });

  // Tables Seed
  SEED_TABLES.forEach(item => {
    promises.push(push(dRef(db, 'tables'), { ...item, createdAt: Date.now() }));
  });

  await Promise.all(promises);
  return { seeded: true };
}

// =============================================
// STORAGE HELPERS
// =============================================
import { uploadToCloudinary } from './cloudinary';

export async function uploadImage(file, path = 'uploads') {
  try {
    // 1. Ambil pengaturan terbaru dari Database untuk konfigurasi Cloudinary
    const snapshot = await get(dRef(db, 'settings'));
    const settings = snapshot.val() || {};
    
    const cloudName = settings.cloudinary?.cloud || "dmi66s3us";
    const uploadPreset = settings.cloudinary?.preset || "ml_default";
    
    // 2. Jalankan upload dengan kredensial dari Database
    const url = await uploadToCloudinary(file, cloudName, uploadPreset);
    return url;
  } catch (error) {
    console.error("Firebase/Cloudinary Upload Proxy Error:", error);
    throw error;
  }
}

// =============================================
// GLOBAL SETTINGS CRUD
// =============================================
export function subscribeSettings(callback) {
  return onValue(dRef(db, 'settings'), (snapshot) => {
    callback(snapshot.val());
  });
}

export async function updateSettings(data) {
  return update(dRef(db, 'settings'), data);
}

// =============================================
// MENU CRUD
// =============================================
export function subscribeMenu(callback) {
  return onValue(dRef(db, 'menu'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items);
  });
}

export async function addMenuItem(data) {
  return push(dRef(db, 'menu'), { ...data, createdAt: Date.now() });
}

export async function updateMenuItem(id, data) {
  return update(dRef(db, `menu/${id}`), data);
}

export async function deleteMenuItem(id) {
  return remove(dRef(db, `menu/${id}`));
}

// =============================================
// EVENTS CRUD
// =============================================
export function subscribeEvents(callback) {
  return onValue(dRef(db, 'events'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items);
  });
}

export async function addEvent(data) {
  return push(dRef(db, 'events'), { ...data, createdAt: Date.now() });
}

export async function updateEvent(id, data) {
  return update(dRef(db, `events/${id}`), data);
}

export async function deleteEvent(id) {
  return remove(dRef(db, `events/${id}`));
}

// =============================================
// REVIEWS CRUD
// =============================================
export function subscribeReviews(callback) {
  return onValue(dRef(db, 'reviews'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items.filter(r => r.approved));
  });
}

export function subscribeAllReviews(callback) {
  return onValue(dRef(db, 'reviews'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items);
  });
}

export async function addReview(data) {
  return push(dRef(db, 'reviews'), { ...data, createdAt: Date.now(), approved: false });
}

export async function updateReview(id, data) {
  return update(dRef(db, `reviews/${id}`), data);
}

export async function deleteReview(id) {
  return remove(dRef(db, `reviews/${id}`));
}

// =============================================
// GALLERY CRUD
// =============================================
export function subscribeGallery(callback) {
  return onValue(dRef(db, 'gallery'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items);
  });
}

export async function addGalleryItem(data) {
  return push(dRef(db, 'gallery'), { ...data, createdAt: Date.now() });
}

export async function deleteGalleryItem(id) {
  return remove(dRef(db, `gallery/${id}`));
}

// =============================================
// SPACE CRUD
// =============================================
export function subscribeSpace(callback) {
  return onValue(dRef(db, 'space'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items);
  });
}

export async function addSpaceItem(data) {
  return push(dRef(db, 'space'), { ...data, createdAt: Date.now() });
}

export async function deleteSpaceItem(id) {
  return remove(dRef(db, `space/${id}`));
}

export async function updateSpaceItem(id, data) {
  return update(dRef(db, `space/${id}`), data);
}

// =============================================
// RESERVATIONS CRUD
// =============================================
export function subscribeReservations(callback) {
  return onValue(dRef(db, 'reservations'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items);
  });
}

export async function addReservation(data) {
  return push(dRef(db, 'reservations'), { 
    ...data, 
    status: 'pending', 
    createdAt: Date.now() 
  });
}

export async function updateReservation(id, data) {
  return update(dRef(db, `reservations/${id}`), data);
}

export async function deleteReservation(id) {
  return remove(dRef(db, `reservations/${id}`));
}

// =============================================
// TABLES CRUD
// =============================================
export function subscribeTables(callback) {
  return onValue(dRef(db, 'tables'), (snapshot) => {
    const data = snapshot.val();
    const items = data
      ? Object.entries(data).map(([id, val]) => ({ ...val, id }))
      : [];
    callback(items);
  });
}

export async function addTable(data) {
  return push(dRef(db, 'tables'), { ...data, createdAt: Date.now() });
}

export async function updateTable(id, data) {
  return update(dRef(db, `tables/${id}`), data);
}

export async function deleteTable(id) {
  return remove(dRef(db, `tables/${id}`));
}

// =============================================
// ANALYTICS & STATS
// =============================================
export const trackClick = async (type) => {
  try {
    const counterRef = dRef(db, `stats/counters/${type}`);
    await runTransaction(counterRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });
  } catch (err) {
    console.error('Track click failed:', err);
  }
};

export function subscribeAnalytics(callback) {
  return onValue(dRef(db, 'stats/counters'), (snapshot) => {
    callback(snapshot.val() || {});
  });
}

export const logAnalyticsClick = async (type, data = {}) => {
  try {
    const analyticsRef = dRef(db, 'analytics/clicks');
    const newClickRef = push(analyticsRef);
    await dbSet(newClickRef, {
      type,
      ...data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  } catch (err) {
    console.error('Analytics log failed:', err);
  }
};