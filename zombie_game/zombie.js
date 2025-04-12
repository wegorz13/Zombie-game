const game_window = document.getElementById("game_window");
const window_width = Number(
  window
    .getComputedStyle(game_window)
    .getPropertyValue("width")
    .replace("px", "")
);
const window_height = Number(
  window
    .getComputedStyle(game_window)
    .getPropertyValue("height")
    .replace("px", "")
);

const score = document.getElementById("score");
const sad_soundtrack = document.getElementById("sad_soundtrack");
const action_soundtrack = document.getElementById("action_soundtrack");
const shot_sound = document.getElementById("shot");
const zombie_sound = document.getElementById("zombie_sound");
zombie_sound.volume = 0.5;
const zombie_width = 200;
const zombie_height = 312;
const min_speed = 5;
const max_speed = 30;
const fps = 24;
const interval = 1000 / fps;

game_window.addEventListener("click", (e) => {
  shot_sound.currentTime = 0;
  shot_sound.play();
  action_soundtrack.play();
  let temp_score = parseInt(score.innerText);
  temp_score -= 5;
  score.innerText = temp_score;
});

function ZOMBIEGAME() {
  let life_left = 3;
  let made_zombies = 0;
  let zombies = [];

  let next_zombie;
  let last = 0;

  action_soundtrack.play();
  createZombie();

  const moveZombie = (timestamp) => {
    if (timestamp - last >= interval && life_left >= 0) {
      last = timestamp;

      for (let i = 0; i < zombies.length; i++) {
        let zombie = zombies[i];

        let el_style = window.getComputedStyle(zombie);
        let position_x = Number(
          el_style.getPropertyValue("background-position-x").replace("px", "")
        );
        let right_value = Number(
          el_style.getPropertyValue("right").replace("px", "")
        );
        let this_zombie_width = Number(
          el_style.getPropertyValue("width").replace("px", "")
        );

        position_x -= this_zombie_width;
        zombie.style["background-position-x"] = position_x + "px";

        if (right_value < window_width - this_zombie_width) {
          let speed = Number(
            getComputedStyle(zombie)
              .getPropertyValue("font-size")
              .replace("px", "")
          );
          zombie.style.right = right_value + speed + "px";
        } else {
          let life_lost_id = "life_" + life_left;
          document
            .getElementById(String(life_lost_id))
            .setAttribute("src", "images/empty_heart.png");
          life_left -= 1;
          game_window.removeChild(zombie);
          zombies.splice(i, 1);

          if (life_left == 0) {
            clearTimeout(next_zombie);
            gameoverProcedure();
            return;
          }
        }
      }
    }

    requestAnimationFrame(moveZombie);
  };

  requestAnimationFrame(moveZombie);

  function createZombie() {
    let zombie = document.createElement("div");
    let zombie_id = "zombie_" + made_zombies;
    zombie.setAttribute("id", zombie_id);
    zombie.classList.add("zombie");

    game_window.appendChild(zombie);
    made_zombies += 1;

    zombie.style.fontSize =
      Math.floor(Math.random() * (max_speed - min_speed) + min_speed) + "px";
    zombie.style.top =
      Math.floor(Math.random() * (window_height - zombie_height)) + "px";

    let zombie_size = Math.floor(Math.random() * 3 + 1);

    zombie.style.width = zombie_width / zombie_size + "px";
    zombie.style.height = zombie_height / zombie_size + "px";

    zombie_sound.play();

    zombie.addEventListener("click", (e) => {
      e.stopPropagation();
      shot_sound.currentTime = 0;
      shot_sound.play();
      // action_soundtrack.play();

      let temp_score = parseInt(score.innerText);
      temp_score += 20;
      score.innerText = temp_score;

      game_window.removeChild(zombie);

      let index = zombies.indexOf(zombie);
      zombies.splice(index, 1);
    });

    zombies.push(zombie);
    let difficulty = Math.floor(2500 / (Math.floor(made_zombies / 5) + 1));
    if (life_left > 0) {
      next_zombie = setTimeout(createZombie, 300 + difficulty);
    }
  }

  function gameoverProcedure() {
    action_soundtrack.pause();
    sad_soundtrack.play();
    for (let i = 0; i < zombies.length; i++) {
      let zombie = zombies[i];
      game_window.removeChild(zombie);
    }

    go_window = document.createElement("div");
    go_window.classList.add("game_over_screen");
    game_window.appendChild(go_window);

    restart_btn = document.createElement("button");
    restart_btn.innerText = "SCORE:" + score.innerText + " PLAY AGAIN";
    restart_btn.classList.add("restart_button");
    go_window.appendChild(restart_btn);

    restart_btn.addEventListener("click", (e) => {
      e.stopPropagation();

      for (let i = 1; i < 4; i++) {
        let life_id = "life_" + i;
        document
          .getElementById(String(life_id))
          .setAttribute("src", "images/full_heart.png");
      }
      score.innerText = "000";

      go_window.removeChild(restart_btn);
      game_window.removeChild(go_window);
      sad_soundtrack.pause();
      sad_soundtrack.currentTime = 0;
      ZOMBIEGAME();
    });
  }
}

ZOMBIEGAME();
