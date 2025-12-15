body = document.getElementsByTagName("body")[0];
let monitor_up = false;
let curr_cam = 0;
let last_cam = 0;
let power = 10000;

let hour = 0;
let camTime = 0;
let officeTime = 0;
let totalTime = 0;

let ClosedLvent = false;
let ClosedRvent = false;

let alive = true;

const camScenes = create_camera_scenes();

function randint(min, max) {
  return Math.floor(Math.random()* (max - min + 1) + min);
}

function randfloat(min, max) {
  return Math.floor(randint(min*100, max*100))/100;
}

function choice(list) {
  return list.at(randint(0, list.length-1));
}


function initialize_night(aiList, longMod, debug) {
  draw_monitor();
  create_monitor_tab();
  create_office();
  display_hour(longMod);
  d = display_power();

  setInterval(drain_power, 130, d);
  setInterval(update_timers, 10, longMod);

  initialize_characters(aiList);
  display_debug(debug);
}

function initialize_characters(aiList) {
  i = new Iris(aiList[0][0], aiList[0][1]);
  i.readyAttack();

  t = new Taylor(aiList[1][0], aiList[1][1]);
  l = new Leo(aiList[2]);
  
  p = new Pickles(aiList[3]);
  /*
  h = new Hazel(aiList[4]);
  n = new Nigel(aiList[5]);
  r = new Ruby(aiList[6]);
  */
}

/*debug timers*/
function display_debug(state) {
  if (state) {
  const debugMenu = document.createElement("div");
  debugMenu.id = "debug";

  const totalTdebug = document.createElement("p");
  const cumulOdebug = document.createElement("p");
  const cumulCdebug = document.createElement("p");

  setInterval(update_timers_debug, 10, totalTdebug, cumulOdebug, cumulCdebug);
  add_to_debug(debugMenu, [totalTdebug, cumulOdebug, cumulCdebug]);
  body.appendChild(debugMenu);

  if (i.is_active == true) {
    const irisIntervalDebug = document.createElement("p");
    setInterval(update_iris_debug, 150, irisIntervalDebug);
    debugMenu.appendChild(irisIntervalDebug);
  }


  }
}

function add_to_debug(debugMenu, debugFeatures) {
  for (let i=0; i<debugFeatures.length;i++) {
    debugFeatures[i].className = "debugFeature";
    debugMenu.appendChild(debugFeatures[i]);
  }
}

function update_timers_debug(total, office, cams) {
  total.textContent = `totaltime: ${totalTime}`;
  office.textContent = `officetime: ${officeTime}`;
  cams.textContent = `camtime: ${camTime}`;
}

function update_iris_debug(display) {
  display.textContent = `next iris attack: ${i.interval}`;
}

