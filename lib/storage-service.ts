import AsyncStorage from "@react-native-async-storage/async-storage";
import { InspectionState } from "./inspection-context";

const INSPECTIONS_KEY = "inspections_list";

export interface StoredInspection extends InspectionState {
  id: string;
}

export function generateInspectionId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function sanitizeName(name: string): string {
  return (name || "sem_nome")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 50) || "sem_nome";
}

export async function saveInspection(inspection: InspectionState): Promise<StoredInspection> {
  try {
    const id = generateInspectionId();

    const stored: StoredInspection = {
      ...inspection,
      id,
    };

    // Salvar dados completos da vistoria
    await AsyncStorage.setItem(`inspection_${id}`, JSON.stringify(stored));

    // Atualizar lista de vistorias
    const inspections = await getInspectionsList();
    inspections.push({
      id,
      type: inspection.type || "simples",
      clientName: inspection.client.fullName || "cliente",
      date: inspection.conditions.date || new Date().toISOString().slice(0, 10),
      createdAt: inspection.createdAt,
    });

    await AsyncStorage.setItem(INSPECTIONS_KEY, JSON.stringify(inspections));

    return stored;
  } catch (error) {
    console.error("Erro ao salvar vistoria:", error);
    throw error;
  }
}

export async function savePhotos(
  folderPath: string,
  items: InspectionState["items"],
  rooms?: InspectionState["rooms"]
): Promise<number> {
  let photoCount = 0;
  for (const item of items) {
    photoCount += item.photos.length;
  }
  if (rooms) {
    for (const room of rooms) {
      for (const section of room.sections) {
        for (const test of section.tests) {
          photoCount += test.photos.length;
        }
      }
    }
  }
  return photoCount;
}

export async function getInspectionsList(): Promise<
  Array<{
    id: string;
    type: string;
    clientName: string;
    date: string;
    createdAt: string;
  }>
> {
  try {
    const data = await AsyncStorage.getItem(INSPECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao obter lista:", error);
    return [];
  }
}

export async function loadInspection(id: string): Promise<StoredInspection | null> {
  try {
    const data = await AsyncStorage.getItem(`inspection_${id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erro ao carregar vistoria:", error);
    return null;
  }
}

export async function deleteInspection(id: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`inspection_${id}`);
    const inspections = await getInspectionsList();
    const updated = inspections.filter((i) => i.id !== id);
    await AsyncStorage.setItem(INSPECTIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Erro ao deletar vistoria:", error);
    throw error;
  }
}
