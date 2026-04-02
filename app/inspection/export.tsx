import { View, Text, Pressable, Alert, ActivityIndicator, Share } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useInspection } from "@/lib/inspection-context";
import { ScreenContainer } from "@/components/screen-container";

export default function ExportScreen() {
  const router = useRouter();
  const { reset } = useInspection();
  const [loading, setLoading] = useState<string | null>(null);

  const handleShareText = async () => {
    setLoading("share");
    try {
      await Share.share({
        message: "Vistoria Check+ finalizada com sucesso!",
        title: "Compartilhar Vistoria",
      });
    } catch (e) {
      Alert.alert("Erro", "Não foi possível compartilhar.");
    } finally {
      setLoading(null);
    }
  };

  const handleNewInspection = () => {
    reset();
    router.replace("/");
  };

  return (
    <ScreenContainer className="p-6">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 24 }}>

        {/* Ícone de sucesso */}
        <View style={{ width: 80, height: 80, backgroundColor: "#dcfce7", borderRadius: 99, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 40 }}>✅</Text>
        </View>

        <View style={{ alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#111", textAlign: "center" }}>
            Vistoria Finalizada!
          </Text>
          <Text style={{ fontSize: 14, color: "#888", textAlign: "center" }}>
            Os dados foram salvos no aplicativo.
          </Text>
        </View>

        {/* Botões */}
        <View style={{ width: "100%", gap: 12 }}>
          <Pressable
            onPress={handleShareText}
            disabled={!!loading}
            style={{ backgroundColor: "#0a7ea4", borderRadius: 16, padding: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}
          >
            {loading === "share" ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                📤 Compartilhar
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleNewInspection}
            style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 16, padding: 16, alignItems: "center" }}
          >
            <Text style={{ color: "#0a7ea4", fontWeight: "600", fontSize: 15 }}>
              + Nova Vistoria
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
