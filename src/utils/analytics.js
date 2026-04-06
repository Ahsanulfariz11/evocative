/**
 * SEO & Analytics Utility for EVOCATIVE SPACE
 * Handles dynamic meta tag injection and mocked tracking events.
 */

export const injectMetaTags = () => {
  const meta = {
    title: "Evocative Space | The Fastest Coffee Bar in Tarakan",
    description: "Experience the perfect blend of high-efficiency service and artisanal coffee at Evocative Space Tarakan. No. 24 Jl. Slamet Riady.",
    keywords: "Kafe Terbaik di Tarakan, Coffee Bar Tarakan, Evocative Space, Kopi Tarakan, Creative Hub Tarakan",
    ogImage: "/hero_bg_rustic_coffee_bar_1774983110104.png",
    ogUrl: "https://evocative.space"
  };

  document.title = meta.title;
  
  const updateOrCreateMeta = (name, content, attr = 'name') => {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  updateOrCreateMeta('description', meta.description);
  updateOrCreateMeta('keywords', meta.keywords);
  updateOrCreateMeta('og:title', meta.title, 'property');
  updateOrCreateMeta('og:description', meta.description, 'property');
  updateOrCreateMeta('og:image', meta.ogImage, 'property');
  updateOrCreateMeta('og:url', meta.ogUrl, 'property');
  updateOrCreateMeta('twitter:card', 'summary_large_image');
};

export const trackEvent = (eventName, params = {}) => {
  console.log(`[Analytics Tracking] Event: ${eventName}`, params);
};
