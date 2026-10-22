
import * as THREE from 'three';

const SPECIES = [
  { id: 'sprout', name: '풀숲 친구', color: '#67bb70' },
  { id: 'ember', name: '불꽃 친구', color: '#f18a53' },
  { id: 'aqua', name: '물 친구', color: '#5eabe2' },
  { id: 'spark', name: '전기 친구', color: '#f3d85a' },
  { id: 'shadow', name: '그림자 친구', color: '#a58acb' }
];

export class PokemonManager {
  constructor(scene, player, onEncounter = () => {}) {
    this.scene = scene;
    this.player = player;
    this.onEncounter = onEncounter;
    this.pokemon = [];
    this.nextId = 1;

    this.createInitialPokemon();
  }

  createPokemon(species, position) {
    const group = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
      color: species.color,
      roughness: 0.72
    });

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.52, 16, 12),
      material
    );

    body.position.y = 0.55;
    body.castShadow = true;
    group.add(body);

    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: '#20252a'
    });

    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        eyeMaterial
      );

      eye.position.set(side * 0.17, 0.65, 0.43);
      group.add(eye);
    }

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.65, 0.77, 32),
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      })
    );

    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.04;
    group.add(ring);

    group.position.copy(position);
    group.userData.pokemonId = this.nextId++;

    this.scene.add(group);

    const entry = {
      id: group.userData.pokemonId,
      species,
      group,
      phase: Math.random() * Math.PI * 2,
      caught: false
    };

    this.pokemon.push(entry);
    return entry;
  }

  createInitialPokemon() {
    const positions = [
      [-4, 0, -5],
      [5, 0, -8],
      [-8, 0, 4],
      [7, 0, 6],
      [2, 0, 12],
      [-11, 0, -12],
      [12, 0, -15],
      [-3, 0, 18]
    ];

    positions.forEach((coords, index) => {
      const species = SPECIES[index % SPECIES.length];

      this.createPokemon(
        species,
        new THREE.Vector3(...coords)
      );
    });
  }

  update(time) {
    for (const entry of this.pokemon) {
      if (entry.caught) continue;

      entry.group.position.y =
        Math.sin(time * 2 + entry.phase) * 0.12;

      entry.group.rotation.y =
        Math.sin(time + entry.phase) * 0.18;
    }
  }

  getAtPosition(position, radius = 2) {
    return this.pokemon.find(entry => {
      if (entry.caught) return false;

      const distance = entry.group.position.distanceTo(position);
      return distance <= radius;
    });
  }

  getById(id) {
    return this.pokemon.find(entry => entry.id === id && !entry.caught);
  }

  catchPokemon(id) {
    const entry = this.getById(id);
    if (!entry) return false;

    entry.caught = true;
    this.scene.remove(entry.group);
    return true;
  }

  dispose() {
    for (const entry of this.pokemon) {
      entry.group.traverse(object => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach(material => material.dispose());
        }
      });

      this.scene.remove(entry.group);
    }

    this.pokemon = [];
  }
}
