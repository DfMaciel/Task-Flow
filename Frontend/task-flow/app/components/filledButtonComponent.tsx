import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

interface FilledButtonProps {
    text: string;
    onPress: () => void;
    color?: string;
    textColor?: string;
}

export default function FilledButton ({text, onPress, color, textColor}: FilledButtonProps) {
    return (
        <Button 
            mode="contained" 
            style={styles.buttonFilled}
            labelStyle={styles.buttonText}
            buttonColor={color}
            textColor={textColor}
            onPress={onPress}> 
            {text}
        </Button>
    )
}

const styles = StyleSheet.create({
    buttonFilled: {
        width: "100%",
    },
    buttonText: {
        fontSize: 15,  
        fontWeight: "bold"  
    }
});