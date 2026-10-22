
import { createPokemon } from "../data/pokemon.js";

const STORAGE_KEY = "monster-adventure-collection-v1";

export class CollectionManager {
  constructor() {
    this.collection = this.load();
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.collection));
  }

  add(monster) {
    if (!monster) return false;

    this.collection.push({ ...monster });
    this.save();
    return true;
  }

  createAndAdd(id, level = 1) {
    const monster = createPokemon(id, level);
    if (!monster) return null;

    this.add(monster);
    return monster;
  }

  getAll() {
    return [...this.collection];
  }

  getById(id) {
    return this.collection.filter(monster => monster.id === id);
  }

  getCount() {
    return this.collection.length;
  }

  clear() {
    this.collection = [];
    this.save();
  }
}
