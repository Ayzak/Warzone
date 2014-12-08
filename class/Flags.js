/**
 *  Flags class.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

/**
 *  Constructor
 *  @param int[x] for x placement
 *  @param int[y] for y placement 
 *  @param int[radius] for the radius of circle
 *  @param hex[color] for the color of the circle (hexadecimal or RGB)
 */
function Flags (x, y, radius, color1) {

	/* Creation of a local canvas in system memory. */
	this.canvas = document.createElement("canvas");
	this.canvas.id = "flags";

	this.canvas.width = radius*2;
	this.canvas.height = radius*2;
    this.width = radius*2;
    this.height = radius*2;
	this.context = this.canvas.getContext("2d");

	/* Centre of the circle in X. */
	this.x = x;

	/* Centre of the circle in Y. */
 	this.y = y;

 	this.radius = radius;
    this.centerX = radius;
    this.centerY = radius;

	/* Delta is the variation of the angular in percent. 
	For exemple 0.7 = 70% . */
 	this.percent = 0.0;
	
 	/* Declare the target for a futur use. */
 	this.target = 0.0;

 	/* The main color of the monitoring. */
 	this.color1 = color1;
}

/**
 * Setter for the position.
 * @param int[x], int[y]] for new placement.
 */
Flags.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Render method for draw drawing on the canvas.
 * @return canvas to draw on main stage.
 */
Flags.prototype.render = function(){

	/* Clear the area where we want to draw. */
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

    /* Draw the background transparent disc. */
    this.context.save();
    this.context.beginPath();/*Begining of the path.*/
    this.context.globalAlpha = 1;
    this.context.fillStyle = this.color1;
    this.context.arc(this.centerX, this.centerY, this.radius-2, 0, 2*Math.PI, false);
    this.context.stroke();
    this.context.fill();
    this.context.closePath();
    this.context.restore();
    this.context.globalAlpha = 1;

    /* Draw a border. */
    this.context.strokeStyle = this.color1;
    this.context.lineWidth = 3;
    this.context.arc(this.centerX, this.centerY, this.radius-2, 0, 2*Math.PI, false);
    this.context.stroke();

    /* Fill a sector based on current percent. */
    this.context.save();
    this.context.fillStyle = 'rgb(250,250,250)';
    if (this.percent > 0) {
        this.context.beginPath();/* Begining of the path. */
        this.context.moveTo(this.centerX, this.centerY);
        this.context.arc(this.centerX, this.centerY, this.radius-3, 0, this.percent*(2*Math.PI), false);/*Draw part of circle. */
        this.context.moveTo(this.centerX, this.centerY);
        this.context.globalalpha = 0.65 ;
        this.context.closePath();
        this.context.fill();

    }

    this.context.restore();

    return this.canvas;
}

/**
 *  Function for the animation of the variation
 *  @param int[percent], for the percent of the deplacement, it's like a ratio.
 *  @param int[target], the maximal number to determinate the ratio.
 */
Flags.prototype.nextFrame = function(percent,target){
    if (this.percent != this.target){
        this.percent += this.delta;
        /* If target percent > actual percent. */
        if (this.delta > 0) {
            /* If we're not on the target. */
            if(this.percent >= this.target){
                this.percent = this.target;
            }
        } else if (this.delta < 0) { /* If target < actual percent. */
            /* If we're not grap the target.*/
            if (this.percent <= this.target) {
                this.percent = this.target;
            }
        }
	}
}

/**
 *  Setterf for the variation.
 *  @param int[percent], to set the variation of the circle.
 */
Flags.prototype.setValue = function (percent){
	this.target = percent;/*Target => percent of variation.*/
	this.delta = (this.target-this.percent)/20; /*variation = (target - percent)/ number of stepsto go to the target.*/
}

