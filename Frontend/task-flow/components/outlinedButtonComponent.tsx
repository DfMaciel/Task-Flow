import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

interface OutlinedButtonProps {
    text: string;
    onPress: () => void;
    textColor?: string;
}

export default function OutlinedButton ({text, onPress,textColor}: OutlinedButtonProps) {
    return (
        <Button 
            mode="outlined" 
            style={styles.buttonOutlined} 
            labelStyle={styles.buttonText}
            textColor={textColor}
            onPress={onPress}
        >
            {text}
        </Button>
    )
}

const styles = StyleSheet.create({
    buttonOutlined: {
        width: "100%",
        marginTop: 15,
        borderColor: "white"
    },
    buttonText: {
        fontSize: 15,  
        fontWeight: "bold"  
    }
});