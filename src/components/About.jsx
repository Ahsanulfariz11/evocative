import React from 'react';
import Reveal from './Reveal';

function About({ settings }) {
  const content = settings?.about || {
    title: "Not a cafe. A caffeine dispensary.",
    description: "Evocative Space dirancang dengan satu metrik utama: Kecepatan tanpa mengorbankan kualitas ekstraksi. Kami memangkas basa-basi hospitaliti tradisional menjadi efisiensi industrial murni.",
    specs: [
      { label: 'Primary Hardware', value: 'Modded 9-Bar Pump / Nitro Tap' },
      { label: 'Output Workflow', value: '< 15s Draft  /  < 45s Bar', live: true },
      { label: 'Core Beans', value: 'Washed / Natural / Anaerobic' },
      { label: 'Operating Hours', value: '10:00 – 23:00 WITA' },
    ]
  };

  return (
    <section id="about" className="border-b border-black bg-black text-white py-20 sm:py-32">
      <div className="max-width-screen-xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
        <Reveal direction="up" className="max-w-4xl">
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-tighter mb-10 italic pt-10">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl text-neutral-400 font-medium leading-relaxed max-w-2xl">
            {content.description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default About;
