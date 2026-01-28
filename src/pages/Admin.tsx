import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, LogOut, RefreshCw, Users, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import lanasLogo from "@/assets/lanas-logo.svg";
import LeadDetailDialog from "@/components/LeadDetailDialog";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

const Admin = () => {
  const { user, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/admin/login");
      } else if (!isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
        signOut();
        navigate("/admin/login");
      }
    }
  }, [user, authLoading, isAdmin, navigate, signOut, toast]);

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchLeads();
    }
  }, [user, isAdmin]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      toast({
        title: "Nenhum dado",
        description: "Não há leads para exportar.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Data", "Nome", "E-mail", "Telefone", "Profissão", "Especialidade",
      "Renda Mensal", "Possui Dívidas", "Patrimônio Total", "Investimentos",
      "Desafios Financeiros", "Objetivo Principal", "Nível de Urgência",
      "Preferência de Contato", "Disponibilidade", "Comentários"
    ];

    const rows = leads.map(lead => [
      format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      lead.name,
      lead.email,
      lead.phone || "",
      lead.profession || "",
      lead.specialty || "",
      lead.monthly_income || "",
      lead.has_debts || "",
      lead.total_assets || "",
      (lead.investments || []).join("; "),
      (lead.financial_challenges || []).join("; "),
      lead.main_objective || "",
      lead.urgency_level || "",
      lead.contact_preference || "",
      lead.availability || "",
      lead.additional_comments || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: `${leads.length} leads exportados com sucesso.`,
    });
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={lanasLogo} alt="Lanas" className="h-8" />
            <span className="text-lg font-semibold text-foreground">Painel Admin</span>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Diagnósticos Recebidos</h1>
            <p className="text-muted-foreground mt-1">
              {leads.length} {leads.length === 1 ? "lead registrado" : "leads registrados"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchLeads} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button variant="gold" onClick={exportToCSV} disabled={leads.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Leads
            </CardTitle>
            <CardDescription>
              Clique em um lead para ver os detalhes completos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum diagnóstico recebido ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Profissão</TableHead>
                      <TableHead>Urgência</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone || "-"}</TableCell>
                        <TableCell>{lead.profession || "-"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            lead.urgency_level === "muito_urgente" 
                              ? "bg-destructive/20 text-destructive"
                              : lead.urgency_level === "urgente"
                              ? "bg-amber-500/20 text-amber-600"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {lead.urgency_level === "muito_urgente" ? "Muito Urgente" 
                              : lead.urgency_level === "urgente" ? "Urgente" 
                              : lead.urgency_level === "moderado" ? "Moderado" 
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <LeadDetailDialog 
        lead={selectedLead} 
        open={!!selectedLead} 
        onOpenChange={(open) => !open && setSelectedLead(null)} 
      />
    </div>
  );
};

export default Admin;
