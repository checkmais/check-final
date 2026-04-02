import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { HistoryCard } from "@/components/history-card";
import { useInspection } from "@/lib/inspection-context";
import { getInspectionsList } from "@/lib/storage-service";

export default function HomeScreen() {
  const router = useRouter();
  const { setInspectionType } = useInspection();
  const [inspections, setInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadInspections();
    }, [])
  );

  const loadInspections = async () => {
    try {
      setIsLoading(true);
      const list = await getInspectionsList();
      // Ordenar por data mais recente primeiro
      const sorted = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInspections(sorted);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTechnicalInspection = () => {
    setInspectionType("technical");
    router.push("../inspection/client-data");
  };

  const handleSimpleInspection = () => {
    setInspectionType("simple");
    router.push("../inspection/client-data");
  };

  const handleRentalInspection = () => {
    setInspectionType("rental");
    router.push("../inspection/client-data");
  };

  const handleOpenInspection = (id: string) => {
    // TODO: Implementar abertura de vistoria existente
    console.log("Abrir vistoria:", id);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Check+ Vistorias</Text>
            <Text className="text-base text-muted text-center">
              Selecione o tipo de vistoria para começar
            </Text>
          </View>

          {/* Buttons */}
          <View className="gap-4">
            <LargeButton
              title="Vistoria Simples"
              subtitle="básica"
              onPress={handleSimpleInspection}
              variant="secondary"
              icon={require("@/assets/images/icon.png")}
              iconSize={56}
            />
            <LargeButton
              title="Vistoria Técnica"
              subtitle="com ART"
              onPress={handleTechnicalInspection}
              variant="primary"
              icon={require("@/assets/images/icon.png")}
              iconSize={56}
            />
            <LargeButton
              title="Vistoria para Locação"
              subtitle="aluguel"
              onPress={handleRentalInspection}
              variant="secondary"
              icon={require("@/assets/images/icon.png")}
              iconSize={56}
            />
          </View>

          {/* Info Section */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">ℹ️ Informações</Text>
            <Text className="text-xs text-muted leading-relaxed">
              O aplicativo funciona completamente offline. Todos os dados são armazenados localmente no seu dispositivo.
            </Text>
          </View>

          {/* History Section */}
          {isLoading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" />
            </View>
          ) : inspections.length > 0 ? (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Histórico de Vistorias</Text>
              {inspections.map((inspection) => (
                <HistoryCard
                  key={inspection.id}
                  type={inspection.type}
                  clientName={inspection.clientName}
                  date={new Date(inspection.createdAt).toLocaleDateString("pt-BR")}
                  onPress={() => handleOpenInspection(inspection.id)}
                />
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-muted text-center">Nenhuma vistoria realizada ainda</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
