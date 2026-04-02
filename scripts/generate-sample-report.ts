/**
 * Script para gerar um relatório PDF de exemplo de vistoria
 * Execução: npx ts-node scripts/generate-sample-report.ts
 */

import * as fs from "fs";
import * as path from "path";

// Dados fictícios de exemplo
const sampleInspection = {
  id: "VIS-2026-001",
  type: "delivery",
  createdAt: new Date().toISOString(),
  client: {
    name: "João Silva Santos",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 456",
      neighborhood: "Vila Mariana",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
  },
  vistoriador: {
    name: "Maria Oliveira",
    cpf: "123.456.789-00",
    email: "maria.oliveira@checkplus.com.br",
    phone: "(11) 99876-5432",
    address: {
      street: "Avenida Paulista",
      number: "1000",
      complement: "",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01311-100",
    },
  },
  conditions: {
    date: "2026-03-26",
    time: "14:30",
    weather: "Ensolarado",
    access: "Fácil",
    lighting: "Boa",
    occupation: "Vazio",
  },
  rooms: [
    {
      id: "room-1",
      name: "Sala de Estar",
      areaType: "internal",
      sections: [
        {
          title: "1. Conferência de Dimensões",
          tests: [
            { description: "Comprimento conforme projeto", status: "approved" },
            { description: "Largura conforme projeto", status: "approved" },
            { description: "Pé-direito conforme especificado", status: "approved" },
          ],
        },
        {
          title: "2. Paredes e Revestimentos",
          tests: [
            { description: "Tipo conforme memorial descritivo", status: "approved" },
            { description: "Pintura uniforme", status: "approved" },
            { description: "Sem manchas, bolhas ou descascamento", status: "approved" },
            { description: "Revestimentos sem trincas ou peças ocas", status: "rejected", photos: 1 },
            { description: "Rejuntes uniformes", status: "approved" },
          ],
        },
        {
          title: "3. Pisos",
          tests: [
            { description: "Tipo conforme memorial", status: "approved" },
            { description: "Nivelamento adequado", status: "approved" },
            { description: "Sem peças soltas ou ocas", status: "approved" },
            { description: "Rejuntes completos", status: "approved" },
            { description: "Caimento adequado (áreas molhadas)", status: "na" },
          ],
        },
        {
          title: "4. Teto / Forro",
          tests: [
            { description: "Tipo conforme memorial", status: "approved" },
            { description: "Sem fissuras ou manchas", status: "approved" },
            { description: "Nivelamento adequado", status: "approved" },
          ],
        },
        {
          title: "5. Esquadrias",
          tests: [
            { description: "Tipo conforme memorial", status: "approved" },
            { description: "Funcionamento adequado", status: "approved" },
            { description: "Vedação correta", status: "approved" },
            { description: "Vidros íntegros", status: "approved" },
          ],
        },
        {
          title: "6. Instalações Elétricas",
          tests: [
            { description: "Pontos conforme projeto", status: "approved" },
            { description: "Tomadas funcionando", status: "approved" },
            { description: "Interruptores funcionando", status: "approved" },
            { description: "Acabamentos fixos", status: "approved" },
          ],
        },
        {
          title: "7. Instalações Hidráulicas",
          tests: [
            { description: "Pontos conforme projeto", status: "na" },
            { description: "Pressão adequada", status: "na" },
            { description: "Sem vazamentos", status: "na" },
            { description: "Escoamento adequado", status: "na" },
          ],
        },
        {
          title: "8. Louças e Metais",
          tests: [
            { description: "Tipo conforme memorial", status: "na" },
            { description: "Fixação adequada", status: "na" },
            { description: "Funcionamento correto", status: "na" },
          ],
        },
        {
          title: "9. Impermeabilização (Indícios)",
          tests: [
            { description: "Sem manchas de umidade", status: "approved" },
            { description: "Sem mofo", status: "approved" },
          ],
        },
        {
          title: "10. Vedações e Acabamentos",
          tests: [
            { description: "Silicone adequado", status: "approved" },
            { description: "Sem falhas", status: "approved" },
          ],
        },
        {
          title: "11. Conformidade com Memorial",
          tests: [
            { description: "Materiais conferem", status: "approved" },
            { description: "Acabamentos conferem", status: "approved" },
          ],
        },
        {
          title: "12. Limpeza",
          tests: [
            { description: "Ambiente limpo", status: "approved" },
            { description: "Sem resíduos de obra", status: "approved" },
          ],
        },
      ],
      observations: "Sala em perfeito estado. Pequeno reparo necessário na parede (trinca superficial).",
    },
    {
      id: "room-2",
      name: "Cozinha",
      areaType: "internal",
      sections: [
        {
          title: "1. Conferência de Dimensões",
          tests: [
            { description: "Comprimento conforme projeto", status: "approved" },
            { description: "Largura conforme projeto", status: "approved" },
            { description: "Pé-direito conforme especificado", status: "approved" },
          ],
        },
        {
          title: "2. Paredes e Revestimentos",
          tests: [
            { description: "Tipo conforme memorial descritivo", status: "approved" },
            { description: "Pintura uniforme", status: "approved" },
            { description: "Sem manchas, bolhas ou descascamento", status: "approved" },
            { description: "Revestimentos sem trincas ou peças ocas", status: "approved" },
            { description: "Rejuntes uniformes", status: "approved" },
          ],
        },
        {
          title: "3. Pisos",
          tests: [
            { description: "Tipo conforme memorial", status: "approved" },
            { description: "Nivelamento adequado", status: "approved" },
            { description: "Sem peças soltas ou ocas", status: "approved" },
            { description: "Rejuntes completos", status: "approved" },
            { description: "Caimento adequado (áreas molhadas)", status: "approved" },
          ],
        },
        {
          title: "4. Teto / Forro",
          tests: [
            { description: "Tipo conforme memorial", status: "approved" },
            { description: "Sem fissuras ou manchas", status: "approved" },
            { description: "Nivelamento adequado", status: "approved" },
          ],
        },
        {
          title: "5. Esquadrias",
          tests: [
            { description: "Tipo conforme memorial", status: "approved" },
            { description: "Funcionamento adequado", status: "approved" },
            { description: "Vedação correta", status: "approved" },
            { description: "Vidros íntegros", status: "approved" },
          ],
        },
        {
          title: "6. Instalações Elétricas",
          tests: [
            { description: "Pontos conforme projeto", status: "approved" },
            { description: "Tomadas funcionando", status: "approved" },
            { description: "Interruptores funcionando", status: "approved" },
            { description: "Acabamentos fixos", status: "approved" },
          ],
        },
        {
          title: "7. Instalações Hidráulicas",
          tests: [
            { description: "Pontos conforme projeto", status: "approved" },
            { description: "Pressão adequada", status: "approved" },
            { description: "Sem vazamentos", status: "approved" },
            { description: "Escoamento adequado", status: "approved" },
          ],
        },
        {
          title: "8. Louças e Metais",
          tests: [
            { description: "Tipo conforme memorial", status: "approved" },
            { description: "Fixação adequada", status: "approved" },
            { description: "Funcionamento correto", status: "approved" },
          ],
        },
        {
          title: "9. Impermeabilização (Indícios)",
          tests: [
            { description: "Sem manchas de umidade", status: "approved" },
            { description: "Sem mofo", status: "approved" },
          ],
        },
        {
          title: "10. Vedações e Acabamentos",
          tests: [
            { description: "Silicone adequado", status: "approved" },
            { description: "Sem falhas", status: "approved" },
          ],
        },
        {
          title: "11. Conformidade com Memorial",
          tests: [
            { description: "Materiais conferem", status: "approved" },
            { description: "Acabamentos conferem", status: "approved" },
          ],
        },
        {
          title: "12. Limpeza",
          tests: [
            { description: "Ambiente limpo", status: "approved" },
            { description: "Sem resíduos de obra", status: "approved" },
          ],
        },
      ],
      observations: "Cozinha em excelente estado. Todos os itens aprovados.",
    },
  ],
};

