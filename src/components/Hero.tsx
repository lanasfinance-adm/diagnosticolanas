import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "@/assets/lanas-logo.svg";

interface HeroProps {
  onCtaClick: () => void;
}

const Hero = ({ onCtaClick }: HeroProps) => {
  const benefits = [
    "Análise completa da sua situação financeira",
    "Plano de ação personalizado",
    "Consultoria gratuita de 30 minutos",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo */}
          <img 
            src={logo} 
            alt="Lana's" 
            className="h-16 md:h-20 mb-12 glow-gold"
          />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">100% Gratuito e Personalizado</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Descubra Como Organizar Suas
            <span className="text-gradient-gold block mt-2">
              Finanças em 7 Dias
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            Faça seu diagnóstico financeiro personalizado e receba um plano de ação 
            exclusivo para alcançar a liberdade financeira que você merece.
          </p>

          {/* Benefits list */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm text-foreground/80"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            variant="gold" 
            size="xl" 
            onClick={onCtaClick}
            className="group"
          >
            Quero Meu Diagnóstico Gratuito
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Trust indicator */}
          <p className="mt-6 text-sm text-muted-foreground">
            Mais de <span className="text-primary font-semibold">2.500+</span> pessoas já transformaram suas finanças
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
