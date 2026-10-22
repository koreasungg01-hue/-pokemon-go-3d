
export class WorldUI {
  constructor(container, world) {
    this.container = container;
    this.world = world;

    this.container.innerHTML = `
      <div class="top-status">
        <div class="trainer-level">Lv. 1</div>
        <div class="nearby-count">주변 탐험</div>
      </div>

      <div class="world-message" id="world-message">
        지면을 터치해 이동하세요!
      </div>

      <div class="bottom-menu">
        <button class="menu-button" data-action="profile">👤</button>
        <button class="menu-button pokeball" data-action="menu">●</button>
        <button class="menu-button" data-action="pokemon">🐾</button>
      </div>

      <div class="side-menu">
        <button class="side-button" data-action="map">🗺️</button>
        <button class="side-button" data-action="nearby">🔎</button>
      </div>
    `;

    this.injectStyles();

    this.onClick = event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const messages = {
        profile: '트레이너 프로필은 다음 단계에서 구현합니다.',
        menu: '게임 메뉴는 다음 단계에서 구현합니다.',
        pokemon: '포켓몬 보관함은 다음 단계에서 구현합니다.',
        map: '현재 3D 월드입니다. 실제 지도는 다음 단계에서 연결합니다.',
        nearby: '주변 포켓몬 시스템은 다음 단계에서 구현합니다.'
      };

      const message = this.container.querySelector('#world-message');
      if (message) message.textContent = messages[button.dataset.action];
    };

    this.container.addEventListener('click', this.onClick);
  }

  injectStyles() {
    if (document.querySelector('#world-ui-styles')) return;

    const style = document.createElement('style');
    style.id = 'world-ui-styles';

    style.textContent = `
      .top-status {
        position: absolute;
        top: max(18px, env(safe-area-inset-top));
        left: 16px;
        right: 16px;
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .trainer-level, .nearby-count {
        padding: 10px 16px;
        border-radius: 24px;
        color: #fff;
        background: rgba(30, 115, 135, .85);
        font-weight: 700;
        box-shadow: 0 2px 8px #0002;
      }

      .world-message {
        position: absolute;
        top: 76px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 90%;
        white-space: nowrap;
        padding: 9px 14px;
        border-radius: 20px;
        background: #ffffffd9;
        color: #31545a;
        font-size: 13px;
        text-align: center;
      }

      .bottom-menu {
        position: absolute;
        bottom: max(20px, env(safe-area-inset-bottom));
        left: 16px;
        right: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .menu-button, .side-button {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        color: #385e6b;
        background: #ffffffed;
        box-shadow: 0 3px 9px #0002;
        font-size: 23px;
      }

      .menu-button.pokeball {
        width: 68px;
        height: 68px;
        border: 5px solid white;
        color: #fff;
        background: linear-gradient(
          to bottom,
          #f45c61 0 45%,
          #46535a 45% 55%,
          #fff 55% 100%
        );
        font-size: 23px;
      }

      .side-menu {
        position: absolute;
        right: 14px;
        bottom: 125px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .side-button {
        width: 44px;
        height: 44px;
        font-size: 19px;
      }

      @media (min-width: 700px) {
        .top-status {
          left: 28px;
          right: 28px;
        }

        .bottom-menu {
          left: 28px;
          right: 28px;
          bottom: 24px;
        }
      }
    `;

    document.head.appendChild(style);
  }
}
