/**
 * Estrutura de dados para o checklist de vistoria
 * Baseado no documento de checklist de entrega de chaves
 */

export type AreaType = "internal" | "external";
export type TestStatus = "pending" | "approved" | "rejected" | "na";

export interface TestItem {
  id: string;
  description: string;
  status: TestStatus;
  photos: PhotoWithCaption[];
}

export interface PhotoWithCaption {
  id: string;
  uri: string;
  caption: string;
  timestamp: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  tests: TestItem[];
}

export interface RoomChecklist {
  id: string;
  roomName: string;
  areaType: AreaType;
  sections: ChecklistSection[];
  memorialAvailable: boolean;
  projectAvailable: boolean;
  overallStatus: "pending" | "approved" | "rejected";
  observations: string;
}

// Checklist para ÁREA INTERNA
export const INTERNAL_CHECKLIST: ChecklistSection[] = [
  {
    id: "dimensions",
    title: "1. Conferência de Dimensões",
    tests: [
      { id: "length", description: "Comprimento conforme projeto", status: "pending", photos: [] },
      { id: "width", description: "Largura conforme projeto", status: "pending", photos: [] },
      { id: "height", description: "Pé-direito conforme especificado", status: "pending", photos: [] },
    ],
  },
  {
    id: "walls",
    title: "2. Paredes e Revestimentos",
    tests: [
      { id: "type", description: "Tipo conforme memorial descritivo", status: "pending", photos: [] },
      { id: "paint", description: "Pintura uniforme", status: "pending", photos: [] },
      { id: "stains", description: "Sem manchas, bolhas ou descascamento", status: "pending", photos: [] },
      { id: "cracks", description: "Revestimentos sem trincas ou peças ocas", status: "pending", photos: [] },
      { id: "grout", description: "Rejuntes uniformes", status: "pending", photos: [] },
    ],
  },
  {
    id: "floors",
    title: "3. Pisos",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "level", description: "Nivelamento adequado", status: "pending", photos: [] },
      { id: "loose", description: "Sem peças soltas ou ocas", status: "pending", photos: [] },
      { id: "grout", description: "Rejuntes completos", status: "pending", photos: [] },
      { id: "slope", description: "Caimento adequado (áreas molhadas)", status: "pending", photos: [] },
    ],
  },
  {
    id: "ceiling",
    title: "4. Teto / Forro",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "cracks", description: "Sem fissuras ou manchas", status: "pending", photos: [] },
      { id: "level", description: "Nivelamento adequado", status: "pending", photos: [] },
    ],
  },
  {
    id: "windows",
    title: "5. Esquadrias",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "function", description: "Funcionamento adequado", status: "pending", photos: [] },
      { id: "sealing", description: "Vedação correta", status: "pending", photos: [] },
      { id: "glass", description: "Vidros íntegros", status: "pending", photos: [] },
    ],
  },
  {
    id: "electrical",
    title: "6. Instalações Elétricas",
    tests: [
      { id: "points", description: "Pontos conforme projeto", status: "pending", photos: [] },
      { id: "outlets", description: "Tomadas funcionando", status: "pending", photos: [] },
      { id: "switches", description: "Interruptores funcionando", status: "pending", photos: [] },
      { id: "finish", description: "Acabamentos fixos", status: "pending", photos: [] },
    ],
  },
  {
    id: "hydraulic",
    title: "7. Instalações Hidráulicas",
    tests: [
      { id: "points", description: "Pontos conforme projeto", status: "pending", photos: [] },
      { id: "pressure", description: "Pressão adequada", status: "pending", photos: [] },
      { id: "leaks", description: "Sem vazamentos", status: "pending", photos: [] },
      { id: "drainage", description: "Escoamento adequado", status: "pending", photos: [] },
    ],
  },
  {
    id: "fixtures",
    title: "8. Louças e Metais",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "fixation", description: "Fixação adequada", status: "pending", photos: [] },
      { id: "function", description: "Funcionamento correto", status: "pending", photos: [] },
    ],
  },
  {
    id: "waterproofing",
    title: "9. Impermeabilização (Indícios)",
    tests: [
      { id: "stains", description: "Sem manchas de umidade", status: "pending", photos: [] },
      { id: "mold", description: "Sem mofo", status: "pending", photos: [] },
    ],
  },
  {
    id: "sealing",
    title: "10. Vedações e Acabamentos",
    tests: [
      { id: "silicone", description: "Silicone adequado", status: "pending", photos: [] },
      { id: "failures", description: "Sem falhas", status: "pending", photos: [] },
    ],
  },
  {
    id: "compliance",
    title: "11. Conformidade com Memorial",
    tests: [
      { id: "materials", description: "Materiais conferem", status: "pending", photos: [] },
      { id: "finishes", description: "Acabamentos conferem", status: "pending", photos: [] },
    ],
  },
  {
    id: "cleaning",
    title: "12. Limpeza",
    tests: [
      { id: "clean", description: "Ambiente limpo", status: "pending", photos: [] },
      { id: "debris", description: "Sem resíduos de obra", status: "pending", photos: [] },
    ],
  },
];

