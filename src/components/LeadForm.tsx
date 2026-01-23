import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const LeadForm = forwardRef<HTMLElement>((_, ref) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    professionOther: "",
    specialty: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalProfession = formData.profession === "other" 
      ? formData.professionOther 
      : formData.profession;

    try {
      // Save lead to database
      const { error: insertError } = await supabase
        .from("leads")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          profession: finalProfession || null,
          specialty: formData.specialty || null,
        });

      if (insertError) {
        console.error("Error saving lead:", insertError);
        throw new Error("Erro ao salvar dados");
      }

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke(
        "send-lead-confirmation",
        {
          body: {
            name: formData.name,
            email: formData.email,
          },
        }
      );

      if (emailError) {
        console.error("Error sending email:", emailError);
        // Don't throw - lead was saved, email is secondary
      }

      toast({
        title: "Diagnóstico Solicitado! 🎉",
        description: "Em breve você receberá seu diagnóstico personalizado por e-mail.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        profession: "",
        professionOther: "",
        specialty: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfessionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      profession: value,
      professionOther: value !== "other" ? "" : prev.professionOther,
    }));
  };

  const guarantees = ["Diagnóstico 100% gratuito", "Sem compromisso", "Dados protegidos"];

  const formFields = [
    { id: "name", label: "1 - Nome Completo", type: "text", placeholder: "Digite seu nome completo", required: true },
    { id: "email", label: "E-mail", type: "email", placeholder: "Digite seu e-mail", required: true },
    { id: "phone", label: "2 - Telefone/WhatsApp (com DDD)", type: "tel", placeholder: "(00) 00000-0000", required: true },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Comece Agora
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Receba seu diagnóstico Financeiro Gratuito
            </h2>
            <p className="text-muted-foreground">
              Preencha seus dados e receba uma análise personalizada da sua situação financeira
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            className="p-8 rounded-2xl bg-gradient-card border border-border shadow-gold"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Text fields */}
              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <label htmlFor={field.id} className="block text-sm font-medium mb-2">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleChange}
                    required={field.required}
                  />
                </motion.div>
              ))}

              {/* Profession Radio Group */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label className="block text-sm font-medium mb-3">
                  3 - Profissão principal <span className="text-destructive">*</span>
                </label>
                <RadioGroup
                  value={formData.profession}
                  onValueChange={handleProfessionChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="empresario" id="empresario" />
                    <Label htmlFor="empresario" className="cursor-pointer">Empresário(a)</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="medico" id="medico" />
                    <Label htmlFor="medico" className="cursor-pointer">Médico(a)</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Outros:</Label>
                    {formData.profession === "other" && (
                      <Input
                        name="professionOther"
                        type="text"
                        placeholder="Especifique"
                        value={formData.professionOther}
                        onChange={handleChange}
                        className="flex-1 ml-2"
                        required
                      />
                    )}
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Specialty field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <label htmlFor="specialty" className="block text-sm font-medium mb-2">
                  4 - Qual sua área de atuação/especialidade? <span className="text-destructive">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  (Ex. Cirurgião, Advogado, TI, Comércio, etc.)
                </p>
                <Input
                  id="specialty"
                  name="specialty"
                  type="text"
                  placeholder="Digite sua área de atuação"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full group"
                  disabled={isSubmitting || !formData.profession}
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
              </motion.div>
            </form>

            {/* Guarantees */}
            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{guarantee}</span>
                </div>
              ))}
            </motion.div>

            {/* Security note */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Seus dados estão seguros e nunca serão compartilhados</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

LeadForm.displayName = "LeadForm";
export default LeadForm;
