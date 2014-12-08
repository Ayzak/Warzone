/**
 *  Class Team which regroup Life and Flags for manitoring and represente teams of the contest.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

 /**
  *  Constructor
  *  @param int[x], int[y] for the position on the main stage
  *  @param int[services_percent] for the services mark
  *  @param url[fanion] for the logo of the team.
  */
function Team (x, y, services_percent, flags_percent, fanion){

	/* Canvas on the memory for working. */
	this.canvas = document.createElement("canvas");
	this.canvas.id="team";
	this.canvas.width = 40;
	this.canvas.height= 40;
	this.context = this.canvas.getContext("2d");

	/* Global width and height for the control and futur anti-aliasing. */
	this.width = this.canvas.width;
	this.height = this.canvas.height;

	/* Placement. */
	this.x = x;
	this.y = y;

	/* Fanion = the logo of the team. */
	this.team_logo = (new Loader()).getImage(fanion);
	
}

/**
 *  Setter to modifie the position of the team.
 *  @param int[x], int[y] to set position of one team.
 */
Team.prototype.setPosition = function(x,y) {
	this.x = x;
	this.y = y;
}

/**
 *  Integration of the element of monitoring 
 *  and
 *  for drawing on the stage (warzone).
 *  @return canvas to draw on main stage.
 */
Team.prototype.render = function(){

	/* Clear the zone where we will draw.*/
	this.context.clearRect(0 ,0 , this.canvas.width, this.canvas.height);

	/* Draw Tag Team (fanion). */
	if (this.team_logo != null){

		/* If logo exist. */
		this.context.beginPath();
		this.context.drawImage(
			this.team_logo,
			0,
			0,
			this.team_logo.width,
			this.team_logo.height,
			0,
			0,
			40,
			40
		);
		this.context.closePath();

	}else{
		
		/* If logo does not exist, draw a standard rect. */
		this.context.beginPath();
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, 64, 64);
		this.context.fill();
		this.context.closePath();
	}

	/* Return the canvas to draw. */
	return this.canvas;

}

/**
 * Animate the monitor.
 */
Team.prototype.nextFrame = function(){

}

/**
 *  Update the render of Services, the lifeBar and lauch the animation of variation.
 *  @param int[ratio] for the variation 0<ratio<1
 */
Team.prototype.updateServices = function(services_percent) {
	this.services_percent = services_percent;
	this.services_monitoring.setValue(this.services_percent);
}

/**
 *  Update the render of the flags monitoring and launch the animation.
 *  @param int[ratio] for the variation 0<ratio<1
 */
Team.prototype.updateFlags = function(flags_percent) {
	this.flags_percent = flags_percent;
	this.flags_monitoring.setValue(this.flags_percent);
}
