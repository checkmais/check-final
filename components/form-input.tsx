import { TextInput, View, Text } from "react-native";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";

interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  required?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  mask?: (text: string) => string;
}

export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  required = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  mask,
}: FormInputProps) {
  const handleChangeText = (text: string) => {
    const formatted = mask ? mask(text) : text;
    onChangeText(formatted);
  };
  const colors = useColors();

  return (
    <View className="gap-2">
      {label && (
        <Text className="text-sm font-semibold text-foreground">
          {label}
          {required && <Text className="text-error"> *</Text>}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        keyboardType={keyboardType}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.muted}
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: colors.foreground,
          fontSize: 16,
          minHeight: multiline ? 100 : 44,
        }}
      />
    </View>
  );
}
