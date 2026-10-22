
export class CatchSystem {
  constructor(pokemonManager) {
    this.pokemonManager = pokemonManager;
    this.collection = this.load();
  }

  load() {
    try {
      return JSON.parse(
        localStorage.getItem('pokemon-go-3d-collection') || '[]'
      );
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(
      'pokemon-go-3d-collection',
      JSON.stringify(this.collection)
    );
  }

  attemptCatch(id) {
    const pokemon = this.pokemonManager.getById(id);

    if (!pokemon) {
      return { success: false, message: '포켓몬을 찾을 수 없습니다.' };
    }

    const success = Math.random() < 0.7;

    if (!success) {
      return { success: false, message: '포켓몬이 볼에서 빠져나왔습니다!' };
    }

    const record = {
      id: `${Date.now()}-${id}`,
      speciesId: pokemon.species.id,
      name: pokemon.species.name,
      color: pokemon.species.color,
      cp: 100 + Math.floor(Math.random() * 401),
      caughtAt: new Date().toISOString()
    };

    if (!this.pokemonManager.catchPokemon(id)) {
      return { success: false, message: '포획에 실패했습니다.' };
    }

    this.collection.push(record);
    this.save();

    return {
      success: true,
      message: `${record.name} 포획 성공!`,
      pokemon: record
    };
  }

  getCollection() {
    return [...this.collection];
  }
}
