
export const POKEMON_DATA = [
  {
    id: "sproutlet",
    name: "새싹이",
    type: "풀",
    rarity: 1,
    maxHp: 42,
    attack: 12,
    defense: 9,
    color: 0x62c96b,
    moves: ["leaf", "tackle"],
    description: "작은 잎사귀로 햇빛을 모으는 풀 타입 몬스터."
  },
  {
    id: "embercub",
    name: "불꼬마",
    type: "불꽃",
    rarity: 2,
    maxHp: 36,
    attack: 16,
    defense: 7,
    color: 0xff7043,
    moves: ["ember", "tackle"],
    description: "기운이 넘치고 꼬리 끝에서 불꽃이 타오른다."
  },
  {
    id: "aquaff",
    name: "물방울이",
    type: "물",
    rarity: 1,
    maxHp: 48,
    attack: 10,
    defense: 12,
    color: 0x42a5f5,
    moves: ["splash", "tackle"],
    description: "물을 모아 방어하는 차분한 물 타입 몬스터."
  },
  {
    id: "voltkit",
    name: "번개냥",
    type: "전기",
    rarity: 3,
    maxHp: 34,
    attack: 18,
    defense: 6,
    color: 0xffd54f,
    moves: ["spark", "tackle"],
    description: "빠르게 움직이며 작은 전기를 방출한다."
  }
];

export const MOVE_DATA = {
  leaf: { name: "잎사귀 날리기", power: 12, type: "풀" },
  ember: { name: "불씨", power: 14, type: "불꽃" },
  splash: { name: "물보라", power: 10, type: "물" },
  spark: { name: "전기 충격", power: 15, type: "전기" },
  tackle: { name: "몸통 박치기", power: 8, type: "노말" }
};

export function createPokemon(id, level = 1) {
  const base = POKEMON_DATA.find(p => p.id === id);
  if (!base) return null;

  const lv = Math.max(1, Math.floor(level));

  return {
    ...base,
    uid: `${base.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    level: lv,
    maxHp: base.maxHp + (lv - 1) * 4,
    hp: base.maxHp + (lv - 1) * 4,
    attack: base.attack + (lv - 1) * 2,
    defense: base.defense + (lv - 1),
    xp: 0
  };
}
