import { ScrollView, View, Text, Pressable, TextInput, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";
import {
  INTERNAL_CHECKLIST,
  EXTERNAL_CHECKLIST,
  ChecklistSection,
  TestItem,
  TestStatus,
  PhotoWithCaption,
} from "@/lib/checklist-data";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ItemsScreen() {
  const router = useRouter();
  const { areaType, roomName } = useLocalSearchParams<{ areaType: string; roomName: string }>();
  const { state, saveRoom } = useInspection();

  const baseChecklist = areaType === "internal" ? INTERNAL_CHECKLIST : EXTERNAL_CHECKLIST;

  const [sections, setSections] = useState<ChecklistSection[]>(
    baseChecklist.map((section) => ({
      ...section,
      tests: section.tests.map((test) => ({ ...test, photos: [] })),
    }))
  );
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0]?.id || null);
  const [observations, setObservations] = useState("");

  // Marca todos os itens de uma seção como N/A
  const markSectionAsNA = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, tests: section.tests.map((test) => ({ ...test, status: "na" as TestStatus })) }
          : section
      )
    );
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const updatePhotoCaption = (sectionId: string, testId: string, photoId: string, caption: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tests: section.tests.map((test) =>
                test.id === testId
                  ? {
                      ...test,
                      photos: test.photos.map((p) =>
                        p.id === photoId ? { ...p, caption } : p
                      ),
                    }
                  : test
              ),
            }
          : section
      )
    );
  };

  const updateTestStatus = (sectionId: string, testId: string, status: TestStatus) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tests: section.tests.map((test) =>
                test.id === testId ? { ...test, status } : test
              ),
            }
          : section
      )
    );
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const addPhoto = async (sectionId: string, testId: string) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const newPhoto: PhotoWithCaption = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        caption: "",
        timestamp: new Date().toISOString(),
      };
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                tests: section.tests.map((test) =>
                  test.id === testId
                    ? { ...test, photos: [...test.photos, newPhoto] }
                    : test
                ),
              }
            : section
        )
      );
    }
  };

  const removePhoto = (sectionId: string, testId: string, photoId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tests: section.tests.map((test) =>
                test.id === testId
                  ? { ...test, photos: test.photos.filter((p) => p.id !== photoId) }
                  : test
              ),
            }
          : section
      )
    );
  };

  const getSectionSummary = (section: ChecklistSection) => {
    const approved = section.tests.filter((t) => t.status === "approved").length;
    const rejected = section.tests.filter((t) => t.status === "rejected").length;
    const na = section.tests.filter((t) => t.status === "na").length;
    const pending = section.tests.filter((t) => t.status === "pending").length;
    return { approved, rejected, na, pending, total: section.tests.length };
  };

  const getTotalSummary = () => {
    const allTests = sections.flatMap((s) => s.tests);
    return {
      approved: allTests.filter((t) => t.status === "approved").length,
      rejected: allTests.filter((t) => t.status === "rejected").length,
      na: allTests.filter((t) => t.status === "na").length,
      pending: allTests.filter((t) => t.status === "pending").length,
      total: allTests.length,
    };
  };

  const handleNext = async () => {
    const rejectedWithoutPhoto = sections
      .flatMap((s) => s.tests)
      .find((t) => t.status === "rejected" && t.photos.length === 0);

    if (rejectedWithoutPhoto) {
      Alert.alert(
        "Foto obrigatória",
        `O item "${rejectedWithoutPhoto.description}" está reprovado. Adicione pelo menos 1 foto.`
      );
      return;
    }

    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Salvar cômodo completo no contexto global
    saveRoom({
      id: `${areaType}_${roomName}_${Date.now()}`,
      roomName: roomName as string,
      areaType: areaType as "internal" | "external",
      sections,
      observations,
      createdAt: new Date().toISOString(),
    });

    router.push("/inspection/summary");
  };

  const summary = getTotalSummary();

  const statusConfig: Record<TestStatus, { label: string; bg: string; text: string; activeBg: string }> = {
    pending:  { label: "Pendente",  bg: "#f5f5f5", text: "#888",    activeBg: "#f5f5f5" },
    approved: { label: "Aprovado",  bg: "#f5f5f5", text: "#666",    activeBg: "#16a34a" },
    rejected: { label: "Reprovado", bg: "#f5f5f5", text: "#666",    activeBg: "#dc2626" },
    na:       { label: "N/A",       bg: "#f5f5f5", text: "#666",    activeBg: "#9ca3af" },
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header fixo */}
      <View style={{ padding: 16, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb" }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#111" }}>{roomName}</Text>
        <Text style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
          {areaType === "internal" ? "Área Interna" : "Área Externa"} • Etapa 3 de 4
        </Text>

        {/* Resumo rápido */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          {[
            { label: "Aprovados", value: summary.approved, color: "#16a34a", bg: "#dcfce7" },
            { label: "Reprovados", value: summary.rejected, color: "#dc2626", bg: "#fee2e2" },
            { label: "Pendentes", value: summary.pending, color: "#d97706", bg: "#fef3c7" },
            { label: "N/A", value: summary.na, color: "#6b7280", bg: "#f3f4f6" },
          ].map((item) => (
            <View
              key={item.label}
              style={{ flex: 1, backgroundColor: item.bg, borderRadius: 8, padding: 6, alignItems: "center" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: item.color }}>{item.value}</Text>
              <Text style={{ fontSize: 9, color: item.color, marginTop: 1 }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => {
          const sectionSummary = getSectionSummary(section);
          const isExpanded = expandedSection === section.id;

          return (
            <View
              key={section.id}
              style={{
                marginBottom: 10,
                borderWidth: 0.5,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Header da seção */}
              <Pressable
                onPress={() => setExpandedSection(isExpanded ? null : section.id)}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, backgroundColor: "#f9fafb" }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#111" }}>{section.title}</Text>
                  <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                    {sectionSummary.approved > 0 && (
                      <Text style={{ fontSize: 10, color: "#16a34a" }}>✓ {sectionSummary.approved}</Text>
                    )}
                    {sectionSummary.rejected > 0 && (
                      <Text style={{ fontSize: 10, color: "#dc2626" }}>✗ {sectionSummary.rejected}</Text>
                    )}
                    {sectionSummary.pending > 0 && (
                      <Text style={{ fontSize: 10, color: "#d97706" }}>⏳ {sectionSummary.pending}</Text>
                    )}
                    {sectionSummary.na > 0 && (
                      <Text style={{ fontSize: 10, color: "#9ca3af" }}>N/A {sectionSummary.na}</Text>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Pressable
                    onPress={() => markSectionAsNA(section.id)}
                    style={{
                      paddingHorizontal: 10, paddingVertical: 4,
                      backgroundColor: sectionSummary.na === sectionSummary.total ? "#9ca3af" : "#f3f4f6",
                      borderRadius: 99, borderWidth: 0.5,
                      borderColor: sectionSummary.na === sectionSummary.total ? "#9ca3af" : "#e5e7eb",
                    }}
                  >
                    <Text style={{
                      fontSize: 11, fontWeight: "600",
                      color: sectionSummary.na === sectionSummary.total ? "white" : "#6b7280",
                    }}>
                      N/A Tudo
                    </Text>
                  </Pressable>
                  <Text style={{ fontSize: 12, color: "#9ca3af" }}>{isExpanded ? "▲" : "▼"}</Text>
                </View>
              </Pressable>

              {/* Itens da seção */}
              {isExpanded && (
                <View style={{ padding: 10, gap: 12 }}>
                  {section.tests.map((test, index) => (
                    <View
                      key={test.id}
                      style={{
                        paddingBottom: 12,
                        borderBottomWidth: index < section.tests.length - 1 ? 0.5 : 0,
                        borderBottomColor: "#f0f0f0",
                      }}
                    >
                      {/* Descrição do item */}
                      <Text style={{ fontSize: 13, color: "#333", marginBottom: 8, lineHeight: 18 }}>
                        {test.description}
                      </Text>

                      {/* Botões de status */}
                      <View style={{ flexDirection: "row", gap: 6, marginBottom: 8 }}>
                        {(["approved", "rejected", "na"] as TestStatus[]).map((status) => (
                          <Pressable
                            key={status}
                            onPress={() => updateTestStatus(section.id, test.id, status)}
                            style={{
                              flex: 1,
                              paddingVertical: 7,
                              borderRadius: 8,
                              alignItems: "center",
                              backgroundColor: test.status === status ? statusConfig[status].activeBg : "#f5f5f5",
                              borderWidth: 0.5,
                              borderColor: test.status === status ? statusConfig[status].activeBg : "#e5e7eb",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: "600",
                                color: test.status === status ? "white" : "#666",
                              }}
                            >
                              {statusConfig[status].label}
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      {/* Fotos */}
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {test.photos.map((photo) => (
                          <View key={photo.id} style={{ position: "relative" }}>
                            <Image
                              source={{ uri: photo.uri }}
                              style={{ width: 64, height: 64, borderRadius: 8 }}
                            />
                            <Pressable
                              onPress={() => removePhoto(section.id, test.id, photo.id)}
                              style={{
                                position: "absolute", top: -4, right: -4,
                                backgroundColor: "#dc2626", borderRadius: 99,
                                width: 18, height: 18, alignItems: "center", justifyContent: "center",
                              }}
                            >
                              <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>✕</Text>
                            </Pressable>
                          </View>
                        ))}

                        {/* Botão adicionar foto */}
                        <Pressable
                          onPress={() => addPhoto(section.id, test.id)}
                          style={{
                            width: 64, height: 64, borderRadius: 8,
                            borderWidth: 1.5, borderStyle: "dashed", borderColor: "#d1d5db",
                            alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 20, color: "#9ca3af" }}>📷</Text>
                        </Pressable>
                      </View>

                      {/* Legendas das fotos */}
                      {test.photos.length > 0 && (
                        <View style={{ gap: 6, marginTop: 8 }}>
                          {test.photos.map((photo, photoIndex) => (
                            <View key={photo.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                              <Image source={{ uri: photo.uri }} style={{ width: 32, height: 32, borderRadius: 4 }} />
                              <TextInput
                                placeholder={`Legenda da foto ${photoIndex + 1}...`}
                                value={photo.caption}
                                onChangeText={(text) => updatePhotoCaption(section.id, test.id, photo.id, text)}
                                style={{
                                  flex: 1, borderWidth: 0.5, borderColor: "#e5e7eb",
                                  borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
                                  fontSize: 12, color: "#333",
                                }}
                                placeholderTextColor="#9ca3af"
                              />
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Aviso foto obrigatória */}
                      {test.status === "rejected" && test.photos.length === 0 && (
                        <Text style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>
                          ⚠ Foto obrigatória para itens reprovados
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Observações gerais */}
        <View style={{ marginTop: 4, marginBottom: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 6 }}>
            Observações gerais
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Alguma observação sobre este cômodo..."
            value={observations}
            onChangeText={setObservations}
            style={{
              borderWidth: 0.5, borderColor: "#e5e7eb", borderRadius: 10,
              padding: 12, fontSize: 13, color: "#333", minHeight: 80,
              textAlignVertical: "top",
            }}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Botões de navegação */}
        <View style={{ gap: 10, marginTop: 8 }}>
          <LargeButton title="Salvar e continuar →" onPress={handleNext} variant="primary" />
          <Pressable onPress={() => router.back()} style={{ alignItems: "center", padding: 10 }}>
            <Text style={{ color: "#0a7ea4", fontWeight: "600", fontSize: 14 }}>Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
