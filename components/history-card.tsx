import { View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface HistoryCardProps {
  type: "technical" | "delivery";
  clientName: string;
  date: string;
  onPress: () => void;
}

export function HistoryCard({ type, clientName, date, onPress }: HistoryCardProps) {
  const colors = useColors();
  const typeLabel = type === "technical" ? "Técnica" : "Entrega de Chaves";
  const typeColor = type === "technical" ? "bg-blue-100" : "bg-green-100";
  const typeTextColor = type === "technical" ? "text-blue-700" : "text-green-700";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className={`${typeColor} rounded-lg p-4 mb-3 border border-gray-200`}>
        <View className="flex-row justify-between items-start mb-2">
          <Text className={`${typeTextColor} font-semibold text-sm`}>{typeLabel}</Text>
          <Text className="text-xs text-gray-500">{date}</Text>
        </View>
        <Text className="text-foreground font-semibold text-base">{clientName}</Text>
      </View>
    </Pressable>
  );
}
