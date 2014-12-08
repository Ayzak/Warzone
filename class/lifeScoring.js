/**
 *  A groupement of life bar to monitoring how many flags are stole, and show their progression.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

/**
 *  Constructor.
 *  @param int[x], int.[y], to determinate position on X and Y axes.
 */
var lifeScoring = function (x,y){
	/*height 20+*/

	/* Create canvas on memory. */
	this.canvas = document.createElement("canvas");
	this.canvas.id='lifeFlag';
	this.canvas.width = 302;
	this.canvas.height = 250;

	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.context = this.canvas.getContext("2d");

	this.x = x;
	this.y = y;

	/* The espacement between life bar. */
	this.espacement = 25;
	this.teamLife = [];

	/* Creation of 10 life bars. */
	for( var i = 0 ; i < 10 ; i++){
		var newLife = new Life(0, (i*this.espacement), 300, 20, Settings.COLORMARK[i])
		this.teamLife.push(newLife);

	}
}

/**
 *  Render.
 *  @return canvas to draw on main stage.
 */
lifeScoring.prototype.render = function(){
	this.context.clearRect(0, 0, this.width, this.height);
		
		for(var i in this.teamLife){

			var rendu = this.teamLife[i].render();
			this.context.drawImage(
				rendu,
				0,
				0,
				rendu.width,
				rendu.height,
				this.teamLife[i].x + (rendu.width/10),
				this.teamLife[i].y,
				rendu.width - rendu.width/10,
				rendu.height - 10
			);
		}
	
	return this.canvas;
}
/**
 *  NextFrame for the animation.
 */
lifeScoring.prototype.nextFrame = function(){
	for (var i in this.teamLife) {
		this.teamLife[i].nextFrame();
	}
}

/**
 *  Function, Setter, for update the variation of one life bar.
 *  @param int[j], for the number of the team,
 *  @param int[n], is the percent of the variation 0<n<1.
 */
lifeScoring.prototype.updateLife = function(j,n){
	
	/* j is for the life bar which we had to change value, and n is for how many we had to change value. */
	if(n<=1 && n>=0 && j >= 0 && j < 10)
		this.teamLife[j].setValue(n);

}
