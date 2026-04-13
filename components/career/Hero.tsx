"use client";

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-[calc(100vh-70px)] bg-cover bg-right flex items-center md:w-full min-h-[calc(100vh-70px)] bg-cover bg-right flex items-center"
      style={{ backgroundImage: "url('/hero_image_1920.jpg')" }}
    >
     
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
      <div className="relative z-10 max-w-[1250px] mx-auto px-6 w-full">
        <div className="max-w-[560px] text-white">

          <h1 className="text-5xl md:text-[56px] font-bold leading-[1.1] mb-6">
            Make an Impact
          </h1>

          <p className="text-gray-200 text-[16px] leading-[1.7] mb-10">
            The world is changing with accelerating scale and complexity.<br />
            This is your opportunity to explore a future with a multidisciplinary
            professional services organisation that leads with purpose,
            solving complex issues for our clients and communities.
          </p>

          <a
            href="/career"
            className="inline-block bg-[#00a4a6] hover:bg-[#008a8c] transition duration-300 text-white px-8 py-3.5 rounded text-[15px] font-medium"
          >
            See Job Openings
          </a>

        </div>
      </div>
    </section>
  );
}