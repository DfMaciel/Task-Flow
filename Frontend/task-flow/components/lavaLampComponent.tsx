import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

interface LavaLampProps {
    size: number;
    left: number;
    delay: number;
    duration: number;
    startPosition: number;
    endPosition: number;
    color?: string; 
  }

export const LavaLamp = ({ size, left, delay, duration, startPosition, endPosition }: LavaLampProps ) => {
    const moveAnim = useRef(new Animated.Value(startPosition)).current;
    const sizeAnim = useRef(new Animated.Value(1)).current;
    
    useEffect(() => {
        const moveAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(moveAnim, {
              toValue: endPosition,
              duration: duration,
              delay: delay,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
            Animated.timing(moveAnim, {
              toValue: startPosition,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
        
        const sizeAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(sizeAnim, {
              toValue: 1.1,
              duration: 3000,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
            Animated.timing(sizeAnim, {
              toValue: 0.9,
              duration: 3000,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
          ])
        );

        moveAnimation.start();
        sizeAnimation.start();
      
        return () => {
            moveAnimation.stop();
            sizeAnimation.stop();
        };
    }, []);
        
    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.lavaLamp,
          {
            width: size,
            height: size * 1.2,
            left: `${left}%`,
            transform: [
              { translateY: moveAnim },
              { scale: sizeAnim }
            ],
            zIndex: 1,
          },
        ]}
      />
    );
  };

  const styles = StyleSheet.create({
    lavaLamp: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
});

