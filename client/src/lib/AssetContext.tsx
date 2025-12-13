import { createContext, useContext, useState, ReactNode } from 'react';

// Define the asset types
export interface MarketingAsset {
  id: string;
  type: 'logo' | 'background' | 'symbol' | 'character' | 'product';
  file: File;
  previewUrl: string;
  name: string;
}

interface AssetContextType {
  assets: MarketingAsset[];
  addAsset: (files: File[]) => void;
  removeAsset: (id: string) => void;
  getAssetsByType: (type: MarketingAsset['type']) => MarketingAsset[];
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<MarketingAsset[]>([]);

  const addAsset = (files: File[]) => {
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
        name: file.name
      };
    });
    
    setAssets(prev => [...prev, ...newAssets]);
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const getAssetsByType = (type: MarketingAsset['type']) => {
    return assets.filter(a => a.type === type);
  };

  return (
    <AssetContext.Provider value={{ assets, addAsset, removeAsset, getAssetsByType }}>
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
