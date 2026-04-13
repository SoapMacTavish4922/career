"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-[#e9e9e9] rounded-2xl mx-0.5 mt-1 shadow-lg border border-gray-200 ">
      <div className="max-w-[1250px] mx-auto px-6">

        <div className="flex items-center justify-between h-[70px]">

          <div>
            <Link href="/">
              <Image
                src="/idbilogo.png"
                alt="IDBI Intech"
                width={170}
                height={45}
                priority
              />
            </Link>
          </div>


          <nav className="hidden xl:flex items-center  gap-5">

            <Link
              href="/loginPage"  
              className="text-[13px] font-semibold uppercase tracking-[1px] text-gray-800 hover:text-[#F26F24] transition duration-300"
            >
              About
            </Link>

            <a
              href="/products-services"
              className="text-[13px] font-semibold uppercase tracking-[1px] text-gray-800 hover:text-[#F26F24] transition duration-300"
            >
              Product & Services
            </a>

            <a
              href="/blogs"
              className="text-[13px] font-semibold uppercase tracking-[1px] text-gray-800 hover:text-[#F26F24] "
            >
              Blogs
            </a>

            <a
              href="/career"
              className="text-[13px] font-semibold uppercase tracking-[1px] text-gray-800 hover:text-[#F26F24] "
            >
              Career
            </a>

            <a
              href="/contact"
              className="text-[13px] font-semibold uppercase tracking-[1px] text-gray-800 hover:text-[#F26F24] "
            >
              Contact Us
            </a>

          </nav>
          <div className="hidden xl:flex items-center gap-4">

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 "
            >
              <img src="/linkedin.svg" alt="LinkedIn" className="w-8 h-8" />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 "
            >
              <img src="/facebook.svg" alt="Facebook" className="w-8 h-8" />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 "
            >
              <img src="/instagram.svg" alt="Instagram" className="w-8 h-8" />
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 "
            >
              <img src="/youtube.svg" alt="YouTube" className="w-8 h-8" />
            </a>

            <a
              href="https://www.glassdoor.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 "
            >
              <img src="/glassdoor.svg" alt="Glassdoor" className="w-8 h-8" />
            </a>

          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          >
            <span
              className={`block w-6 h-[2px] bg-black transition-all ${open ? "rotate-45 translate-y-2" : ""
                }`}
            />
            <span
              className={`block w-6 h-[2px] bg-black transition-all ${open ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block w-6 h-[2px] bg-black transition-all ${open ? "-rotate-45 -translate-y-2" : ""
                }`}
            />
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white shadow-md transition-all duration-300 overflow-hidden ${open ? "max-h-[500px] py-6" : "max-h-0"
          }`}
      >
        <div className="flex flex-col items-center gap-6">

          <Link href="/about" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide">
            About
          </Link>

          <Link href="/products-services" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide">
            Product & Services
          </Link>

          <Link href="/blogs" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide">
            Blogs
          </Link>

          <Link href="/career" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide">
            Career
          </Link>

          <Link href="/contact" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide">
            Contact Us
          </Link>

        </div>
      </div>
    </header>
  );
}