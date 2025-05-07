import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    image: "https://pixabay.com/get/g16513089b0dbcca847d345d2ea999959ed428b8c5f667dc9fa6f9a040e0829812ac1841397f942cf33c910422aa9aa92a788d26dd96f95776ae2819bd0ddc11d_1280.jpg",
    title: "Heritage In Every Thread",
    description: "Discover our exquisite collection of handcrafted sarees that blend traditional artistry with contemporary elegance.",
    buttonText: "Explore Collection",
    buttonLink: "/products",
  },
  {
    image: "https://pixabay.com/get/g6af868092d7629d7cdf65e37c548c5123320a28c2a7a0752ecda2fe1835f0675ef32b647a602b65f066c9c75e10460251122a1c55a403af7f3faa8a1e5f53937_1280.jpg",
    title: "Timeless Elegance",
    description: "Elevate your style with our premium collection of luxury sarees and lehengas crafted for those special moments.",
    buttonText: "View Collection",
    buttonLink: "/products/silk-sarees",
  },
  {
    image: "https://pixabay.com/get/gede6e4f1832f0d15c04249382ae0b4972693be098402796fcba79714c96a4478e41452ae1bc3b14a2e2cc76879c4f1d9e70d25c5472c0bfc283046b6420614ed_1280.jpg",
    title: "Bridal Dreams",
    description: "Make your special day unforgettable with our exclusive bridal collection, crafted with love and precision.",
    buttonText: "Bridal Collection",
    buttonLink: "/products/designer-lehengas",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  return (
    <section className="relative overflow-hidden bg-offwhite">
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
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
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
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
