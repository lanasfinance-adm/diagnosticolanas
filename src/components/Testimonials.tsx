import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empresária",
      content:
        "Em apenas 2 meses consegui organizar todas as minhas finanças e criar minha primeira reserva de emergência. O diagnóstico foi o primeiro passo!",
      rating: 5,
    },
    {
      name: "Carlos Santos",
      role: "Médico",
      content:
        "Sempre ganhei bem, mas nunca sobrava dinheiro. O diagnóstico me mostrou exatamente onde eu estava errando. Hoje invisto 30% do que ganho.",
      rating: 5,
    },
    {
      name: "Ana Oliveira",
      role: "Professora",
      content:
        "Achei que com meu salário seria impossível investir. O plano personalizado me provou o contrário. Já estou montando minha carteira de investimentos!",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            Histórias de
            <span className="text-gradient-gold"> Transformação</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja o que nossos clientes dizem sobre o diagnóstico financeiro
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
