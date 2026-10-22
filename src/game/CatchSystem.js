
export class CatchSystem {
  constructor(collectionManager) {
    this.collection = collectionManager;
  }

  attempt(monster, bonus = 0) {
    if (!monster) {
      return { success: false, message: "포획할 몬스터가 없다!" };
    }

    const rarity = Math.max(1, monster.rarity || 1);
    const chance = Math.max(0.1, Math.min(0.95, 0.82 - rarity * 0.12 + bonus));
    const success = Math.random() < chance;

    if (success) {
      this.collection.add(monster);
      return {
        success: true,
        message: `${monster.name} 포획 성공!`,
        monster
      };
    }

    return {
      success: false,
      message: `${monster.name}이(가) 몬스터볼에서 빠져나왔다!`,
      monster
    };
  }
}
