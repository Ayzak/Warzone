/**
 * Class who create the color point which represent the associate team.
 */

 /*
  * Remplacer les marqueurs par un camembert représentant les services, les missiles partirait de là
  mais on aurait quand même un render pour les services et de façon minimaliste avec un gain de place 
  assez conséquent.

  */
var Marqueur = function(x,y, color){

	this.canvas = document.createElement('canvas');
	this.canvas.id="marqueur";
	this.ctx = this.canvas.getContext('2d');

	this.radius = 10; 
	this.height = this.radius*2;
	this.width = this.radius*2;
	this.radius = 8;
	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.x = x;
	this.y = y;

	this.color = color;

}

/**
 * Rendering of the color point who represent the apprpriate team.
 */
Marqueur.prototype.render = function (){

	this.ctx.beginPath();
	this.ctx.arc(this.width/2, this.height/2, this.radius, 0, 2*Math.PI, false);
	this.ctx.fillStyle = this.color;
	this.ctx.fill();
	this.ctx.lineWidth=1;
	this.ctx.stroke();
	this.ctx.closePath();

	return this.canvas;
}

/**
 * We need a function with this name for the GlobalRender.
 */
Marqueur.prototype.nextFrame = function (){

}