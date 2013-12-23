An IRC/hipchat client (uses node-irc/wobot) written in node.js & utilizing the blessed library from nodejitsu

In development.. I murdered this code recently. I need to re-design how I handle chatting in different rooms. I had some weird idea which was clearly NOT working and I just kept coding it to see if it eventually made sense => no. It ended up becoming a serious wreck.

It connects to irc/hipchat and you can talk etc..

Very quick rundown:

	node app.js
	/use efnet
	/join #channel
	talk.. like normal
	just type stuff
	/use hipchat
	/join Room
	talk like normal
	/use blessed <-- this shows all of the chat simultaneously


lol what a wreck.

:F

