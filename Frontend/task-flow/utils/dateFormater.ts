export default function formatDateTime(dateString: string | undefined) {
    if (dateString == undefined) return '';

    const date = new Date(dateString);

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) + ', ' + 
    date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};