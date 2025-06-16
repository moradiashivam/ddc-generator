import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react';
import { getTestimonials, type Testimonial } from '../lib/testimonials';

export function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500); // Match transition duration
  }, [isAnimating, testimonials.length]);

  const prevTestimonial = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500); // Match transition duration
  }, [isAnimating, testimonials.length]);

  const goToTestimonial = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500); // Match transition duration
  }, [isAnimating, currentIndex]);

  useEffect(() => {
    let mounted = true;

    async function loadTestimonials() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTestimonials();
        
        if (mounted) {
          setTestimonials(Array.isArray(data) ? data : []);
          // Reset current index if it's out of bounds
          if (currentIndex >= data.length) {
            setCurrentIndex(0);
          }
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
        if (mounted) {
          setError('Failed to load testimonials');
          setTestimonials([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadTestimonials();

    // Set up auto-refresh interval
    const intervalId = setInterval(loadTestimonials, 30000); // Refresh every 30 seconds

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(() => {
      if (!isAnimating) {
        nextTestimonial();
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length, isAnimating, nextTestimonial]);

  if (isLoading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !testimonials.length) {
    return null;
  }

  return (
    <div className="w-full py-16 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              What People Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Hear from our satisfied users
          </p>
        </div>

        <div className="relative">
          {/* Testimonial Cards */}
          <div className="relative h-[400px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute w-full transition-all duration-500 transform ${
                  index === currentIndex
                    ? 'opacity-100 translate-x-0 scale-100 z-20'
                    : index === (currentIndex + 1) % testimonials.length
                    ? 'opacity-40 translate-x-full scale-95 z-10'
                    : index === (currentIndex - 1 + testimonials.length) % testimonials.length
                    ? 'opacity-40 -translate-x-full scale-95 z-10'
                    : 'opacity-0 translate-x-0 scale-90 z-0'
                }`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100 dark:ring-purple-900"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 w-8 h-8 text-purple-200 dark:text-purple-800 transform -rotate-12" />
                    <p className="text-lg text-gray-700 dark:text-gray-300 italic relative z-10">
                      {testimonial.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                disabled={isAnimating}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:scale-110 transition-transform z-30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
              </button>
              <button
                onClick={nextTestimonial}
                disabled={isAnimating}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:scale-110 transition-transform z-30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
              </button>

              {/* Dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    disabled={isAnimating}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-purple-600 dark:bg-purple-400 w-6'
                        : 'bg-gray-300 dark:bg-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}