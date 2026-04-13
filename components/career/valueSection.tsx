"use client";

import Image from "next/image";

export default function ValuesSection() {
  return (
    <section className="w-full bg-[#FEFEFE] py-20">
      <div className="max-w-[1250px] mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          
          <div className="bg-white border-[2] border-[#f26522] rounded-2xl p-10 text-center hover:shadow-md transition duration-300">
            <div className="flex justify-center mb-6">
              <Image src="/innovation.svg" alt="Innovation" width={70} height={70}  />
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Focused on developing AI-powered, next-generation technologies
              and digital solutions to provide a competitive edge to clients.
            </p>
          </div>

          
          <div className="bg-white border-[2] border-[#f26522] rounded-2xl p-10 text-center hover:shadow-md transition duration-300">
            <div className="flex justify-center mb-6">
              <Image src="/agility.svg" alt="Execution" width={70} height={70} />
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Emphasizing rapid, time-to-value execution and scalable,
              elastic, cloud-based Banking as a Service (BaaS) to adapt to
              changing financial landscapes.
            </p>
          </div>

          
          <div className="bg-white border-[2] border-[#f26522] rounded-2xl p-10 text-center hover:shadow-md transition duration-300">
            <div className="flex justify-center mb-6">
              <Image src="/icon3.svg" alt="Values" width={70} height={70} />
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Built on core values of Integrity, Intelligence, and Ingenuity
              to foster a collaborative and high-performing environment.
            </p>
          </div>

          
          <div className="bg-white border-[2] border-[#f26522] rounded-2xl p-10 text-center hover:shadow-md transition duration-300">
            <div className="flex justify-center mb-6">
              <Image src="/icon4.svg" alt="Teamwork" width={70} height={70} />
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Promoting teamwork, regular ideation, and partnership-driven
              approaches to ensure seamless, end-to-end service delivery to
              customers.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}