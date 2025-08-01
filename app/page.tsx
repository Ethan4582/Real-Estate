"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import { Home, Search, ArrowRight, Check, Star } from "lucide-react";
import { useEffect } from "react";

const properties = [
  {
    id: "1",
    title: "Cozy Studio Apartment",
    location: "Downtown, New York",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    images: ["/4.png"],
    description: "Modern studio in the heart of the city with amazing views.",
    type: "Apartment",
    owner: {
      id: "1",
      name: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "2",
    title: "Luxury Condo",
    location: "Beverly Hills, CA",
    price: 750000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: ["/5.png"],
    description: "Stunning condo with premium finishes and amenities.",
    type: "Condo",
    owner: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com"
    }
  },
  {
    id: "3",
    title: "Suburban Family Home",
    location: "Greenville, TX",
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    images: ["/6.png"],
    description: "Spacious family home in a quiet neighborhood.",
    type: "House",
    owner: {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com"
    }
  },
  {
    id: "4",
    title: "Modern Loft",
    location: "Soho, New York",
    price: 3200,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ["/7.png"],
    description: "Industrial-chic loft with exposed brick and high ceilings.",
    type: "Loft",
    owner: {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com"
    }
  }
];

export default function HomePage() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10"></div>
          <Image
            src="/1.png"
            alt="Dream House"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
              DREAM HOUSE<sup className="text-xl">®</sup>
            </h1>
            <p className="text-2xl md:text-3xl font-light text-white mb-10">
              FIND YOUR DREAM HOME TODAY
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center space-x-8 mb-12"
          >
            {["HOME", "OUR VISION", "PROPERTIES", "CONTACT"].map((item, index) => (
              <Link 
                key={index} 
                href={index === 0 ? "#" : `#${item.toLowerCase().replace(' ', '-')}`}
                className="text-white font-medium hover:text-blue-200 transition-colors"
              >
                {item}
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-xl text-white mb-10">
              WHERE TIMELESS ELEGANCE MEETS MODERN LIVING. LET US GUIDE YOU TO A PLACE YOU'LL LOVE FOREVER.
            </p>
            <Link 
              href="#properties" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-100 transition-colors"
            >
              EXPLORE PROPERTIES <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col md:flex-row justify-center items-center gap-6 text-white text-sm"
          >
            <span>Award-Winning Service</span>
            <span>Verified Listings</span>
            <span>Secure Transactions</span>
            <span>Satisfaction Guarantee</span>
          </motion.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section id="our-vision" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              CRAFTING YOUR FUTURE, ONE HOME AT A TIME
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700">
                AT DREAM HOUSE, WE BELIEVE A HOME IS MORE THAN A PLACE — IT'S A STORY WAITING TO UNFOLD. OUR VISION IS TO CONNECT YOU WITH SPACES THAT INSPIRE, COMFORT, AND REFLECT WHO YOU ARE. WITH CURATED PROPERTIES AND PERSONALIZED SERVICE, WE'RE HERE TO MAKE YOUR DREAM A REALITY.
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-xl overflow-hidden"
            >
              <Image
                src="/5.png"
                alt="Our Vision"
                fill
                className="object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-xl overflow-hidden"
            >
              <Image
                src="/2.png"
                alt="Our Vision"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              PROPERTIES
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              FIND YOUR PERFECT HOME
            </p>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              EXPLORE OUR CURATED SELECTION OF PROPERTIES FOR RENT OR PURCHASE.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link 
              href="/search" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              VIEW ALL PROPERTIES <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-xl overflow-hidden"
            >
              <Image
                src="/3.png"
                alt="Why Choose Us"
                fill
                className="object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                WHY CHOOSE DREAM HOUSE?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                EXCEPTIONAL SERVICE, UNMATCHED EXPERTISE.
              </p>
              
              <div className="space-y-6">
                {[
                  "PERSONALIZED GUIDANCE | TAILORED RECOMMENDATIONS TO MATCH YOUR LIFESTYLE.",
                  "CURATED LISTINGS | HANDPICKED PROPERTIES THAT MEET THE HIGHEST STANDARDS.",
                  "SEAMLESS PROCESS | FROM SEARCH TO CLOSING, WE MAKE IT EFFORTLESS.",
                  "LOCAL EXPERTISE | DEEP KNOWLEDGE OF NEIGHBORHOODS AND MARKETS."
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 mr-3" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                OUR PROMISE TO YOU
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                DREAM HOUSE IS BUILT ON TRUST, INTEGRITY, AND A PASSION FOR HELPING YOU FIND HOME.
              </p>
              <p className="text-gray-700 mb-8">
                OUR MISSION IS TO SIMPLIFY YOUR JOURNEY, OFFERING CLARITY AND CONFIDENCE AT EVERY STEP. WE'RE NOT JUST REALTORS—WE'RE STORYTELLERS, CREATING THE NEXT CHAPTER OF YOUR LIFE.
              </p>
              <Link 
                href="#contact" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                CONTACT THE REALTOR <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-xl overflow-hidden"
            >
              <Image
                src="/5.png"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "DISCOVER", 
                description: "SHARE YOUR NEEDS, AND WE'LL CURATE THE PERFECT OPTIONS." 
              },
              { 
                title: "EXPLORE", 
                description: "TOUR PROPERTIES WITH OUR EXPERT GUIDANCE." 
              },
              { 
                title: "SECURE", 
                description: "WE HANDLE NEGOTIATIONS AND PAPERWORK FOR A STRESS-FREE CLOSE." 
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl text-center"
              >
                <div className="text-5xl font-bold text-blue-900 mb-4">{index + 1}.</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              STORIES FROM HAPPY HOMEOWNERS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "SARAH & MARK",
                role: "FIRST-TIME BUYERS",
                quote: "DREAM HOUSE FOUND US THE PERFECT HOME IN JUST WEEKS. THEIR CARE AND EXPERTISE MADE ALL THE DIFFERENCE.",
                rating: 5
              },
              {
                name: "EMILY",
                role: "TENANT",
                quote: "RENTING WITH DREAM HOUSE WAS SEAMLESS. THEY TRULY LISTEN TO WHAT YOU NEED.",
                rating: 4
              },
              {
                name: "JAMES",
                role: "HOMEOWNER",
                quote: "THE TEAM'S KNOWLEDGE OF THE MARKET IS UNMATCHED. WE COULDN'T BE HAPPIER!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">CONTACT US</h2>
              <p className="text-xl mb-8">
                READY TO FIND YOUR DREAM HOME? GET IN TOUCH WITH OUR TEAM TODAY.
              </p>
              
              <form className="space-y-6">
                <div>
                  <label className="block mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-blue-800 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-blue-800 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-blue-800 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button className="w-full py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  SEND MESSAGE
                </button>
              </form>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-xl overflow-hidden"
            >
              <Image
                src="/6.png"
                alt="Contact Us"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}