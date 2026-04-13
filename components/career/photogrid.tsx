import Image from "next/image";
export default function PhotoGrid(){
    return (
        <>
            <div className="grid grid-cols-12 auto-rows-[1fr] gap-6 min-h-screen p-6 overflow-hidden  ">
                <div className="col-span-2 bg-sky-600 rounded-xl overflow-hidden relative border-[2] border-[#00a4a6]"> <Image src="/wwe2.jpg" alt="Teamwork" fill className="object-cover" /> </div>
                <div className="col-span-8 row-span-2 bg-sky-600 overflow-hidden rounded-xl relative border-[2] border-[#00a4a6]"><Image src="/wwe2.jpg" alt="Teamwork" fill className="object-cover" /></div>
                <div className="col-span-2 row-span-2 bg-sky-600 overflow-hidden rounded-xl relative border-[2] border-[#00a4a6]"><Image src="/wwe2.jpg" alt="Teamwork" fill className="object-cover" /></div>
                <div className="col-span-2 bg-sky-600 rounded-xl overflow-hidden relative border-[2] border-[#00a4a6]"><Image src="/wwe2.jpg" alt="Teamwork" fill className="object-cover" /></div>
                <div className="col-span-3 bg-sky-600 rounded-xl overflow-hidden relative border-[2] border-[#00a4a6]"><Image src="/wwe2.jpg" alt="Teamwork" fill className="object-cover" /></div>
                <div className="col-span-6 bg-sky-600 rounded-xl overflow-hidden relative border-[2] border-[#00a4a6]"><Image src="/wwe2.jpg" alt="Teamwork" fill className="object-cover" /></div>
                <div className="col-span-3 bg-sky-600 rounded-xl overflow-hidden relative border-[2] border-[#00a4a6]"><Image src="/wwe2.jpg" alt="Teamwork" fill className="object-cover" /></div>
            </div>
        </>
    );
}