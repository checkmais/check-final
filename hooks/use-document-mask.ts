import { useCallback } from "react";

/**
 * Hook para formatar CPF ou CNPJ automaticamente
 * CPF: 000.000.000-00 (11 dígitos)
 * CNPJ: 00.000.000/0000-00 (14 dígitos)
 */
export function useDocumentMask() {
  const formatDocument = useCallback((value: string): string => {
    // Remove tudo que não é número
    const cleanValue = value.replace(/\D/g, "");

    // Se tem 14 dígitos, formata como CNPJ
    if (cleanValue.length > 11) {
      const truncated = cleanValue.slice(0, 14);
      if (truncated.length === 0) return "";
      if (truncated.length <= 2) return truncated;
      if (truncated.length <= 5) return `${truncated.slice(0, 2)}.${truncated.slice(2)}`;
      if (truncated.length <= 8) return `${truncated.slice(0, 2)}.${truncated.slice(2, 5)}.${truncated.slice(5)}`;
      if (truncated.length <= 12) return `${truncated.slice(0, 2)}.${truncated.slice(2, 5)}.${truncated.slice(5, 8)}/${truncated.slice(8)}`;
      return `${truncated.slice(0, 2)}.${truncated.slice(2, 5)}.${truncated.slice(5, 8)}/${truncated.slice(8, 12)}-${truncated.slice(12)}`;
    }

    // Se tem até 11 dígitos, formata como CPF
    const truncated = cleanValue.slice(0, 11);
    if (truncated.length === 0) return "";
    if (truncated.length <= 3) return truncated;
    if (truncated.length <= 6) return `${truncated.slice(0, 3)}.${truncated.slice(3)}`;
    if (truncated.length <= 9) return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6)}`;
    return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6, 9)}-${truncated.slice(9)}`;
  }, []);

  return { formatDocument };
}
