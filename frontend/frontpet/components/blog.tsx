"use client";

import React from "react";
import { Card, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetBlogs } from "@/app/utils/store/server/blog/query";

const BlogSection = () => {
  const { data: blogPosts = [], isLoading } = useGetBlogs();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-indigo-600 font-semibold text-lg">
        Loading blog posts...
      </div>
    );
  }

  return (
    <section
      className="relative w-full 
   border border-blue-100 dark:border-neutral-700 
    rounded-2xl
    dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 
    overflow-hidden pb-20 pt-24 px-6 md:px-12 
    transition-all duration-500 
    hover:shadow-[0_8px_40px_rgba(59,130,246,0.4)] 
    hover:-translate-y-1 
    hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100 hover:to-blue-50"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-indigo-700"
      >
        Latest Blog Posts
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-gray-600 mt-2 mb-12"
      >
        Stay updated with expert tips and insights.
      </motion.p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card
              className="rounded-lg shadow-lg flex flex-col h-full"
              styles={{
                body: {
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                },
              }}
              cover={
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              }
            >
              <h3 className="text-xl font-bold mt-2 text-gray-900">
                {post.title}
              </h3>
              <p className="text-gray-600 mt-2 flex-grow">{post.description}</p>
              <Link href={`/blogs/${post.id}`}>
                <Button
                  type="primary"
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  Read More
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
