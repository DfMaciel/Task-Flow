import { Text } from "react-native";

export default function TitleTextComponent(props: { text: string, color: string }) {
    return <Text style={{ fontSize: 40, fontWeight: "bold", color: props.color }}>{props.text}</Text>;
}