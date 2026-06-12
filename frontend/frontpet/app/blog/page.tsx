import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <p className="text-slate-600 mb-4">Blog is not part of PetConnect MVP.</p>
      <Link href="/" className="text-teal-600 font-medium">
        Back home
      </Link>
    </div>
  );
}
