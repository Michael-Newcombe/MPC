//GUI variables -----------------------------------------------
var font = "";
var mpcButtons = [];
var startstop;
var slides = [];

//Sound variables -----------------------------------------------
var volume =1.0;
var dryMix = 0.75;
var delay;
var delayTime = 0.25;
var sliderDelay = 0.0;
var myFilter;
var sliderFilter = 1.0;

var timer, currentCount, isTriggered, playhead;//metronome
var isPlaying;
var click, isClick;


//Beat object arrays -----------------------------------------------
var snare = [{beat: 0, volume:0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 1, volume: 0.8},
            {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 1, volume: 0.8}
            
             ];
              
var hats = [{beat: 1, volume:1},{beat: 0, volume: 0},{beat: 1, volume: 0.5},{beat: 1, volume: 0.3},
           {beat: 1, volume: 1},{beat: 0, volume: 0},{beat: 1, volume: 0.5},{beat: 1, volume: 0.3},
           {beat: 1, volume: 1},{beat: 0, volume: 0},{beat: 1, volume: 0.5},{beat: 1, volume: 0.3},
           {beat: 1, volume: 1},{beat: 0, volume: 0},{beat: 1, volume: 0.5},{beat: 1, volume: 0.3}
           
            ];

var fx =  [{beat: 0, volume:0},{beat: 0, volume: 0},{beat: 1, volume: 1},{beat: 0, volume: 0},
          {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 1, volume: 1},{beat: 0, volume: 0},
          {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 1, volume: 1},{beat: 0, volume: 0},
          {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 1, volume: 0.5},{beat: 1, volume: 1}
         
            ];

var bass = [{beat: 1, volume:1},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
           {beat: 1, volume: 1}, {beat: 0,volume: 0},{beat: 0, volume: 0},{beat: 1, volume: 1},
           {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
           {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0}
           
            ];

var piano = [{beat: 1, volume:1},{beat: 1, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 1}, {beat: 0,volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 1, volume: 0.2},{beat: 0,volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0}
              
            ];

var synth = [{beat: 0, volume:0},{beat: 1, volume: 0.7},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0}, {beat: 1, volume: 0.5},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0},{beat: 1, volume: 0.7},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0},{beat: 1, volume: 0.5},{beat: 0, volume: 0},{beat: 0, volume: 0}
              
            ];

var voice = [{beat: 1, volume:1},{beat: 1, volume: 0.7},{beat: 1, volume: 0.3},{beat: 0, volume: 0},
            {beat: 0, volume: 0}, {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},{beat: 0, volume: 0},
            {beat: 0, volume: 0},{beat: 0, volume:  0},{beat: 0, volume: 0},{beat: 0, volume: 0}
              
            ];


function preload() {


    font = loadFont('assets/Azonix.otf');

}


function setup() {

    createCanvas(750, 600);

//GUI controls -----------------------------------------------
    startstop = new Button(70, 150, 50);

    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            mpcButtons.push(new Button(
                    300 + x * 120, //x position
                    200 + y * 120, //y position
                    100) // button size
            );
        }
    }

    for (var i = 0; i < 3; i++) {
        slides.push(new VSlide(60 + i * 60, 250, 30, 200));
    }

    startstop.onPressed = startstopCB;

    slides[0].onSlide = slider0CB;
    slides[1].onSlide = slider1CB;
    slides[2].onSlide = slider2CB;
    
    mpcButtons[0].onPressed = button0CB;
    mpcButtons[1].onPressed = button1CB;
    mpcButtons[2].onPressed = button2CB;
    mpcButtons[3].onPressed = button3CB;
    mpcButtons[4].onPressed = button4CB;
    mpcButtons[5].onPressed = button5CB;
    mpcButtons[6].onPressed = button6CB;
    mpcButtons[7].onPressed = button7CB;
    mpcButtons[8].onPressed = button8CB;
    
//MaxiLib variables -----------------------------------------------    
    audio = new maximJs.maxiAudio();
    audio.init();
    audio.play = audioLoop
    timeStretcher = new maximJs.maxiTimestretch();
    delay = new maximJs.maxiDelayline();
    env1 = new maximEx.env();
    myFilter = new maximEx.filter();
    timer = new maximJs.maxiOsc(); //we will use this as a very accurate metronome

