
export class EncounterSystem {
  constructor(world, pokemonManager, catchSystem) {
    this.world = world;
    this.pokemonManager = pokemonManager;
    this.catchSystem = catchSystem;
    this.activePokemon = null;
    this.onChange = () => {};

    this.raycaster = new world.raycaster.constructor();
    this.pointer = world.pointer.clone();

    this.onPointerDown = event => this.handlePointer(event);

    world.renderer.domElement.addEventListener(
      'pointerdown',
      this.onPointerDown
    );
  }

  handlePointer(event) {
    if (event.button !== undefined && event.button !== 0) return;

    const rect = this.world.renderer.domElement.getBoundingClientRect();

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.world.camera);

    const groups = this.pokemonManager.pokemon
      .filter(entry => !entry.caught)
      .map(entry => entry.group);

    const hits = this.raycaster.intersectObjects(groups, true);

    if (!hits.length) return;

    let object = hits[0].object;

    while (object && object.userData.pokemonId === undefined) {
      object = object.parent;
    }

    if (!object) return;

    const pokemon = this.pokemonManager.getById(
      object.userData.pokemonId
    );

    if (!pokemon) return;

    const distance = this.world.player.position.distanceTo(
      pokemon.group.position
    );

    if (distance > 18) {
      this.world.target = pokemon.group.position.clone();
      this.onChange({
        type: 'message',
        message: '포켓몬에게 가까이 이동하세요!'
      });
      return;
    }

    this.activePokemon = pokemon;

    this.onChange({
      type: 'encounter',
      pokemon
    });
  }

  catchActive() {
    if (!this.activePokemon) return null;

    const result = this.catchSystem.attemptCatch(
      this.activePokemon.id
    );

    if (result.success) this.activePokemon = null;

    this.onChange({
      type: 'catch-result',
      result
    });

    return result;
  }

  close() {
    this.activePokemon = null;
    this.onChange({ type: 'close' });
  }

  destroy() {
    this.world.renderer.domElement.removeEventListener(
      'pointerdown',
      this.onPointerDown
    );
  }
}
