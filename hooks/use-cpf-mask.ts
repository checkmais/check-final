import { useCallback } from "react";

/**
 * Hook para formatar CPF automaticamente no padrão: 000.000.000-00
 * Remove caracteres não numéricos e aplica a máscara
 */
export function useCPFMask() {
  const formatCPF = useCallback((value: string): string => {
    // Remove tudo que não é número
    const cleanValue = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const truncated = cleanValue.slice(0, 11);

    // Aplica a máscara: 000.000.000-00
    if (truncated.length === 0) return "";
    if (truncated.length <= 3) return truncated;
    if (truncated.length <= 6) return `${truncated.slice(0, 3)}.${truncated.slice(3)}`;
    if (truncated.length <= 9) return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6)}`;
    return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6, 9)}-${truncated.slice(9)}`;
  }, []);

  return { formatCPF };
}