//trigger variables ----------------------------------------------- 
    isClick = false;
    isClick1 = false;
    isClick2 = false;
    isClick3 = false;
    isClick4 = false;
    isClick5 = false;
    isClick6 = false;
    isClick7 = false;
    isClick8 = false;
    
//Loading samples -----------------------------------------------
    click = new maximJs.maxiSample();
    audio.loadSample("assets/click.mp3", click);
    click1 = new maximJs.maxiSample();
    audio.loadSample("assets/kick.wav", click1);
    click2 = new maximJs.maxiSample();
    audio.loadSample("assets/snare.wav", click2);
    click3 = new maximJs.maxiSample();
    audio.loadSample("assets/hihat.wav", click3);
    click4 = new maximJs.maxiSample();
    audio.loadSample("assets/fx.wav", click4);
    click5 = new maximJs.maxiSample();
    audio.loadSample("assets/bass.wav", click5);
    click6 = new maximJs.maxiSample();
    audio.loadSample("assets/piano.wav", click6);
    click7 = new maximJs.maxiSample();
    audio.loadSample("assets/synth.wav", click7);
    click8 = new maximJs.maxiSample();
    audio.loadSample("assets/voice.wav", click8);
    
    

}


function audioLoop() {

//Audio functionality -----------------------------------------------
    var sampleOut = 0;
    if (isPlaying) {

        currentCount = timer.phasor(8);

        if (currentCount < 0.5 && !isTriggered) {

            playhead = (playhead + 1) % 16; 
            isTriggered = true; 
           
            if (playhead % 4 == 0) {
                click.trigger(); 
            }
            
            if (playhead % 12 ==0)
                {
                    click1.trigger(); 
                }
          
            if (snare[playhead].beat ==1 )
                {
                    click2.trigger();
                }
           
            if (hats[playhead].beat ==1)
                {
                    click3.trigger();
                }
            
            if (fx[playhead].beat ==1)
                {
                    click4.trigger();
                }
            
             if (bass[playhead].beat ==1)
                {
                    click5.trigger();
                }
            
             if (piano[playhead].beat ==1)
                {
                    click6.trigger();
                }
            
            if (synth[playhead].beat ==1)
                {
                    click7.trigger();
                }
            
             if (voice[playhead].beat ==1)
                {
                    click8.trigger();
                }
            

        } else if (currentCount > 0.5) {
            isTriggered = false; 
        }

        if (isClick && click.isReady()) {
        
             sampleOut += click.playOnce() * volume;
        }
        
        if (isClick1 && click1.isReady())
            {
                
                sampleOut += click1.playOnce() * volume;
            }
        
        if (isClick2 && click2.isReady())
            {
               
                sampleOut += click2.playOnce() * snare[playhead].volume * volume; 
            }
        
         if (isClick3 && click3.isReady())
            {
                
                sampleOut += click3.playOnce() * hats[playhead].volume * volume;  
            }
        
        if (isClick4 && click4.isReady())
            {
                
                sampleOut += click4.playOnce() * fx[playhead].volume * volume;  
            }
        
         if (isClick5 && click5.isReady())
            {
                
                sampleOut += click5.playOnce() * bass[playhead].volume * volume;  
            }
        
         if (isClick6 && click6.isReady())
            {
                
                sampleOut += click6.playOnce() * piano[playhead].volume * volume;  
            }
        
          if (isClick7 && click7.isReady())
            {
                
                sampleOut += click7.playOnce() * synth[playhead].volume * volume;  
            }
        
           if (isClick8 && click8.isReady())
            {
               
                sampleOut += click8.playOnce() * voice[playhead].volume * volume;   
            }

    } else {
        sampleOut = 0;
    }
    

   var filterFx = myFilter.lowpass(sampleOut, 10000 * sliderFilter);
   sampleOut = filterFx;
   
   var delayFx = delay.dl(sampleOut,44100 * delayTime , sliderDelay);

   var mix = (filterFx * (1.0 - dryMix)) + (delayFx * (1.0 - dryMix)) + (sampleOut * dryMix);
    
   this.output = mix;
}


function draw() {

//Drawing GUI controls -----------------------------------------------     
    background(105,105,105);

  
    fill(220,20,60);
    textFont(font);
    textSize(60);
    text('MPC', 10, 80);

    fill(255);
    stroke(255);


    textSize(12);
    text("Start/stop", 20, 120);

    for (b in mpcButtons) {
        mpcButtons[b].draw();
    }

    for (s in slides) {
        slides[s].draw();
    }

    startstop.draw();



}

