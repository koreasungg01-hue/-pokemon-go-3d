
const app = document.querySelector("#app") || document.body;

function showError(error) {
  console.error(error);

  let panel = document.querySelector("#error-panel");

  if (!panel) {
    panel = document.createElement("pre");
    panel.id = "error-panel";
    panel.style.cssText = `
      position:fixed; inset:12px; z-index:99999;
      overflow:auto; padding:18px; border-radius:12px;
      background:#241316; color:#ffd9d9; white-space:pre-wrap;
      font:14px/1.6 monospace; overflow-wrap:anywhere;
    `;
    document.body.appendChild(panel);
  }

  panel.textContent =
    "게임 실행 오류\n\n" +
    (error?.stack || error?.message || String(error)) +
    "\n\n이 오류 내용을 복사해서 보내 주세요.";
}

async function startGame() {
  try {
    const [{ World3D }, { WorldUI }] = await Promise.all([
      import("./game/World3D.js"),
      import("./ui/WorldUI.js")
    ]);

    if (typeof World3D !== "function") {
      throw new Error(
        "World3D.js에서 World3D를 찾을 수 없습니다. export 이름을 확인하세요."
      );
    }

    if (typeof WorldUI !== "function") {
      throw new Error(
        "WorldUI.js에서 WorldUI를 찾을 수 없습니다. export 이름을 확인하세요."
      );
    }

    const world = new World3D();
    const ui = new WorldUI();

    window.gameDebug = { world, ui };

    console.info("게임 기본 모듈 초기화 완료", window.gameDebug);
  } catch (error) {
    showError(error);
  }
}

window.addEventListener("error", event => {
  showError(event.error || event.message);
});

window.addEventListener("unhandledrejection", event => {
  showError(event.reason);
});

startGame();
