import React from 'react';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface PortfolioProps {
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

export default function PortfolioTemplate({ content, whatsapp_number }: PortfolioProps) {
  const { hero, about, items, theme_color } = content;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center">
        <div className="flex-1 w-full px-8 md:px-16 lg:px-24 py-20 flex flex-col justify-center z-10">
          <h1 
            className="text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[1.1] tracking-tight text-balance mb-6"
            style={{ color: theme_color }}
          >
            {hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-10 text-balance leading-relaxed">
            {hero.subheadline}
          </p>
          <div className="flex gap-4">
            <a 
              href={getWhatsAppLink(whatsapp_number, "Hi! I'd like to discuss a project with you.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-white font-medium text-lg transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              style={{ backgroundColor: theme_color }}
            >
              Hire Me
            </a>
            <a 
              href="#projects"
              className="px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-medium text-lg transition-all duration-300 hover:border-gray-900 hover:text-gray-900"
            >
              View Work
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-[50vh] md:h-[90vh] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent z-10 hidden md:block" />
          <img 
            src={hero.image_url} 
            alt="Hero Portfolio" 
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-6" style={{ color: theme_color }}>About Me</h2>
          <p className="text-2xl md:text-4xl text-gray-800 leading-snug font-light text-balance">
            {about}
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-8 md:px-16 lg:px-24 bg-gray-50">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 shadow-sm" style={{ color: theme_color }}>Selected Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {items.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-6 shadow-sm transition-all duration-500 hover:shadow-2xl">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-gray-600 transition-colors">{item.name}</h3>
                  <p className="text-gray-500 text-lg">{item.desc}</p>
                </div>
                {item.price && item.price !== "Custom" && (
                  <span className="inline-block px-4 py-1 bg-gray-100 text-gray-800 font-medium rounded-full whitespace-nowrap">
                    {item.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-8 right-8 z-50">
        <a 
          href={getWhatsAppLink(whatsapp_number, "Hi! I was looking at your portfolio and wanted to chat.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4 rounded-full text-white shadow-2xl transition-transform duration-300 hover:scale-110"
          style={{ backgroundColor: theme_color }}
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
