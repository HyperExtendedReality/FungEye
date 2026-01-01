import * as SQLite from 'expo-sqlite';
import { MushroomItem } from '../store/useFungiStore';

// Open the database (or create if not exists)
// Note: expo-sqlite v14+ changes might apply, but standard openDatabase is safe for now usually.
// However, let's use the modern sync/async API if possible or stick to the standard check.
// Error handling is crucial.

const db = SQLite.openDatabaseSync('fungeye.db');

// Helper to ensure proper initialization
const ensureInitialized = () => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS mushrooms (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          scientific TEXT NOT NULL,
          date TEXT NOT NULL,
          image TEXT NOT NULL,
          match INTEGER NOT NULL,
          type TEXT NOT NULL,
          icon TEXT NOT NULL,
          iconColor TEXT NOT NULL,
          tag TEXT,
          tagColor TEXT
        );
      `);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
};

// Initialize immediately on module load to catch early issues, 
// but also ensure it's run before critical actions just in case.
ensureInitialized();

export const DatabaseService = {
  initDatabase: ensureInitialized,

  saveMushroom: (item: MushroomItem) => {
    ensureInitialized();
    try {
      const statement = db.prepareSync(
        'INSERT OR REPLACE INTO mushrooms (id, name, scientific, date, image, match, type, icon, iconColor, tag, tagColor) VALUES ($id, $name, $scientific, $date, $image, $match, $type, $icon, $iconColor, $tag, $tagColor)'
      );
      
      const result = statement.executeSync({
        $id: item.id,
        $name: item.name,
        $scientific: item.scientific,
        $date: item.date,
        $image: item.image,
        $match: item.match,
        $type: item.type,
        $icon: item.icon,
        $iconColor: item.iconColor,
        $tag: item.tag || null,
        $tagColor: item.tagColor || null
      });
      
      console.log('Mushroom saved:', result);
    } catch (error) {
      console.error('Error saving mushroom:', error);
    }
  },

  getMushrooms: (): MushroomItem[] => {
    ensureInitialized();
    try {
      const result = db.getAllSync('SELECT * FROM mushrooms ORDER BY date DESC');
      return result as MushroomItem[];
    } catch (error) {
      console.error('Error fetching mushrooms:', error);
      return [];
    }
  },

  deleteMushroom: (id: string) => {
    ensureInitialized();
    try {
        const statement = db.prepareSync('DELETE FROM mushrooms WHERE id = $id');
        statement.executeSync({ $id: id });
        console.log('Mushroom deleted:', id);
    } catch (error) {
        console.error('Error deleting mushroom:', error);
    }
  }
};
