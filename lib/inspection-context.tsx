import React, { createContext, useContext, useReducer } from "react";

export type InspectionType = "simple" | "technical" | "rental";

export interface AddressData {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface ClientData {
  documentType: "cpf" | "cnpj";
  document: string;
  nameType: "individual" | "company";
  fullName: string;
  address: AddressData;
  email: string;
  phone: string;
}

export interface VistoriadorData {
  documentType: "cpf" | "cnpj";
  document: string;
  nameType: "individual" | "company";
  name: string;
  address: AddressData;
  email: string;
  phone: string;
  crea?: string;
  cau?: string;
}

export interface InspectionConditions {
  date: string;
  time: string;
  weather: "sunny" | "cloudy" | "rainy" | "partly_cloudy";
  access: "total" | "partial" | "restricted";
  lighting: "adequate" | "partial" | "insufficient";
  occupancy: "empty" | "occupied" | "under_construction";
}

export interface InspectionPhoto {
  id: string;
  uri: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  itemId?: string;
  status?: "approved" | "rejected" | "na";
  description?: string;
}

export interface InspectionItem {
  id: string;
  name: string;
  status: "approved" | "rejected" | "na";
  photos: InspectionPhoto[];
  description: string;
}

// Novo: representa um cômodo completo com checklist
export interface RoomData {
  id: string;
  roomName: string;
  areaType: "internal" | "external";
  sections: Array<{
    id: string;
    title: string;
    tests: Array<{
      id: string;
      description: string;
      status: string;
      photos: Array<{
        id: string;
        uri: string;
        caption: string;
        timestamp: string;
      }>;
    }>;
  }>;
  observations: string;
  createdAt: string;
}

export interface InspectionState {
  type: InspectionType | null;
  client: ClientData;
  vistoriador: VistoriadorData;
  conditions: InspectionConditions;
  items: InspectionItem[];
  rooms: RoomData[]; // Novo: lista de cômodos com checklist completo
  createdAt: string;
  updatedAt: string;
}

export interface InspectionContextType {
  state: InspectionState;
  setInspectionType: (type: InspectionType) => void;
  updateClient: (data: Partial<ClientData>) => void;
  updateVistoriador: (data: Partial<VistoriadorData>) => void;
  updateConditions: (data: Partial<InspectionConditions>) => void;
  addPhoto: (photo: InspectionPhoto) => void;
  updateItem: (itemId: string, data: Partial<InspectionItem>) => void;
  saveRoom: (room: RoomData) => void; // Novo
  reset: () => void;
}

const defaultAddress: AddressData = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  cep: "",
};

const defaultState: InspectionState = {
  type: null,
  client: {
    documentType: "cpf",
    document: "",
    nameType: "individual",
    fullName: "",
    address: { ...defaultAddress },
    email: "",
    phone: "",
  },
  vistoriador: {
    documentType: "cpf",
    document: "",
    nameType: "individual",
    name: "",
    address: { ...defaultAddress },
    email: "",
    phone: "",
    crea: "",
    cau: "",
  },
  conditions: {
    date: "",
    time: "",
    weather: "sunny",
    access: "total",
    lighting: "adequate",
    occupancy: "empty",
  },
  items: [],
  rooms: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

type Action =
  | { type: "SET_INSPECTION_TYPE"; payload: InspectionType }
  | { type: "UPDATE_CLIENT"; payload: Partial<ClientData> }
  | { type: "UPDATE_VISTORIADOR"; payload: Partial<VistoriadorData> }
  | { type: "UPDATE_CONDITIONS"; payload: Partial<InspectionConditions> }
  | { type: "ADD_PHOTO"; payload: InspectionPhoto }
  | { type: "UPDATE_ITEM"; payload: { itemId: string; data: Partial<InspectionItem> } }
  | { type: "SAVE_ROOM"; payload: RoomData }
  | { type: "RESET" };

function inspectionReducer(state: InspectionState, action: Action): InspectionState {
  switch (action.type) {
    case "SET_INSPECTION_TYPE":
      return { ...state, type: action.payload, updatedAt: new Date().toISOString() };
    case "UPDATE_CLIENT":
      return { ...state, client: { ...state.client, ...action.payload }, updatedAt: new Date().toISOString() };
    case "UPDATE_VISTORIADOR":
      return { ...state, vistoriador: { ...state.vistoriador, ...action.payload }, updatedAt: new Date().toISOString() };
    case "UPDATE_CONDITIONS":
      return { ...state, conditions: { ...state.conditions, ...action.payload }, updatedAt: new Date().toISOString() };
    case "ADD_PHOTO":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, photos: [...item.photos, action.payload] }
            : item
        ),
        updatedAt: new Date().toISOString(),
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId ? { ...item, ...action.payload.data } : item
        ),
        updatedAt: new Date().toISOString(),
      };
    case "SAVE_ROOM": {
      // Substitui o cômodo se já existir, senão adiciona
      const exists = state.rooms.find((r) => r.id === action.payload.id);
      const updatedRooms = exists
        ? state.rooms.map((r) => (r.id === action.payload.id ? action.payload : r))
        : [...state.rooms, action.payload];
      return { ...state, rooms: updatedRooms, updatedAt: new Date().toISOString() };
    }
    case "RESET":
      return { ...defaultState, createdAt: new Date().toISOString() };
    default:
      return state;
  }
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(inspectionReducer, defaultState);

  const value: InspectionContextType = {
    state,
    setInspectionType: (type) => dispatch({ type: "SET_INSPECTION_TYPE", payload: type }),
    updateClient: (data) => dispatch({ type: "UPDATE_CLIENT", payload: data }),
    updateVistoriador: (data) => dispatch({ type: "UPDATE_VISTORIADOR", payload: data }),
    updateConditions: (data) => dispatch({ type: "UPDATE_CONDITIONS", payload: data }),
    addPhoto: (photo) => dispatch({ type: "ADD_PHOTO", payload: photo }),
    updateItem: (itemId, data) => dispatch({ type: "UPDATE_ITEM", payload: { itemId, data } }),
    saveRoom: (room) => dispatch({ type: "SAVE_ROOM", payload: room }),
    reset: () => dispatch({ type: "RESET" }),
  };

  return (
    <InspectionContext.Provider value={value}>
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error("useInspection must be used within InspectionProvider");
  }
  return context;
}
