import { ScrollView, View, Text, Pressable, TextInput, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";
import { SUGGESTED_ROOMS, SUGGESTED_EXTERNAL_AREAS, AreaType } from "@/lib/checklist-data";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function RoomSelectionScreen() {
  const router = useRouter();
  const { state } = useInspection();
  const [areaType, setAreaType] = useState<AreaType | null>(null);
  const [roomName, setRoomName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = areaType === "internal" ? SUGGESTED_ROOMS : SUGGESTED_EXTERNAL_AREAS;
  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(roomName.toLowerCase())
  );

  const handleSelectSuggestion = (suggestion: string) => {
    setRoomName(suggestion);
    setShowSuggestions(false);
  };

  const handleNext = async () => {
    if (!areaType || !roomName.trim()) {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Passar dados para a próxima tela via router params
    router.push({
      pathname: "/inspection/items",
      params: {
        areaType,
        roomName: roomName.trim(),
      },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Novo Cômodo</Text>
            <Text className="text-sm text-muted">Selecione o tipo de área e identifique o cômodo</Text>
          </View>

          {/* Area Type Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Tipo de Área</Text>
            <View className="gap-2">
              <Pressable
                onPress={() => {
                  setAreaType("internal");
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: areaType === "internal" ? "#0a7ea4" : "#f5f5f5",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: areaType === "internal" ? "#0a7ea4" : "#e5e7eb",
                  },
                ]}
              >
                <Text
                  style={{
                    color: areaType === "internal" ? "white" : "#333",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Área Interna
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setAreaType("external");
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: areaType === "external" ? "#0a7ea4" : "#f5f5f5",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: areaType === "external" ? "#0a7ea4" : "#e5e7eb",
                  },
                ]}
              >
                <Text
                  style={{
                    color: areaType === "external" ? "white" : "#333",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Área Externa
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Room Name Input */}
          {areaType && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">
                {areaType === "internal" ? "Identificação do Cômodo" : "Identificação da Área"}
              </Text>

              <TextInput
                placeholder={
                  areaType === "internal"
                    ? "Ex: Sala de Estar, Cozinha..."
                    : "Ex: Fachada Principal, Terraço..."
                }
                value={roomName}
                onChangeText={(text) => {
                  setRoomName(text);
                  setShowSuggestions(text.length > 0);
                }}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
              />

              {/* Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <View className="border border-border rounded-lg bg-surface overflow-hidden">
                  <FlatList
                    scrollEnabled={false}
                    data={filteredSuggestions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => handleSelectSuggestion(item)}
                        style={({ pressed }) => [
                          {
                            opacity: pressed ? 0.7 : 1,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: "#e5e7eb",
                          },
                        ]}
                      >
                        <Text className="text-foreground">{item}</Text>
                      </Pressable>
                    )}
                  />
                </View>
              )}
            </View>
          )}

          {/* Info Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-xs text-blue-900">
              ℹ️ Você poderá adicionar mais cômodos após finalizar este. Cada cômodo terá seu próprio
              checklist.
            </Text>
          </View>

          {/* Navigation Buttons */}
          <View className="gap-3 mt-4">
            <LargeButton
              title="Iniciar Checklist"
              onPress={handleNext}
              variant="primary"
              disabled={!areaType || !roomName.trim()}
            />
            <Pressable onPress={() => router.back()}>
              <Text className="text-center text-primary font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
