import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSlider } from "@/components/home/hero-slider";
import { CategoryBanner } from "@/components/home/category-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PromoBanner } from "@/components/home/promo-banner";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

// Sample data for category banner
const categories = [
  {
    id: 1,
    name: "Silk Sarees",
    slug: "silk-sarees",
    description: "Timeless elegance in every drape",
    image: "https://pixabay.com/get/gc6d334dcade497091ebe2d99fe24652eaed4808fc01f8a3a71f915dd4fcf844d1f5e732fe072fef8f4319edbd4bf6791a71c1bf25f5485f387b504b4fff00c7c_1280.jpg"
  },
  {
    id: 2,
    name: "Designer Lehengas",
    slug: "designer-lehengas",
    description: "Crafted for your special moments",
    image: "https://pixabay.com/get/gede6e4f1832f0d15c04249382ae0b4972693be098402796fcba79714c96a4478e41452ae1bc3b14a2e2cc76879c4f1d9e70d25c5472c0bfc283046b6420614ed_1280.jpg"
  },
  {
    id: 3,
    name: "Premium Fabrics",
    slug: "premium-fabrics",
    description: "Finest textures for custom creations",
    image: "https://pixabay.com/get/gccacd68d184616335271f9a9d6708f4a881fd2824fe14b8c8d0179e9da04290e5a414655e7904b5268034f112da02c577bced2a4888213ce551c47c351349b48_1280.jpg"
  },
];

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Surdharshan Sarees - Luxury Ethnic Wear</title>
        <meta name="description" content="Discover luxurious handcrafted sarees, designer lehengas, and premium fabrics at Surdharshan Sarees. Traditional elegance meets contemporary design." />
        <meta property="og:title" content="Surdharshan Sarees - Luxury Ethnic Wear" />
        <meta property="og:description" content="Discover luxurious handcrafted sarees, designer lehengas, and premium fabrics at Surdharshan Sarees. Traditional elegance meets contemporary design." />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <HeroSlider />
          <CategoryBanner categories={categories} />
          <FeaturedProducts />
          <PromoBanner />
          <Testimonials />
          <Newsletter />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
