/**
 *  Class for the variation of the principal timer for the 12h of the CTF.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

 /**
  *  Constructor
  *  @param int[x], int[y], for the position on X and Y axes,
  *  @param int[width], int[height] for the size of the element.
  *  @param int[percent], is the ratio of progression of the bar,
  *  @param int[target], is the end point (use to calculate ratio).
  */
function TimerBar (x, y, width, height,percent,target){

	/* Date for the begining. Use for the animation of the timer Bar. */
	this.starttime = new Date("Jun 28 20:00:00 2014");
	/* Date to the end of the event for the variation of the bar. */
	this.endtime = new Date("Jun 29 08:00:00 2014");
	/* Compute time left. */
	this.totaltime = (this.endtime - this.starttime)/1000;

	this.currendDate = new Date(); 
	
	/* Canvas on memory.*/
	this.canvas = document.createElement("canvas");
	this.canvas.id="progression";
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext("2d");

	/* Values for the draw. */
	this.x = x;
	this.y= y;
	this.width = width;
	this.height = height;

	/* Percent for the variation. */
	this.percent=0.5;
	/* Mode true of false for the special animation for the 30 minutes left. */
	this.mode = 0;
	/* The offset for the variation and glow effect. */
	this.offset = 0;
	/* The direction of the variation. */
	this.direction = 0;
}

/**
 *  Render.
 *  @return canvas to draw on main stage.
 */
TimerBar.prototype.render=function(){

	/* Clear the drawning zone. */
	this.context.clearRect(0,0,this.canvas.width , this.canvas.height);
	/* Draw background. */
	this.context.fillStyle='black';
	this.context.globalAlpha = 0.3;
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.globalAlpha = 1;

	/* If mode == 0, then 'normal mode'. */
	if (this.mode == 0) {
		if (this.percent <= 1) {
			/* Draw the rect which represent the timer bar. */
			this.context.strokeStyle='rgb(250,250,250)';
			this.context.lineWidth = 2;
			this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);


			var grd = this.context.createLinearGradient(0, this.canvas.height, 0,0);
			grd.addColorStop(0,'rgb(141,15,15)');
			grd.addColorStop(1, 'rgb(207,0,0)');
			this.context.fillStyle = grd;
			this.context.fillRect(1, 1, this.percent*(this.canvas.width-2), this.canvas.height-2);
		}

	} else {
		/* Else it's the special mode ! */
		var min = Math.floor(this.percent / 60);
		var sec = Math.floor(this.percent % 60);

		if (min < 10)
			min = '0'+min;
		if (sec < 10)
			sec = '0'+sec;

		var g = 250 + this.offset*(5);
		this.context.strokeStyle='rgb('+g+','+g+','+g+')';
		this.context.lineWidth = 1;
		this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);


		var grd = this.context.createLinearGradient(0, this.canvas.height, 0,0);
		var r1 = Math.floor(141 + this.offset*(-50));
		var g1 = Math.floor(15 + this.offset*(-10));
		var b1 = Math.floor(15 + this.offset*(-10));
		var r2 = Math.floor(207 + this.offset*(-50));
		var g2 = Math.floor(0);
		var b2 = Math.floor(0);
		grd.addColorStop(0,'rgb('+r1+','+g1+','+b1+')');
		grd.addColorStop(1, 'rgb('+r2+','+g2+','+b2+')');
		this.context.fillStyle = grd;
		
		this.context.fillRect(1, 1, this.canvas.width-2, this.canvas.height-2);
		this.context.font = '30px Arial bold';
		this.context.textAlign = 'center';
		this.context.fillStyle = 'rgb(250,250,250)';
		this.context.fillText(min+':'+sec, this.canvas.width/2, this.canvas.height/2 +5);
		this.canvas.height/2;
	}

	return this.canvas;	
}

/**
 *  Animation.
 */
TimerBar.prototype.nextFrame=function(){

	/* Calcule le temps restant en sec. */
	var left = ((this.endtime - new Date())/1000);

	if (left <= 0) {
		/* Game Over ! */
		this.percent = 0;
	} else if (left <= 30*60) {
		/* <= 30 mins left ! */
		this.mode = 1;
		this.percent = left;

		/* Glow effect. */
		if (this.direction == 0 && this.offset < 1) {
			this.offset += 0.1;
		} else if (this.direction == 0 && this.offset >=1) {
			this.direction = 1;
		} else if (this.direction == 1 && this.offset > 0) {
			this.offset -= 0.1;
		} else if (this.direction == 1 && this.offset <= 0) {
			this.direction = 0;
		}

	} else {
		this.percent = left/this.totaltime;
	}
}


