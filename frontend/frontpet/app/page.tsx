"use client";

import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-end justify-between px-8 py-4 bg-white">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="PetConnect Logo"
            className="w-8 h-8 object-cover rounded-full"
          />
          <span className="text-xl font-bold text-gray-800">PetConnect</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          <a href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">
            How It Works
          </a>
          <a href="#providers" className="text-gray-600 hover:text-gray-900">
            Providers
          </a>
          <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
            Testimonals
          </a>
          <a href="#cta" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </div>
      </nav>

      <section id="home" className="relative pt-0 px-6 py-8 overflow-hidden">
        {/* Blue Section */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-3xl overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">
                All Your Pet Care in One Place
              </h1>
              <p className="text-base mb-6 text-blue-50">
                Manage pets, health records, bookings, <br /> and communication
                easily
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50">
                  Login as Pet Owner
                </button>
                <button className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800">
                  Login as Care Provider
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <img
                src="/dogCat.png"
                alt="dog and cat"
                className="h-72 w-96 object-contain"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full leading-[0] ">
            <svg
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              className="relative block w-full h-[100px] md:h-[150px]"
            >
              <path
                fill="#DBEAFE"
                fillOpacity="1"
                d="M0,180L0,160C160,292,390,244,480,213.3C840,43,800,52,960,78.7C1120,128,1280,160,1380,88L1440,40L1446,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,180,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className=" px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-4xl mb-3">🐾</div>
            <h3 className="font-bold text-lg mb-2">Digital Pet Passport</h3>
            <p className="text-gray-600 text-sm">
              Store all pet information in one secure place.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="font-bold text-lg mb-2">Health Dashboard</h3>
            <p className="text-gray-600 text-sm">
              Track weight, vaccines, and health records with ease.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-bold text-lg mb-2">Easy Booking</h3>
            <p className="text-gray-600 text-sm">
              Book services and appointments with trusted providers.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">Direct Messaging</h3>
            <p className="text-gray-600 text-sm">
              Chat with providers in real time for quick support.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 px-8 flex">
        <div>
          <h2 className="text-3xl font-bold text-center mb-2">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 font-semibold">
            Simple steps to better pet care
          </p>
          <div className="grid grid-cols-4 gap-6">
            {/* Pet Owners Steps */}
            <div className="pl-16">
              <h3 className="text-lg font-bold text-green-600 mb-6">
                For Pet Owners
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-md">Create an account</h4>
                    <p className="text-gray-600 text-xs">
                      Sign up and get started in seconds.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-md">
                      Find Trusted Providers
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Search and connect with verified service providers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-md">Book & Manage</h4>
                    <p className="text-gray-600 text-xs">
                      Book services and track your pet's care history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <img
              src="/petowner.png"
              alt="Pet owner with pets"
              className="h-62 object-contain"
            />

            {/* Service Providers Steps */}
            <div className="pl-16">
              <h3 className="text-lg font-bold text-blue-600 mb-6">
                For Service Providers
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-md">Create Your Profile</h4>
                    <p className="text-gray-600 text-xs">
                      Sign up and set up your services.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-md">Set Availability</h4>
                    <p className="text-gray-600 text-xs">
                      Choose your schedule and service areas.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-md">Manage & Grow</h4>
                    <p className="text-gray-600 text-xs">
                      Manage bookings and grow your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/serviceprovider.png"
                alt="Service provider with pet"
                className="h-62 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/*Providers */}
      <section id="providers" className="py-6 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto ">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Providers overview</h2>
            <p className="text-gray-600">Trusted by pet owners like you</p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              {
                name: "Jane Cooper",
                role: "Dog Walker",
                price: "$15/hr",
                image: "/profile1.jpg",
              },
              {
                name: "Robert Fox",
                role: "Pet Sitter",
                price: "$20/hr",
                image: "/profile2.jpg",
              },
              {
                name: "Cameron Williamson",
                role: "Veterinary Assistant",
                price: "$18/hr",
                image: "/profile3.jpg",
              },
              {
                name: "Brooklynn Simmons",
                role: "Pet Trainer",
                price: "$22/hr",
                image: "/profile4.jpg",
              },
            ].map((provider, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-blue-500">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{provider.role}</p>
                  <p className="text-gray-600 text-sm font-semibold mt-2">
                    {provider.price}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Loves {provider.role.toLowerCase()}s and nurturing
                    relationships.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            What Pet Parents Say
          </h2>

          <div className="grid grid-cols-3 gap-8 mb-8">
            {[
              {
                text: "PetConnect made it so easy to find a reliable dog walker. My dog loves it!",
                name: "Sarah Johnson",
                image: "/profile5.jpg",
              },
              {
                text: "I can track my cat's health and bookings all in one place. Amazing app!",
                name: "Michael Brown",
                image: "/profile6.jpg",
              },
              {
                text: "Best platform for pet care management. Highly recommended!",
                name: "Emily Davis",
                image: "/profile7.jpg",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-blue-100 rounded-lg p-6 shadow-sm flex gap-4"
              >
                <div className="flex-1">
                  <div className="text-5xl text-blue-600 leading-none mb-2">
                    "
                  </div>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                  <p className="text-gray-600 font-semibold text-sm">
                    — {testimonial.name}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className=" px-8">
        <div className="max-w-7xl mx-auto bg-blue-100 rounded-3xl px-12 py-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Ready to give your pet the best care?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of pet parents and service providers who trust
                PetConnect every day.
              </p>
              <a
                href="#home"
                className="px-16 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-bold text-lg"
              >
                Get Started Now
              </a>
            </div>
            <div className="text-6xl">🐕 ❤️ 🐱</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <span className="font-bold">PetConnect</span>
            </div>
            <p className="text-gray-400 text-sm">
              All your pet care in one place. Manage, connect, and give the best
              care for your furry family members.
            </p>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            © 2024 PetConnect. All rights reserved.
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: support@petconnect.com</li>
              <li>Phone: +43 (000) 0000-0000</li>
              <li>Address: mosstrasse 123, 5020 Salzburg</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
