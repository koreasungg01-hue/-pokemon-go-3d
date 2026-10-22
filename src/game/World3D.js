
import * as THREE from 'three';

export class World3D {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#91d8ed');
    this.scene.fog = new THREE.Fog('#91d8ed', 35, 110);

    this.camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    this.camera.position.set(0, 20, 25);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.5)
    );
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.running = false;
    this.frameId = null;

    this.createLights();
    this.createGround();
    this.createRoads();
    this.createEnvironment();
    this.createPlayer();

    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);

    this.onPointerDown = event => this.handlePointer(event);
    this.renderer.domElement.addEventListener(
      'pointerdown',
      this.onPointerDown
    );

    this.target = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
  }

  createLights() {
    this.scene.add(new THREE.HemisphereLight(0xe4f8ff, 0x6b8150, 2));

    const sun = new THREE.DirectionalLight(0xfff3d4, 2.2);
    sun.position.set(-12, 24, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    this.scene.add(sun);
  }

  createGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({
        color: '#72c47c',
        roughness: 1
      })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = 'ground';
    this.scene.add(ground);

    for (let i = 0; i < 90; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;

      const patch = new THREE.Mesh(
        new THREE.CircleGeometry(1 + Math.random() * 3, 8),
        new THREE.MeshStandardMaterial({
          color: i % 2 ? '#7ac981' : '#69bc76',
          roughness: 1
        })
      );

      patch.rotation.x = -Math.PI / 2;
      patch.position.set(x, 0.015, z);
      this.scene.add(patch);
    }
  }

  createRoads() {
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: '#d6d7bd',
      roughness: 1
    });

    const roadLineMaterial = new THREE.MeshBasicMaterial({
      color: '#f5efc8'
    });

    const addRoad = (x, z, width, length, rotation = 0) => {
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(width, length),
        roadMaterial
      );

      road.rotation.x = -Math.PI / 2;
      road.rotation.z = rotation;
      road.position.set(x, 0.035, z);
      this.scene.add(road);

      const line = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12, length),
        roadLineMaterial
      );

      line.rotation.x = -Math.PI / 2;
      line.rotation.z = rotation;
      line.position.set(x, 0.045, z);
      this.scene.add(line);
    };

    addRoad(0, 0, 5, 110);
    addRoad(-15, 8, 90, 4, Math.PI / 2);
    addRoad(15, -20, 70, 4, Math.PI / 2);
    addRoad(0, 30, 65, 4, Math.PI / 2);
  }

  createEnvironment() {
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: '#79543a'
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: '#318e58',
      roughness: 1
    });

    for (let i = 0; i < 45; i++) {
      const x = (Math.random() - 0.5) * 95;
      const z = (Math.random() - 0.5) * 95;

      if (Math.abs(x) < 4 || Math.abs(z - 8) < 4) continue;

      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.22, 1.4, 7),
        trunkMaterial
      );
      trunk.position.y = 0.7;
      trunk.castShadow = true;
      tree.add(trunk);

      const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(0.9 + Math.random() * 0.4, 8, 7),
        leafMaterial
      );
      leaves.position.y = 1.9;
      leaves.castShadow = true;
      tree.add(leaves);

      tree.position.set(x, 0, z);
      this.scene.add(tree);
    }
  }

  createPlayer() {
    this.player = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.32, 0.65, 4, 8),
      new THREE.MeshStandardMaterial({ color: '#263b55' })
    );
    body.position.y = 0.85;
    body.castShadow = true;
    this.player.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 12, 10),
      new THREE.MeshStandardMaterial({ color: '#f1c49b' })
    );
    head.position.y = 1.48;
    this.player.add(head);

    const marker = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.82, 40),
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      })
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.y = 0.08;
    this.player.add(marker);

    this.scene.add(this.player);
  }

  handlePointer(event) {
    if (event.button !== undefined && event.button !== 0) return;

    const rect = this.renderer.domElement.getBoundingClientRect();

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const ground = this.scene.children.filter(
      object => object.name === 'ground'
    );

    const hits = this.raycaster.intersectObjects(ground, false);

    if (hits.length > 0) {
      this.target = hits[0].point.clone();
      this.target.y = 0;
    }
  }

  update(delta) {
    if (this.target) {
      const direction = this.target.clone().sub(this.player.position);
      direction.y = 0;

      const distance = direction.length();

      if (distance < 0.15) {
        this.target = null;
      } else {
        direction.normalize();

        const speed = 4;
        this.player.position.addScaledVector(
          direction,
          Math.min(speed * delta, distance)
        );

        this.player.rotation.y = Math.atan2(direction.x, direction.z);
      }
    }

    const desiredCamera = new THREE.Vector3(
      this.player.position.x,
      this.player.position.y + 20,
      this.player.position.z + 25
    );

    this.camera.position.lerp(desiredCamera, 1 - Math.exp(-3 * delta));
    this.camera.lookAt(
      this.player.position.x,
      0,
      this.player.position.z
    );
  }

  animate = () => {
    if (!this.running) return;

    this.frameId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.05);

    this.update(delta);
    this.renderer.render(this.scene, this.camera);
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (!width || !height) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.frameId);

    window.removeEventListener('resize', this.onResize);

    this.renderer.domElement.removeEventListener(
      'pointerdown',
      this.onPointerDown
    );

    this.scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();

      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach(material => material.dispose());
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
