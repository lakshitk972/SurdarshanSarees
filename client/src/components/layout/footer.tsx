import { Link } from "wouter";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-6">
              Surdharshan<span className="text-gold">Sarees</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Celebrating the art of traditional Indian craftsmanship since 1985. Our heritage textiles are handcrafted by master artisans.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-montserrat font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-gold transition-colors">Collections</Link></li>
              <li><Link href="/products/designer-lehengas" className="text-gray-400 hover:text-gold transition-colors">Bridal Services</Link></li>
              <li><Link href="/custom-order" className="text-gray-400 hover:text-gold transition-colors">Custom Orders</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Lookbook</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-montserrat font-semibold mb-6">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Track Your Order</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Care Instructions</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-montserrat font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-gold mt-1 mr-3 h-4 w-4" />
                <span className="text-gray-400">123 Silk Road, Chennai, Tamil Nadu, India - 600001</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-gold mr-3 h-4 w-4" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-gold mr-3 h-4 w-4" />
                <span className="text-gray-400">contact@surdharshansilks.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="text-gold mr-3 h-4 w-4" />
                <span className="text-gray-400">10:00 AM - 8:00 PM, Mon - Sun</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Surdharshan Sarees. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
                Privacy Policy
              </Link>
              <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
                Terms of Service
              </Link>
              <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
