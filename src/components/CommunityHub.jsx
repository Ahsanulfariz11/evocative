import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Star, 
  Send, 
  Loader2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Check 
} from 'lucide-react';
import Reveal from './Reveal';
import { addReview } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function CommunityHub({ eventsData, reviewsData, eventsLoading, reviewsLoading }) {
  const events = eventsData || [];
  const reviews = reviewsData || [];

  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Refs for Navigation
  const prevEventRef = useRef(null);
  const nextEventRef = useRef(null);
  const prevReviewRef = useRef(null);
  const nextReviewRef = useRef(null);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    setSubmitting(true);
    try {
      await addReview(reviewForm);
      setSubmitted(true);
      setReviewForm({ name: '', text: '', rating: 5 });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      console.error('Review submit failed:', err);
    }
    setSubmitting(false);
  };

  return (
    <section id="events" className="border-b border-black bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT: EVENTS SECTION (with Swiper Carousel) */}
        <Reveal direction="right" className="p-8 sm:p-12 md:p-16 border-b lg:border-b-0 lg:border-r border-black overflow-hidden bg-white min-w-0">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-10 flex items-center gap-3">
            Community <Calendar className="w-7 h-7" />
          </h2>
          
          {eventsLoading ? (
            <div className="h-48 skeleton border-2 border-black" />
          ) : events.length > 0 ? (
            <div className="group relative min-w-0">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                navigation={{
                  prevEl: prevEventRef.current,
                  nextEl: nextEventRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevEventRef.current;
                  swiper.params.navigation.nextEl = nextEventRef.current;
                }}
                pagination={{ clickable: true, el: '.swiper-pagination-event' }}
                className="w-full"
              >
                {events.map(event => (
                  <SwiperSlide key={event.id}>
                    <div className="group/card cursor-pointer relative">
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[16/9] border-4 border-black bg-neutral-100 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover/card:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover/card:-translate-x-1 group-hover/card:-translate-y-1 transition-all duration-300">
                        {event.img ? (
                          <img 
                            src={event.img} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_11px)] opacity-10">
                            <Calendar className="w-12 h-12 text-black" />
                          </div>
                        )}
                        
                        <div className="absolute top-4 left-4">
                          <span className="bg-black text-white font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                            {event.type}
                          </span>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-widest text-neutral-400">
                           <Clock className="w-3.5 h-3.5" /> 
                           <span>{event.date}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none group-hover/card:underline decoration-4 underline-offset-8">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation for Events — Centered & Symmetric */}
              <div className="flex items-center justify-between gap-4 mt-10">
                <button 
                  ref={prevEventRef}
                  className="p-3 sm:p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-brutal-sm active:translate-y-1 active:shadow-none shrink-0"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="swiper-pagination-event flex justify-center gap-2" />
                <button 
                  ref={nextEventRef}
                  className="p-3 sm:p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-brutal-sm active:translate-y-1 active:shadow-none shrink-0"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-neutral-400 py-16 border-2 border-dashed border-neutral-200 flex flex-col items-center gap-4 uppercase tracking-widest font-black italic">
              <span>No upcoming events scheduled.</span>
            </div>
          )}
        </Reveal>

        {/* RIGHT: REVIEWS SECTION (with Swiper Carousel) */}
        <Reveal direction="left" className="p-8 sm:p-12 md:p-16 bg-neutral-50 flex flex-col min-w-0">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-10 flex items-center gap-3">
            The Word <Star className="w-7 h-7" />
          </h2>

          <div className="relative mb-12 min-w-0">
            {reviewsLoading ? (
              <div className="h-48 skeleton border-2 border-black" />
            ) : reviews.length > 0 ? (
              <div className="group relative">
                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  navigation={{
                    prevEl: prevReviewRef.current,
                    nextEl: nextReviewRef.current,
                  }}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevReviewRef.current;
                    swiper.params.navigation.nextEl = nextReviewRef.current;
                  }}
                  pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
                  className="w-full"
                >
                  {reviews.map(review => (
                    <SwiperSlide key={review.id}>
                      <div className="bg-white p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 min-h-[240px] flex flex-col h-full">
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 5) ? 'fill-black text-black' : 'text-neutral-200'}`} />
                          ))}
                        </div>
                        <p className="text-sm sm:text-base font-medium leading-relaxed mb-6 italic grow flex items-center">
                          "{review.text}"
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                          <div className="w-8 h-[2px] bg-black"></div>
                          <p className="text-[11px] font-mono font-black uppercase tracking-widest text-neutral-400">
                             {review.name}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation for Reviews — Centered & Symmetric */}
                <div className="flex items-center justify-between gap-4 mt-10">
                  <button 
                    ref={prevReviewRef}
                    className="p-3 sm:p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-brutal-sm active:translate-y-1 active:shadow-none shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <div className="swiper-pagination-custom flex justify-center gap-2" />
                  <button 
                    ref={nextReviewRef}
                    className="p-3 sm:p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-brutal-sm active:translate-y-1 active:shadow-none shrink-0"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            ) : (
               <div className="text-[10px] font-mono text-neutral-400 py-16 border-2 border-dashed border-neutral-200 flex flex-col items-center gap-4 uppercase tracking-widest font-black italic text-center w-full">
                  No reviews yet. Be the first to share your experience.
               </div>
            )}
          </div>

          {/* Submit Review Form */}
          <div className="border-4 border-black p-6 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="inline-flex p-3 bg-green-50 border-2 border-green-600">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-mono text-xs font-black uppercase tracking-widest text-green-600 leading-relaxed">
                  Review Submitted.<br/>
                  <span className="text-neutral-400 uppercase">Your feedback is being processed.</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="NAME"
                  value={reviewForm.name}
                  onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="w-full border-2 border-neutral-200 focus:border-black px-4 py-3 text-sm focus:outline-none font-mono uppercase"
                  required
                />
                <textarea
                  rows={3}
                  placeholder="SHARE YOUR EXPERIENCE..."
                  value={reviewForm.text}
                  onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                  className="w-full border-2 border-neutral-200 focus:border-black px-4 py-3 text-sm focus:outline-none resize-none font-mono uppercase"
                  required
                />
                <div className="flex items-center gap-4 p-2 bg-neutral-50 border-2 border-neutral-100">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black text-neutral-400">RATING:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                        className="p-1"
                      >
                        <Star className={`w-6 h-6 transition-colors ${n <= reviewForm.rating ? 'fill-black text-black' : 'text-neutral-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-brutal-sm active:translate-y-1 active:shadow-none"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CommunityHub;
