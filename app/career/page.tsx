import Hero from "@/components/career/Hero";
import Navbar from "@/components/navbar";
import ValuesSection from "@/components/career/valueSection";
import TeamPart from "@/components/career/teamPart";
import PhotoGrid from "@/components/career/photogrid";
import Footer from "@/components/footer";

export default function CareerPage() {
  return (
    <>
      <Navbar/>
      <Hero />
      <ValuesSection />
      <PhotoGrid/>
      <TeamPart />
      <Footer/>
    </>
  );
}   