# Check+ Vistorias - Design de Interface Mobile

## Princípios de Design

- **Orientação**: Retrato (9:16) - otimizado para uso com uma mão
- **Padrão**: Segue Apple Human Interface Guidelines (HIG)
- **Objetivo**: Interface limpa, rápida e sem erros para vistoria em campo
- **Foco**: Minimizar passos, botões grandes, feedback visual claro

---

## Mapa de Telas

### 1. **Tela Inicial (Home)**
- Dois botões principais (grande, ocupando 60% da largura):
  - "Vistoria Técnica de Imóvel (com ART)"
  - "Vistoria de Entrega de Chaves (sem ART)"
- Botão secundário: "Minhas Vistorias" (histórico/edição)
- Botão de configurações (ícone, canto superior direito)

### 2. **Tela de Dados - Cliente e Inspetor**
- Seção 1: Dados do Cliente (Contratante)
  - Nome completo
  - Endereço
  - CEP
  - Email
  - Telefone
- Seção 2: Dados do Inspetor (Contratada)
  - Nome / Razão Social
  - CPF ou CNPJ
  - Endereço
  - CEP
  - Email
  - Telefone
- Seção 3: Dados Condicionais (apenas Vistoria Técnica)
  - CREA
  - CAU

**Comportamento**: Formulário com scroll, campos com validação em tempo real

### 3. **Tela de Condições da Vistoria**
- Data da vistoria (date picker)
- Hora da vistoria (time picker)
- Condições climáticas (botões segmentados):
  - Ensolarado
  - Nublado
  - Chuvoso
  - Parcialmente nublado
- Condições de acesso (botões segmentados):
  - Total
  - Parcial
  - Restrito
- Iluminação (botões segmentados):
  - Adequada
  - Parcial
  - Insuficiente
- Ocupação (botões segmentados):
  - Desocupado
  - Ocupado
  - Em obra

**Comportamento**: Seleção única por grupo, feedback visual imediato

### 4. **Tela de Itens de Vistoria (Checklist)**
- Mensagem informativa: "Os itens de vistoria serão definidos posteriormente"
- Placeholder com lista vazia
- Cada item (quando disponível) terá:
  - Nome do item
  - Status: Aprovado / Reprovado / NA (botões)
  - Área para fotos (galeria)
  - Campo de descrição/notas

**Regra crítica**: Se status = "Reprovado", exigir pelo menos 1 foto antes de prosseguir

### 5. **Tela de Captura de Foto**
- Câmera ao vivo (preview)
- Botão grande de captura (circular, centro-inferior)
- Botões de ação:
  - Usar foto (confirmação)
  - Retomar (nova tentativa)
  - Cancelar
- Metadados automáticos:
  - Timestamp (data e hora)
  - GPS (latitude, longitude)
  - Se GPS indisponível: mensagem "Localização não disponível"

**Comportamento**: Foto vinculada automaticamente ao item + status

### 6. **Tela de Resumo/Finalização**
- Resumo completo da vistoria (editável)
- Seções expansíveis:
  - Dados do cliente
  - Dados do inspetor
  - Condições da vistoria
  - Itens e fotos
- Botão "Finalizar Vistoria" (grande, destaque)
- Botão "Editar" (para cada seção)

### 7. **Tela de Exportação**
- Três botões principais:
  - "Exportar PDF"
  - "Exportar Fotos"
  - "Compartilhar Tudo"
- Feedback de sucesso/erro
- Opção de voltar ao início ou editar

### 8. **Tela de Minhas Vistorias**
- Lista de vistorias salvas (com data, cliente, tipo)
- Cada item permite:
  - Visualizar
  - Editar
  - Deletar
  - Compartilhar
- Busca/filtro por data ou cliente

---

## Fluxo Principal de Usuário

1. **Iniciar** → Tela Inicial
2. **Selecionar tipo** → Tipo de Vistoria
3. **Preencher dados** → Tela de Dados (Cliente + Inspetor)
4. **Condições** → Tela de Condições
5. **Checklist** → Tela de Itens (placeholder por enquanto)
6. **Fotos** → Captura com GPS/Timestamp
7. **Resumo** → Tela de Finalização (editável)
8. **Exportar** → PDF, Fotos ou Compartilhar
9. **Salvar** → Armazenamento local (AsyncStorage + Filesystem)

---

## Paleta de Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| Primária | #0a7ea4 (azul) | Botões principais, destaque |
| Sucesso | #22C55E (verde) | Status "Aprovado", confirmações |
| Erro | #EF4444 (vermelho) | Status "Reprovado", avisos |
| Neutro | #687076 (cinza) | Texto secundário, desabilitado |
| Fundo | #ffffff (claro) / #151718 (escuro) | Background |
| Superfície | #f5f5f5 (claro) / #1e2022 (escuro) | Cards, inputs |

---

## Componentes Reutilizáveis

1. **LargeButton** - Botão grande (ocupar 60-80% da largura)
2. **SegmentedControl** - Seleção única entre opções
3. **FormInput** - Campo de texto com validação
4. **PhotoGallery** - Galeria de fotos capturadas
5. **TimestampBadge** - Exibir data/hora/GPS
6. **SectionCard** - Container para seções do formulário
7. **StatusBadge** - Indicador de status (Aprovado/Reprovado/NA)

---

## Armazenamento Local

**Estrutura de Pasta**:
```
vistoria_tipo_nomecliente_data/
├── metadata.json (dados da vistoria)
├── fotos/
│   ├── item-status-date.jpg
│   └── metadata.json (info de cada foto)
└── relatorio.pdf (gerado na exportação)
```

**Exemplo**: `vistoria_tecnica_joao_silva_2026-03-26/`

---

## Considerações Técnicas

- **Offline-first**: Toda a lógica funciona sem internet
- **GPS**: Funciona offline (sensor nativo), com fallback gracioso
- **Fotos**: Armazenadas localmente com metadados
- **PDF**: Gerado localmente (sem servidor)
- **Compartilhamento**: Via sistema nativo (WhatsApp, Drive, Email, etc.)
- **Modularidade**: Estrutura preparada para futura integração com backend

---

## Validações Críticas

1. ✅ Todos os campos obrigatórios preenchidos antes de avançar
2. ✅ Se "Reprovado": exigir foto
3. ✅ GPS/Timestamp: capturados automaticamente
4. ✅ Nomes de pasta: sanitizados (sem caracteres especiais)
5. ✅ PDF: gerado com todos os dados e fotos
