export interface Lembrete {
    id: string;
    titulo: string;
    descricao?: string;
    dataHora: string;
    frequencia: 'nenhuma' | 'diaria' | 'semanal' | 'mensal'
    diasSemana?: number[];
    diaMes?: number;
    notificationIds?: string[];
}

export interface CriarLembrete {
    titulo: string;
    descricao?: string;
    dataHora: string;
    frequencia: 'nenhuma' | 'diaria' | 'semanal' | 'mensal';
    diasSemana?: number[];
    diaMes?: number;
}