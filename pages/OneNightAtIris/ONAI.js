body = document.getElementsByTagName("body")[0];
let monitor_up = 0;
let curr_cam = 0;
let last_cam = 1;

let ClosedLvent = false;
let ClosedRvent = false;

function randint(min, max) {
  return Math.floor(Math.random()* (max - min + 1) + min);
}


function initialize_night([iris, rb] , leo, pickles, hazel, nigel, ruby, [taylor, limbo]) {
  draw_monitor();
  create_monitor_tab();
  create_office();
}

/*cameras*/
function create_camera_scenes() {
  let scenes = [];
  for (let i=1; i<4; i++) {
    scenes.push(`../../resources/ONAI/Cam${i}.jpg`);
  }
  return scenes;
}

function create_monitor_tab() {
  const monitorTab = document.createElement("div");
  monitorTab.id = "monitorTab";

  monitorHitbox.appendChild(monitorTab);

  monitorTab.setAttribute("onclick", "change_monitor_state()")

}

function change_monitor_state() {
  monitor_up = Number(!Boolean(monitor_up));

  if (monitor_up == 1) {
    pull_up_monitor();
  }
  else {
    pull_down_monitor();
  }
}

function pull_up_monitor() {

  display_camera(curr_cam);
  const cams = document.getElementsByClassName("camEl");
  for (let i=0; i<cams.length;i++) {
    cams[i].style.display = "block"; }
}

function pull_down_monitor() {
  const cams = document.getElementsByClassName("camEl");
  for (let i=0; i<cams.length;i++) {
    cams[i].style.display = "none";}

}

function draw_monitor() {

  const monitor = document.createElement("div");
  monitor.id = "monitor";
  monitor.className = "camEl";
  body.appendChild(monitor);

  for (let i=1; i<4; i++) {
    const camButton = document.createElement("div");

    camButton.textContent = `Cam ${i}`;
    camButton.className = "camEl camButtons";
    camButton.style.backgroundColor = "black";
    camButton.style.color = "white";
    camButton.style.top = "10vh";
    camButton.style.left = `${(70 + (i*5))}vw`;
    camButton.onclick = function(){change_camera(camButton)};
    
    
    monitor.appendChild(camButton);

  }
}

function display_camera(num) {
  const camRooms = create_camera_scenes();
  const monitor = document.getElementById("monitor");
  monitor.style.backgroundImage = `url(${camRooms[num]})`;
}

function change_camera(self) {
  const content = self.textContent;
  const last = document.getElementsByClassName("camButtons")[last_cam];
  last.style.backgroundColor = "black";
  
  curr_cam = Number(content.at(-1)) -1;
  display_camera(curr_cam);
  self.style.backgroundColor = "lime";
  last_cam = curr_cam;
}

/*vents*/
function create_office() {
  const leftContainer = document.createElement("div");
  leftContainer.className = "officeEl";
  const leftButton = document.createElement("div");
  const leftVent = document.createElement("div");
  leftContainer.id = "leftContainer";
  leftButton.id = "leftButton";
  leftButton.onclick = function(){toggle_left()};
  leftVent.id = "leftVent";
  leftContainer.style.left = "15vw";
  leftContainer.style.top = "50vh";
  body.appendChild(leftContainer);
  leftContainer.appendChild(leftButton);
  leftContainer.appendChild(leftVent);

  const rightContainer = document.createElement("div");
  rightContainer.className = "officeEl";
  const rightButton = document.createElement("div");
  const rightVent = document.createElement("div");
  rightContainer.id = "rightContainer";
  rightButton.id = "rightButton";
  rightButton.onclick = function(){toggle_right()};
  rightVent.id = "rightVent";
  rightContainer.style.right = "15vw";
  rightContainer.style.top = "50vh";
  body.appendChild(rightContainer);
  rightContainer.appendChild(rightButton);
  rightContainer.appendChild(rightVent);
}

function toggle_left() {
  ClosedLvent = !ClosedLvent;
  const vent = document.getElementById("leftVent");

  if (ClosedLvent) {
  const door = document.createElement("div");
  door.id = "lDoor"; 
  vent.appendChild(door); }

  else {
    const door = document.getElementById("lDoor");
    vent.removeChild(door);
  }
}

function toggle_right() {
  ClosedRvent = !ClosedRvent;
  const vent = document.getElementById("rightVent");

  if (ClosedRvent) {
  const door = document.createElement("div");
  door.id = "rDoor"; 
  vent.appendChild(door); }

  else {
    const door = document.getElementById("rDoor");
    vent.removeChild(door);
  }
}

/*characters*/

class Character {
  constructor(ai) {
    this.ai = ai;
    this.interval = interval;
    this.chance = chance;
  }

  check_spawn() {
    if (ai => (randint(1, this.chance))) {
      return true; }
    else {
      return false; }
  }
}

class Leo extends Character {
  constructor(ai, chance) {
    super(ai);
    super(chance);
  }

  spawn() {
    if (this.check_spawn()) {

    }
  }
}


function main() {
  initialize_night([5, false], 5, 5, 5, 5, 5, [5, false]);
}

main();