import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { FormInput } from "@/components/form-input";
import { LargeButton } from "@/components/large-button";
import { Toast } from "@/components/toast";
import { useInspection } from "@/lib/inspection-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ConditionsScreen() {
  const router = useRouter();
  const { state, updateConditions } = useInspection();
  const [showToast, setShowToast] = useState(false);

  const handleNext = async () => {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowToast(true);
    setTimeout(() => {
      router.push("../inspection/room-selection");
    }, 500);
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
            <Text className="text-2xl font-bold text-foreground">Condições da Vistoria</Text>
            <Text className="text-sm text-muted">Etapa 2 de 4</Text>
          </View>

          {/* Date and Time */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Data e Hora</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  label="Data"
                  placeholder="DD/MM/YYYY"
                  value={state.conditions.date}
                  onChangeText={(text) => updateConditions({ date: text })}
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Hora"
                  placeholder="HH:MM"
                  value={state.conditions.time}
                  onChangeText={(text) => updateConditions({ time: text })}
                />
              </View>
            </View>
          </View>

          {/* Weather */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Clima</Text>
            <View className="flex-row gap-2 flex-wrap">
              {["sunny", "cloudy", "rainy", "partly_cloudy"].map((weather) => (
                <Pressable
                  key={weather}
                  onPress={() => updateConditions({ weather: weather as any })}
                  className={`px-4 py-2 rounded-full border ${
                    state.conditions.weather === weather
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={
                      state.conditions.weather === weather
                        ? "text-background font-semibold"
                        : "text-foreground"
                    }
                  >
                    {weather === "sunny"
                      ? "Ensolarado"
                      : weather === "cloudy"
                      ? "Nublado"
                      : weather === "rainy"
                      ? "Chuvoso"
                      : "Parcialmente Nublado"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Access */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Acesso</Text>
            <View className="flex-row gap-2 flex-wrap">
              {["total", "partial", "restricted"].map((access) => (
                <Pressable
                  key={access}
                  onPress={() => updateConditions({ access: access as any })}
                  className={`px-4 py-2 rounded-full border ${
                    state.conditions.access === access
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={
                      state.conditions.access === access
                        ? "text-background font-semibold"
                        : "text-foreground"
                    }
                  >
                    {access === "total"
                      ? "Total"
                      : access === "partial"
                      ? "Parcial"
                      : "Restrito"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Lighting */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Iluminação</Text>
            <View className="flex-row gap-2 flex-wrap">
              {["adequate", "partial", "insufficient"].map((lighting) => (
                <Pressable
                  key={lighting}
                  onPress={() => updateConditions({ lighting: lighting as any })}
                  className={`px-4 py-2 rounded-full border ${
                    state.conditions.lighting === lighting
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={
                      state.conditions.lighting === lighting
                        ? "text-background font-semibold"
                        : "text-foreground"
                    }
                  >
                    {lighting === "adequate"
                      ? "Adequada"
                      : lighting === "partial"
                      ? "Parcial"
                      : "Insuficiente"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Occupancy */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Ocupação</Text>
            <View className="flex-row gap-2 flex-wrap">
              {["empty", "occupied", "under_construction"].map((occupancy) => (
                <Pressable
                  key={occupancy}
                  onPress={() => updateConditions({ occupancy: occupancy as any })}
                  className={`px-4 py-2 rounded-full border ${
                    state.conditions.occupancy === occupancy
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={
                      state.conditions.occupancy === occupancy
                        ? "text-background font-semibold"
                        : "text-foreground"
                    }
                  >
                    {occupancy === "empty"
                      ? "Vazio"
                      : occupancy === "occupied"
                      ? "Ocupado"
                      : "Em Reforma"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Navigation Buttons */}
          <View className="gap-3 mt-4">
            <LargeButton title="Próximo" onPress={handleNext} variant="primary" />
            <Pressable onPress={() => router.back()}>
              <Text className="text-center text-primary font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Toast 
        message="Condições salvas com sucesso!" 
        type="success" 
        visible={showToast} 
        onHide={() => setShowToast(false)} 
      />
    </ScreenContainer>
  );
}
