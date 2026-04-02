import { describe, it, expect } from "vitest";

// Teste da função formatCPF diretamente
function formatCPF(value: string): string {
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
}

describe("CPF Mask Formatting", () => {
  it("deve formatar CPF vazio", () => {
    expect(formatCPF("")).toBe("");
  });

  it("deve formatar CPF com 3 dígitos", () => {
    expect(formatCPF("123")).toBe("123");
  });

  it("deve formatar CPF com 6 dígitos", () => {
    expect(formatCPF("123456")).toBe("123.456");
  });

  it("deve formatar CPF com 9 dígitos", () => {
    expect(formatCPF("123456789")).toBe("123.456.789");
  });

  it("deve formatar CPF com 11 dígitos completo", () => {
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
  });

  it("deve remover caracteres não numéricos", () => {
    expect(formatCPF("123.456.789-01")).toBe("123.456.789-01");
  });

  it("deve remover caracteres especiais e formatar", () => {
    expect(formatCPF("123@456#789$01")).toBe("123.456.789-01");
  });

  it("deve limitar a 11 dígitos", () => {
    expect(formatCPF("123456789012345")).toBe("123.456.789-01");
  });

  it("deve formatar CPF digitado progressivamente", () => {
    expect(formatCPF("1")).toBe("1");
    expect(formatCPF("12")).toBe("12");
    expect(formatCPF("123")).toBe("123");
    expect(formatCPF("1234")).toBe("123.4");
    expect(formatCPF("12345")).toBe("123.45");
    expect(formatCPF("123456")).toBe("123.456");
    expect(formatCPF("1234567")).toBe("123.456.7");
    expect(formatCPF("12345678")).toBe("123.456.78");
    expect(formatCPF("123456789")).toBe("123.456.789");
    expect(formatCPF("1234567890")).toBe("123.456.789-0");
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
  });

  it("deve aceitar CPF com espaços e remover", () => {
    expect(formatCPF("123 456 789 01")).toBe("123.456.789-01");
  });

  it("deve aceitar CPF com hífen e remover", () => {
    expect(formatCPF("123-456-789-01")).toBe("123.456.789-01");
  });
});
