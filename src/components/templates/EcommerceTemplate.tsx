import React from 'react';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface EcommerceProps {
  content: {
    hero: {
      headline: string;
      subheadline: string;
      image_url: string;
    };
    about: string;
    items: Array<{
      name: string;
      desc: string;
      price: string;
      image_url: string;
    }>;
    theme_color: string;
  };
  whatsapp_number: string;
}

export default function EcommerceTemplate({ content, whatsapp_number }: EcommerceProps) {
  const { hero, about, items, theme_color } = content;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white pb-20">
      {/* Header */}
      <header className="py-6 px-8 md:px-16 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="font-extrabold text-2xl tracking-tighter" style={{ color: theme_color }}>
          Store
        </div>
        <nav className="flex gap-6 font-medium text-sm">
          <a href="#about" className="hover:text-gray-500 transition-colors">About</a>
          <a href="#products" className="hover:text-gray-500 transition-colors">Products</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-8 md:px-16 py-12 md:py-24 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex flex-col justify-center">
            <h1 
              className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-balance mb-6"
            >
              {hero.headline}
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed text-balance">
              {hero.subheadline}
            </p>
            <div className="flex">
              <a 
                href="#products"
                className="px-10 py-4 rounded-lg text-white font-bold text-lg transition-transform duration-300 hover:scale-[1.03] shadow-lg"
                style={{ backgroundColor: theme_color }}
              >
                Shop Now
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10 pointer-events-none" />
              <img 
                src={hero.image_url} 
                alt="Store Hero" 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-8 md:px-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
            &quot;{about}&quot;
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-8 md:px-16 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">Our Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {items.map((item, index) => (
            <div key={index} className="group flex flex-col h-full">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-6 relative">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{item.name}</h3>
                  <span className="font-bold text-lg whitespace-nowrap" style={{ color: theme_color }}>
                    {item.price}
                  </span>
                </div>
                <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-auto">
                  <a 
                    href={getWhatsAppLink(whatsapp_number, `Hi! I want to buy: ${item.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3.5 px-6 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    style={{ backgroundColor: theme_color }}
                  >
                    Buy via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
