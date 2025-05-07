import { Link } from "wouter";
import { motion } from "framer-motion";

interface CategoryBannerProps {
  categories: {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string;
  }[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function CategoryBanner({ categories }: CategoryBannerProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl font-playfair font-bold text-center mb-10"
        >
          Explore Our Collections
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group relative h-96 overflow-hidden rounded-md shadow-lg"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-playfair font-bold text-white">{category.name}</h3>
                <p className="text-white/80 mb-4">{category.description}</p>
                <Link href={`/products/${category.slug}`}>
                  <a className="inline-block bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2 rounded-sm transition-all">
                    View Collection
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
