import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "The craftsmanship of my wedding lehenga was absolutely breathtaking. Every detail was meticulously executed, and the customization options made it truly one-of-a-kind.",
    image: "https://pixabay.com/get/g9ae40f217e97ad3a8be20ea6a9d48460586cfeb1d81ed69fdf97b8a752decd3a7f54f9b1f1e12c491c0937a5639b15829a81b8e22278a246a7395816fd9c89a1_1280.jpg"
  },
  {
    id: 2,
    name: "Lakshmi Iyer",
    location: "Chennai",
    rating: 5,
    text: "My Kanchipuram silk saree from Surdharshan is an heirloom piece that I will cherish forever. The quality of silk and zari work is unmatched in today's market.",
    image: "https://pixabay.com/get/gf6e9829ebd2a7784024587426a617e19af09e4c533e959b7d50c23a4f423525ab31db279567850dea7be7cbd297ece29530b32ce5271a29b7a9823c36e62a2fb_1280.jpg"
  },
  {
    id: 3,
    name: "Anika Patel",
    location: "Mumbai",
    rating: 4.5,
    text: "The attention to detail in my customized Banarasi silk saree exceeded all expectations. The team worked closely with me to create exactly what I envisioned for my reception.",
    image: "https://pixabay.com/get/g342c76c2134893bf28a8e8e8f2a4dcc6edd27d6ad762a48ffe2cc066c60e4e5d96a8995058803e7304f1b380231774d755e0cfd30b204499614341e3a97baf52_1280.jpg"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-offwhite">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-playfair font-bold text-center mb-12"
        >
          Our Customer Stories
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-md shadow-md"
            >
              <div className="flex text-gold mb-4">
                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                {testimonial.rating % 1 !== 0 && (
                  <div className="relative">
                    <Star className="h-5 w-5 text-gray-200" />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                      <Star className="h-5 w-5 fill-current text-gold" />
                    </div>
                  </div>
                )}
              </div>
              <blockquote className="font-cormorant text-xl italic mb-6">
                "{testimonial.text}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-montserrat font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
