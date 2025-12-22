body = document.getElementsByTagName("body")[0];
let monitor_up = false;
let curr_cam = 0;
let last_cam = 0;
let power = 10000;

let hour = 0;
let camTime = 0;
let officeTime = 0;
let totalTime = 0;
let realTime = 0;

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
  p.init_pickles();

  h = new Hazel(aiList[4]);
  h.init_hazel();

  
  /* n = new Nigel(aiList[5]); */
  
  r = new Ruby(aiList[6]);
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

  if (p.is_active == true) {
    const picklesKillTimeDebug = document.createElement("p");
    setInterval(update_pickles_debug, 20, picklesKillTimeDebug);
    debugMenu.appendChild(picklesKillTimeDebug);
  }

  if (h.is_active == true) {
    const hazelTimerDebug = document.createElement("p");
    setInterval(update_hazel_debug, 20, hazelTimerDebug);
    debugMenu.appendChild(hazelTimerDebug);
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

function update_pickles_debug(display) {
  display.textContent = `pickles kill timer: ${p.killtimer}`;
}

function update_hazel_debug(display) {
  display.textContent = `hazel attack timer: ${h.timer}`;
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

  p.tryMove();
  r.tryMove();
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

  r.tryMove();
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
    const usage = 0.5 + Number(monitor_up)*2 + Number(ClosedLvent) * 3 + Number(ClosedRvent) * 3;
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
  display_real_timer();
}

function increase_hour() {
  const display = document.getElementById("hourDisplay");
  hour += 1;
  const toDisplay = String(hour);
  display.textContent = `${toDisplay}AM`;

  if (hour == 6) {
    kill("You Survived");
  }

  t.tryAttack();
}

function display_real_timer() {
  display = document.createElement("p");
  display.id = "rTimeDisplay";
  body.appendChild(display);
}

function update_real_timer(longMod) {
  let deci = Math.floor(totalTime/100) % 10;
  let sec = Math.floor(totalTime / 1000) % 60;
  let min = Math.floor(totalTime / 60000);

  const rTimer = document.getElementById("rTimeDisplay");
  if (sec < 10) {
    rTimer.textContent = `${min}:0${sec}.${deci}`; }
  else {
  rTimer.textContent = `${min}:${sec}.${deci}`; }
}

function update_timers(longMod) {
  if (alive) {
  totalTime += 10;
  update_real_timer(longMod);
  if (monitor_up) {
    camTime += 10;
  }
  else {
    officeTime += 10;
  }

  if (longMod) {
    if (totalTime % 60000 == 0) {
      increase_hour(); }
  }
  else {
    if (totalTime % 45000 == 0) {
      increase_hour(); }
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
    this.char_cam;
    this.lastPosition;
    this.sprite;
  }

  check_spawn(chance) {
    if ((randint(1, chance)) <= this.ai) {
      return true; }
    else {
      return false; }
  }

  check_looking() {
    return (curr_cam == this.char_cam && monitor_up);
  }

  move_to_cam(loc) {

    this.char_cam = loc[0];
    const curr_sprite = this.get_sprite_at_pos(loc);
    const last = this.get_sprite_at_pos(this.lastPosition);

    curr_sprite.style.display = "block";
    last.style.display = "none";
    this.lastPosition = loc;
  }

  get_movement_pos(disableFlipSpawn) {
    let move = [];
    for (let i=2; i>0; i--) {
      move.push(randint(0, i));
    }

    if (move[0] == this.lastPosition[0] || (move[0] == curr_cam && disableFlipSpawn)) {
      move[0] = (move[0] + randint(1, 2)) % 3;
    }

    return move;
  }

  get_sprite_at_pos(loc) {
    return this.sprite[loc[0]][loc[1]];
  }

  get is_active() {
    return this.active;
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
    (this.sound).play();
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
    this.sound;
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
    this.sound = document.createElement("AUDIO");
    (this.sound).src = "../../resources/ONAI/okthenMeow.mp3";
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
        (this.clickLoc).id = "1";
      }

      else {if ((this.clickLoc).id == "1") {
        (this.clickLoc).style.display = "none";
        clearTimeout(this.timer);
        (this.sprite).style.backgroundImage = `url("../../resources/ONAI/taylorDefault.png")`;
        (this.clickLoc).id = "0";
        if (randint(1, 50) == 50) {
          (this.sound).play();
        }
      } }
  }
}

class Pickles extends Character {
  constructor(ai) {
    super(ai);
    this.active = this.active;
    this.chance = this.ai+12;
    this.sprites;
    this.sound;
    this.char_cam = randint(0, 2);
    this.lastPosition = [0, 0];
    this.max = (30-this.ai)*1000
    this.timer = (30-this.ai)*1000;
    this.deathMSG = "Track him in the cameras. Going too long without looking at him will make him angry.";
  }

  tryMove() {
    if (this.active) {
      if (this.roll_pickles()) {
        let loc = this.get_movement_pos(true);
        this.move_to_cam(loc);

        }
      }
    }

  init_pickles() {
    if (this.active) {
      this.sound = document.createElement("AUDIO");
      (this.sound).src = "../../resources/ONAI/pickles_purr.mp3";
    setInterval(this.pickles_cam_logic.bind(this), 20);
    setInterval(this.pickles_sound_logic.bind(this), 100);
    let spriteList = [[],[],[]];
    for (let i=0; i<3; i++) {
      for (let x=0; x<2; x++) {
      const picklesCont = document.createElement("div");
      picklesCont.className = "picklesContainer";
      picklesCont.id = `picklesCam${i}Cont${x}`;
      picklesCont.style.backgroundImage = `url("../../resources/ONAI/pickles1.png")`;
      spriteList[i].push(picklesCont);

      camScenes[i].appendChild(picklesCont);
    }
    }

    this.sprite = spriteList;
    this.move_to_cam([randint(0, 2), randint(0, 1)]);
  } else {return "pickles Inactive";}
}

  roll_pickles() {
      return (randint(1, this.chance) <= Math.ceil(this.ai*1.5));
    }

  pickles_cam_logic() {
    if (alive) {
    if (this.check_looking()) {
      this.timer += 20; }
    else {
      this.timer -= 20; }

    if (monitor_up && (totalTime % 4000 == 0)) {
      this.tryMove()}


    if (this.timer <= 0) {
      kill("Pickles", this.deathMSG);
    }
  
    if (this.timer > this.max) {
      this.timer = this.max;
    }
  }
  }

  pickles_sound_logic() {
    if (alive && this.timer < 3000) {
      (this.sound).play();
    } else { (this.sound).pause()}
  }

  get killtimer() {
    return this.timer;
  }

  get get_cam() {
    return this.char_cam;
  }
}

class Hazel extends Character {
  constructor(ai) {
    super(ai);
    this.active = this.active;
    this.chance = this.ai+15;
    this.sprites;
    this.sound;
    this.char_cam = randint(0, 2);
    this.lastPosition = [0, 0];
    this.max = (29-this.ai)*500;
    this.timer = (29-this.ai)*500;
    this.drain = Math.ceil(this.ai/4)*100;
    this.deathMSG = "She will move around the cameras, looking at her for too long will cause her to drain your power.";
  }

  tryMove() {
    if (this.active) {
      if (this.roll_hazel()) {
        let loc = this.get_movement_pos(false);
        this.move_to_cam(loc);

        if (p.is_active) {
          if (this.char_cam == p.get_cam) {
            if (randint(1, 5) == 5) {
              let loc = this.get_movement_pos(false);
              this.move_to_cam(loc); }}}
      }
    }
  }

  init_hazel() {
    if (this.active) {

    this.sound = document.createElement("AUDIO");
    (this.sound).src = "../../resources/ONAI/PowerSpark.mp3";
    setInterval(this.hazel_cam_logic.bind(this), 20);
    let spriteList = [[],[],[]];
    for (let i=0; i<3; i++) {
      for (let x=0; x<2; x++) {
      const hazelCont = document.createElement("div");
      hazelCont.className = "hazelContainer";
      hazelCont.id = `hazelCam${i}Cont${x}`;
      hazelCont.style.backgroundImage = `url("../../resources/ONAI/hazel${x+1}.png")`;
      spriteList[i].push(hazelCont);

      camScenes[i].appendChild(hazelCont);
    }
    }

    this.sprite = spriteList;
    this.move_to_cam([randint(0, 2), randint(0, 1)]);
  } else {return "hazel Inactive";}
}

  roll_hazel() {
      return (randint(1, this.chance) <= this.ai);
    }

  hazel_cam_logic() {
    if (alive) {
    if (this.check_looking()) {
      this.timer -= 20; }
    else { if (!monitor_up) {
      this.timer += 10; } }

    if (totalTime % 5000 == 0) {
      this.tryMove(); }

    


    if (this.timer <= 0) {
      this.hazel_attack();
    }
  
    if (this.timer > this.max) {
      this.timer = this.max;
    }
  }
  }

  hazel_attack() {
    power = power - this.drain;
    this.drain += 250;
    (this.sound).play();

    this.timer = this.max;
  }

  get attacktimer() {
    return this.timer;
  }
}

class Ruby extends Character {
  constructor(ai) {
    super(ai);
    this.active = this.active;
    this.chance = 25;

    this.inCams = false;
    this.maxcooldown = randint(15000, 16000) - (this.ai*500);
    this.cooldownActive = false;
    this.anger = 0;
    this.attack_threshold = 2000 - (this.ai*50);

    this.vent_check_interval;
    this.cam_check_interval;
    this.killTimer;
    this.ventTimer = 0;
    
    this.camsprites = this.init_ruby();
    this.ventsprite;
    this.char_cam;
    this.lastPosition = 0;
    this.deathMSG = `She will sometimes appear on the cameras, quickly switch cams to make her go away. \nIf you look at Ruby for too long or pull the monitor down while she's on the camera she will enter the left vent.`;
  }

  tryMove() {
    if (this.active) {
      if (this.check_spawn(this.chance) && this.inCams == false && !(this.cooldownActive)) {
        this.ruby_move_cam();
        this.inCams = true;

       /* if (p.is_active) {
          if (this.char_cam == p.get_cam) {
            if (randint(1, 5) < 3) {
              this.clear_ruby(false); }}} */
      }
    }
  }

  init_ruby() {
    if (this.active) {
    let spriteList = [];
    for (let i=0; i<3; i++) {
      const rubyCont = document.createElement("div");
      rubyCont.className = "rubyCamContainer";
      rubyCont.id = `rubyCam${i}Cont`;
      rubyCont.style.backgroundImage = `url("../../resources/ONAI/rubyCam.png")`;
      spriteList.push(rubyCont);

      camScenes[i].appendChild(rubyCont);
    }

    const lVent = document.getElementById("leftVent");
    const ventSp = document.createElement("div");
    ventSp.className = "rubyVentContainer";
    lVent.appendChild(ventSp);
    this.ventsprite = ventSp;

    this.cooldownActive = true;
    this.cooldownTimer = setTimeout(this.update_cooldown.bind(this), randint(3500, this.maxcooldown));

    return spriteList;

  } else {return "ruby Inactive";}
}

  ruby_move_cam() {
    this.char_cam = curr_cam;
    (this.camsprites[curr_cam]).style.display = "block";
    this.cam_check_interval = setInterval(this.ruby_cam_logic.bind(this), 20);
    this.lastPosition = this.char_cam;
  }

  ruby_cam_logic() {
    if (alive) {
    if (this.check_looking()) {
      this.anger += 20; } }

    if (this.char_cam != curr_cam) {
      (this.camsprites)[this.lastPosition].style.display = "none";
      this.clear_ruby(true);
    }

    if (this.anger >= this.attack_threshold || (curr_cam == this.char_cam && monitor_up == false)) {
      this.anger = 0;
      this.ruby_attack();
    }
  }


  ruby_attack() {
    (this.ventsprite).style.display = "block";
    (this.camsprites)[this.lastPosition].style.display = "none";

    clearInterval(this.cam_check_interval);
    this.killTimer = setTimeout(kill, (this.attack_threshold*2)+1, "Ruby", this.deathMSG);
    this.vent_check_interval = setInterval(this.check_vent_status.bind(this), 5);

  }

  check_vent_status() {
    if (this.ventTimer >= 100) {
      this.clear_ruby(true);
    }

    if (ClosedLvent) {
      this.ventTimer += 5;
    }
  }

  clear_ruby(setCooldown) {
    clearTimeout(this.killTimer);
    clearInterval(this.vent_check_interval);
    clearInterval(this.cam_check_interval);
    this.ventTimer = 0;
    this.inCams = false;
    this.anger = 0;
    (this.ventsprite).style.display = "none";

    this.cooldownActive = true;
    this.cooldownTimer = setTimeout(this.update_cooldown.bind(this), this.maxcooldown);
  }

  update_cooldown() {
    this.cooldownActive = false;
  }

  get ready() {
    return !(this.cooldownActive);
  }
}


/* class Nigel extends Character { -- DEVELOPMENT PAUSED UNTIL I CAN THINK OF A GOOD MECHANIC --
  constructor(ai) {
    super(ai);
    this.active = this.active;
    this.chance = 30;
    this.atOffice = false;
    this.sprite = this.init_nigel();
    this.sound;
    this.kill_check_interval;
    this.pet = 0;
    this.deathMSG = "He will appear at the right vents when you're in the office, Pet him to make him leave. Closing the door or pulling up the monitor will make him angry.";
  }

  tryAttack() {
    if (this.active == true) {
    if (this.check_spawn(this.chance) && this.atOffice == false) {
      this.atOffice = true;
      this.spawn_nigel();

    }
    }
  }
    
  nigel_anger_logic() {
    this.pet += 1;
    if ((this.sprite).id == "touchNigel") {
      if (this.pet > )
    }
  }

  spawn_nigel() {
    this.touch = Boolean(randint(0, 1));
    (this.sprite).style.display = "block";
    (this.sprite).id = choice(["touchNigel", "leaveNigel"]);
    }

  init_nigel() {
    if (this.active == true) {
      const rVent = document.getElementById("rightVent");
      const containNigel = document.createElement("div");
      containNigel.className = "NigelContainer";
      rVent.appendChild(containNigel);
      containNigel.addEventListener("onmousemove", this.nigel_anger_logic.bind(this));

      return containNigel;
    }
  }

  clear_nigel() {
    if ((this.sprite).id == "touchNigel") {

    }
  }
} */

function init_ai() {
  const irisAi = Number(sessionStorage.getItem("irisAI"));
  const taylorAi = Number(sessionStorage.getItem("taylorAI"));
  const leoAi = Number(sessionStorage.getItem("leoAI"));
  const picklesAi = Number(sessionStorage.getItem("picklesAI"));
  const hazelAi = Number(sessionStorage.getItem("hazelAI"));
  const nigelAi = Number(sessionStorage.getItem("nigelAI"));
  const rubyAi = Number(sessionStorage.getItem("rubyAI"));

  return [[irisAi, false], [taylorAi, false], leoAi, picklesAi, hazelAi, nigelAi, rubyAi];
}

function main() {
 const chars = init_ai();

  const longNights = Boolean(Number(sessionStorage.getItem("longNights")));
  const debug = Boolean(sessionStorage.getItem("debugActive"));

  initialize_night(chars, longNights, debug);
}

main();
