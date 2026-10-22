
import * as THREE from 'three';

export class MapManager {
  constructor(scene) {
    this.scene = scene;
    this.objects = new THREE.Group();
    this.scene.add(this.objects);
    this.createMap();
  }

  createMap() {
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: '#e7e2c9',
      roughness: 1
    });

    const parkMaterial = new THREE.MeshStandardMaterial({
      color: '#69bd78',
      roughness: 1
    });

    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: '#b9d9d4',
      roughness: 1
    });

    // 녹지 구역
    for (let i = 0; i < 8; i++) {
      const park = new THREE.Mesh(
        new THREE.PlaneGeometry(10 + (i % 3) * 4, 12),
        parkMaterial
      );

      park.rotation.x = -Math.PI / 2;
      park.position.set(
        (i % 4) * 22 - 33,
        0.025,
        Math.floor(i / 4) * 28 - 14
      );

      this.objects.add(park);
    }

    // 도로
    const roads = [
      [0, 0, 5, 110, 0],
      [-15, 8, 90, 4, Math.PI / 2],
      [15, -20, 70, 4, Math.PI / 2],
      [0, 30, 65, 4, Math.PI / 2],
      [25, 0, 5, 85, 0]
    ];

    for (const [x, z, width, length, rotation] of roads) {
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(width, length),
        roadMaterial
      );

      road.rotation.x = -Math.PI / 2;
      road.rotation.z = rotation;
      road.position.set(x, 0.04, z);
      this.objects.add(road);
    }

    // 단순화된 건물 블록
    for (let i = 0; i < 24; i++) {
      const width = 3 + Math.random() * 5;
      const depth = 3 + Math.random() * 5;
      const height = 1 + Math.random() * 4;

      const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        buildingMaterial
      );

      building.position.set(
        (Math.floor(i / 6) - 2) * 16 + (Math.random() - 0.5) * 4,
        height / 2,
        (i % 6) * 15 - 38
      );

      building.castShadow = true;
      building.receiveShadow = true;
      this.objects.add(building);
    }
  }

  dispose() {
    this.objects.traverse(object => {
      if (object.geometry) object.geometry.dispose();

      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach(material => material.dispose());
      }
    });

    this.scene.remove(this.objects);
  }
}
