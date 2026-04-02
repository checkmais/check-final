import { InspectionState } from "./inspection-context";
import * as FileSystem from "expo-file-system";
import { File } from "expo-file-system";

/**
 * Gera um relatório em PDF para a vistoria
 */
export async function generateInspectionPDF(
  inspection: InspectionState,
  folderPath: string
): Promise<string> {
  try {
    // Criar conteúdo HTML do PDF
    const htmlContent = generateHTMLReport(inspection);

    // Salvar como arquivo HTML (que pode ser convertido para PDF)
    const pdfPath = `${folderPath}/relatorio.html`;
    const pdfFile = new File(folderPath, "relatorio.html");
    await pdfFile.write(htmlContent);

    return pdfFile.uri;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

/**
 * Gera o conteúdo HTML do relatório
 */
function generateHTMLReport(inspection: InspectionState): string {
  const typeLabel = inspection.type === "technical" ? "Técnica" : "Entrega de Chaves";
  const weatherLabel = {
    sunny: "Ensolarado",
    cloudy: "Nublado",
    rainy: "Chuvoso",
    partly_cloudy: "Parcialmente nublado",
  }[inspection.conditions.weather];

  const accessLabel = {
    total: "Total",
    partial: "Parcial",
    restricted: "Restrito",
  }[inspection.conditions.access];

  const lightingLabel = {
    adequate: "Adequada",
    partial: "Parcial",
    insufficient: "Insuficiente",
  }[inspection.conditions.lighting];

  const occupancyLabel = {
    empty: "Desocupado",
    occupied: "Ocupado",
    under_construction: "Em obra",
  }[inspection.conditions.occupancy];

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Vistoria - Check+ Vistorias</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0a7ea4;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 32px;
      color: #0a7ea4;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 14px;
      color: #666;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #0a7ea4;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 15px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-size: 12px;
      font-weight: bold;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 14px;
      color: #333;
    }
    .intro-box {
      background: #f0f9ff;
      border-left: 4px solid #0a7ea4;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .intro-box p {
      font-size: 13px;
      line-height: 1.8;
      color: #333;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .signature-area {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
    }
    .signature-block {
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #333;
      margin-top: 50px;
      padding-top: 10px;
      font-size: 12px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 5px;
    }
    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-error {
      background: #fee2e2;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Relatório de Vistoria</h1>
      <p>Check+ Vistorias - ${typeLabel}</p>
      <p>Data: ${new Date(inspection.createdAt).toLocaleDateString("pt-BR")}</p>
    </div>

    <!-- Introduction -->
    <div class="section">
      <div class="intro-box">
        <p>
          ${
            inspection.type === "technical"
              ? "Este é um relatório de <strong>Vistoria Técnica de Imóvel com ART</strong>. O vistoriador responsável assume responsabilidade técnica e profissional pelos dados e conclusões apresentados neste documento."
              : "Este é um relatório de <strong>Vistoria de Entrega de Chaves</strong>. Trata-se de uma inspeção visual não-técnica realizada no momento da entrega do imóvel."
          }
        </p>
      </div>
    </div>

    <!-- Client Data -->
    <div class="section">
      <div class="section-title">Dados do Cliente (Contratante)</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Nome Completo</span>
          <span class="info-value">${inspection.client.fullName || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">${inspection.client.email || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Telefone</span>
          <span class="info-value">${inspection.client.phone || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">CEP</span>
          <span class="info-value">${inspection.client.address.cep || "—"}</span>
        </div>
      </div>
      <div class="info-item">
        <span class="info-label">Endereço</span>
        <span class="info-value">${inspection.client.address.street || "—"} ${inspection.client.address.number || ""} ${inspection.client.address.complement || ""}, ${inspection.client.address.city || ""} - ${inspection.client.address.state || ""}</span>
      </div>
    </div>

    <!-- Inspector Data -->
    <div class="section">
      <div class="section-title">Dados do Vistoriador (Contratada)</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Nome / Razão Social</span>
          <span class="info-value">${inspection.vistoriador.name || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">CPF / CNPJ</span>
          <span class="info-value">${inspection.vistoriador.document || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">${inspection.vistoriador.email || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Telefone</span>
          <span class="info-value">${inspection.vistoriador.phone || "—"}</span>
        </div>
        ${
          inspection.type === "technical"
            ? `
        <div class="info-item">
          <span class="info-label">CREA</span>
          <span class="info-value">${inspection.vistoriador.crea || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">CAU</span>
          <span class="info-value">${inspection.vistoriador.cau || "—"}</span>
        </div>
        `
            : ""
        }
      </div>
    </div>

    <!-- Inspection Conditions -->
    <div class="section">
      <div class="section-title">Condições da Vistoria</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Data da Vistoria</span>
          <span class="info-value">${inspection.conditions.date || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Hora da Vistoria</span>
          <span class="info-value">${inspection.conditions.time || "—"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Condições Climáticas</span>
          <span class="info-value">${weatherLabel}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Condições de Acesso</span>
          <span class="info-value">${accessLabel}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Iluminação</span>
          <span class="info-value">${lightingLabel}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Ocupação</span>
          <span class="info-value">${occupancyLabel}</span>
        </div>
      </div>
    </div>

    <!-- Technical Section (only for technical inspections) -->
    ${
      inspection.type === "technical"
        ? `
    <div class="section">
      <div class="section-title">Parecer Técnico</div>
      <div class="intro-box">
        <p>
          <strong>Classificação de Risco (NBR):</strong> A ser preenchido pelo inspetor responsável.
        </p>
        <p style="margin-top: 10px;">
          Observações técnicas e recomendações serão adicionadas conforme necessário.
        </p>
      </div>
    </div>
    `
        : ""
    }

    <!-- Signatures -->
    <div class="signature-area">
      <div class="signature-block">
        <div class="signature-line">
          ${inspection.client.fullName || "Cliente"}
        </div>
      </div>
      <div class="signature-block">
        <div class="signature-line">
          ${inspection.vistoriador.name || "Vistoriador"}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Relatório gerado automaticamente pelo Check+ Vistorias</p>
      <p>ID: ${inspection.createdAt} | Versão: 1.0</p>
    </div>
  </div>
</body>
</html>
  `;
}