// Gerar HTML do relatório
function generateReportHTML(): string {
  const approvedCount = sampleInspection.rooms.reduce(
    (acc, room) =>
      acc +
      room.sections.reduce(
        (sectionAcc, section) =>
          sectionAcc +
          section.tests.filter((t) => t.status === "approved").length,
        0
      ),
    0
  );

  const rejectedCount = sampleInspection.rooms.reduce(
    (acc, room) =>
      acc +
      room.sections.reduce(
        (sectionAcc, section) =>
          sectionAcc +
          section.tests.filter((t) => t.status === "rejected").length,
        0
      ),
    0
  );

  const naCount = sampleInspection.rooms.reduce(
    (acc, room) =>
      acc +
      room.sections.reduce(
        (sectionAcc, section) =>
          sectionAcc +
          section.tests.filter((t) => t.status === "na").length,
        0
      ),
    0
  );

  const totalTests = approvedCount + rejectedCount + naCount;
  const approvalPercentage = ((approvedCount / totalTests) * 100).toFixed(1);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Vistoria - ${sampleInspection.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .page { page-break-after: always; padding: 40px; max-width: 210mm; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #0a7ea4; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #0a7ea4; margin-bottom: 10px; }
    .report-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px; }
    .report-id { font-size: 14px; color: #666; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: bold; color: #0a7ea4; margin-bottom: 15px; border-left: 4px solid #0a7ea4; padding-left: 10px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-box { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .info-label { font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
    .info-value { font-size: 14px; color: #333; }
    .room-header { background: #e8f4f8; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
    .room-title { font-size: 16px; font-weight: bold; color: #0a7ea4; }
    .room-meta { font-size: 12px; color: #666; margin-top: 5px; }
    .test-item { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
    .test-status { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; margin-right: 15px; flex-shrink: 0; }
    .status-approved { background: #10B981; }
    .status-rejected { background: #EF4444; }
    .status-na { background: #9CA3AF; }
    .test-description { flex: 1; font-size: 13px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
    .summary-box { background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; border-left: 4px solid #0a7ea4; }
    .summary-value { font-size: 24px; font-weight: bold; color: #0a7ea4; }
    .summary-label { font-size: 12px; color: #666; margin-top: 5px; }
    .observations { background: #fffbea; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 5px; margin-top: 15px; }
    .observations-label { font-size: 12px; font-weight: bold; color: #d97706; text-transform: uppercase; margin-bottom: 5px; }
    .observations-text { font-size: 13px; color: #333; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 11px; color: #999; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #0a7ea4; color: white; padding: 10px; text-align: left; font-size: 12px; }
    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
    tr:nth-child(even) { background: #f9f9f9; }
  </style>
</head>
<body>
  <!-- Página 1: Capa -->
  <div class="page">
    <div class="header">
      <div class="logo">✓ CHECK+</div>
      <div class="report-title">Relatório de Vistoria</div>
      <div class="report-id">${sampleInspection.id}</div>
    </div>

    <div class="section">
      <div class="section-title">Informações da Vistoria</div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Tipo de Vistoria</div>
          <div class="info-value">Entrega de Chaves</div>
        </div>
        <div class="info-box">
          <div class="info-label">Data</div>
          <div class="info-value">${new Date(sampleInspection.conditions.date).toLocaleDateString("pt-BR")}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Hora</div>
          <div class="info-value">${sampleInspection.conditions.time}</div>
        </div>
        <div class="info-box">
          <div class="info-label">ID da Vistoria</div>
          <div class="info-value">${sampleInspection.id}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Dados do Cliente</div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Nome</div>
          <div class="info-value">${sampleInspection.client.name}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Email</div>
          <div class="info-value">${sampleInspection.client.email}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Telefone</div>
          <div class="info-value">${sampleInspection.client.phone}</div>
        </div>
        <div class="info-box">
          <div class="info-label">CEP</div>
          <div class="info-value">${sampleInspection.client.address.zipCode}</div>
        </div>
      </div>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 15px;">
        <div class="info-label">Endereço Completo</div>
        <div class="info-value">
          ${sampleInspection.client.address.street}, ${sampleInspection.client.address.number}
          ${sampleInspection.client.address.complement ? `- ${sampleInspection.client.address.complement}` : ""}<br>
          ${sampleInspection.client.address.neighborhood} - ${sampleInspection.client.address.city}, ${sampleInspection.client.address.state}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Dados do Vistoriador</div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Nome</div>
          <div class="info-value">${sampleInspection.vistoriador.name}</div>
        </div>
        <div class="info-box">
          <div class="info-label">CPF</div>
          <div class="info-value">${sampleInspection.vistoriador.cpf}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Email</div>
          <div class="info-value">${sampleInspection.vistoriador.email}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Telefone</div>
          <div class="info-value">${sampleInspection.vistoriador.phone}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Condições da Vistoria</div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Clima</div>
          <div class="info-value">${sampleInspection.conditions.weather}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Acesso</div>
          <div class="info-value">${sampleInspection.conditions.access}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Iluminação</div>
          <div class="info-value">${sampleInspection.conditions.lighting}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Ocupação</div>
          <div class="info-value">${sampleInspection.conditions.occupation}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Relatório gerado automaticamente pelo sistema Check+ Vistorias</p>
      <p>Data de geração: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
    </div>
  </div>

  <!-- Página 2+: Checklists -->
  ${sampleInspection.rooms
    .map(
      (room) => `
  <div class="page">
    <div class="room-header">
      <div class="room-title">${room.name}</div>
      <div class="room-meta">Tipo: ${room.areaType === "internal" ? "Área Interna" : "Área Externa"}</div>
    </div>

    ${room.sections
      .map(
        (section) => `
      <div style="margin-bottom: 25px;">
        <div class="section-title">${section.title}</div>
        ${section.tests
          .map(
            (test) => `
          <div class="test-item">
            <div class="test-status ${
              test.status === "approved"
                ? "status-approved"
                : test.status === "rejected"
                  ? "status-rejected"
                  : "status-na"
            }">
              ${test.status === "approved" ? "✓" : test.status === "rejected" ? "✕" : "NA"}
            </div>
            <div class="test-description">${test.description}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `
      )
      .join("")}

    ${
      room.observations
        ? `
    <div class="observations">
      <div class="observations-label">Observações</div>
      <div class="observations-text">${room.observations}</div>
    </div>
    `
        : ""
    }
  </div>
  `
    )
    .join("")}

  <!-- Página Final: Resumo -->
  <div class="page">
    <div class="section">
      <div class="section-title">Resumo da Vistoria</div>
      <div class="summary">
        <div class="summary-box">
          <div class="summary-value" style="color: #10B981;">${approvedCount}</div>
          <div class="summary-label">Aprovados</div>
        </div>
        <div class="summary-box">
          <div class="summary-value" style="color: #EF4444;">${rejectedCount}</div>
          <div class="summary-label">Reprovados</div>
        </div>
        <div class="summary-box">
          <div class="summary-value" style="color: #9CA3AF;">${naCount}</div>
          <div class="summary-label">Não Aplicável</div>
        </div>
        <div class="summary-box">
          <div class="summary-value">${approvalPercentage}%</div>
          <div class="summary-label">Taxa de Aprovação</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Conclusão</div>
      <div style="background: #f0fdf4; padding: 20px; border-radius: 5px; border-left: 4px solid #10B981;">
        <p style="font-size: 14px; color: #166534; line-height: 1.8;">
          A vistoria foi realizada conforme os padrões estabelecidos. ${rejectedCount > 0 ? `Foram identificados ${rejectedCount} item(ns) que necessitam de atenção e correção.` : "Todos os itens foram aprovados."} 
          A propriedade está ${rejectedCount === 0 ? "em perfeito estado para entrega" : "em condições de entrega com ressalvas"}.
        </p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Assinaturas</div>
      <table>
        <tr>
          <td style="text-align: center; padding: 40px 20px;">
            <div style="border-top: 1px solid #333; margin-top: 20px; font-size: 12px;">
              ${sampleInspection.vistoriador.name}<br>
              Vistoriador
            </div>
          </td>
          <td style="text-align: center; padding: 40px 20px;">
            <div style="border-top: 1px solid #333; margin-top: 20px; font-size: 12px;">
              ${sampleInspection.client.name}<br>
              Cliente
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <p>Relatório de Vistoria ${sampleInspection.id}</p>
      <p>© 2026 Check+ Vistorias - Todos os direitos reservados</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Salvar HTML
const outputDir = path.join(__dirname, "..", "sample-reports");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const htmlPath = path.join(outputDir, "sample-report.html");
const htmlContent = generateReportHTML();
fs.writeFileSync(htmlPath, htmlContent);

console.log(`✓ Relatório HTML gerado: ${htmlPath}`);
console.log(`✓ Abra o arquivo no navegador para visualizar`);
