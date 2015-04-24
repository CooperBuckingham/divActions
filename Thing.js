

var Thing = function(w,h, color){
    //setting up a div
    w = w || 100;
    h = h || 100;

    if(true){ //this is just part of the demo, so you can easily fold all the div code out of the way.
      this.size = {w:w,h:h};
      color = color || "rgba(125,125,125,.7)";
      this.div = document.createElement("div");
      this.insideDiv = document.createElement("div");

      this.div.style.width = "" + w + "px";
      this.div.style.height = "" + h + "px";
      this.div.style.display ="inline-block";
      this.div.style.position = "absolute";
      this.div.appendChild(this.insideDiv);
      if(useTransforms){
        //this is set here to make the demo between
        //manual placement and using transforms align visually.
        //in reality you would most likely leave it
        //to the center defaults.
        this.div.style.transformOrigin = "left top";
      }
      //the inner div exists so transform can rotate it
      //without having to worry about position offsets
      this.insideDiv.style.display="inline-block";
      this.insideDiv.style.position = "absolute";
      this.insideDiv.style.width = "100%";
      this.insideDiv.style.height = "100%";
      this.insideDiv.style.left = "0";
      this.insideDiv.style.bottom = "0";
      this.insideDiv.style.border = "10px solid rgba(255,0,0,.4)";
      this.insideDiv.style.backgroundColor = color;
      demo.appendChild(this.div);
    }

  //setting up base data for actions
  this.actionsImDoing = {};
  this.actionId = 0;
  this.currentPixelPosition = {x:0,y:0};
  this.currentRotation = 0;
  this.currentScale = 1;

  //we aggregate all the updates of each action at the end of each frame
  //so that we only have to update the div a single time.
  this.aggregateResultOfActions = {move:{x:0,y:0}, scale: 0, rotate: 0};

  //add this thing to the list in gameloop
  listOfThings.push(this);
};

//obviously if you cared, you would break all this code out
//into an Action class, to get instantiated on each call.
Thing.prototype.moveByPixelsInTime = function(x,y,time){
  var action = {};
  action.thing = this;
  action.type = "move";
  action.totalDistance =  {x:x,y:y};
  action.totalTime = time;
  action.timeElapsed = 0;
  action.updateFunc = function(interval){
    this.timeElapsed += interval;
    if(this.timeElapsed > this.totalTime){
      this.thing.actionsImDoing[this.id] = undefined;
       return;
    }
    var timePercent = interval/this.totalTime;
    var moveAmount = this.thing.scaleVector(this.totalDistance, timePercent);
    var aggMovement = this.thing.aggregateResultOfActions.move;
    this.thing.aggregateResultOfActions.move = this.thing.addVectors(moveAmount, aggMovement);
  };
  action.id = this.actionId++;
  this.actionsImDoing[action.id] = action;
};
Thing.prototype.scaleByPercentInTime = function(percent, time){
  var action = {};
  action.thing = this;
  action.type = "move";
  action.totalScale = percent - 1;
  action.totalTime = time;
  action.timeElapsed = 0;
  action.updateFunc = function(interval){
    this.timeElapsed += interval;
    if(this.timeElapsed > this.totalTime){
      this.thing.actionsImDoing[this.id] = undefined;
       return;
    }
    var timePercent = interval/this.totalTime;
    var scaleAmount = this.totalScale * timePercent;
    var aggScale = this.thing.aggregateResultOfActions.scale;
    this.thing.aggregateResultOfActions.scale = aggScale + scaleAmount;
  };
  action.id = this.actionId++;
  this.actionsImDoing[action.id] = action;
};
Thing.prototype.rotateByDegreesInTime = function(degrees, time){
  var action = {};
  action.thing = this;
  action.type = "move";
  action.totalRotation = degrees;
  action.totalTime = time;
  action.timeElapsed = 0;
  action.updateFunc = function(interval){
    this.timeElapsed += interval;
    if(this.timeElapsed > this.totalTime){
      this.thing.actionsImDoing[this.id] = undefined;
       return;
    }
    var timePercent = interval/this.totalTime;
    var rotationAmount = this.totalRotation * timePercent;
    var aggRotation = this.thing.aggregateResultOfActions.rotate;
    this.thing.aggregateResultOfActions.rotate = aggRotation + rotationAmount;
  };
  action.id = this.actionId++;
  this.actionsImDoing[action.id] = action;
};

//==========actually update the DOM screen============
Thing.prototype.doActionsByFractionOfTime = function(interval){
  var dirtyCheck = false;
  for(var i in this.actionsImDoing){
    if(this.actionsImDoing[i] !== undefined){
      dirtyCheck = true;
      this.actionsImDoing[i].updateFunc(interval);
    }
  }
  //if no actions were called then the div doesn't need to be updated.
  if(dirtyCheck === false) return;

  this.currentPixelPosition = this.addVectors(this.currentPixelPosition, this.aggregateResultOfActions.move);
  this.currentRotation = this.aggregateResultOfActions.rotate + this.currentRotation;
  this.currentScale = (1 + this.aggregateResultOfActions.scale) * this.currentScale;

  //clear the aggregate data that built up during this frame;
  this.aggregateResultOfActions = {move:{x:0,y:0}, scale: 0, rotate: 0};

  if(useTransforms){
    //USE tranforms and allow GPU to handle most things
    var transformString = "";
    var moveString = "translate(" + this.currentPixelPosition.x + "px ," + this.currentPixelPosition.y + "px) ";
    var scaleString = "scale(" + this.currentScale + ") ";

    var rotateString = "rotate(" + this.currentRotation + "deg)";
    this.insideDiv.style.transform = rotateString;
    this.div.style.transform = moveString + scaleString;
  }else{
    //Manually maneuvar divs, keeping updates on the CPU
    //there's really no reason to do this, except
    //some types of scaling may have different effects on child divs
    this.div.style.left = "" + this.currentPixelPosition.x + "px";
    this.div.style.top = "" + this.currentPixelPosition.y + "px";
    this.div.style.width = "" + (this.currentScale * this.size.w) + "px";
    this.div.style.height = "" + (this.currentScale * this.size.h) + "px";

    var rotateString = "rotate(" + this.currentRotation + "deg)";
    this.div.style.transform = rotateString;
  }
};

//VECTOR STUFF
//if your game was large, you'd probably want a separate vector class
//to handle size, position, distance, etc.
Thing.prototype.vectorDistance = function(vA,vB){
  return Math.sqrt( (vA.x-vB.x)*(vA.x-vB.x) + (vA.y-vB.y)*(vA.y-vB.y) );
};
Thing.prototype.subtractVector = function(vA, vB){
  return {x:vA.x - vB.x,y:vA.y - vB.y};
}
Thing.prototype.addVectors = function(vA, vB){
  return {x:vA.x + vB.x,y:vA.y + vB.y};
};
Thing.prototype.scaleVector = function(vA, scale){
  return {x:vA.x * scale, y: vA.y * scale};
};



