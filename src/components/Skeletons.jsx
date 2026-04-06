import React from 'react';

export const MenuSkeleton = () => (
  <div className="menu-grid border-t border-l border-black">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="border-b border-r border-black flex flex-col bg-white">
        <div className="h-64 skeleton" />
        <div className="p-3 sm:p-5 space-y-3">
          <div className="h-3 skeleton w-16" />
          <div className="h-5 skeleton w-3/4" />
          <div className="h-3 skeleton w-full" />
          <div className="h-3 skeleton w-2/3" />
          <div className="h-10 skeleton mt-4" />
        </div>
      </div>
    ))}
  </div>
);

export const LogoSkeleton = () => (
  <div className="w-8 h-8 skeleton rounded-full shrink-0" />
);

export const HeroSkeleton = () => (
  <section className="relative w-full min-h-[85vh] flex flex-col md:flex-row border-b border-black">
    <div className="w-full md:w-[55%] flex flex-col justify-center px-6 py-16 sm:px-10 md:px-16 lg:px-24 border-r border-black bg-white space-y-8">
      <div className="flex items-center gap-4">
        <LogoSkeleton />
        <div className="h-4 skeleton w-32" />
      </div>
      <div className="h-32 skeleton w-full" />
      <div className="h-6 skeleton w-3/4" />
      <div className="flex gap-4">
        <div className="h-12 skeleton w-40" />
        <div className="h-12 skeleton w-40" />
      </div>
    </div>
    <div className="w-full md:w-[45%] bg-neutral-100 skeleton" />
  </section>
);

export const SectionSkeleton = ({ dark = false }) => (
  <section className={`p-8 sm:p-12 md:p-16 lg:p-24 border-b border-black ${dark ? 'bg-black' : 'bg-white'}`}>
    <div className="max-w-4xl space-y-6">
      <div className={`h-4 skeleton w-32 ${dark ? 'opacity-20' : ''}`} />
      <div className={`h-16 skeleton w-full ${dark ? 'opacity-20' : ''}`} />
      <div className={`h-24 skeleton w-2/3 ${dark ? 'opacity-20' : ''}`} />
    </div>
  </section>
);

export const ArchiveSkeleton = () => (
  <section className="border-b border-black bg-white overflow-hidden">
    <div className="px-4 sm:px-6 md:px-8 py-5 border-b border-black flex justify-between items-center bg-neutral-50">
      <div className="h-6 skeleton w-48" />
      <div className="h-3 skeleton w-24" />
    </div>
    <div className="p-4 flex gap-4 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="shrink-0 w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] aspect-[4/5] sm:aspect-square skeleton border-2 border-black" />
      ))}
    </div>
  </section>
);
