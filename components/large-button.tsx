import { Pressable, Text, View, Image } from "react-native";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface LargeButtonProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "success" | "error";
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
  iconSize?: number;
}

export function LargeButton({
  title,
  subtitle,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  iconSize = 48,
}: LargeButtonProps) {
  const handlePress = async () => {
    if (!disabled && !loading) {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-surface border border-border",
    success: "bg-success",
    error: "bg-error",
  };

  const textColor = {
    primary: "text-background",
    secondary: "text-foreground",
    success: "text-background",
    error: "text-background",
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
      ]}
    >
      <View
        className={cn(
          "rounded-2xl px-6 py-5 items-center justify-center min-h-20 gap-2",
          variantStyles[variant],
          disabled && "opacity-50"
        )}
      >
        {icon && (
          <Image
            source={icon}
            style={{
              width: iconSize,
              height: iconSize,
              resizeMode: "contain",
            }}
          />
        )}
        <Text className={cn("text-lg font-bold", textColor[variant])}>{title}</Text>
        {subtitle && <Text className={cn("text-sm mt-1", textColor[variant])}>{subtitle}</Text>}
      </View>
    </Pressable>
  );
}