// Checklist para ÁREA EXTERNA
export const EXTERNAL_CHECKLIST: ChecklistSection[] = [
  {
    id: "dimensions",
    title: "1. Conferência de Dimensões",
    tests: [
      { id: "measures", description: "Medidas conforme projeto", status: "pending", photos: [] },
      { id: "area", description: "Área compatível", status: "pending", photos: [] },
    ],
  },
  {
    id: "floors",
    title: "2. Pisos Externos",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "level", description: "Nivelamento adequado", status: "pending", photos: [] },
      { id: "loose", description: "Sem peças soltas", status: "pending", photos: [] },
      { id: "grout", description: "Rejuntes completos", status: "pending", photos: [] },
      { id: "slope", description: "Caimento correto", status: "pending", photos: [] },
    ],
  },
  {
    id: "drainage",
    title: "3. Drenagem",
    tests: [
      { id: "drains", description: "Ralos existentes", status: "pending", photos: [] },
      { id: "flow", description: "Escoamento adequado", status: "pending", photos: [] },
      { id: "water", description: "Sem acúmulo de água", status: "pending", photos: [] },
    ],
  },
  {
    id: "walls",
    title: "4. Paredes / Fachada",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "cracks", description: "Sem fissuras", status: "pending", photos: [] },
      { id: "peeling", description: "Sem descascamento", status: "pending", photos: [] },
      { id: "adhesion", description: "Boa aderência", status: "pending", photos: [] },
    ],
  },
  {
    id: "roof",
    title: "5. Teto / Cobertura",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "infiltration", description: "Sem sinais de infiltração", status: "pending", photos: [] },
    ],
  },
  {
    id: "windows",
    title: "6. Esquadrias Externas",
    tests: [
      { id: "type", description: "Tipo conforme memorial", status: "pending", photos: [] },
      { id: "function", description: "Funcionamento adequado", status: "pending", photos: [] },
      { id: "sealing", description: "Vedação correta", status: "pending", photos: [] },
      { id: "glass", description: "Vidros íntegros", status: "pending", photos: [] },
    ],
  },
  {
    id: "handrail",
    title: "7. Guarda-corpo / Corrimão",
    tests: [
      { id: "structure", description: "Estrutura firme", status: "pending", photos: [] },
      { id: "height", description: "Altura adequada", status: "pending", photos: [] },
      { id: "fixation", description: "Fixação correta", status: "pending", photos: [] },
    ],
  },
  {
    id: "electrical",
    title: "8. Instalações Elétricas",
    tests: [
      { id: "points", description: "Pontos conforme projeto", status: "pending", photos: [] },
      { id: "protection", description: "Proteção contra água", status: "pending", photos: [] },
      { id: "function", description: "Funcionamento adequado", status: "pending", photos: [] },
    ],
  },
  {
    id: "hydraulic",
    title: "9. Instalações Hidráulicas",
    tests: [
      { id: "points", description: "Pontos conforme projeto", status: "pending", photos: [] },
      { id: "leaks", description: "Sem vazamentos", status: "pending", photos: [] },
      { id: "function", description: "Funcionamento adequado", status: "pending", photos: [] },
    ],
  },
  {
    id: "waterproofing",
    title: "10. Impermeabilização",
    tests: [
      { id: "infiltration", description: "Sem infiltrações", status: "pending", photos: [] },
      { id: "stains", description: "Sem manchas", status: "pending", photos: [] },
    ],
  },
  {
    id: "joints",
    title: "11. Juntas e Dilatação",
    tests: [
      { id: "existing", description: "Existentes", status: "pending", photos: [] },
      { id: "integrity", description: "Íntegras", status: "pending", photos: [] },
    ],
  },
  {
    id: "finishes",
    title: "12. Acabamentos",
    tests: [
      { id: "thresholds", description: "Soleiras e pingadeiras adequadas", status: "pending", photos: [] },
      { id: "general", description: "Acabamento geral conforme", status: "pending", photos: [] },
    ],
  },
  {
    id: "compliance",
    title: "13. Conformidade com Memorial",
    tests: [
      { id: "materials", description: "Materiais conferem", status: "pending", photos: [] },
      { id: "finishes", description: "Acabamentos conferem", status: "pending", photos: [] },
    ],
  },
  {
    id: "cleaning",
    title: "14. Limpeza",
    tests: [
      { id: "clean", description: "Área limpa", status: "pending", photos: [] },
      { id: "debris", description: "Sem resíduos", status: "pending", photos: [] },
    ],
  },
];

/**
 * Sugestões de cômodos para área interna
 */
export const SUGGESTED_ROOMS = [
  "Sala de Estar",
  "Sala de Jantar",
  "Cozinha",
  "Quarto Principal",
  "Quarto Secundário",
  "Banheiro Principal",
  "Banheiro Secundário",
  "Lavanderia",
  "Corredor",
  "Varanda",
  "Garagem",
  "Outro",
];

/**
 * Sugestões de áreas externas
 */
export const SUGGESTED_EXTERNAL_AREAS = [
  "Fachada Principal",
  "Fachada Lateral",
  "Fachada Posterior",
  "Cobertura",
  "Terraço",
  "Sacada",
  "Garagem Externa",
  "Área de Serviço",
  "Outro",
];
