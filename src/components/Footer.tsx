import logo from "@/assets/lanas-logo.svg";

const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <img src={logo} alt="Lana's" className="h-10 mb-6 opacity-80" />

          {/* Copyright */}
          <p className="text-muted-foreground text-sm mb-4">
            © {new Date().getFullYear()} Lana's. Todos os direitos reservados.
          </p>

          {/* Legal links */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