/*cameras*/
function create_camera_scenes() {
  let scenes = [];
  for (let i=1; i<4; i++) {
    const cam = document.createElement("div");
    cam.style.backgroundImage = `url("../../resources/ONAI/Cam${i}.jpg")`;
    cam.className = "cameraScene";
    scenes.push(cam);
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
  monitor_up = !monitor_up;

  if (monitor_up) {
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

    if (i==1) {
      camButton.style.backgroundColor = "lime";
    }

    for (let i=0; i<3; i++) {
      monitor.appendChild(camScenes[i]);
    }
    
    
    monitor.appendChild(camButton);

  }
}

function display_camera(num) {
  camScenes.at(num).style.display = "block";
}

function change_camera(self) {
  const content = self.textContent;
  const last = document.getElementsByClassName("camButtons")[last_cam];
  last.style.backgroundColor = "black";
  camScenes[last_cam].style.display = "none";
  
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

/*power and timers*/
function display_power() {
  display = document.createElement("h1");
  display.textContent = "100%";
  display.id = "powerDisplay";
  body.appendChild(display);
  return display;
}

function drain_power(display) {
  if (power > 0) {
    const usage = 0.5 + Number(monitor_up) + Number(ClosedLvent) * 1.5 + Number(ClosedRvent) * 1.5;
    power -= usage;
    const toDisplay = String(power);
    display.textContent = `${toDisplay.slice(0, 2)}.${toDisplay.at(2)}%`;
  }
  else { kill("power out", "") }
}

function display_hour() {
  display = document.createElement("h1");
  display.textContent = "12AM";
  display.id = "hourDisplay";
  body.appendChild(display);
}

function increase_hour() {
  const display = document.getElementById("hourDisplay");
  hour += 1;
  const toDisplay = String(hour);
  display.textContent = `${toDisplay}AM`;

  t.tryAttack();
}

function update_timers(longMod) {
  totalTime += 10;
  if (monitor_up) {
    camTime += 10;
  }
  else {
    officeTime += 10;
  }

  if (longMod) {
    if (totalTime % 60000 == 0) {
      increase_hour();
    }
  }
  else {
    if (totalTime % 45000 == 0) {
      increase_hour();
    }
  }
}

function kill(cause, message) {
  if (alive == true) {
    const deathScreen = document.createElement("div");
    deathScreen.id = "deathScreen";

    const deathBase = document.createElement("h2");
    deathBase.textContent = `You died to ${cause}`;
    deathScreen.appendChild(deathBase);

    const deathMSG = document.createElement("h4");
    deathMSG.textContent = message;
    deathScreen.appendChild(deathMSG);

    body.appendChild(deathScreen);
    alive = false;
  }
}

/*characters*/

class Character {
  constructor(ai) {
    this.ai = ai;
    this.deathMSG = "";
    this.active = (this.ai > 0);
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
    this.active = this.active;
    this.chance = 25;
    this.atOffice = false;
    this.sprite = this.init_leo();
    this.timer;
    this.deathMSG = "When he appears, click him quickly to make him go away.";
  }

  tryAttack() {
    if (this.active == true) {
    if (this.check_spawn(this.chance) && this.atOffice == false) {
      this.atOffice = true;

      let coords = [randint(30, 65), randint(25, 70)];
      (this.sprite).style.left = `${coords[0]}vw`;
      (this.sprite).style.bottom = `${coords[1]}vh`;
      (this.sprite).style.display = "block";

      this.timer = setTimeout(kill, ((1.35-0.05*(this.ai/2))*1000), "Leo", this.deathMSG);
    }
    }
  }

  init_leo() {
    if (this.active == true) {
    const containLeo = document.createElement("div");
    containLeo.className = "leoContainer";

    body.appendChild(containLeo);
    containLeo.addEventListener("click", this.clear_leo.bind(this));
    return containLeo;
    }
  }

  clear_leo() {
    clearTimeout(this.timer);
    this.atOffice = false;
    (this.sprite).style.display = "none";
  }
}

class Iris extends Character {
  constructor(ai, ragebait) {
    super(ai);
    this.ragebait = ragebait;
    this.active = this.active;
    this.chance = 30;
    this.atOffice = false;
    this.sprite = this.init_iris();
    this.killTimer;
    this.sound;
    this.vent_check_interval;
    this.target;
    this.deathMSG = "He will appear at the vents when you're in the cameras, making a meowing sound. Shut the door on him to make him leave.";
  }

  tryAttack() {
    if (this.active == true) {
    if (this.check_spawn(this.chance) && this.atOffice == false) {
      this.atOffice = true;
      const ventNum = this.spawn_iris();
      (this.sound).play();

      this.killTimer = setTimeout(kill, ((2.15-0.05*this.ai)*1000), "Iris", this.deathMSG);

      this.vent_check_interval = setInterval(this.check_vent_status.bind(this), 5, ventNum);
    }
    else {this.readyAttack(); }
    }
  }

  readyAttack() {
    if (this.active && alive==true) {
      const currCamTime = camTime;
      const appearTimer = randfloat(4, 6)*1000;
      this.target = currCamTime + appearTimer;

      setInterval(this.check_timer_status.bind(this), 10);
    }
  }
    
  check_timer_status() {

    if (monitor_up == true && this.atOffice == false) {
      if ((camTime > this.target-5) && (camTime < this.target+5)) {
        this.tryAttack();
      }
    }
  }

  check_vent_status(ventNum) {
    const ventStates = [ClosedLvent, ClosedRvent];
    if (ventStates[ventNum]) {
      this.clear_iris.bind(this)(ventNum);
    }
  }

  spawn_iris() {
    const pos = randint(0, 1);
    (this.sprite.at(pos)).style.display = "block";
    return pos;
    }

  init_iris() {
    if (this.active == true) {
      this.sound = document.createElement("AUDIO");
      (this.sound).src = "../../resources/ONAI/iris_meow.mp3";
      
      const lVent = document.getElementById("leftVent");
      const containleftIris = document.createElement("div");
      containleftIris.className = "IrisContainer";
      lVent.appendChild(containleftIris);

      const rVent = document.getElementById("rightVent");
      const containrightIris = document.createElement("div");
      containrightIris.className = "IrisContainer";
      rVent.appendChild(containrightIris);

    return [containleftIris, containrightIris];
    }
  }

  clear_iris(ventNum) {
    clearTimeout(this.killTimer);
    clearInterval(this.vent_check_interval);
    this.atOffice = false;
    (this.sprite.at(ventNum)).style.display = "none";

    this.readyAttack();
  }

  get is_active() {
    return this.active;
  }

  get interval() {
    return this.target;
  }
}

class Taylor extends Character {
  constructor(ai, limbo) {
    super(ai);
    this.limbo = limbo;
    this.active = this.active;
    this.chance = (Math.floor(this.ai/4)+1);
    this.sprite = this.init_taylor();
    this.clickLoc;
    this.timer;
    this.deathMSG = "Every hour she might put her bowtie on, double click it to make her take it off before she kills you.";
  }

  tryAttack() {
    if (this.active == true) {
    if (this.roll_taylor() == true) {
      this.change_taylor_disp();

      this.timer = setTimeout(kill, ((4.5 - 0.1*this.ai)*1000), "Taylor", this.deathMSG);

    }
    }
  }

    init_taylor() {
    if (this.active == true) {
      console.log("talore");
    const containTaylor = document.createElement("div");
    containTaylor.className = "taylorContainer";
    body.appendChild(containTaylor);

    const taylorBow = document.createElement("div");
    taylorBow.className = "taylorBow";
    taylorBow.id = "0";
    this.clickLoc = taylorBow;

    containTaylor.appendChild(taylorBow);

    taylorBow.addEventListener("click", this.clear_taylor.bind(this));
    return containTaylor;
    }
  }

    roll_taylor() {
      console.log(this.chance);
      return (randint(1, 6) <= this.chance);
    }

    change_taylor_disp() {
      if (this.limbo == false) {
        (this.clickLoc).style.display = "block";
        (this.sprite).style.backgroundImage = `url("../../resources/ONAI/taylorBowtie.png")`;
        return 0;
      }
    }

    clear_taylor(num) {
      if ((this.clickLoc).id == "0") {
        (this.clickLoc).id = "1"
      }

      else {if ((this.clickLoc).id == "1") {
        (this.clickLoc).style.display = "none";
        clearTimeout(this.timer);
        (this.sprite).style.backgroundImage = `url("../../resources/ONAI/taylorDefault.png")`;
        (this.clickLoc).id = "0";
      } }
  }
}

class Pickles extends Character {
  constructor(ai) {
    super(ai);
    this.active = this.active;
    this.chance = 25;
    this.sprite = this.init_pickles();
    this.p_cam = 0;
    this.max = (30-this.ai)*1000
    this.timer = this.max;
    this.deathMSG = "Track him in the cameras. Going too long without looking at him will make him angry.";
  }

  init_pickles() {
    if (this.active) {
    setInterval(20, this.check_looking.bind(this));

    for (let i=0; i<6; i++) {
      const picklesCont = document.createElement("div");
      picklesCont.className = "picklesContainer";
      picklesCont.id = `picklesCam${i%3}Cont${i%2}`;

      camScenes[i%3].appendChild(picklesCont);
    }
    }
  }

  check_looking() {
    if (curr_cam == p_cam && monitor_up) {
      this.timer += 20; }
    else {
      this.timer -= 20; }

    if (this.timer <= 0) {
      kill("Pickles", this.deathMSG);
    }
  
    if (this.timer > this.max) {
      this.timer = this.max;
    }
  }


  get killtimer() {
    return this.timer;
  }

}

function main() {
  const irisAi = 0;
  const taylorAi = 20;
  const leoAi = 0;
  const picklesAi = 5;
  const hazelAi = 5;
  const nigelAi = 5;
  const rubyAi = 5;

  const longNights = false;
  const ragebaitMod = false;
  const LimboMod = false;
  const debug = true;

  const chars = [[irisAi, ragebaitMod], [taylorAi, LimboMod], leoAi, picklesAi, hazelAi, nigelAi, rubyAi];

  initialize_night(chars, longNights, debug);
}

main();
