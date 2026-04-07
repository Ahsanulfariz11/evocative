import React from 'react';
import { MapPin, ChevronRight, Map as MapIcon, ExternalLink, Navigation, Loader2, Clock } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { trackClick } from '../hooks/useFirebase.js';
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerLabel, MapRoute } from './MapcnMap.tsx';

function Location({ settings }) {
  const [routeCoords, setRouteCoords] = React.useState(null);
  const [routing, setRouting] = React.useState(false);
  const [userPos, setUserPos] = React.useState(null);

  const contact = settings?.contact || {
    address: "Jl. Slamet Riady No. 24, Tarakan, Kalimantan Utara",
    hours: "10:00 – 23:00 WITA",
    coordinates: { lat: 3.3214, lng: 117.5855 }
  };

  const destLat = contact.coordinates?.lat || 3.3214;
  const destLng = contact.coordinates?.lng || 117.5855;

  const handleShowRoute = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setRouting(true);
    trackClick('maps_view');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserPos([longitude, latitude]);

        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${longitude},${latitude};${destLng},${destLat}?overview=full&geometries=geojson`
          );
          const data = await response.json();

          if (data.code === 'Ok' && data.routes.length > 0) {
            setRouteCoords(data.routes[0].geometry.coordinates);
          } else {
            alert("Could not calculate route. Please try again.");
          }
        } catch (error) {
          console.error("Routing error:", error);
          alert("Error connecting to routing service.");
        } finally {
          setRouting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please enable location access to see the route.");
        setRouting(false);
      }
    );
  };

  return (
    <section id="location" className="border-b border-black bg-black relative overflow-hidden h-[500px] sm:h-[650px] z-0">
      {/* Immersive Full-Width Map */}
      <div className="absolute inset-0 w-full h-full bg-neutral-900 z-0">
        <Map
          className="w-full h-full grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          viewport={{ center: [destLng, destLat], zoom: 15 }}
          theme="dark"
        >
          <MapControls position="top-right" showZoom showCompass />
          <MapMarker longitude={destLng} latitude={destLat}>
            <MarkerLabel className="bg-black text-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border border-white/20 shadow-xl mb-2">
              Evocative Space
            </MarkerLabel>
            <MarkerContent>
              <div className="relative h-6 w-6 rounded-full border-2 border-white bg-black shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform">
                 <div className="h-2 w-2 bg-white rounded-full relative z-10" />
              </div>
            </MarkerContent>
            <MarkerPopup className="min-w-[220px] p-0 overflow-hidden border-black shadow-2xl bg-white rounded-none">
              <div className="bg-black p-3 flex items-center justify-between">
                <h4 className="text-white font-black uppercase tracking-tighter text-sm">Evocative Space</h4>
              </div>
              <div className="p-4 border-t border-black">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3 leading-relaxed">
                  {contact.address}
                </p>
                <button 
                  onClick={handleShowRoute}
                  disabled={routing}
                  className="w-full bg-black text-white py-2 px-3 font-mono text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors mb-2 disabled:opacity-50"
                >
                  {routing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                  {routeCoords ? "Update Route" : "Show Route on Map"}
                </button>

                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.address)}`}
                  onClick={() => trackClick('maps_view')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border border-black text-black py-2 px-3 font-mono text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors"
                >
                  Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </MarkerPopup>
          </MapMarker>

          {userPos && (
            <MapMarker longitude={userPos[0]} latitude={userPos[1]}>
              <MarkerLabel className="bg-blue-600 text-white px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest mb-2">
                Your Position
              </MarkerLabel>
              <MarkerContent>
                <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-lg shadow-blue-500/50" />
              </MarkerContent>
            </MapMarker>
          )}

          {routeCoords && (
            <MapRoute 
              coordinates={routeCoords} 
              color="#3b82f6" 
              width={5} 
              opacity={0.9}
            />
          )}
        </Map>
      </div>

      {/* Decorative Grid Overlays */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/40 pointer-events-none z-10" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/40 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10 opacity-30" />

      {/* Tactical Minimal Overlay (Horizontal Alignment) */}
      <Reveal direction="up" className="absolute bottom-6 left-6 right-6 sm:right-auto z-30">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8 text-white mix-blend-difference drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <div className="space-y-0.5 shrink-0">
            <p className="text-[11px] sm:text-xs font-black uppercase leading-[1.1] max-w-[280px]">
              {contact.address.split(',').slice(0, 2).join(',')}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-tighter opacity-60">
              {contact.address.split(',').slice(2).join(',')}
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
              onClick={() => trackClick('maps_view')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-[9px] font-mono font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
              Open in Maps <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default Location;
