import Hero from "@/components/sections/Hero";
import Sobre from "@/components/sections/Sobre";
import Servicos from "@/components/sections/Servicos";
import Processo from "@/components/sections/Processo";
import Cases from "@/components/sections/Cases";
import CTABand from "@/components/sections/CTABand";
import Contato from "@/components/sections/Contato";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Sobre />
      <Servicos />
      <Processo />
      <Cases />
      <CTABand />
      <Contato />
    </main>
  );
}
