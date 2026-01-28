import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const labelMap: Record<string, string> = {
  // Income
  "ate_10k": "Até R$10.000",
  "10k_20k": "R$ 10.001 a R$ 20.000",
  "20k_50k": "R$ 20.001 a R$ 50.000",
  "50k_100k": "R$ 50.001 a R$ 100.000",
  "acima_100k": "Acima de R$ 100.000",
  // Debts
  "alto_custo": "Sim, de alto custo (juros altos)",
  "baixo_custo": "Sim, de baixo custo (juros baixos)",
  "nao": "Não",
  // Assets
  "ate_300k": "Até R$ 300.000",
  "300k_1m": "R$ 301.000 a R$ 1.000.000",
  "1m_2m": "R$ 1.000.001 a R$ 2.000.000",
  "2m_5m": "R$ 2.000.001 a R$ 5.000.000",
  "acima_5m": "Acima de R$ 5.000.000",
  "nao_tenho": "Não tenho",
  // Investments
  "poupanca": "Poupança",
  "renda_fixa": "Renda Fixa (CDB, LCI, LCA, Tesouro Direto)",
  "acoes": "Ações",
  "fundos": "Fundos de Investimentos",
  "previdencia": "Previdência Privada",
  "cripto": "Criptomoedas",
  "imoveis": "Imóveis (para investimento)",
  "nao_possuo": "Não possuo investimentos",
  // Challenges
  "impostos": "Pagar muitos impostos",
  "organizacao": "Dificuldade em organizar finanças",
  "investir": "Não saber onde/como investir",
  "protecao": "Proteção do patrimônio",
  "aposentadoria": "Falta de plano para aposentadoria",
  "sucessao": "Preocupação com sucessão",
  "renda_passiva": "Gerar mais renda passiva",
  // Urgency
  "muito_urgente": "Muito urgente",
  "urgente": "Urgente",
  "moderado": "Moderado",
  // Contact
  "whatsapp": "WhatsApp",
  "email": "E-mail",
  "ligacao": "Ligação telefônica",
  // Profession
  "empresario": "Empresário(a)",
  "medico": "Médico(a)",
};

const getLabel = (value: string | null | undefined): string => {
  if (!value) return "-";
  return labelMap[value] || value;
};

const getLabels = (values: string[] | null | undefined): string => {
  if (!values || values.length === 0) return "-";
  return values.map(v => labelMap[v] || v).join(", ");
};

const LeadDetailDialog = ({ lead, open, onOpenChange }: LeadDetailDialogProps) => {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Diagnóstico</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Personal Info */}
            <section>
              <h3 className="text-sm font-semibold text-primary mb-3">Informações Pessoais</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Nome:</span>
                  <p className="font-medium">{lead.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">E-mail:</span>
                  <p className="font-medium">{lead.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Telefone:</span>
                  <p className="font-medium">{lead.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span>
                  <p className="font-medium">
                    {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Professional Info */}
            <section>
              <h3 className="text-sm font-semibold text-primary mb-3">Informações Profissionais</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Profissão:</span>
                  <p className="font-medium">{getLabel(lead.profession)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Especialidade:</span>
                  <p className="font-medium">{lead.specialty || "-"}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Financial Info */}
            <section>
              <h3 className="text-sm font-semibold text-primary mb-3">Situação Financeira</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Renda bruta mensal:</span>
                  <p className="font-medium">{getLabel(lead.monthly_income)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Possui dívidas:</span>
                  <p className="font-medium">{getLabel(lead.has_debts)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Patrimônio total:</span>
                  <p className="font-medium">{getLabel(lead.total_assets)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Investimentos:</span>
                  <p className="font-medium">{getLabels(lead.investments)}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Goals & Challenges */}
            <section>
              <h3 className="text-sm font-semibold text-primary mb-3">Desafios e Objetivos</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Maiores desafios financeiros:</span>
                  <p className="font-medium">{getLabels(lead.financial_challenges)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Objetivo principal:</span>
                  <p className="font-medium">{lead.main_objective || "-"}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Contact Preferences */}
            <section>
              <h3 className="text-sm font-semibold text-primary mb-3">Preferências de Contato</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Nível de urgência:</span>
                  <p className="font-medium">{getLabel(lead.urgency_level)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Forma de contato:</span>
                  <p className="font-medium">{getLabel(lead.contact_preference)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Disponibilidade:</span>
                  <p className="font-medium">{lead.availability || "-"}</p>
                </div>
              </div>
            </section>

            {lead.additional_comments && (
              <>
                <Separator />
                <section>
                  <h3 className="text-sm font-semibold text-primary mb-3">Comentários Adicionais</h3>
                  <p className="text-sm">{lead.additional_comments}</p>
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
