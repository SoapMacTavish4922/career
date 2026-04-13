import Image from "next/image";
export default function TeamPart() {
  return (
    <>
      <section className="relative overflow-hidden bg-orange-500 text-white px-16 py-24 min-h-[350px]">

        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400 rounded-full opacity-60"></div>
        <div className="absolute -bottom-40 -right-10 w-96 h-96 bg-emerald-500 rounded-full opacity-80"></div>

        <div className="relative z-10 flex justify-between items-center gap-12">

          <div className="flex-1">
            <h2 className="text-5xl font-bold leading-tight">
              Be a part of IDBI Intech Team
            </h2>
          </div>

          <div className="flex-1 max-w-xl">
            <p className="leading-relaxed text-white/90">
              We are a leading provider of technology solutions for the banking and financial services industry with a commitment to providing a dynamic and innovative work culture that nurtures talent and provides a platform for growth. Come be a part of our team - bring your ideas and innovate to make a difference. IDBI Intech is committed to providing its employees with a supportive and collaborative work environment and offers various benefits.
            </p>

            <button className="mt-6 bg-emerald-600 px-6 py-3 rounded-md shadow-md hover:bg-emerald-700 transition">
              See Job Openings
            </button>
          </div>

        </div>
      </section>
      <div className="flex">
        <div className="flex-1/3 ">
          <Image src="/wwe2.jpg" alt="123"  width={130} height={40}/>
        </div>
        <div className="flex-2/3 ">
          <Image src="/wwe2.jpg" alt="123"  width={130} height={40}/>
        </div>
      </div>
    </>
  );
}