import { Link } from "wouter";
import { motion } from "framer-motion";

export function PromoBanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-center bg-cover opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80')" }}></div>
      <div className="absolute inset-0 bg-maroon/90"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
              Custom Bridal Collection
            </h2>
            <p className="text-lg opacity-90 mb-8 font-montserrat leading-relaxed">
              Celebrate your special day with our bespoke bridal creations. Our master craftsmen bring your dream outfit to life with exquisite detailing and personalized design consultations.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/custom-order">
                <a className="inline-block bg-white text-maroon hover:bg-offwhite px-6 py-3 rounded-sm font-medium transition-colors text-center">
                  Book Consultation
                </a>
              </Link>
              <Link href="/products/designer-lehengas">
                <a className="inline-block border border-white text-white hover:bg-white/10 px-6 py-3 rounded-sm font-medium transition-colors text-center">
                  View Gallery
                </a>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="hidden md:block relative p-6"
          >
            <img 
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80" 
              alt="Luxury Bridal Collection" 
              className="w-full h-auto rounded-md shadow-2xl transform translate-x-4 translate-y-4 relative z-20"
            />
            <div className="absolute top-0 left-0 right-12 bottom-12 border-2 border-gold rounded-md z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
