import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Directory, Paths } from "expo-file-system";
import { InspectionState } from "./inspection-context";

const INSPECTIONS_KEY = "inspections_list";
const INSPECTION_PREFIX = "inspection_";

export interface StoredInspection extends InspectionState {
  id: string;
  folderPath: string;
}

/**
 * Gera um ID único para a vistoria
 */
export function generateInspectionId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitiza nomes de arquivo/pasta removendo caracteres especiais
 */
export function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 50);
}

/**
 * Cria o nome da pasta para a vistoria
 */
export function generateFolderName(type: string, clientName: string, date: string): string {
  const typeLabel = type === "technical" ? "tecnica" : type === "rental" ? "locacao" : "simples";
  const sanitizedClient = sanitizeName(clientName);
  return `vistoria_${typeLabel}_${sanitizedClient}_${date}`;
}

/**
 * Salva uma vistoria localmente
 */
export async function saveInspection(inspection: InspectionState): Promise<StoredInspection> {
  try {
    const id = generateInspectionId();
    const folderName = generateFolderName(
      inspection.type || "unknown",
      inspection.client.fullName,
      inspection.conditions.date
    );
    const folderPath = `${Paths.document}/${folderName}`;

    // Criar pasta
    try {
      const folder = new Directory(folderPath);
      await folder.create();
    } catch (e) {
      // Pasta pode já existir
      console.log("Pasta já existe ou erro ao criar", e);
    }

    // Criar subpasta para fotos
    try {
      const photosFolder = new Directory(`${folderPath}/fotos`);
      await photosFolder.create();
    } catch (e) {
      // Pasta pode já existir
      console.log("Pasta de fotos já existe ou erro ao criar", e);
    }

    // Salvar metadados
    const metadata: StoredInspection = {
      ...inspection,
      id,
      folderPath,
    };

    const metadataFile = new File(folderPath, "metadata.json");
    await metadataFile.write(JSON.stringify(metadata, null, 2));

    // Atualizar lista de vistorias
    const inspections = await getInspectionsList();
    inspections.push({
      id,
      type: inspection.type || "unknown",
      clientName: inspection.client.fullName,
      date: inspection.conditions.date,
      folderPath,
      createdAt: inspection.createdAt,
    });

    await AsyncStorage.setItem(INSPECTIONS_KEY, JSON.stringify(inspections));

    return metadata;
  } catch (error) {
    console.error("Erro ao salvar vistoria:", error);
    throw error;
  }
}

/**
 * Carrega uma vistoria pelo ID
 */
export async function loadInspection(id: string): Promise<StoredInspection | null> {
  try {
    const inspections = await getInspectionsList();
    const inspection = inspections.find((i) => i.id === id);

    if (!inspection) return null;

    const metadataFile = new File(inspection.folderPath, "metadata.json");
    const metadataContent = await metadataFile.text();
    return JSON.parse(metadataContent);
  } catch (error) {
    console.error("Erro ao carregar vistoria:", error);
    return null;
  }
}

/**
 * Obtém lista de vistorias salvas
 */
export async function getInspectionsList(): Promise<
  Array<{
    id: string;
    type: string;
    clientName: string;
    date: string;
    folderPath: string;
    createdAt: string;
  }>
> {
  try {
    const data = await AsyncStorage.getItem(INSPECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao obter lista de vistorias:", error);
    return [];
  }
}

/**
 * Deleta uma vistoria
 */
export async function deleteInspection(id: string): Promise<void> {
  try {
    const inspections = await getInspectionsList();
    const inspection = inspections.find((i) => i.id === id);

    if (inspection) {
      // Deletar pasta
      const folder = new Directory(inspection.folderPath);
      await folder.delete();

      // Atualizar lista
      const updated = inspections.filter((i) => i.id !== id);
      await AsyncStorage.setItem(INSPECTIONS_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Erro ao deletar vistoria:", error);
    throw error;
  }
}

/**
 * Salva uma foto com metadados
 */
export async function savePhoto(
  inspectionId: string,
  photoUri: string,
  itemName: string,
  status: string,
  timestamp: string,
  latitude?: number,
  longitude?: number,
  description?: string
): Promise<string> {
  try {
    const inspections = await getInspectionsList();
    const inspection = inspections.find((i) => i.id === inspectionId);

    if (!inspection) throw new Error("Vistoria não encontrada");

    const photoFileName = `${sanitizeName(itemName)}_${status}_${timestamp.replace(/[:/]/g, "-")}.jpg`;
    const photosDir = new Directory(inspection.folderPath, "fotos");
    const photoFile = new File(photosDir, photoFileName);

    // Copiar foto
    const sourceFile = new File(photoUri);
    await sourceFile.copy(photoFile);

    // Salvar metadados da foto
    const photoMetadata = {
      fileName: photoFileName,
      itemName,
      status,
      timestamp,
      latitude,
      longitude,
      description,
    };

    const metadataFile = new File(photosDir, `${photoFileName}.json`);
    await metadataFile.write(JSON.stringify(photoMetadata, null, 2));

    return photoFile.uri;
  } catch (error) {
    console.error("Erro ao salvar foto:", error);
    throw error;
  }
}

/**
 * Obtém lista de fotos de uma vistoria
 */
export async function getInspectionPhotos(
  inspectionId: string
): Promise<
  Array<{
    fileName: string;
    itemName: string;
    status: string;
    timestamp: string;
    latitude?: number;
    longitude?: number;
    description?: string;
  }>
> {
  try {
    const inspections = await getInspectionsList();
    const inspection = inspections.find((i) => i.id === inspectionId);

    if (!inspection) return [];

    const photosDir = new Directory(inspection.folderPath, "fotos");
    const files = photosDir.list();

    const photos = [];
    for (const item of files) {
      if (item instanceof File && item.name.endsWith(".json")) {
        const metadataContent = await item.text();
        photos.push(JSON.parse(metadataContent));
      }
    }

    return photos;
  } catch (error) {
    console.error("Erro ao obter fotos:", error);
    return [];
  }
}
