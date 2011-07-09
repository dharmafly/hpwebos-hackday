enyo.kind({
	name: "journeyman.hello",
	kind: enyo.Control,
	content: "Hello World!"
});


/////


function init(){
    new journeyman.hello().renderInto(document.body);
}

window.addEventListener("load", init, false);
