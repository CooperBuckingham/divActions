
//all instances of Things get added to this list
var listOfThings = [];

var doThisEveryFrame = function(deltaTime){
  if(gamePaused === true){
    return;
  }
  spikeTime(deltaTime);

  //You could update all your game logic here
  // - askAllControllersIfTheyHaveAnyThingNew();
  // - doPhysicsCalculations();

  for(var i = 0; i < listOfThings.length; i++){
    listOfThings[i].doActionsByFractionOfTime(deltaTime);
  }
};

//this only gets called once
var startGameLoop = function( tellThingsToUpdate ) {
    var lastFrameTime;
    var timeSinceLastFrame;
    var lowEnd = 1;
    var highEnd = 160;

    //then this function gets called every frame
    //and executes the tellThingsToUpdate callback with the time delta
    function recurse( thisFrameTime ) {
      //this function, requestAnimationFrame, handles the loop,
      //by repeatedly calling the recuse function, and passing in
      //the time since the last frame.
      window.requestAnimationFrame(recurse);
      thisFrameTime = thisFrameTime && thisFrameTime > 5000 ? thisFrameTime : window.performance.now();
      lastFrameTime = lastFrameTime || thisFrameTime;
      timeSinceLastFrame = thisFrameTime - lastFrameTime;

      if (timeSinceLastFrame >  highEnd){
        //if you hit some huge lag spike, or the user tabs out,
        //or anything, we basically just cap out the time that could have passed
        //this is great for handling smooth transitions, but be careful
        //because it means that things like setTimeout will be out of sync.
        //in general, if using RAF, don't use setTimeout, and instead
        //use a timer that tracks its progress via deltaTime for game stuff.
        timeSinceLastFrame = highEnd;
      }
      if(timeSinceLastFrame > lowEnd){
        //as long as the frame amount isn't super tiny, meaning something
        //is probably odd, then we call the update function
        //if it is super tiny, then we just skip this frame and go to the next
        tellThingsToUpdate(timeSinceLastFrame);
        lastFrameTime = thisFrameTime;
      }
    }
  recurse();
};

//trigger loop for the first time by calling this
var start = function(){
  var i;

  //this if is really just for demo purposes, if the forceRAF
  //has a value, then it will use setInterval to loop, instead of
  //requestAnimationFrame
  if(!forceRAF && forceSetIntervalRate){
    var interval = 1.0 / forceSetIntervalRate;
    var frameInterval = interval * 1000.0;

    window.setInterval(function(){
      doThisEveryFrame(interval);
     }, frameInterval );
  }else{
    //this is the real entry point. We pass a callback function into
    //this startGameLoop, that then executes the function every time
    //requestAnimationFrame comes up for air, hopefully, aout 60
    //times per second
      startGameLoop(function( deltaT ) {
      doThisEveryFrame(deltaT/1000);
    } );
  }
};


//========helper stuff============================
//this tries to randomly spike performance, simulating laggy code
//it is only here to show the difference between how differnt settings
//handle lag spikes more effectively.
var spikeTime = function(interval){
  if(killPerformance === false){
    return interval;
  }
  var extraInterval = interval * (Math.random() * 100 + 1000);
  var future = window.performance.now() + extraInterval;
  var count = 0;
  while(future > window.performance.now()){
   //kill performance, and count for fun;
   count++;
  }
  return extraInterval;
};

//this is a shim to handle window.performance.now
//missing on some browsers and mobile devices.
//it is Copyright Paul Irish 2014
(function(){
  if ("performance" in window == false) {
      window.performance = {};
  }
  Date.now = (Date.now || function () {
    return new Date().getTime();
  });
  if ("now" in window.performance == false){
    var nowOffset = Date.now();
    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }
    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }
})();
