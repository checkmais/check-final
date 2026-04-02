import { ScrollView, View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";
import { useState } from "react";
import { saveInspection } from "@/lib/storage-service";
import * as FileSystem from "expo-file-system";

export default function SummaryScreen() {
  const router = useRouter();
  const { state } = useInspection();
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    client: true,
    vistoriador: true,
    conditions: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleEditSection = (section: string) => {
    if (section === "client" || section === "vistoriador") {
      router.push("/inspection/client-data");
    } else if (section === "conditions") {
      router.push("/inspection/conditions");
    }
  };

  const handleFinalize = async () => {
    setSaving(true);
    try {
      // 1. Salvar vistoria (cria pasta e metadata.json)
      const saved = await saveInspection(state);

      // 2. Copiar fotos para pasta permanente
      const photosDir = `${saved.folderPath}/fotos`;
      await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });

      let photoCount = 0;
      for (const item of state.items) {
        for (const photo of item.photos) {
          try {
            const ext = photo.uri.split(".").pop() || "jpg";
            const fileName = `${item.id}_${photo.id}.${ext}`;
            const dest = `${photosDir}/${fileName}`;
            await FileSystem.copyAsync({ from: photo.uri, to: dest });
            photoCount++;
          } catch (e) {
            console.warn("Erro ao copiar foto:", e);
          }
        }
      }

      setSaving(false);
      Alert.alert(
        "✅ Vistoria Salva!",
        `Vistoria salva com sucesso!\n${photoCount > 0 ? `${photoCount} foto(s) salva(s) no celular.` : "Nenhuma foto anexada."}`,
        [{ text: "OK", onPress: () => router.push("/inspection/export") }]
      );
    } catch (error) {
      setSaving(false);
      Alert.alert(
        "Erro ao salvar",
        "Não foi possível salvar a vistoria. Tente novamente.",
        [{ text: "OK" }]
      );
      console.error("Erro ao finalizar:", error);
    }
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>
      <Pressable onPress={() => toggleSection(section)} style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>{title}</Text>
          <Text style={{ fontSize: 20, color: "#0a7ea4" }}>{expandedSections[section] ? "−" : "+"}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => handleEditSection(section)}
        style={{ marginLeft: 8, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: "#0a7ea4", borderRadius: 99 }}
      >
        <Text style={{ fontSize: 12, fontWeight: "600", color: "white" }}>Editar</Text>
      </Pressable>
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" }}>
      <Text style={{ fontSize: 13, color: "#888", flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "500", color: "#111", flex: 1, textAlign: "right" }}>{value || "—"}</Text>
    </View>
  );

  const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <View style={{ backgroundColor: "#f9fafb", borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: "#e5e7eb", gap: 2 }}>
      {children}
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 20, paddingBottom: 24 }}>
          {/* Header */}
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#111" }}>Resumo da Vistoria</Text>
            <Text style={{ fontSize: 13, color: "#888" }}>Etapa 4 de 4 — Revise antes de finalizar</Text>
          </View>

          {/* Cliente */}
          <View style={{ gap: 8 }}>
            <SectionHeader title="Cliente (Contratante)" section="client" />
            {expandedSections.client && (
              <SectionCard>
                <InfoRow label="Nome" value={state.client.fullName} />
                <InfoRow label="CPF/CNPJ" value={state.client.document} />
                <InfoRow label="Email" value={state.client.email} />
                <InfoRow label="Telefone" value={state.client.phone} />
                <InfoRow label="Endereço" value={`${state.client.address.street}, ${state.client.address.number}${state.client.address.complement ? ` - ${state.client.address.complement}` : ""}`} />
                <InfoRow label="Bairro" value={state.client.address.neighborhood} />
                <InfoRow label="Cidade/UF" value={`${state.client.address.city} - ${state.client.address.state}`} />
                <InfoRow label="CEP" value={state.client.address.cep} />
              </SectionCard>
            )}
          </View>

          {/* Vistoriador */}
          <View style={{ gap: 8 }}>
            <SectionHeader title="Vistoriador (Contratada)" section="vistoriador" />
            {expandedSections.vistoriador && (
              <SectionCard>
                <InfoRow label="Nome" value={state.vistoriador.name} />
                <InfoRow label="CPF/CNPJ" value={state.vistoriador.document} />
                <InfoRow label="Email" value={state.vistoriador.email} />
                <InfoRow label="Telefone" value={state.vistoriador.phone} />
                <InfoRow label="Endereço" value={`${state.vistoriador.address.street}, ${state.vistoriador.address.number}${state.vistoriador.address.complement ? ` - ${state.vistoriador.address.complement}` : ""}`} />
                <InfoRow label="Bairro" value={state.vistoriador.address.neighborhood} />
                <InfoRow label="Cidade/UF" value={`${state.vistoriador.address.city} - ${state.vistoriador.address.state}`} />
                {state.type === "technical" && (
                  <>
                    <InfoRow label="CREA" value={state.vistoriador.crea || ""} />
                    <InfoRow label="CAU" value={state.vistoriador.cau || ""} />
                  </>
                )}
              </SectionCard>
            )}
          </View>

          {/* Condições */}
          <View style={{ gap: 8 }}>
            <SectionHeader title="Condições da Vistoria" section="conditions" />
            {expandedSections.conditions && (
              <SectionCard>
                <InfoRow label="Data" value={state.conditions.date} />
                <InfoRow label="Hora" value={state.conditions.time} />
                <InfoRow label="Clima" value={{
                  sunny: "Ensolarado",
                  cloudy: "Nublado",
                  rainy: "Chuvoso",
                  partly_cloudy: "Parcialmente nublado",
                }[state.conditions.weather] || ""} />
                <InfoRow label="Acesso" value={{
                  total: "Total",
                  partial: "Parcial",
                  restricted: "Restrito",
                }[state.conditions.access] || ""} />
                <InfoRow label="Iluminação" value={{
                  adequate: "Adequada",
                  partial: "Parcial",
                  insufficient: "Insuficiente",
                }[state.conditions.lighting] || ""} />
                <InfoRow label="Ocupação" value={{
                  empty: "Desocupado",
                  occupied: "Ocupado",
                  under_construction: "Em obra",
                }[state.conditions.occupancy] || ""} />
              </SectionCard>
            )}
          </View>

          {/* Itens */}
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>Itens Vistoriados</Text>
              <Pressable onPress={() => router.push("/inspection/room-selection")} style={{ paddingHorizontal: 12, paddingVertical: 4, backgroundColor: "#0a7ea4", borderRadius: 99 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "white" }}>+ Adicionar</Text>
              </Pressable>
            </View>
            <SectionCard>
              {state.items.length === 0 ? (
                <Text style={{ fontSize: 13, color: "#888", textAlign: "center", paddingVertical: 8 }}>
                  Nenhum item vistoriado ainda
                </Text>
              ) : (
                <>
                  <InfoRow label="Total de itens" value={String(state.items.length)} />
                  <InfoRow label="Aprovados" value={String(state.items.filter(i => i.status === "approved").length)} />
                  <InfoRow label="Reprovados" value={String(state.items.filter(i => i.status === "rejected").length)} />
                  <InfoRow label="N/A" value={String(state.items.filter(i => i.status === "na").length)} />
                  <InfoRow label="Fotos" value={String(state.items.reduce((acc, i) => acc + i.photos.length, 0))} />
                </>
              )}
            </SectionCard>
          </View>

          {/* Botões */}
          <View style={{ gap: 12, marginTop: 8 }}>
            {saving ? (
              <View style={{ backgroundColor: "#0a7ea4", borderRadius: 16, padding: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
                <ActivityIndicator color="white" size="small" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>Salvando vistoria...</Text>
              </View>
            ) : (
              <LargeButton title="✅ Finalizar e Salvar" onPress={handleFinalize} variant="success" />
            )}
            <Pressable onPress={() => router.back()} style={{ alignItems: "center", padding: 10 }}>
              <Text style={{ color: "#0a7ea4", fontWeight: "600", fontSize: 14 }}>Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
