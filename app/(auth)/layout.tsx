import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-200">

      {/* ── Desktop: Left Hero Panel (hidden on mobile) ── */}
      <div className="relative flex-1 overflow-hidden hidden lg:flex flex-col">
        <Image
          src="/hero2.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute top-6 left-6 z-10">
          <Image
            src="/white-intech-logo.png"
            alt="IDBI Intech"
            width={140}
            height={50}
            className="object-contain"
          />
        </div>
      </div>

      {/* ── Right Panel / Full screen on mobile ── */}
      <div
        className="
          w-full lg:w-[420px] shrink-0 flex flex-col
          bg-cover bg-center
          lg:bg-gray-100"
        style={{ backgroundImage: "url('/login-hero.jpg')" }}
      >
        {/* ── Mobile-only: Logo bar at top ── */}
        <div className="lg:hidden flex justify-center items-center pt-6 pb-4 px-6">
          <Image
            src="/white-intech-logo.png"
            alt="IDBI Intech"
            width={160}
            height={55}
            className="object-contain"
            priority
          />
        </div>

        {/* ── White card ── */}
        <div className="flex flex-col justify-center items-center w-[92%] bg-white rounded-2xl mx-auto lg:w-full lg:flex-1 lg:rounded-none lg:bg-gray-100 lg:justify-center px-8 py-10 shadow-[0_-4px_24px_rgba(0,0,0,0.10)] lg:shadow-none overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}