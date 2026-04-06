import { useEffect } from 'react';

const SEO = ({ settings }) => {
  useEffect(() => {
    const title = settings?.contact?.address 
      ? `Evocative Space | Coffee Bar in ${settings.contact.city || 'Tarakan'}`
      : 'Evocative Space | The Fastest Coffee Bar';
      
    document.title = title;
    
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    
    const desc = settings?.hero?.description || 'Kafe Terbaik. Nikmati kopi artisan dengan kecepatan tanpa kompromi.';
    meta.setAttribute('content', desc);
  }, [settings]);

  return null;
};

export default SEO;
