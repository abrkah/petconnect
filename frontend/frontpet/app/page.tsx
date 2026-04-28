"use client";

import React from "react";
import { Layout } from "antd";
import FooterComponent from "@/components/footer";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/testimonial";

const { Content } = Layout;

const LandingPage = () => {
  return (
    <Layout
      className="min-h-screen bg-slate-100"
      style={{ minHeight: "100vh" }}
    >
      <Content className="pb-12">
      <HeroSection />

        <main className="max-w-7xl mx-auto px-6 md:px-8">
          <section id="testimonials" className="pt-16 scroll-mt-28">
            <TestimonialsSection />
          </section>
        </main>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default LandingPage;
