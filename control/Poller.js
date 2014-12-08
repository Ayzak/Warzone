/**
  *  A controller who pull informations.
  *  @Authors : Jeremy Locheron, Damien Cauquil.
  */

/**
 *  Constructor which load UI and all parts of the visual interface.
 *  @param class[UI], Class wich load UI elements.
 */
var Poller = function(ui) {

	this.ui = ui;
	/* Delay to relpad informations. */
	this.delay = 1000;
	/* Delay to relpad information captures. */
	this.delay2 = 10000;
	/* An array which contain correspondance between teams ID and teams No. */
	this.corresp = new Array();
	
	this.correspondance();
};

/**
 *  Function which sort array in ascending order.
 *  @param int[A], int[B] to sort them.
 */
Poller.prototype.sortUp = function(a,b){
	return b.score - a.score;
}

/**
 *  Function which sort the array in ascending order for team's No.
 *  @param nt[A], int[B] to sort them.
 */
Poller.prototype.sortNo = function(a,b){
	if(b.score == 0)
		return a.team - b.team;
}

/**
 * Function that lake correspondance between teams ID and teams No.
 * @return array[corresp] to make correspond team's ID and team's No.
 */
Poller.prototype.correspondance = function(){
	$.ajax({
		url : "../teams/ranking.json?" + new Date().getTime(),
		dataType : 'json',
		success : (function(me){
				return function(res){
					/* Simplify access and parsing for the json. */
					var result = res.saltmaster; 

					for (var i in res){
						me.corresp[res[i].Team.id] = res[i].Team.no - 1;
					}

				}
			})(this)
		});
	return this.corresp;
}

/**
 * Function which monitor captures.
 */
Poller.prototype.capturesPoll = function(){

	$.ajax({
		url : "../captures/ranking.json?" + new Date().getTime(),
		dataType : 'json',
		success : (function(me){
				return function(res){

					for (var j in res.captures){	

						/* if (res.captures[j].Flag.target in me.corresp) { */
							me.ui.war.addCapture(
								res.captures[j].Team.shooter - 1,
								res.captures[j].Flag.target -1
							);
						
					}

					/* We load and parse the json every 10 seconds. */
					setTimeout(function(){me.capturesPoll();}, me.delay2);

				}

			})(this)
		});
}

/**
 *  Function who pull new informations and add new elements on the scene.
 */
Poller.prototype.poll = function() {

	/* Ajax (with jquery) script who load informations. */

	/**
	 *  Poll trafic informations.
	 */
	$.ajax({
		/* Url to load JSON file. */
		url: "data.json?" + new Date().getTime(),
		/* What will we load ? */
		dataType: 'json',
		/* If success. */
		success: (function(me){
			return function(res){
				/* var result to simplify the access to the json object like an array. */
				var result = res.saltmaster; 
				/* Hardcoding max value for speed. max speed is 1.5 */
				var max = 100000;

				/* We loop on the object that contain informations. */
				for (var i  in result){
					for(var j in result[i]){

						/* If we have some trafic. */
						if( result[i][j].packets > 0 && result[i][j].bytes > 0 ){

							/********************************************************************
							  Utilisation de la proportionalité ou des logarithme à tester si on utilise par rapport aux BYTES ou aux PACKETS.
							*********************************************************************/

							/* Proportionnalité. */
							/*var coef = (1.5 * result[i][j].packets) / max ;  */

							/* Logarithme. */
							var coef = Math.log(result[i][j].packets) / Math.log(max);
								/* If coef is > max speed that we can draw. */
								if(coef>1.5)
									coef=1.5;
								/* Min speed is 0.1 bacause less is to slow. */
								if(coef<0.1)
									coef=0.1;

							/* Add some strikes. */
							if (me.ui.loaded)
								me.ui.war.addStrike(result[i][j].source_team - 1,result[i][j].dest_team - 1,coef);

						/* Else If we don't have some traffic. */
						} else if (result[i][j].packets == 0 && result[i][j].bytes == 0){

							/* We remove Strikes. */
							if (me.ui.loaded)
								me.ui.war.removeStrike(result[i][j].source_team - 1,result[i][j].dest_team - 1);
						}	
					}
				}

				/* We reload and parse the json every 3 seconds. */
				setTimeout(function(){me.poll();}, me.delay);
			}

		})(this)
	});
	
	/**
	 *  Poll rank.
	 */
	$.ajax({
		/* Here new date generate a new URL every time. It's use to forbid cache memory. */
		url : '../teams/ranking.json?' + new Date().getTime(),
		dataType:'json',
		success: (function(me){
			return function(res){

				/* Creation of an array with the number and number of points of each team. */
				var scoring = new Array();

				for(var i in res){
					scoring.push({
						'score' : res[i].Score.points,
						'team' : parseInt(res[i].Team.no)-1,
						'progress' : res[i].Score.progression
					});

				}

				/* If score == 0, we sort teams by their numero. */
				scoring.sort(me.sortNo);

				/* Sort the array in ascending order. */
				scoring.sort(me.sortUp);

				/* Creation of an array only with number in ascending order 
				for the param of me.ui.rank.update() to update the rank. */
				var update = [];

				for (var j in scoring){
					update.push(scoring[j].team);
					/* Update the number of points on the rank. */
					me.ui.rank.updateScore(scoring[j].team, scoring[j].score);
					/* Update Life, which represente progression of flags' validation. */
					me.ui.life.updateLife(scoring[j].team , scoring[j].progress / 100);
				}
				
				/* Update the rank with the appropriate animation. */
				me.ui.rank.update(update);
					
			}

		})(this)

	});

	/**
	 * Poll Services
	 */
	$.ajax({
	 	url: '../services/ranking.json?' + new Date().getTime(),
	 	dataType: 'json',
		success: (function(me){
			return function(res){

	 			var totalServices = res.total;
	 			var servicing = new Array();

	 			for(var i in res){
	 				for(var j in res[i]){

	 					servicing.push({
							'team' : parseInt(res[i][j].Team.no)-1,
							'services_down' : res[i][j][0].down
						});

	 				}
	 			}

	 			for(var k in servicing){
	 				var ratio = Math.round((servicing[k].services_down / totalServices)*100)/100 ;
	 				me.ui.war.updateServices(servicing[k].team,ratio);
	 			}


			}
		})(this)
	});

}

