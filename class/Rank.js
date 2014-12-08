/**
 *  Class which represent the rank with the 10 teams.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

 /**
  *  Constructor
  *  @param array[ranking] with numero of teams in ascending order
  */
var Rank = function (ranking){

	/* Creation of the canvas on memory. */
	this.canvas = document.createElement("canvas");
	this.canvas.id = "rank";
	this.canvas.height = 500;
	this.canvas.width = 300;
	this.canvas.style = "border:1px solid #000000;";
	this.context = this.canvas.getContext('2d');

	/* The espacement of the team vignette. */
	this.espacement = 50;

	/* Position of the rank. */
	this.x = 700;
	this.y = 0;
	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.drawY = null;

	/* Array with the 10 teams. */
	this.teams = [];
	/* Array with moves for the memory and vairations. */
	this.moves = null;
	/* An array with the position of all team in the order. */
	this.ranking = ranking;

	/* Create every team object */
	for (var i = 0; i<10; i++) {
		this.teams.push(new rankTeam(i, 0));
		this.teams[this.teams.length-1].offset = this.espacement*i;
	}

}

/**
 *  Render of the rank of 10 teams.
 *  @return canvas to draw on main stage.
 */
Rank.prototype.render = function(){
	
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	this.Draw();

	return this.canvas;

}

/**
 *  Draw teams one by one.
 */
Rank.prototype.Draw = function(){

	for (var team in this.teams){

		this.drawY = this.teams[team].offset;
		var rendu = this.teams[team].render();
		
		this.context.drawImage(
				rendu,
				0,
				0,
				rendu.width,
				rendu.height,
				0,
				this.drawY,
				rendu.width,
				rendu.height
		);

	}

}

/**
 *  Animation for the rank update.
 */
Rank.prototype.nextFrame = function(){
	if (this.moves != null &&  this.moves.length > 0) {
		for (var i in this.moves) {
			this.moves[i].nextFrame();
		}
	}
}

/**
 *  Set the rank with an array of team's positions.
 *  @param array[ranking] with numero of teams in ascending order
 */
Rank.prototype.update = function(ranking){
	
	/* Remove all previous moves. */
	this.moves = [];

	for (var rank in ranking) {
		if (ranking[rank] != this.ranking[rank]) {
			this.moves.push(
				new Move(
					this.teams[ranking[rank]],
					this.ranking.indexOf(ranking[rank])*this.espacement,
					rank*this.espacement
				)
			);
		}
	}

	this.ranking = ranking;

 }

/**
 *  Function which simplify the scoring variation. 
 *  @param int[t], int[v] t is the team's No and v is the new score.
 */
 Rank.prototype.updateScore = function(t,v){
 	this.teams[t].Pts = v ;
 }

/**
 *  Un peu de documentation:
 *
 *  rank : nouvelle instance de rank global et permet d'intéragir avec le classement.
 *
 *  ui.update: permet de mettre à jour le classement et prend en paramètre un tableau
 *	ex: rank.update([0,1,2,3,4,5,6,7,8,9]);
 */


 /**
  *  ui.rank.teams[0].Pts; => Affiche les points de l'équipe
  *  ui.rank.teams[0].Pts = 250; => Modifie la valeur des points dans le tableau et
  *								a l'affichage du classement.
  *  ui.rank.updateScore(Team, nextScore);
  */
