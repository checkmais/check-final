import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { FormInput } from "@/components/form-input";
import { LargeButton } from "@/components/large-button";
import { Toast } from "@/components/toast";
import { useInspection } from "@/lib/inspection-context";
import { useDocumentMask } from "@/hooks/use-document-mask";
import { StateSelect } from "@/components/state-select";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ClientDataScreen() {
  const router = useRouter();
  const { state, updateClient, updateVistoriador } = useInspection();
  const { formatDocument } = useDocumentMask();
  const [showToast, setShowToast] = useState(false);

  const handleNext = async () => {
    // Validar apenas campos essenciais
    if (!state.client.fullName || !state.vistoriador.name) {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    // Para vistoria técnica, exigir CREA OU CAU (não ambos)
    if (state.type === "technical" && !state.vistoriador.crea && !state.vistoriador.cau) {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowToast(true);
    setTimeout(() => {
      router.push("/inspection/conditions");
    }, 500);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Dados da Vistoria</Text>
            <Text className="text-sm text-muted">Etapa 1 de 4</Text>
          </View>

          {/* Client Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Cliente (Contratante)</Text>
            <FormInput
              label="Nome Completo"
              placeholder="Ex: João Silva"
              value={state.client.fullName}
              onChangeText={(text) => updateClient({ fullName: text })}
            />
            <FormInput
              label="Rua"
              placeholder="Ex: Rua das Flores"
              value={state.client.address.street}
              onChangeText={(text) => updateClient({ address: { ...state.client.address, street: text } })}
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  label="Número"
                  placeholder="Ex: 123"
                  value={state.client.address.number}
                  onChangeText={(text) => updateClient({ address: { ...state.client.address, number: text } })}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Complemento"
                  placeholder="Ex: Apt 42"
                  value={state.client.address.complement}
                  onChangeText={(text) => updateClient({ address: { ...state.client.address, complement: text } })}
                />
              </View>
            </View>
            <FormInput
              label="Bairro"
              placeholder="Ex: Centro"
              value={state.client.address.neighborhood}
              onChangeText={(text) => updateClient({ address: { ...state.client.address, neighborhood: text } })}
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  value={state.client.address.city}
                  onChangeText={(text) => updateClient({ address: { ...state.client.address, city: text } })}
                />
              </View>
              <View className="flex-0.25">
                <StateSelect
                  label="UF"
                  value={state.client.address.state}
                  onValueChange={(text) => updateClient({ address: { ...state.client.address, state: text } })}
                  placeholder="Selecione"
                />
              </View>
            </View>
            <FormInput
              label="CEP"
              placeholder="Ex: 12345-678"
              value={state.client.address.cep}
              onChangeText={(text) => updateClient({ address: { ...state.client.address, cep: text } })}
              keyboardType="numeric"
            />
            <FormInput
              label="Email"
              placeholder="Ex: joao@email.com"
              value={state.client.email}
              onChangeText={(text) => updateClient({ email: text })}
              keyboardType="email-address"
            />
            <FormInput
              label="Telefone"
              placeholder="Ex: (11) 99999-9999"
              value={state.client.phone}
              onChangeText={(text) => updateClient({ phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* Vistoriador Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Vistoriador (Contratada)</Text>
            <FormInput
              label="Nome / Razão Social"
              placeholder="Ex: João Vistoriador ou Empresa XYZ"
              value={state.vistoriador.name}
              onChangeText={(text) => updateVistoriador({ name: text })}
            />
            <FormInput
              label="CPF/CNPJ"
              placeholder="Ex: 123.456.789-00 ou 00.000.000/0000-00"
              value={state.vistoriador.document}
              onChangeText={(text) => updateVistoriador({ document: formatDocument(text) })}
              keyboardType="numeric"
            />
            <FormInput
              label="Rua"
              placeholder="Ex: Rua das Flores"
              value={state.vistoriador.address.street}
              onChangeText={(text) => updateVistoriador({ address: { ...state.vistoriador.address, street: text } })}
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  label="Número"
                  placeholder="Ex: 123"
                  value={state.vistoriador.address.number}
                  onChangeText={(text) => updateVistoriador({ address: { ...state.vistoriador.address, number: text } })}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Complemento"
                  placeholder="Ex: Apt 42"
                  value={state.vistoriador.address.complement}
                  onChangeText={(text) => updateVistoriador({ address: { ...state.vistoriador.address, complement: text } })}
                />
              </View>
            </View>
            <FormInput
              label="Bairro"
              placeholder="Ex: Centro"
              value={state.vistoriador.address.neighborhood}
              onChangeText={(text) => updateVistoriador({ address: { ...state.vistoriador.address, neighborhood: text } })}
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  value={state.vistoriador.address.city}
                  onChangeText={(text) => updateVistoriador({ address: { ...state.vistoriador.address, city: text } })}
                />
              </View>
              <View className="flex-0.25">
                <StateSelect
                  label="UF"
                  value={state.vistoriador.address.state}
                  onValueChange={(text) => updateVistoriador({ address: { ...state.vistoriador.address, state: text } })}
                  placeholder="Selecione"
                />
              </View>
            </View>
            <FormInput
              label="CEP"
              placeholder="Ex: 12345-678"
              value={state.vistoriador.address.cep}
              onChangeText={(text) => updateVistoriador({ address: { ...state.vistoriador.address, cep: text } })}
              keyboardType="numeric"
            />
            <FormInput
              label="Email"
              placeholder="Ex: vistoriador@email.com"
              value={state.vistoriador.email}
              onChangeText={(text) => updateVistoriador({ email: text })}
              keyboardType="email-address"
            />
            <FormInput
              label="Telefone"
              placeholder="Ex: (11) 99999-9999"
              value={state.vistoriador.phone}
              onChangeText={(text) => updateVistoriador({ phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* Technical Section (only for technical inspections) */}
          {state.type === "technical" && (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">Dados Técnicos</Text>
              <FormInput
                label="CREA (ou deixe em branco se tiver CAU)"
                placeholder="Ex: 12345/D-SP"
                value={state.vistoriador.crea || ""}
                onChangeText={(text) => updateVistoriador({ crea: text })}
              />
              <FormInput
                label="CAU (ou deixe em branco se tiver CREA)"
                placeholder="Ex: 123456"
                value={state.vistoriador.cau || ""}
                onChangeText={(text) => updateVistoriador({ cau: text })}
              />
            </View>
          )}

          {/* Rental Section (only for rental inspections) */}
          {state.type === "rental" && (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">Dados de Locação</Text>
              <FormInput
                label="Proprietário"
                placeholder="Ex: João Silva"
                value={state.vistoriador.name || ""}
                onChangeText={(text) => updateVistoriador({ name: text })}
              />
              <FormInput
                label="Inquilino"
                placeholder="Ex: Maria Santos"
                value={state.client.fullName || ""}
                onChangeText={(text) => updateClient({ fullName: text })}
              />
            </View>
          )}

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
        message="Dados salvos com sucesso!" 
        type="success" 
        visible={showToast} 
        onHide={() => setShowToast(false)} 
      />
    </ScreenContainer>
  );
}
