import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeadFormProps {
  formRef: React.RefObject<HTMLDivElement>;
}

const LeadForm = ({ formRef }: LeadFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Diagnóstico Solicitado! 🎉",
      description: "Em breve você receberá seu diagnóstico personalizado por e-mail.",
    });

    setFormData({ name: "", email: "", phone: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const guarantees = [
    "Diagnóstico 100% gratuito",
    "Sem compromisso",
    "Dados protegidos",
  ];

  return (
    <section ref={formRef} className="py-20 bg-gradient-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Comece Agora
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Receba Seu Diagnóstico
              <span className="text-gradient-gold block">Financeiro Gratuito</span>
            </h2>
            <p className="text-muted-foreground">
              Preencha seus dados e receba uma análise personalizada da sua situação financeira
            </p>
          </div>

          {/* Form card */}
          <div className="p-8 rounded-2xl bg-gradient-card border border-border shadow-gold">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Seu Nome Completo
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Digite seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Seu Melhor E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  WhatsApp (opcional)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="xl"
                className="w-full group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    Quero Meu Diagnóstico Gratuito
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Guarantees */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{guarantee}</span>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5" />
              <span>Seus dados estão seguros e nunca serão compartilhados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
