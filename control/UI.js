/**
 *  Function for loading all instances elements that we need.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

 /**
  * Constructor
  */
var UI = function(){
	/* Boolean for loading or not loading. */
	this.loaded = false;
	/* Function which create instances. */
	this.load();
	/* Instance of Poller who load json files. */
	this.poller = new Poller(this);
}

/**
 *  Load all we need.
 */
UI.prototype.load = function() {
	
	/* Preload all we need. */
	this.loader = new Loader();
	this.zone = null;
	this.rank = null;
	this.life = null;
	
	this.loader.preload([
		/* Strike, capture flag animations. */
		'template/pictures/striker.png',
		'template/pictures/grappin-only.png',
		'template/pictures/grappin-flag.png',
		/* Load all informations about teams. */
		Settings.TEAMS[0].nat_img,
		Settings.TEAMS[1].nat_img,
		Settings.TEAMS[2].nat_img,
		Settings.TEAMS[3].nat_img,
		Settings.TEAMS[4].nat_img,
		Settings.TEAMS[5].nat_img,
		Settings.TEAMS[6].nat_img,
		Settings.TEAMS[7].nat_img,
		Settings.TEAMS[8].nat_img,
		Settings.TEAMS[9].nat_img,
		Settings.TEAMS[0].logoFan,
		Settings.TEAMS[1].logoFan,
		Settings.TEAMS[2].logoFan,
		Settings.TEAMS[3].logoFan,
		Settings.TEAMS[4].logoFan,
		Settings.TEAMS[5].logoFan,
		Settings.TEAMS[6].logoFan,
		Settings.TEAMS[7].logoFan,
		Settings.TEAMS[8].logoFan,
		Settings.TEAMS[9].logoFan ],
		/* Callback. */
		(function(me){
			return function(){
				me.initialize();
			}
		})(this)
	);
};

/**
 *  Initialize the canvas where all animations will be.
 */
UI.prototype.initialize = function() {

	var can = document.getElementById("warzone");
	can.style.width = window.innerWidth + 'px';
	can.style.height = window.innerHeight + 'px';
	can.width=1010;
	can.height=780;

	this.zone = new GlobalRender('warzone');
	this.war = new Warzone(0,0,700,700);
	//var team1 = new Team(10, 10, 0.5, 0.7, "red", null);
	this.progress_bar = new TimerBar(0,700,500,35,0.2,1.0);
	var initBarWidth = this.progress_bar.width;
	var initBarHeight = this.progress_bar.height;

	var initPos = [0,1,2,3,4,5,6,7,8,9];
	this.rank = new Rank(initPos);
	/* Flags counter. */
	this.life = new lifeScoring(690,510);

	/* x, y - épaisseur de la barre, largeur total du canvas, epaisseur de la barre.*/
	this.zone.add(this.war);
	this.zone.add(this.progress_bar);
	this.zone.add(this.rank);
	this.zone.add(this.life);
	this.zone.active = true;

	/**
	 *  When we resize the window, the canvas will be resize too.
	 */
	window.onresize = (function(me){
		return function() {

			/* Resize canvas. */
			var width = window.innerWidth;
			var height = window.innerHeight;
			me.zone.onResize(width, height);

			/* Resize our items. */
			rank_ratio = me.rank.width/me.rank.height;
			me.rank.height = 2*height/3 - 20;
			me.rank.width = me.rank.height * rank_ratio;
			me.rank.x = width - me.rank.width - 10;

			life_ratio = me.life.width/me.life.height;
			me.life.y = me.rank.height + me.rank.y + 10;
			me.life.height = height/3;
			me.life.width = me.life.height * life_ratio;
			me.life.x = width - me.life.width - 10;

			me.war.width = width - 320;

			me.progress_bar.width = width - me.rank.width - 125;
			me.progress_bar.y = height - 50;
			me.progress_bar.x = 25;

			/* Resize warzone. */
			me.war.setSize(0, 0, width - me.rank.width - 20, height - 50);
		};
	})(this);

	/* Loading is ok. */
	this.loaded = true;
	/* The loop that will refresh the scene in the global render. */
	this.zone.loop();
	/* Poller who get json. */
	this.poller.poll();
	/* Poller which get json of captures. */
	this.poller.capturesPoll();
	/* First resize. */
	window.onresize();

}
