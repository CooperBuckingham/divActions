# divActions
A simple example framework for animating divs using composite actions for position, scale, and rotation.

demo.js contains the examples for how to:

1. instance a Thing, which is just a class wrapped around a div.
2. add actions to a Thing to move it, rotate it and scale it.
3. the top portion has demo flags to force fixed intervals, and lower performance, all just for the purpose of discussion.

Note: actions are composite, which means if you add 2 movement actions to a Thing, then the thing will be updating each frame based on both actions.

Since everything is just a div, you could add CSS classes and files, use standard button and click and link commands, etc.

For demo purposes the code in the Thing/actions is not very dry, if you were going to really use this to do anything, you'd want to make an action class and create instances of Actions and add them to Things. That way you could also easily pause or remove an individual action ahead of schedule.

Oh, and obviously all the objects have just simple names stored in global, so please wrap them up in something first.





