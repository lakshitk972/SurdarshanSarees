import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { set } from "mongoose";

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    image: "https://cdn.pixabay.com/photo/2021/04/12/08/19/bride-6171757_1280.jpg",
    title: "Heritage In Every Thread",
    description: "Discover our exquisite collection of handcrafted sarees that blend traditional artistry with contemporary elegance.",
    buttonText: "Explore Collection",
    buttonLink: "/products",
  },
  {
    image: "https://cdn.pixabay.com/photo/2025/02/19/09/51/bride-9417363_1280.jpg",
    title: "Timeless Elegance",
    description: "Elevate your style with our premium collection of luxury sarees and lehengas crafted for those special moments.",
    buttonText: "View Collection",
    buttonLink: "/products/silk-sarees",
  },
  {
    image: "https://media.istockphoto.com/id/1357924370/photo/young-woman-dressed-in-posh-gilded-indian-costume-kundan-style-jewelry-and-henna-tattoo-on.jpg?s=612x612&w=0&k=20&c=3vmujjn8mxTImpYR18qsS5xk03gwtTWto0ecK3YiwWo=",
    title: "Bridal Dreams sdfdfsdf",
    description: "Make your special day unforgettable with our exclusive bridal collection, crafted with love and precision.",
    buttonText: "Bridal Collection",
    buttonLink: "/products/designer-lehengas",
  },
];

// Autoplay delay (ms)
const AUTOPLAY_DELAY = 9000;
export function HeroSlider(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  // intervalId is now a ref, not state, for proper handling of setInterval/clearInterval
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Clear existing interval before setting a new one
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    intervalId.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_DELAY);
    // Cleanup on unmount/effect re-run
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [currentSlide]); // depend on currentSlide, so timer resets on user navigation
  // When user clicks next, go to next and reset interval by changing currentSlide
  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  // When user clicks previous, go to previous and reset interval
  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const current = slides[currentSlide];
  
  return (
    <section className="relative overflow-hidden bg-offwhite">
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
            
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="container mx-auto px-4 h-full flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="max-w-xl"
              >
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 opacity-95">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-lg md:text-xl font-montserrat text-white mb-8 opacity-90">
                  {slides[currentSlide].description}
                </p>
                <Button
                  asChild
                  className="bg-maroon hover:bg-maroon-dark text-white px-8 py-6 font-medium rounded-sm transition-all hover:shadow-lg"
                >
                  <a href={slides[currentSlide].buttonLink}>
                    {slides[currentSlide].buttonText}
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          <button
            onClick={prevSlide}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          <button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="slider-pagination absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full bg-white opacity-50 transition-all ${
                index === currentSlide ? "active" : ""
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
