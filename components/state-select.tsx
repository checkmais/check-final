import { View, Text, Pressable, Modal, ScrollView, FlatList } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";

const STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

interface StateSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function StateSelect({ label, value, onValueChange, placeholder = "Selecione um estado" }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = useColors();
  const selectedState = STATES.find(s => s.code === value);

  const renderItem = ({ item }: { item: typeof STATES[0] }) => (
    <Pressable
      onPress={() => {
        onValueChange(item.code);
        setIsOpen(false);
      }}
      className={`px-4 py-3 border-b border-border ${value === item.code ? "bg-primary" : "bg-surface"}`}
    >
      <Text className={value === item.code ? "text-background font-semibold" : "text-foreground"}>
        {item.code} - {item.name}
      </Text>
    </Pressable>
  );

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <Pressable
        onPress={() => setIsOpen(true)}
        className="border border-border rounded-lg p-3 bg-surface"
      >
        <Text className={value ? "text-foreground font-medium" : "text-muted"}>
          {selectedState ? `${selectedState.code} - ${selectedState.name}` : placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            className="bg-surface rounded-t-2xl max-h-96"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4 border-b border-border">
              <Text className="text-lg font-semibold text-foreground">Selecione um Estado</Text>
            </View>
            <FlatList
              data={STATES}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
              scrollEnabled
              nestedScrollEnabled
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
