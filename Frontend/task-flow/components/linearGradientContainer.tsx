import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Dimensions, View, ViewStyle, StyleSheet } from "react-native";
import { LavaLamp } from "./lavaLampComponent";

const { height, width } = Dimensions.get('window');

interface GradientBackgroundProps {
    children: ReactNode;
    colors?: readonly [string, string, ...string[]];
    style?: ViewStyle;
    lavaLamp: boolean;
}

export default function GradientBackground({ children, colors = ["#6247aa", "#a594f9"], style, lavaLamp }: GradientBackgroundProps) {
    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={[style]}
        >
            {lavaLamp && (
                <View style={styles.lavaLampContainer}>
                    <LavaLamp size={25} left={15} delay={0} duration={15000} 
                            startPosition={height + 50} endPosition={-300} />
                    <LavaLamp size={35} left={65} delay={2000} duration={18000} 
                            startPosition={height + 100} endPosition={-350} />
                    <LavaLamp size={20} left={35} delay={5000} duration={12000} 
                            startPosition={height + 20} endPosition={-250} />
                    <LavaLamp size={30} left={80} delay={3000} duration={20000} 
                            startPosition={height + 150} endPosition={-400} />
                    <LavaLamp size={28} left={50} delay={7000} duration={17000} 
                            startPosition={height + 80} endPosition={-300} />
                    <LavaLamp size={22} left={20} delay={9000} duration={16000} 
                            startPosition={height + 200} endPosition={-270} />
                    <LavaLamp size={18} left={40} delay={11000} duration={14000} 
                            startPosition={height + 120} endPosition={-220} />
                    <LavaLamp size={15} left={75} delay={13000} duration={13000} 
                            startPosition={height + 170} endPosition={-230} />
                    <LavaLamp size={24} left={25} delay={8000} duration={19000} 
                            startPosition={height + 90} endPosition={-280} />
                </View>
              )}
            <View style={styles.contentWrapper}>
                {children}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    lavaLampContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        elevation: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        pointerEvents: 'none',
        overflow: 'visible', 
    },
    contentWrapper: {
        zIndex: 100, 
        elevation: 100,
        width: "100%",
        height: "100%",
        position: 'absolute',
    }
});