//Events & Callbacks -----------------------------------------------

function mousePressed() {

    for (b in mpcButtons) {
        if (mpcButtons[b].isInside(mouseX, mouseY)) {
            mpcButtons[b].press();
            break;
        }
    };

    if (startstop.isInside(mouseX, mouseY)) {
        startstop.press();
    }
}

function mouseDragged() {

    for (s in slides) {
        if (slides[s].isInside(mouseX, mouseY)) {
            slides[s].slide(mouseY);
            break;
        }
    }
}

function startstopCB() {

    if (startstop.isActive) {
        isPlaying = true;
        playhead = 0;
        isTriggered = false;
    } else {
        isPlaying = false;
    }
}

function button0CB() {
    
    if (mpcButtons[0].isActive) {
        isClick = true;
    } else {
        isClick = false;
    }
}

function button1CB() {
    
    if (mpcButtons[1].isActive) {
        isClick1 = true;
    } else {
        isClick1 = false;
    } 
}

function button2CB() {
   
    if (mpcButtons[2].isActive) {
        isClick2 = true;
    } else {
        isClick2 = false;
    }
}

function button3CB() {
    
    if (mpcButtons[3].isActive) {
        isClick3 = true;
    } else {
        isClick3 = false;
    }
    
}


function button4CB() {
    
    if (mpcButtons[4].isActive) {
        isClick4 = true;
    } else {
        isClick4 = false;
    }
    
}

function button5CB() {
   
    if (mpcButtons[5].isActive) {
        isClick5 = true;
    } else {
        isClick5 = false;
    }
    
}

function button6CB() {
   
    if (mpcButtons[6].isActive) {
        isClick6 = true;
    } else {
        isClick6 = false;
    }
    
}

function button7CB() {
   
    if (mpcButtons[7].isActive) {
        isClick7 = true;
    } else {
        isClick7 = false;
    }
    
}


function button8CB() {
    
    if (mpcButtons[8].isActive) {
        isClick8 = true;
    } else {
        isClick8 = false;
    }
    
}


function slider0CB() {

    if (slides[0].onSlide)
       { 
            volume = slides[0].value;
      }
}

function slider1CB() {

    if (slides[1].onSlide)
       {  
           sliderDelay = slides[1].value;
      }
}

function slider2CB() {

    if (slides[2].onSlide)
       { 
           sliderFilter = slides[2].value;
      }
}

//GUI functionality -------------------------------------------------------------------------------------------------------------------------------------------------------------

function Button(center_x, center_y, dim) {
    this.width = dim;
    this.height = dim;
    this.topLeft = createVector(center_x - this.width / 2, center_y - this.height / 2);
    this.bottomRight = createVector(center_x + this.width / 2, center_y + this.height / 2);
    this.isActive = false;
    this.onPressed = undefined;

    this.draw = function () {
        stroke(255);

        if (this.isActive) {
            if (frameCount % 10 > 5) {
                fill(30,255,255);
            } else {
                fill(30,144,255);
            }
        } else {
            fill(30,144,255);
        }

        rect(this.topLeft.x, this.topLeft.y, this.width, this.height)
    }

    this.isInside = function (x, y) {
        if (x > this.topLeft.x && x < this.bottomRight.x) {
            if (y > this.topLeft.y && y < this.bottomRight.y) {
                return true;
            }
        }

        return false;
    }

    this.press = function () {
        this.isActive = !this.isActive;
        if (this.onPressed != undefined) this.onPressed();
    }

}

function VSlide(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.topLeft = createVector(x, y);
    this.bottomRight = createVector(x + this.width, y + this.height);
    this.onSlide = undefined;
    this.value = 0.0;
  
    this.draw = function () {

        stroke(255);
        fill(105);
        rect(this.topLeft.x, this.topLeft.y, this.width, this.height);
        fill(150);
       
        rect
            (
                this.topLeft.x,
                this.bottomRight.y - this.height * this.value,
                this.width,
                this.height * this.value
            );
    }

    this.isInside = function (x, y) {
        if (x > this.topLeft.x && x < this.bottomRight.x) {
            if (y > this.topLeft.y && y < this.bottomRight.y) {
                return true;
            }
        }

        return false;
    }

    this.slide = function (y) {
        this.value = (this.bottomRight.y - y) / this.height;
        if (this.onSlide != undefined) this.onSlide();
    }

}
