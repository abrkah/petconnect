"use client";

export default function LegacyConsultancyPage() {
  return (
    <div className="p-8 text-center text-slate-600">
      This legacy route is not used in PetConnect. Use{" "}
      <a href="/owner" className="text-teal-600">
        /owner
      </a>{" "}
      or{" "}
      <a href="/provider" className="text-teal-600">
        /provider
      </a>
      .
    </div>
  );
}
