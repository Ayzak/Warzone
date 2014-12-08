var Application = function(){

			/**
			debug script
			*/
			
		    var loader = new Loader();
            var zone = null;
            var nunu = null;
            var life = null;
            /* flag monitoring (bar); */
            loader.preload([
            	'template/pictures/striker.png',
            	'template/pictures/grappin-only.png',
            	'template/pictures/grappin-flag.png',
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
				Settings.TEAMS[0].logo,
				Settings.TEAMS[0].logoBan,
				Settings.TEAMS[0].logoFan,
				Settings.TEAMS[1].logo,
				Settings.TEAMS[1].logoBan,
				Settings.TEAMS[1].logoFan,
				Settings.TEAMS[3].logo,
				Settings.TEAMS[3].logoBan,
				Settings.TEAMS[3].logoFan,
				Settings.TEAMS[6].logo,
				Settings.TEAMS[6].logoBan,
				Settings.TEAMS[6].logoFan,
				Settings.TEAMS[7].logo,
				Settings.TEAMS[7].logoBan, 
				Settings.TEAMS[7].logoFan], function(){  


				var can = document.getElementById("warzone");
					can.style.width = window.innerWidth + 'px';
					can.style.height = window.innerHeight + 'px';
					can.width=1010;
					can.height=780;

                zone = new GlobalRender('warzone');
                window.war = new Warzone()
                //var team1 = new Team(10, 10, 0.5, 0.7, "red", null);
                var progress_bar = new TimerBar(0,700,700,50,0.2,1.0);

                var initPos = [0,1,2,3,4,5,6,7,8,9];
                nunu = new Rank(initPos);
                /* Flags counter. */
                life = new lifeScoring(700,510);

                //var missiles = new Strike(200,10,10,200 , 6);
                /* x, y - épaisseur de la barre, largeur total du canvas, epaisseur de la barre.*/
                
                zone.add(progress_bar);
                zone.add(nunu);
                zone.add(life);
                zone.active = true;

			    window.onresize = function(){
			    	/* Resize canvas. */
			    	var width = window.innerWidth;
			    	var height = window.innerHeight;
			    	zone.onResize(width, height);

			    	/* Resize our items. */
			    	nunu_ratio = nunu.width/nunu.height;
		    		nunu.height = 2*height/3 - 20;
		    		nunu.width = nunu.height * nunu_ratio;
		    		life_ratio = life.width/life.height;
		    		life.y = nunu.height + nunu.y + 10;
		    		life.height = height/3;
		    		life.width = life.height * life_ratio;
			    	nunu.x = width - nunu.width - 10;
			    	life.x = width - life.width - 10;
			    	war.width = width - 320;
			    	var ratio_pb = progress_bar.width/progress_bar.height;
			    	if (width < (progress_bar.width - nunu.width - 20)) {
				    	progress_bar.width = width - nunu.width - 20;
				    	progress_bar.height = progress_bar.width / ratio_pb;
				    }
			    	progress_bar.y = height - progress_bar.height - 20;
			    }

                zone.loop();
            });
}

