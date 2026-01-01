import { create } from 'zustand';
import { DatabaseService } from '../services/DatabaseService';

// Interface for stored mushroom items
export interface MushroomItem {
  id: string;
  name: string;
  scientific: string;
  date: string;
  image: string; // uri
  match: number;
  type: string; // Edible, Toxic, etc.
  icon: string;
  iconColor: string;
  tag?: string;
  tagColor?: string;
}

interface DetectionResult {
  label: string;
  confidence: number;
}

interface FungiStore {
  isScanning: boolean;
  setIsScanning: (isScanning: boolean) => void;
  result: DetectionResult | null;
  setResult: (result: DetectionResult | null) => void;
  capturedImage: string | null;
  setCapturedImage: (uri: string | null) => void;
  currentScreen: 'home' | 'camera' | 'details' | 'library' | 'settings' | 'donation' | 'results';
  setCurrentScreen: (screen: 'home' | 'camera' | 'details' | 'library' | 'settings' | 'donation' | 'results') => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // New: Flash & Collection
  flashMode: 'auto' | 'on' | 'off';
  setFlashMode: (mode: 'auto' | 'on' | 'off') => void;
  collection: MushroomItem[];
  loadCollection: () => void;
  addToCollection: (item: MushroomItem) => void;
  deleteFromCollection: (id: string) => void;
}

export const useFungiStore = create<FungiStore>((set) => ({
  isScanning: false,
  setIsScanning: (isScanning) => set({ isScanning }),
  result: null,
  setResult: (result) => set({ result }),
  capturedImage: null,
  setCapturedImage: (capturedImage) => set({ capturedImage }),
  currentScreen: 'home',
  setCurrentScreen: (currentScreen) =>
  set((state) => ({
    currentScreen,
    // Clear result/image when entering camera, but keep them when going to results
    result: currentScreen === 'camera' ? null : state.result,
    capturedImage: currentScreen === 'camera' ? null : state.capturedImage, 
  })),
  isDarkMode: true,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // New Defaults
  flashMode: 'auto',
  setFlashMode: (mode) => set({ flashMode: mode }),
  collection: [],
  loadCollection: () => {
    DatabaseService.initDatabase();
    const items = DatabaseService.getMushrooms();
    set({ collection: items });
  },
  addToCollection: (item) => {
    DatabaseService.saveMushroom(item);
    // Reload from DB to ensure consistency or append locally
    set((state) => ({ collection: [item, ...state.collection] }));
  },
  deleteFromCollection: (id) => {
    DatabaseService.deleteMushroom(id);
    set((state) => ({ collection: state.collection.filter(i => i.id !== id) }));
  },
}));


