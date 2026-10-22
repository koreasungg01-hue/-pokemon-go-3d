
import { MOVE_DATA } from "../data/pokemon.js";

const TYPE_ADVANTAGE = {
  "풀": { strong: "물", weak: "불꽃" },
  "불꽃": { strong: "풀", weak: "물" },
  "물": { strong: "불꽃", weak: "풀" },
  "전기": { strong: "물", weak: "풀" }
};

export class BattleSystem {
  constructor() {
    this.playerPokemon = null;
    this.enemyPokemon = null;
    this.active = false;
    this.turn = "player";
    this.log = [];
    this.onUpdate = null;
  }

  start(playerPokemon, enemyPokemon) {
    if (!playerPokemon || !enemyPokemon) {
      throw new Error("배틀에 참가할 몬스터가 필요합니다.");
    }

    this.playerPokemon = playerPokemon;
    this.enemyPokemon = enemyPokemon;
    this.playerPokemon.hp = this.playerPokemon.maxHp;
    this.enemyPokemon.hp = this.enemyPokemon.maxHp;
    this.active = true;
    this.turn = "player";
    this.log = [`야생 ${enemyPokemon.name}이(가) 나타났다!`];
    this.notify();
    return this.getState();
  }

  attack(moveId) {
    if (!this.active || this.turn !== "player") return this.getState();

    const move = MOVE_DATA[moveId];
    if (!move) return this.getState();

    this.performAttack(this.playerPokemon, this.enemyPokemon, move);
    if (this.enemyPokemon.hp <= 0) {
      this.enemyPokemon.hp = 0;
      this.log.push(`${this.enemyPokemon.name}이(가) 쓰러졌다!`);
      this.finish("win");
      return this.getState();
    }

    this.turn = "enemy";
    this.notify();

    // 적의 반격을 잠깐 뒤에 처리한다.
    setTimeout(() => {
      if (!this.active || this.turn !== "enemy") return;

      const moveIds = this.enemyPokemon.moves || ["tackle"];
      const enemyMoveId = moveIds[Math.floor(Math.random() * moveIds.length)];
      const enemyMove = MOVE_DATA[enemyMoveId] || MOVE_DATA.tackle;

      this.performAttack(this.enemyPokemon, this.playerPokemon, enemyMove);

      if (this.playerPokemon.hp <= 0) {
        this.playerPokemon.hp = 0;
        this.log.push(`${this.playerPokemon.name}이(가) 쓰러졌다!`);
        this.finish("lose");
      } else {
        this.turn = "player";
        this.notify();
      }
    }, 700);

    return this.getState();
  }

  performAttack(attacker, defender, move) {
    const advantage = TYPE_ADVANTAGE[move.type];
    let multiplier = 1;

    if (advantage?.strong === defender.type) multiplier = 1.5;
    if (advantage?.weak === defender.type) multiplier = 0.7;

    const damage = Math.max(
      1,
      Math.floor((attacker.attack + move.power - defender.defense * 0.4) * multiplier)
    );

    defender.hp = Math.max(0, defender.hp - damage);

    const effect =
      multiplier > 1 ? " 효과가 굉장했다!" :
      multiplier < 1 ? " 효과가 별로였다." : "";

    this.log.push(
      `${attacker.name}의 ${move.name}! ${defender.name}에게 ${damage} 피해.${effect}`
    );
  }

  finish(result) {
    this.active = false;

    if (result === "win") {
      this.playerPokemon.xp = (this.playerPokemon.xp || 0) + 20;
      this.log.push(`${this.playerPokemon.name}이(가) 경험치 20을 얻었다!`);
    }

    this.log.push(result === "win" ? "승리!" : "패배!");
    this.notify();
  }

  getState() {
    return {
      active: this.active,
      turn: this.turn,
      playerPokemon: this.playerPokemon,
      enemyPokemon: this.enemyPokemon,
      log: [...this.log]
    };
  }

  notify() {
    this.onUpdate?.(this.getState());
  }
}
