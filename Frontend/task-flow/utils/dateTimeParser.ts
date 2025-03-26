export default function formatPrazo (prazo: string | undefined): string {
    if (prazo == undefined) return "Sem prazo definido"; 
    try {
        const [year, month, day] = prazo.split("-"); 
        return `${day}/${month}/${year}`; 
    } catch (error) {
        console.error("Erro ao formatar o prazo:", error);
        return prazo;
    }
};