body = document.getElementsByTagName("body")[0];
let monitor_up = 0;
let curr_cam = 0;
let last_cam = 1;
let power = 10000;

let ClosedLvent = false;
let ClosedRvent = false;

let alive = true;

function randint(min, max) {
  return Math.floor(Math.random()* (max - min + 1) + min);
}


function initialize_night([iris, rb] , leo, pickles, hazel, nigel, ruby, [taylor, limbo]) {
  l = new Leo(leo);
  draw_monitor();
  create_monitor_tab();
  create_office();
  d = display_power();

  setInterval(drain_power, 130, d);
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
  
  l.tryAttack();
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

/*power*/
function display_power() {
  display = document.createElement("h1");
  display.textContent = "100%";
  display.id = "powerDisplay";
  body.appendChild(display);
  return display;
}

function drain_power(display) {
  if (power > 0) {
    const usage = 0.5 + monitor_up + Number(ClosedLvent) * 1.5 + Number(ClosedRvent) * 1.5;
    power -= usage;
    const toDisplay = String(power);
    display.textContent = `${toDisplay.slice(0, 2)}.${toDisplay.at(2)}%`;
  }
  else { kill("power out") }
}

function kill(cause) {
  if (alive == true) {
    console.log(`you died by ${cause}`);
    alive = false;
  }
  }

/*characters*/

class Character {
  constructor(ai) {
    this.ai = ai;
  }

  check_spawn(chance) {
    if ((randint(1, chance)) <= this.ai) {
      return true; }
    else {
      return false; }
  }

}

class Leo extends Character {
  constructor(ai) {
    super(ai);
    this.chance = 25;
    this.atOffice = false;
    this.timer = NaN;
  }

  tryAttack() {
    if (this.check_spawn(this.chance) && this.atOffice == false) {
      this.atOffice = true;
      const leo = this.spawn_leo();
      this.timer = setTimeout(kill, ((0.95-0.05*(this.ai/2))*1000), "Leo");
      leo.addEventListener("click", this.clear_leo());
    }
  }

  spawn_leo() {
    const containLeo = document.createElement("div");
    containLeo.className = "leoContainer";
    let coords = [randint(30, 65), randint(25, 70)];
    containLeo.style.left = `${coords[0]}vw`;
    containLeo.style.bottom = `${coords[1]}vh`;

    body.appendChild(containLeo);
    return containLeo;
  }

  clear_leo(timer) {
    console.log("leo cleared");
    clearTimeout(this.timer);
    this.atOffice = false;
    body.removeChild(document.getElementsByClassName("leoContainer")[0]);
  }
}

function main() {
  initialize_night([5, false], 5, 5, 5, 5, 5, [5, false]);
}

main();