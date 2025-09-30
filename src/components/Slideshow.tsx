import { useEffect, useState } from 'react';

export type SlideshowImage = {
  src: string;
  caption: string;
};

export type SlideshowProps = {
  images: SlideshowImage[];
  autoAdvanceInterval?: number; // milliseconds
};

const Slideshow = ({ images, autoAdvanceInterval = 4000 }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance functionality
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [images.length, autoAdvanceInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="slideshow-empty">
        <p>No images to display</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="slideshow">
      <div className="slideshow-container">
        {/* Main image display */}
        <div className="slideshow-image-container">
          <img
            src={currentImage.src}
            alt={currentImage.caption}
            className="slideshow-image"
          />
          
          {/* Navigation arrows - only show if more than 1 image */}
          {images.length > 1 && (
            <>
              <button
                className="slideshow-nav slideshow-nav-prev"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button
                className="slideshow-nav slideshow-nav-next"
                onClick={goToNext}
                aria-label="Next image"
              >
                &#8250;
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        <div className="slideshow-caption">
          <p>{currentImage.caption}</p>
        </div>

        {/* Dot indicators - only show if more than 1 image */}
        {images.length > 1 && (
          <div className="slideshow-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`slideshow-dot ${
                  index === currentIndex ? 'slideshow-dot-active' : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Slideshow;