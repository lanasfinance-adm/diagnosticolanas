import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQ = () => {
  const faqs = [
    {
      question: "O diagnóstico financeiro é realmente gratuito?",
      answer:
        "Sim, 100% gratuito! Nosso objetivo é ajudar você a entender sua situação financeira atual sem nenhum custo. Após o diagnóstico, você terá clareza sobre os próximos passos para organizar suas finanças.",
    },
    {
      question: "Quanto tempo leva para receber meu diagnóstico?",
      answer:
        "Após preencher o formulário, você receberá seu diagnóstico personalizado em até 24 horas por e-mail. Em casos de alta demanda, pode levar até 48 horas.",
    },
    {
      question: "Preciso ter conhecimento financeiro para participar?",
      answer:
        "Não! O diagnóstico é feito de forma simples e didática, independente do seu nível de conhecimento. Explicamos tudo de forma clara e acessível para que você entenda cada ponto da análise.",
    },
    {
      question: "Meus dados estão seguros?",
      answer:
        "Absolutamente. Utilizamos criptografia de ponta e seguimos todas as normas da LGPD. Seus dados nunca serão compartilhados com terceiros e são usados exclusivamente para elaborar seu diagnóstico.",
    },
    {
      question: "O que está incluso no diagnóstico financeiro?",
      answer:
        "O diagnóstico inclui: análise completa da sua situação atual, identificação de gastos desnecessários, sugestões de economia, plano de ação personalizado e uma consultoria gratuita de 30 minutos para tirar suas dúvidas.",
    },
    {
      question: "Posso fazer o diagnóstico mesmo estando endividado?",
      answer:
        "Sim, e na verdade é ainda mais importante! O diagnóstico vai te ajudar a entender como sair das dívidas de forma organizada e criar um plano realista para recuperar sua saúde financeira.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            Perguntas
            <span className="text-gradient-gold"> Frequentes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre o diagnóstico financeiro personalizado
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-gradient-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
