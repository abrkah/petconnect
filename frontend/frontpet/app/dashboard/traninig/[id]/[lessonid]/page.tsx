"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  useGetLessonMaterial,
  useGetLessonMaterialByOrder,
} from "@/app/utils/store/server/training/query";
import { useTnaManagementCoursePageStore } from "@/app/utils/uistate/fetures/training/managemnet/coursePage";

export default function LessonPage() {
  const { lessonId } = useTnaManagementCoursePageStore();
  const params = useParams();

  // Fetch current lesson material by lessonid route param
  const {
    data: materialData,
    isLoading,
    error,
  } = useGetLessonMaterial(params.lessonid);

  // Get current order number from the fetched material
  const currentOrder = materialData?.order;

  // Fetch next lesson material by lessonId and order + 1
  // Only enabled if lessonId and currentOrder exist
  const { data: nextMaterial, isLoading: isNextLoading } =
    useGetLessonMaterialByOrder(
      lessonId || "",
      currentOrder || 1,
      !!lessonId && !!currentOrder
    );
  
  console.log("nextMaterial", nextMaterial);
  if (isLoading) return <p>Loading...</p>;
  if (error || !materialData)
    return <p>Error loading material or not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-xl sm:px-12 py-10 mt-8 mb-16 max-w-7xl mx-auto"
    >
      {/* 🧼 Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-900 mb-6 tracking-tight">
        🧼 {materialData.name}
      </h1>

      {/* 🔍 Introduction */}
      <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl">
        {materialData.introduction || "No introduction available."}
      </p>

      {/* ✅ Objectives */}
      {materialData.objectives?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            ✅ Objectives
          </h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-800 leading-relaxed">
            {materialData.objectives.map((obj: string, i: number) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 🔄 Steps */}
      {materialData.steps?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6">
            🔄 Step-by-Step Process
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materialData.steps.map((step: string, index: number) => (
              <div
                key={index}
                className="bg-white border border-indigo-100 shadow-sm p-5 rounded-xl hover:shadow-lg transition"
              >
                <h4 className="text-indigo-700 font-semibold mb-2">
                  Step {index + 1}
                </h4>
                <p className="text-gray-700 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🖼️ Image */}
      {materialData?.imageUrl && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">🖼️ Image</h2>
          <div className="overflow-hidden rounded-xl border border-indigo-200 shadow-md max-h-[400px]">
            <img
              src={materialData.imageUrl}
              alt={materialData.imageCaption || "Material Image"}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
          {materialData.imageCaption && (
            <p className="text-sm text-indigo-500 italic mt-2">
              {materialData.imageCaption}
            </p>
          )}
        </section>
      )}

      {/* 🎥 Video */}
      {materialData.videoPath && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            🎥 Video Tutorial
          </h2>
          <div className="mx-auto w-full max-w-5xl rounded-2xl border border-indigo-200 shadow-xl overflow-hidden group relative">
            <div className="aspect-[16/9] relative">
              <iframe
                src={materialData.videoPath}
                title={materialData.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-2xl group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>
          {materialData.videoDescription && (
            <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-2xl">
              {materialData.videoDescription}
            </p>
          )}
        </section>
      )}

      {/* ⚠️ Safety Tip */}
      {materialData.safetyTipTitle && materialData.safetyTipContent && (
        <section className="mb-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
            <h3 className="text-yellow-800 font-semibold mb-1">
              {materialData.safetyTipTitle}
            </h3>
            <p className="text-yellow-700 leading-relaxed">
              {materialData.safetyTipContent}
            </p>
          </div>
        </section>
      )}

      {/* 📄 Resources */}
      {materialData.resources?.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            📄 Resources
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {materialData.resources.map(
              (res: { url: string; label: string }, i: number) => (
                <a
                  key={i}
                  href={res.url}
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow transition"
                >
                  {res.label}
                </a>
              )
            )}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 border-t pt-8">
        {/* TODO: Add previous material link here */}
        <Link href="/lessons/previous" passHref legacyBehavior>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 text-base font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-md transition"
          >
            ← Previous Lesson
          </motion.a>
        </Link>

        {nextMaterial ? (
          <Link
            href={`/dashboard/traninig/${params.id}/${nextMaterial.id}`}
            passHref
            legacyBehavior
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition"
            >
              Next Lesson →
            </motion.a>
          </Link>
        ) : (
          <button
            disabled
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold bg-gray-300 text-gray-600 rounded-lg shadow transition cursor-not-allowed"
          >
            End of Lesson
          </button>
        )}
      </div>
    </motion.div>
  );
}
