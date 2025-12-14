import { createContext, useContext, useState, ReactNode } from 'react';

// Define the asset types
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface MarketingAsset {
  id: string;
  type: 'logo' | 'background' | 'symbol' | 'character' | 'product';
  file: File;
  previewUrl: string;
  name: string;
  folderId?: string | null;
}

interface AssetContextType {
  assets: MarketingAsset[];
  folders: Folder[];
  addAsset: (files: File[], folderId?: string | null) => void;
  removeAsset: (id: string) => void;
  getAssetsByType: (type: MarketingAsset['type']) => MarketingAsset[];
  createFolder: (name: string, parentId?: string | null) => void;
  deleteFolder: (id: string) => void;
  moveAssetToFolder: (assetId: string, folderId: string | null) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'marketing-kits', name: 'Marketing Kits', parentId: null }
  ]);

  const createFolder = (name: string, parentId: string | null = null) => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      parentId
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    // Also move assets back to root or delete them? Let's move to root for safety
    setAssets(prev => prev.map(a => a.folderId === id ? { ...a, folderId: null } : a));
  };

  const addAsset = (files: File[], folderId: string | null = null) => {
    const newAssets = files.map(file => {
      // Auto-categorize based on name or simple heuristics for demo
      let type: MarketingAsset['type'] = 'symbol';
      if (file.name.toLowerCase().includes('logo')) type = 'logo';
      else if (file.name.toLowerCase().includes('bg') || file.name.toLowerCase().includes('background')) type = 'background';
      else if (file.name.toLowerCase().includes('char')) type = 'character';
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        folderId
      };
    });
    
    setAssets(prev => [...prev, ...newAssets]);
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const moveAssetToFolder = (assetId: string, folderId: string | null) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, folderId } : a));
  };

  const getAssetsByType = (type: MarketingAsset['type']) => {
    return assets.filter(a => a.type === type);
  };

  return (
    <AssetContext.Provider value={{ assets, folders, addAsset, removeAsset, getAssetsByType, createFolder, deleteFolder, moveAssetToFolder }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
}
