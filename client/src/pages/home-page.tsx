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
    image: "https://cdn.pixabay.com/photo/2015/04/22/15/26/saree-734948_1280.jpg"
  },
  {
    id: 2,
    name: "Designer Lehengas",
    slug: "designer-lehengas",
    description: "Crafted for your special moments",
    image: "https://media.istockphoto.com/id/2161342626/photo/kanchipuram-silk-brocade-lehenga-saree-little-india-kuala-lumpur-malaysia.jpg?s=612x612&w=0&k=20&c=fDvtW4WUD6ctC0ljjekPk12m2zBnpfGZ1jF1NgSU830="
  },
  {
    id: 3,
    name: "Premium Fabrics",
    slug: "premium-fabrics",
    description: "Finest textures for custom creations",
    image: "https://media.istockphoto.com/id/105680592/photo/indian-scarves-in-many-colors-for-display.jpg?s=612x612&w=0&k=20&c=eGIl-xZv6K7miZSCQjvezFqSoas3H6uVZ4OR7cAhDxs="
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
