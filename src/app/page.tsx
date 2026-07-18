import Preloader from "@/components/Preloader";
import AmbientBackground from "@/components/AmbientBackground";
import CustomCursor from "@/components/CustomCursor";
import CursorGlow from "@/components/CursorGlow";
import Nav from "@/components/Nav";
import JsonLd from "@/components/JsonLd";
import KgmHome from "@/components/KgmHome";
import LandingCopilot from "@/components/copilot/LandingCopilot";
import { faqSchema, organizationSchema, serviceSchema } from "@/lib/structuredData";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="theme-light relative min-h-screen w-full overflow-clip">
      <JsonLd data={[organizationSchema(), serviceSchema(), faqSchema()]} />
      <Preloader />
      <AmbientBackground theme="light" />
      <CursorGlow />
      <CustomCursor />
      <Nav />
      <main id="top" className="relative z-10 w-full">
        <KgmHome />
        <Footer />
      </main>
      <LandingCopilot />
    </div>
  );
}
