import { View } from "react-native";

export default function ItemStatusCircle({ status }: { status: string }) {
    const getStatusDetails = (status: string) => {
        switch (status) {
            case "naoiniciada":
                return { cor: "#91e5e5", text: "Não inciada" };
            case "emandamento":
                return { cor: "#0032ff", text: "Em andamento" };
            case "concluida":
                return { cor: "#76d970", text: "Concluída" };
            default:
                return { cor: "gray", text: "Desconhecido" }; 
        }
    };

    const { cor } = getStatusDetails(status);

    return (
        <View style={{ backgroundColor: cor, borderRadius: 50, width: 20, height: 20 }} />
    );
}