import Link from "next/link";
import Image from "next/image";


export default function Footer() {
    return (
        <>
            <footer>
                {/*Footer section with comp.Logo ISO and email-section*/}
                <div className="flex bg-[#343A40] w-full ">
                    <div className="flex-1 flex flex-col justify-center items-center text-white ">
                        <Link href="/">
                            <Image
                                src="/idbilogo.png"
                                alt="IDBI Intech"
                                width={170}
                                height={45}
                                priority
                            />
                        </Link>
                        iso
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-white px-4">
                        <p className="text-white self-start">Wee</p>
                        <div className="flex">
                            <input className="bg-white text-black p-2 w-sm" type="email" placeholder="Your Mail" />
                            <button className="bg-[#F26F24] px-4 py-2 ">Submit</button>
                        </div>
                    </div>
                </div>
                {/*main footer section */}

                {/* Main Footer Section */}
                <section className="w-full bg-gray-100 py-12 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">

                        {/* Connect With Us — col-span-4 */}
                        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-gray-900">Connect With Us</h3>

                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
                                    className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-gray-700 transition-colors">
                                    <img src="/linkedin.svg" alt="LinkedIn" className="w-4 h-4" />
                                </a>
                                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
                                    className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-gray-700 transition-colors">
                                    <img src="/facebook.svg" alt="Facebook" className="w-4 h-4" />
                                </a>
                                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                                    className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-gray-700 transition-colors">
                                    <img src="/instagram.svg" alt="Instagram" className="w-4 h-4" />
                                </a>
                                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"
                                    className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-gray-700 transition-colors">
                                    <img src="/youtube.svg" alt="YouTube" className="w-4 h-4" />
                                </a>
                                <a href="https://www.glassdoor.com/" target="_blank" rel="noopener noreferrer"
                                    className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-gray-700 transition-colors">
                                    <img src="/glassdoor.svg" alt="Glassdoor" className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Board Line */}
                            <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-bold text-gray-900">Board Line</h3>
                                <a href="tel:02261592300" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                    <img src="/phone.svg" alt="" className="w-4 h-4" />
                                    022 6159 2300
                                </a>
                            </div>

                            {/* Business Development */}
                            <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-bold text-gray-900">Business Development</h3>
                                <a href="tel:+919152781613" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                    <img src="/phone.svg" alt="" className="w-4 h-4" />
                                    (+91) 9152 781 613
                                </a>
                                <a href="mailto:business.solutions@idbiintech.com"
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 break-all">
                                    <img src="/email.svg" alt="" className="w-4 h-4" />
                                    business.solutions@idbiintech.com
                                </a>
                            </div>
                        </div>

                        {/* Digital Solutions — col-span-2 */}
                        <div className="col-span-12 md:col-span-2 flex flex-col gap-3">
                            <h3 className="text-sm font-bold text-gray-900">Digital Solutions</h3>
                            <ul className="flex flex-col gap-2">
                                {[
                                    { label: "Combating Financial Crime with Reg Tech", href: "/anti-money-laundering" },
                                    { label: "Digital Customer Experience & Journey", href: "/digital-customer-experience" },
                                    { label: "Payments Transformation", href: "/payments-transformation" },
                                ].map((item) => (
                                    <li key={item.href}>
                                        <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 hover:underline leading-snug">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Innovative Products — col-span-3 */}
                        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
                            <h3 className="text-sm font-bold text-gray-900">Innovative Products</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <ul className="flex flex-col gap-2">
                                    {[
                                        { label: "i - AML", href: "/i-aml" },
                                        { label: "i - Recon", href: "/i-recon" },
                                        { label: "i - ERM", href: "/i-erm" },
                                        { label: "i@Connect", href: "/i-connect" },
                                    ].map((item) => (
                                        <li key={item.href}>
                                            <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="flex flex-col gap-2">
                                    {[
                                        { label: "i - IRAC", href: "/i-irac" },
                                        { label: "i - GLMS", href: "/i-glms" },
                                    ].map((item) => (
                                        <li key={item.href}>
                                            <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Quick Links — col-span-3 */}
                        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
                            <h3 className="text-sm font-bold text-gray-900">Quick Links</h3>
                            <ul className="flex flex-col gap-2">
                                {[
                                    { label: "Notices & Tenders", href: "/notices-tenders" },
                                    { label: "Press Releases", href: "/press-releases" },
                                    { label: "Blogs & Events", href: "/blogs-events" },
                                    { label: "Career", href: "/careers" },
                                    { label: "About IDBI Intech", href: "/about-us" },
                                    { label: "Certifications", href: "/certifications" },
                                    { label: "CSR", href: "/csr" },
                                ].map((item) => (
                                    <li key={item.href}>
                                        <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </section>

                {/*Sitemap/Dec/Regis.No section */}
                <div className="flex w-full">
                    <div className="flex-1 flex bg-[#343A40] h-6 justify-center items-center text-white">
                        <div>
                            <Link className="text-xs" href="/">Sitemap | </Link>
                            <Link className="text-xs" href="/">Disclaimer | </Link>
                            <Link className="text-xs" href="/">RTI | </Link>
                            <Link className="text-xs" href="/">Compliance | </Link>
                            <Link className="text-xs" href="/">Notices and Tenders</Link>
                        </div>
                    </div>

                    <div className="flex-1 flex bg-[#343A40] h-6 justify-center items-center text-white text-xs">
                        IDBI Intech Ltd. CIN No. U72200MH2000GOI124665
                    </div>
                </div>


            </footer>
        </>


    )
}
