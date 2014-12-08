/**
 *  Class for monitoring flags progression or not like a life bar.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

 /**
  *  Constructor
  *  @param int[x], int[y], for the position on X and Y axes,
  *  @param int[width], int[height] for the size of the element.
  *  @param hex[color} for the color of the circle (hexadecimal or RGB)
  */
function Life (x, y, width, height, color1) {

	/*Canvas on memory for working.*/
	this.canvas = document.createElement("canvas");
	this.canvas.id = "life";
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext("2d");

    /* Global width and heigth for the control and futur anti-aliasing. */
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    /* Placement of the life canvas. */
    this.x = x;
    this.y = y;

    /* Percent of variation. */
	this.percent = 0.0;
    /* Target. */
 	this.target = 0.0;

    /* Color. */
    this.color1=color1;

}

/**
 *  Function for drawing on the stage (warzone).
 *  @return canvas to draw on main stage.
 */
Life.prototype.render = function (){

	/* Clear the zone where we are goning to draw.*/
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	/* Draw the rect and close the path. */
    this.context.save();
    this.context.globalAlpha = 1;
    this.context.fillStyle = "white";
    this.context.strokeStyle = "rgb(5,5,5)";
    this.context.lineWidth = 2;
    this.context.fillRect(15, 0, this.canvas.width-12, this.canvas.height);
    this.context.strokeRect(15, 0, this.canvas.width-12, this.canvas.height);
    this.context.restore();

    /* Draw the other rect on, for the variation. */
    if (this.percent <= 1){
        this.context.save();
        this.context.fillStyle = this.color1;
        this.context.fillRect(14, 0, this.percent*(this.canvas.width-11), this.canvas.height);
        this.context.restore();
    }

    /* Draw a small rect for compréhension when the lifeBar will be empty. */
    this.context.save();
    this.context.strokeStyle = "rgb(250,250,250)";
    this.context.lineWidth = 1;
    this.context.fillStyle = this.color1;
    this.context.fillRect(1, 1, 10, this.canvas.height);
    this.context.strokeRect(0,0,11,this.canvas.height+1);
    this.context.restore();

    /* Return the canvas for the GlobalRender. */
    return this.canvas;

}

/**
 *  Function for the animation of the variation
 *  @param int[percent], for the percent of the deplacement, it's like a ratio.
 *  @param int[target], the maximal number to determinate the ratio.
 */
Life.prototype.nextFrame = function(percent,target){

    if (this.percent != this.target){
        this.percent += this.delta;
        /* If target percent > actual percent. */
        if (this.delta > 0) {
            /* If we're not on the target. */
            if(this.percent >= this.target){
                this.percent = this.target;
            }
        /* else If target < actual percent. */
        } else if (this.delta < 0) { 
            /* If we're not grap the target.*/
            if (this.percent <= this.target) {
                this.percent = this.target;
            }
        }
    }
}

/**
 *  Function to set the variation .
 *  @param int[percent], to set the variation of the circle.
 */
Life.prototype.setValue = function (percent) {
    /* Destination = variation */
	this.target = percent;
    /*variation = target - percent of variation) / step */
    this.delta = (this.target - this.percent) / 20;
}

