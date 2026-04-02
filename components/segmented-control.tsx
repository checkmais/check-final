import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface SegmentedControlProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  label?: string;
}

export function SegmentedControl({
  options,
  selectedValue,
  onValueChange,
  label,
}: SegmentedControlProps) {
  const handlePress = async (value: string) => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange(value);
  };

  return (
    <View className="gap-2">
      {label && <Text className="text-sm font-semibold text-foreground">{label}</Text>}
      <View className="flex-row gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <Pressable
              key={option}
              onPress={() => handlePress(option)}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="flex-1"
            >
              <View
                className={cn(
                  "py-3 px-3 rounded-lg items-center justify-center",
                  isSelected ? "bg-primary" : "bg-surface border border-border"
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-background" : "text-foreground"
                  )}
                  numberOfLines={1}
                >
                  {option}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
