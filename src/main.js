
import './styles/global.css';
import { World3D } from './game/World3D.js';
import { WorldUI } from './ui/WorldUI.js';

const worldElement = document.querySelector('#game-world');
const uiElement = document.querySelector('#game-ui');

const world = new World3D(worldElement);
new WorldUI(uiElement, world);

world.start();

window.addEventListener('beforeunload', () => {
  world.destroy();
});
