// import React from "react";
// import { Card, Button } from "antd";
// import Image from "next/image";
// import Link from "next/link";
// import { useGetBlogs } from "../utils/store/server/blog/query";



// const BlogSection = () => {
//   const {data: blogPosts, loading:loading} = useGetBlogs();
//   return (
//     <section className="py-16  text-center">
//       <h2 className="text-4xl font-bold text-gray-800">Latest Blog Posts</h2>
//       <p className="text-gray-600 mt-2 mb-8">
//         Stay updated with expert tips and insights.
//       </p>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
//         {blogPosts.map((post, index) => (
//           <Card
//             key={index}
//             cover={
//               <div className="relative w-full h-48">
//                 <Image
//                   src={post.image}
//                   alt={post.title}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-t-lg"
//                 />
//               </div>
//             }
//             className="rounded-lg shadow-lg text-left flex flex-col h-full"
//           >
//             <h3 className="text-xl font-bold mt-4">{post.title}</h3>
//             <p className="text-gray-600 mt-2 flex-grow">{post.excerpt}</p>
//             <Link href={post.link}>
//               <Button
//                 type="primary"
//                 className="mt-4 bg-indigo-600 hover:bg-indigo-700"
//               >
//                 Read More
//               </Button>
//             </Link>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default BlogSection;
