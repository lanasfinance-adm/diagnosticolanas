import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormData {
  name: string;
  email: string;
  phone: string;
  profession: string;
  professionOther: string;
  specialty: string;
  monthlyIncome: string;
  hasDebts: string;
  totalAssets: string;
  investments: string[];
  investmentsOther: string;
  financialChallenges: string[];
  challengesOther: string;
  mainObjective: string;
  urgencyLevel: string;
  contactPreference: string;
  availability: string;
  additionalComments: string;
}

const TOTAL_STEPS = 4;

const LeadForm = forwardRef<HTMLElement>((_, ref) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    profession: "",
    professionOther: "",
    specialty: "",
    monthlyIncome: "",
    hasDebts: "",
    totalAssets: "",
    investments: [],
    investmentsOther: "",
    financialChallenges: [],
    challengesOther: "",
    mainObjective: "",
    urgencyLevel: "",
    contactPreference: "",
    availability: "",
    additionalComments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsSubmitting(true);

    const finalProfession = formData.profession === "other" 
      ? formData.professionOther 
      : formData.profession;

    const finalInvestments = formData.investments.includes("other")
      ? [...formData.investments.filter(i => i !== "other"), formData.investmentsOther]
      : formData.investments;

    const finalChallenges = formData.financialChallenges.includes("other")
      ? [...formData.financialChallenges.filter(c => c !== "other"), formData.challengesOther]
      : formData.financialChallenges;

    try {
      const { error: insertError } = await supabase
        .from("leads")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          profession: finalProfession || null,
          specialty: formData.specialty || null,
          monthly_income: formData.monthlyIncome || null,
          has_debts: formData.hasDebts || null,
          total_assets: formData.totalAssets || null,
          investments: finalInvestments.length > 0 ? finalInvestments : null,
          financial_challenges: finalChallenges.length > 0 ? finalChallenges : null,
          main_objective: formData.mainObjective || null,
          urgency_level: formData.urgencyLevel || null,
          contact_preference: formData.contactPreference || null,
          availability: formData.availability || null,
          additional_comments: formData.additionalComments || null,
        });

      if (insertError) {
        console.error("Error saving lead:", insertError);
        throw new Error("Erro ao salvar dados");
      }

      const { error: emailError } = await supabase.functions.invoke(
        "send-lead-confirmation",
        { body: { name: formData.name, email: formData.email } }
      );

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      toast({
        title: "Diagnóstico Solicitado! 🎉",
        description: "Em breve você receberá seu diagnóstico personalizado por e-mail.",
      });

      setFormData({
        name: "", email: "", phone: "", profession: "", professionOther: "",
        specialty: "", monthlyIncome: "", hasDebts: "", totalAssets: "",
        investments: [], investmentsOther: "", financialChallenges: [],
        challengesOther: "", mainObjective: "", urgencyLevel: "",
        contactPreference: "", availability: "", additionalComments: "",
      });
      setCurrentStep(1);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRadioChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: "investments" | "financialChallenges", value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone && 
               (formData.profession && (formData.profession !== "other" || formData.professionOther)) && 
               formData.specialty;
      case 2:
        return formData.monthlyIncome && formData.hasDebts && formData.totalAssets;
      case 3:
        return formData.investments.length > 0 && formData.financialChallenges.length > 0 &&
               formData.financialChallenges.length <= 3 && formData.mainObjective;
      case 4:
        return formData.urgencyLevel && formData.contactPreference && formData.availability;
      default:
        return false;
    }
  };

  const incomeOptions = [
    { value: "ate_10k", label: "Até R$10.000" },
    { value: "10k_20k", label: "R$ 10.001 a R$ 20.000" },
    { value: "20k_50k", label: "R$ 20.001 a R$ 50.000" },
    { value: "50k_100k", label: "R$ 50.001 a R$ 100.000" },
    { value: "acima_100k", label: "Acima de R$ 100.000" },
  ];

  const debtOptions = [
    { value: "alto_custo", label: "Sim, de alto custo (juros altos)" },
    { value: "baixo_custo", label: "Sim, de baixo custo (juros baixos, como financiamento imobiliário)" },
    { value: "nao", label: "Não" },
  ];

  const assetOptions = [
    { value: "ate_300k", label: "Até R$ 300.000" },
    { value: "300k_1m", label: "R$ 301.000 a R$ 1.000.000" },
    { value: "1m_2m", label: "R$ 1.000.001 a R$ 2.000.000" },
    { value: "2m_5m", label: "R$ 2.000.001 a R$ 5.000.000" },
    { value: "acima_5m", label: "Acima de R$ 5.000.000" },
    { value: "nao_tenho", label: "Não tenho" },
  ];

  const investmentOptions = [
    { value: "poupanca", label: "Poupança" },
    { value: "renda_fixa", label: "Renda Fixa (CDB, LCI, LCA, Tesouro Direto)" },
    { value: "acoes", label: "Ações" },
    { value: "fundos", label: "Fundos de Investimentos (Multimercados, Ações, FIIs)" },
    { value: "previdencia", label: "Previdência Privada" },
    { value: "cripto", label: "Criptomoedas" },
    { value: "imoveis", label: "Imóveis (para investimento)" },
    { value: "nao_possuo", label: "Não possuo investimentos" },
    { value: "other", label: "Outros" },
  ];

  const challengeOptions = [
    { value: "impostos", label: "Pagar muitos impostos (PF e/ou PJ)" },
    { value: "organizacao", label: "Dificuldade em organizar finanças pessoais e da empresa/clínica" },
    { value: "investir", label: "Não saber onde e como investir para multiplicar o patrimônio" },
    { value: "protecao", label: "Preocupação com a proteção do patrimônio (blindagem)" },
    { value: "aposentadoria", label: "Falta de um plano claro para a aposentadoria" },
    { value: "sucessao", label: "Preocupação com a sucessão do negócio/clínica ou bens" },
    { value: "renda_passiva", label: "Gerar mais renda passiva" },
    { value: "other", label: "Outros" },
  ];

  const urgencyOptions = [
    { value: "muito_urgente", label: "Muito urgente (preciso de soluções rápidas)" },
    { value: "urgente", label: "Urgente (quero começar nos próximos 1-3 meses)" },
    { value: "moderado", label: "Moderado (estou pesquisando, mas sem pressa)" },
  ];

  const contactOptions = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "email", label: "E-mail" },
    { value: "ligacao", label: "Ligação telefônica" },
  ];

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
        <Input id="email" name="email" type="email" placeholder="Digite seu e-mail" value={formData.email} onChange={handleChange} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="name">1 - Nome Completo <span className="text-destructive">*</span></Label>
        <Input id="name" name="name" type="text" placeholder="Digite seu nome completo" value={formData.name} onChange={handleChange} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="phone">2 - Telefone/WhatsApp (com DDD) <span className="text-destructive">*</span></Label>
        <Input id="phone" name="phone" type="tel" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleChange} required className="mt-1" />
      </div>
      <div>
        <Label>3 - Profissão principal <span className="text-destructive">*</span></Label>
        <RadioGroup value={formData.profession} onValueChange={(v) => handleRadioChange("profession", v)} className="mt-2 space-y-2">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="empresario" id="empresario" />
            <Label htmlFor="empresario" className="cursor-pointer font-normal">Empresário(a)</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="medico" id="medico" />
            <Label htmlFor="medico" className="cursor-pointer font-normal">Médico(a)</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="other" id="prof_other" />
            <Label htmlFor="prof_other" className="cursor-pointer font-normal">Outros:</Label>
            {formData.profession === "other" && (
              <Input name="professionOther" placeholder="Especifique" value={formData.professionOther} onChange={handleChange} className="flex-1" />
            )}
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="specialty">4 - Qual sua área de atuação/especialidade? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mb-1">(Ex. Cirurgião, Advogado, TI, Comércio, etc.)</p>
        <Input id="specialty" name="specialty" placeholder="Digite sua área de atuação" value={formData.specialty} onChange={handleChange} required />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div>
        <Label>5 - Qual sua renda bruta mensal média? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mb-2">(somando PF e PJ, se aplicável)</p>
        <RadioGroup value={formData.monthlyIncome} onValueChange={(v) => handleRadioChange("monthlyIncome", v)} className="space-y-2">
          {incomeOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-3">
              <RadioGroupItem value={opt.value} id={`income_${opt.value}`} />
              <Label htmlFor={`income_${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label>6 - Você possui dívidas? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mb-2">(empréstimos, financiamentos, cartão de crédito, etc.)</p>
        <RadioGroup value={formData.hasDebts} onValueChange={(v) => handleRadioChange("hasDebts", v)} className="space-y-2">
          {debtOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-3">
              <RadioGroupItem value={opt.value} id={`debt_${opt.value}`} />
              <Label htmlFor={`debt_${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label>7 - Qual o valor aproximado do seu patrimônio total? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mb-2">(imóveis, investimentos, bens, etc.)</p>
        <RadioGroup value={formData.totalAssets} onValueChange={(v) => handleRadioChange("totalAssets", v)} className="space-y-2">
          {assetOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-3">
              <RadioGroupItem value={opt.value} id={`asset_${opt.value}`} />
              <Label htmlFor={`asset_${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div>
        <Label>8 - Você possui investimentos? Se sim, quais tipos? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mb-2">(Marque todas as opções aplicáveis)</p>
        <div className="space-y-2">
          {investmentOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-3">
              <Checkbox 
                id={`inv_${opt.value}`} 
                checked={formData.investments.includes(opt.value)}
                onCheckedChange={(checked) => handleCheckboxChange("investments", opt.value, checked as boolean)}
              />
              <Label htmlFor={`inv_${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
              {opt.value === "other" && formData.investments.includes("other") && (
                <Input name="investmentsOther" placeholder="Especifique" value={formData.investmentsOther} onChange={handleChange} className="flex-1" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>9 - Qual o seu maior desafio financeiro hoje? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mb-2">(Marque até 3 opções)</p>
        <div className="space-y-2">
          {challengeOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-3">
              <Checkbox 
                id={`chal_${opt.value}`} 
                checked={formData.financialChallenges.includes(opt.value)}
                disabled={formData.financialChallenges.length >= 3 && !formData.financialChallenges.includes(opt.value)}
                onCheckedChange={(checked) => handleCheckboxChange("financialChallenges", opt.value, checked as boolean)}
              />
              <Label htmlFor={`chal_${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
              {opt.value === "other" && formData.financialChallenges.includes("other") && (
                <Input name="challengesOther" placeholder="Especifique" value={formData.challengesOther} onChange={handleChange} className="flex-1" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="mainObjective">10 - Qual é o seu principal objetivo ao buscar um planejamento financeiro patrimonial? <span className="text-destructive">*</span></Label>
        <Textarea id="mainObjective" name="mainObjective" placeholder="Descreva seu objetivo" value={formData.mainObjective} onChange={handleChange} required className="mt-1" />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div>
        <Label>11 - Qual o seu nível de urgência para iniciar este planejamento? <span className="text-destructive">*</span></Label>
        <RadioGroup value={formData.urgencyLevel} onValueChange={(v) => handleRadioChange("urgencyLevel", v)} className="mt-2 space-y-2">
          {urgencyOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-3">
              <RadioGroupItem value={opt.value} id={`urg_${opt.value}`} />
              <Label htmlFor={`urg_${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label>12 - Preferencialmente, como você prefere ser contatado? <span className="text-destructive">*</span></Label>
        <RadioGroup value={formData.contactPreference} onValueChange={(v) => handleRadioChange("contactPreference", v)} className="mt-2 space-y-2">
          {contactOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-3">
              <RadioGroupItem value={opt.value} id={`contact_${opt.value}`} />
              <Label htmlFor={`contact_${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="availability">13 - Qual sua disponibilidade geral para call/reuniões? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mb-1">(Ex: Terças e Quintas à tarde, flexível)</p>
        <Input id="availability" name="availability" placeholder="Digite sua disponibilidade" value={formData.availability} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="additionalComments">14 - Há algo mais que você gostaria de compartilhar?</Label>
        <Textarea id="additionalComments" name="additionalComments" placeholder="Comentários adicionais (opcional)" value={formData.additionalComments} onChange={handleChange} className="mt-1" />
      </div>
    </div>
  );

  const guarantees = ["Diagnóstico 100% gratuito", "Sem compromisso", "Dados protegidos"];

  return (
    <section ref={ref} className="py-20 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Comece Agora</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Aplicação para Diagnóstico Financeiro Patrimonial</h2>
            <p className="text-muted-foreground">Preencha seus dados e receba uma análise personalizada da sua situação financeira</p>
          </motion.div>

          <motion.div className="p-8 rounded-2xl bg-gradient-card border border-border shadow-gold" initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }}>
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-8">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${i + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1 < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  {i < TOTAL_STEPS - 1 && <div className={`w-12 md:w-20 h-1 mx-1 transition-colors ${i + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  {currentStep === 4 && renderStep4()}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 mt-8">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                  </Button>
                )}
                <Button type="submit" variant="gold" size="xl" className="flex-1 group" disabled={!canProceed() || isSubmitting}>
                  {isSubmitting ? "Enviando..." : currentStep < TOTAL_STEPS ? (
                    <>Próximo <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <>Enviar Aplicação <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </div>
            </form>

            <motion.div className="mt-6 flex flex-wrap items-center justify-center gap-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.5 }}>
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{guarantee}</span>
                </div>
              ))}
            </motion.div>

            <motion.div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.6 }}>
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