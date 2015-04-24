var demo = document.getElementById('demo');
demo.style.position = 'relative';
demo.style.width = "" + window.innerWidth + "px";
demo.style.height ="" + window.innerHeight +"px";


//demo settings
var useTransforms = true;

var forceRAF = true;
var forceSetIntervalRate = null;
var killPerformance = false;

var gamePaused = false;
var testTime = 20;
start();

var thing1 = new Thing(50,50,"blue");
var thing2 = new Thing(50,50,"red");
var thing3 = new Thing(50,50,"purple");
var thing4 = new Thing(50,50);

//the action names are obviously long and annoying
//but just wanted to be clear about exactly what they
//are doing.
thing1.moveByPixelsInTime(200,0,testTime);
thing2.moveByPixelsInTime(300,0,testTime);
thing3.moveByPixelsInTime(400,0,testTime);
thing4.moveByPixelsInTime(500,0,testTime);

//also, you call this action with x and y, but I wanted to make the
//point that the actions are acting in total, as opposed to just replacing
//the previous one, like what would happen with a standard transform.
thing1.moveByPixelsInTime(0,200,testTime);
thing2.moveByPixelsInTime(0,300,testTime);
thing3.moveByPixelsInTime(0,400,testTime);
thing4.moveByPixelsInTime(0,500,testTime);

thing1.scaleByPercentInTime(2,testTime);
thing2.scaleByPercentInTime(2.5,testTime);
thing3.scaleByPercentInTime(3,testTime);
thing4.scaleByPercentInTime(3.5,testTime);

thing1.rotateByDegreesInTime(30,testTime);
thing2.rotateByDegreesInTime(60,testTime);
thing3.rotateByDegreesInTime(90,testTime);
thing4.rotateByDegreesInTime(120,testTime);




