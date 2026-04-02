import { View, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useColors } from "@/hooks/use-colors";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, type, visible, onHide, duration = 3000 }: ToastProps) {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "#10B981"
      : type === "error"
        ? "#EF4444"
        : "#3B82F6";

  const icon =
    type === "success"
      ? "✓"
      : type === "error"
        ? "✕"
        : "ℹ";

  return (
    <Animated.View
      style={{
        opacity,
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: bgColor,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {icon}
        </Text>
        <Text style={{ color: "white", fontSize: 14, flex: 1 }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
