export default function dateComparer(filtroPrazo: string, tarefaPrazo?: string, dataPersonalizada?: string | null) : boolean | undefined {
    const hoje = new Date();
      const prazoTarefa = tarefaPrazo ? new Date(tarefaPrazo) : null;

      if (!prazoTarefa) return false;

      if (filtroPrazo === 'HOJE') {
        if (
          prazoTarefa.getDate() !== hoje.getDate() ||
          prazoTarefa.getMonth() !== hoje.getMonth() ||
          prazoTarefa.getFullYear() !== hoje.getFullYear()
        ) {
          return false;
        }
      } else if (filtroPrazo === 'SEMANA') {
        const firstDayOfWeek = new Date(hoje);
        firstDayOfWeek.setDate(hoje.getDate() - hoje.getDay());
        const lastDayOfWeek = new Date(hoje);
        lastDayOfWeek.setDate(hoje.getDate() + (6 - hoje.getDay()));
        if (prazoTarefa < firstDayOfWeek || prazoTarefa > lastDayOfWeek) {
          return false;
        }
      } else if (filtroPrazo === 'MES') {
        if (
          prazoTarefa.getMonth() !== hoje.getMonth() ||
          prazoTarefa.getFullYear() !== hoje.getFullYear()
        ) {
          return false;
        }
      } else if (filtroPrazo === 'PERSONALIZADO' && dataPersonalizada) {
        const personalizada = new Date(dataPersonalizada);
        if (
          prazoTarefa.getDate() !== personalizada.getDate() ||
          prazoTarefa.getMonth() !== personalizada.getMonth() ||
          prazoTarefa.getFullYear() !== personalizada.getFullYear()
        ) {
          return false;
        }
      }
      
    return true;
}