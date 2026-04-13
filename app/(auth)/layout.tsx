import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-200">

      {/* ── Desktop: Left Hero Panel (hidden on mobile) ── */}
      <div className="relative flex-1 overflow-hidden hidden md:flex flex-col">
        <Image
          src="/login-hero.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 to-blue-900/30" />
        <div className="absolute top-6 left-6 z-10">
          <Image
            src="/idbilogo.png"
            alt="IDBI Intech"
            width={140}
            height={50}
            className="object-contain"
          />
        </div>
      </div>

      {/* ── Right Panel / Full screen on mobile ── */}
      <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col bg-[#0d1f4c] md:bg-gray-100">

        {/* ── Mobile-only: Logo bar at top ── */}
        <div className="md:hidden flex justify-center items-center pt-6 pb-4 px-6">
          <Image
            src="/idbilogo.png"
            alt="IDBI Intech"
            width={160}
            height={55}
            className="object-contain"
            priority
          />
        </div>

        {/* ── White card: slides over the navy banner ── */}
        <div
          className="flex-1 flex flex-col items-center justify-start bg-white rounded-t-3xl md:rounded-none md:bg-gray-100 md:justify-center px-8 py-10 shadow-[0_-4px_24px_rgba(0,0,0,0.10)] md:shadow-none overflow-y-auto " >
          {children}
        </div>

      </div>
    </div>
  );
}