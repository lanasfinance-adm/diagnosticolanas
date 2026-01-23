import { Target, TrendingUp, Shield, Clock, Award, Users } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Target,
      title: "Clareza Total",
      description: "Entenda exatamente para onde vai cada centavo do seu dinheiro",
    },
    {
      icon: TrendingUp,
      title: "Estratégias Comprovadas",
      description: "Métodos testados por milhares de pessoas que já conquistaram a liberdade financeira",
    },
    {
      icon: Shield,
      title: "Segurança Financeira",
      description: "Construa uma reserva de emergência e proteja sua família",
    },
    {
      icon: Clock,
      title: "Resultados Rápidos",
      description: "Veja mudanças reais nas suas finanças em apenas 7 dias",
    },
    {
      icon: Award,
      title: "Plano Personalizado",
      description: "Estratégias adaptadas à sua realidade e objetivos específicos",
    },
    {
      icon: Users,
      title: "Suporte Dedicado",
      description: "Acompanhamento individual para tirar todas as suas dúvidas",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Por Que Fazer o Diagnóstico
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            Transforme Sua Relação Com o
            <span className="text-gradient-gold"> Dinheiro</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Descubra os benefícios que nossos clientes mais valorizam
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
