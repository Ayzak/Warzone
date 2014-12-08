/**
 *  Class which create representation of one team on the global Rank.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

 /**
  *  Constructor
  *  @param int[team's numero], int[team's points], url[team's logo]
  */
var rankTeam = function(numero,pts,flags){	

	/* Creation of the team canvas. */
	this.team_can = document.createElement('canvas');
	this.team_can.id = "team";
	this.team_can.width = this.width = 300;
	this.team_can.height = this.height = 50;
	this.team_ctx = this.team_can.getContext('2d');

	/* Creation of the canvas which become with opacity. */
	this.logo_can = document.createElement("canvas");
	this.logo_can.id = "logo";
	this.logo_can.width = this.width;
	this.logo_can.height = this.height;
	this.logo_ctx = this.logo_can.getContext('2d');		

	this.ID = numero;
	this.nom = Settings.TEAMS[this.ID].name;
	this.pays = Settings.TEAMS[this.ID].nat;
	this.colorTeam = Settings.COLORMARK[this.ID];

	/* Number of points of the team. In it creation, they don't have any points. */
	this.Pts = pts;

	/* Pre-load logo and nationality flag. */
	this.logo = (new Loader()).getImage(Settings.TEAMS[this.ID].logoFan);
	this.flag = (new Loader()).getImage(Settings.TEAMS[this.ID].nat_img);
	
}

/**
 *  Render of the team.
 *  @return canvas to draw on main stage.
 */
rankTeam.prototype.render=function(){

	/* Draw the basic rectangular form */
	this.team_ctx.clearRect(0,0,this.team_can.width,this.team_can.height);
	
	this.team_ctx.save();
	this.team_ctx.fillStyle = "#efeae3",//"#7C9EA6";
	this.team_ctx.globalAlpha = 0.7;
	this.team_ctx.fillRect(15, 2, this.team_can.width, this.team_can.height-2);
	this.team_ctx.restore();

	/* Draw a small rect with the color of the team. To recognize the team in the rank And the warzone.*/
	this.team_ctx.save();	
	this.team_ctx.fillStyle = this.colorTeam;
	this.team_ctx.fillRect(15, 2, 8, this.team_can.height-2);
	this.team_ctx.restore();

	if (this.logo) {

		/* Draw the logo. */
		this.team_ctx.beginPath();
		this.team_ctx.drawImage(
			this.logo,
			0,
			0,
			this.logo.width,
			this.logo.height,
			27,
			2,
			48,
			48
		);
		this.team_ctx.closePath();

	}
	
	/* Write the name of the team. */
	var text = Settings.TEAMS[this.ID].name;
	this.team_ctx.font = "23pt computerfont";
	this.team_ctx.fillStyle = '#7d0002'
	this.team_ctx.fillText(text,110,22);
	
	/* Draw country flag. */
	this.team_ctx.fillRect(79,3,21,21);
	this.team_ctx.drawImage(
		this.flag,
		0,
		0,
		this.flag.width,
		this.flag.height,
		80,
		4,
		20,
		20
	);
	
	/* Write the points. */
	var text = this.Pts;
	this.team_ctx.font = "17pt foo";
	this.team_ctx.fillStyle = "rgb(5,5,5)"; //"#C9EBF";
	var text_size = this.team_ctx.measureText(new String(this.Pts));
	this.team_ctx.fillText(new String(this.Pts), this.team_can.width - text_size.width - 10, 45);
	
	return this.team_can;
}

/**
 *  Setter of points for the rank.
 *  @param int[new team's point]
 */
 rankTeam.prototype.setPoints = function(newPts){
 	this.Pts = newPts;
 }

 /**
  *  Update the flag monitor.
  *  @param int[new ratio of flags progression]
  */
 rankTeam.prototype.setFlags = function(newFlags){
 	this.flagsNumber = this.flagMonitor.setValue(newFlags);
 }
