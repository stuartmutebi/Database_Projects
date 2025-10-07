"use client";

export type AssetRecord = {
  id: string;
  name: string;
  serialNumber: string;
  description?: string;
  supplier?: string;
  classification?: string;
  storage?: string;
  assignedUser?: string;
  purchaseDate?: string; // ISO date string
  purchasePrice?: number;
  currentValue?: number;
  status: "Active" | "Inactive" | "Maintenance" | "Disposed";
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

const ASSETS_KEY = "ams.assets";

function generateId(): string {
  try {
    if (
      typeof globalThis !== "undefined" &&
      (globalThis as any).crypto &&
      typeof (globalThis as any).crypto.randomUUID === "function"
    ) {
      return (globalThis as any).crypto.randomUUID();
    }
  } catch {}
  return `ast-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function readAssets(): AssetRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ASSETS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AssetRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAssets(assets: AssetRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
}

export function listAssets(): AssetRecord[] {
  return readAssets().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getAssetById(id: string): AssetRecord | null {
  return readAssets().find((a) => a.id === id) ?? null;
}

export function createAsset(
  payload: Omit<AssetRecord, "id" | "createdAt" | "updatedAt">
): AssetRecord {
  const now = new Date().toISOString();
  const asset: AssetRecord = {
    id: generateId(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };
  const assets = readAssets();
  assets.push(asset);
  writeAssets(assets);
  return asset;
}

export function updateAsset(id: string, updates: Partial<AssetRecord>): AssetRecord | null {
  const assets = readAssets();
  const index = assets.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const updated: AssetRecord = {
    ...assets[index],
    ...updates,
    id: assets[index].id,
    updatedAt: new Date().toISOString(),
  };
  assets[index] = updated;
  writeAssets(assets);
  return updated;
}

export function deleteAsset(id: string): boolean {
  const assets = readAssets();
  const next = assets.filter((a) => a.id !== id);
  if (next.length === assets.length) return false;
  writeAssets(next);
  return true;
}

export function seedDemoAssets() {
  if (typeof window === "undefined") return;
  const existing = readAssets();
  if (existing.length > 0) return;
  const now = new Date().toISOString();
  const demo: AssetRecord[] = [
    {
      id: generateId(),
      name: "Dell Laptop XPS 15",
      serialNumber: "DL-XPS-2024-001",
      description: "Developer workstation",
      supplier: "Dell Inc.",
      classification: "Electronics",
      storage: "Office Floor 2",
      assignedUser: "John Doe",
      purchaseDate: now.slice(0, 10),
      purchasePrice: 6500000,
      currentValue: 5200000,
      status: "Active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Office Chair Ergonomic",
      serialNumber: "OF-CH-2023-145",
      description: "Ergonomic mesh chair",
      supplier: "Office Furniture Co.",
      classification: "Furniture",
      storage: "Office Floor 3",
      assignedUser: "Jane Smith",
      purchaseDate: now.slice(0, 10),
      purchasePrice: 450000,
      currentValue: 350000,
      status: "Active",
      createdAt: now,
      updatedAt: now,
    },
  ];
  writeAssets(demo);
}


