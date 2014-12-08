/**
 *  Controler who going to place 10 teams on the warzone and make the gestion of actions.+
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

/**
 *  Constructor
 *  @param int[x] int[y], for the position on X and Y axes,
 *  @param int[width], int[height] for the size of the element.
 */
var Warzone = function(x, y, width, height) {

    /* List of different teams. */
    this.teams = [];

    /* List of different Markers. */
    this.markers = [];

    /* Array wich add flags capture on memory. */
    this.grapFlag = [];

    /* Strikes */
    this.strikes = [];

    /* Call the singleton to draw new elements ont the main canvas. */
    this.setSize(x, y, width, height);

}

/**
 *  Function will compute all new position of the warzone when the windows will be resize.
 *  @param int[x] int[y], for new position on X and Y axes,
 *  @param int[width], int[height] to set the new size of the element.
 */
Warzone.prototype.setSize = function(x, y, width, height) {

    /* If a previous canvas exists, remove it. */
    if (this.canvas) {
        delete this.canvas;
        this.canvas = null;
    }

    /* Create our canvas. */
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");

    /* Save coords and size. */
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    /* Populate teams if not already populated. */
    var shouldPopulate = (this.teams.length == 0);

    /* The center of the "scene" and of the circle to draw teams. */
    var centerX = this.canvas.width/2;
    var centerY = this.canvas.height/2;
    var radius = Math.min(this.canvas.width, this.canvas.height)/2 -80;

    /* Loop for drawing teams on circle positon on the warzone. */
    var id = 0;
    var i = 0;

    for (var angle = null; angle < (Math.PI*2) ; angle += (Math.PI/5)){

        /* Compute positions on x and y. */
        var x = centerX + (Math.cos(angle) * radius) - 10; /* Marker height: 100px */
        var y = centerY + (Math.sin(angle) * radius) - 10; /* Marker width: 100px */

        var xf = centerX + (Math.cos(angle) * (radius+45)) - 16; /* Team height: 100px */
        var yf = centerY + (Math.sin(angle) * (radius+45)) - 16; /* Team width: 100px */
        /* The end of the formula is for alignate markers and fanion. The espacement between
        two elements is about the radius adjustment. */

        /* Creation of the team. */
        if (shouldPopulate) {
            /* Create a new team at the right position. */
            this.teams.push(new Team(xf, yf, null, null, Settings.TEAMS[id].logoFan));

            /* And the associated marker. */
            this.teams[id].marker = new Flags(x,y,15,Settings.COLORMARK[id]);
            this.teams[id].marker.team = id;
            this.markers.push(this.teams[id].marker);
        }
        else {
            /* Update team position. */
            this.teams[id].setPosition(xf, yf);
            this.teams[id].marker.setPosition(x, y);
        }

        id++;
    }

    /* Update strikes. */
    for (var from in this.strikes) {
        for (var to in this.strikes[from]) {
            var strike = this.strikes[from][to];
            if (strike != null){
                strike.setPosition(
                    this.teams[from].marker.x+10,
                    this.teams[from].marker.y +10,
                    this.teams[to].marker.x +10,
                    this.teams[to].marker.y +10
                );
            }
        }
    }

    /* Update captures. */
    for (var from in this.grapFlag) {
        for (var to in this.grapFlag[from]) {
            var grap = this.grapFlag[from][to];
            if (grap != null) {
                grap.setPosition(
                    this.teams[from].marker.x+10,
                    this.teams[from].marker.y +10,
                    this.teams[to].marker.x +10,
                    this.teams[to].marker.y +10
                );
            }
        }
    }
}

/**
 *  Render.
 *  @return canvas to draw on main stage.
 */
Warzone.prototype.render = function() {
    /* Render everything inside our warzone. */

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* First, render strikes. */
    for (var from in this.strikes) {
        for (var to in this.strikes[from]) {
            if (this.strikes[from][to] && this.strikes[from][to].active) {
                var strike_render = this.strikes[from][to].render();
                this.context.drawImage(
                    strike_render,
                    0,
                    0,
                    strike_render.width,
                    strike_render.height,
                    this.strikes[from][to].x,
                    this.strikes[from][to].y,
                    strike_render.width,
                    strike_render.height
                );
            }
        }
    }

    /* Draw captures. */
    for (var from in this.grapFlag) {
        for (var to in this.grapFlag[from]) {
            if (this.grapFlag[from][to]) {
                var grap_render = this.grapFlag[from][to].render();
                this.context.drawImage(
                    grap_render,
                    0,
                    0,
                    grap_render.width,
                    grap_render.height,
                    this.grapFlag[from][to].x,
                    this.grapFlag[from][to].y,
                    grap_render.width,
                    grap_render.height
                );
            }
        }
    }

    /* Draw teams. */
    for (var team in this.teams) {
        var team_render = this.teams[team].render();
        this.context.drawImage(
            team_render,
            0,
            0,
            team_render.width,
            team_render.height,
            this.teams[team].x,
            this.teams[team].y,
            team_render.width,
            team_render.height
        );

        var marker_render = this.teams[team].marker.render();
        this.context.drawImage(
            marker_render,
            0,
            0,
            marker_render.width,
            marker_render.height,
            this.teams[team].marker.x-5,
            this.teams[team].marker.y-5,
            marker_render.width,
            marker_render.height
        );
    }

    /* Return the canvas. */
    return this.canvas;
}

/**
 *  NextFrame for the animation.
 */
Warzone.prototype.nextFrame = function() {

    /* Animate strikes and captures. */
    for (var from in this.strikes) {
        for (var to in this.strikes[from]) {
            if (this.strikes[from][to])
                this.strikes[from][to].nextFrame();
        }
    }

    /* Draw captures. */
    for (var from in this.grapFlag) {
        for (var to in this.grapFlag[from]) {
            if (this.grapFlag[from][to])
                this.grapFlag[from][to].nextFrame();
        }
    }

    /* Animate flags. */
    for (var marker in this.markers) {
        this.markers[marker].nextFrame();
    }
}

/**
 *  Place teams on the canvas.
 */
Warzone.prototype.Placement = function() {

    /* The center of the "scene" and of the circle to draw teams. */
    var centerX = this.canvas.width/2;
    var centerY = this.canvas.height/2;
    var radius = Math.min(this.canvas.width, this.canvas.height);

    /* Boucle for drawing teams on circle positon on the warzone. */
    var id = 0;
    var i = 0;

    for (var angle = null; angle < (Math.PI*2) ; angle += (Math.PI/5)){

        /* Compute positions on x and y. */
        var x = centerX + (Math.cos(angle) * radius) - 10; /* Marker height: 100px */
        var y = centerY + (Math.sin(angle) * radius) - 10; /* Marker width: 100px */

        var xf = centerX + (Math.cos(angle) * (radius+45)) - 16; /* Team height: 100px */
        var yf = centerY + (Math.sin(angle) * (radius+45)) - 16; /* Team width: 100px */
        /* The end of the formula is for alignate markers and fanion. The espacement between
        two elements is about the radius adjustment. */

        /* Creation of the team. */
        this.teams.push(new Team(xf, yf, null, null, Settings.TEAMS[id].logoFan));

        /* And the associated marker. */
        this.teams[id].marker = new Flags(x,y,10,Settings.COLORMARK[id]);
        this.teams[id].marker.team = id;
        this.markers.push(this.teams[id].marker);

        this.markers.push(this.teams[id].marker);

    }

}

/**
 *  Add Strike on the scene between two teams.
 *  @param int[beginTeam], int[endTeam] for the begining point and the end of animation,
 *  @param int[speed], to set the speed of the animation.
 */
Warzone.prototype.addStrike = function(beginTeam, endTeam, speed){

    var missile = new Strike(this.markers[beginTeam].x +10 ,this.markers[beginTeam].y + 10,
        this.markers[endTeam].x + 10, this.markers[endTeam].y + 10, speed);

    missile.from = beginTeam;
    missile.to = endTeam;

    /* If null, create 2nd dimension of the array.*/
    if (this.strikes[beginTeam] == null)
        this.strikes[beginTeam] = [];
    /* If begin team and end team of an attack are not null, update the informations 
        about the traffic. */
    if (this.strikes[beginTeam][endTeam] != null) {
        this.strikes[beginTeam][endTeam].setSpeed(speed);
        return;
    /* Else if begin team and end team are egal to missile attack, add the Strike to the scene. */
    } else {
        this.strikes[beginTeam][endTeam] = missile;
    }
}

/**
 *  Remove a Strike to the scene between two teams.
 *  @param int[beginTeam], int[endTeam] for the begining point and the end of animation.
 */
Warzone.prototype.removeStrike = function(beginTeam,endTeam){

    /* If begin team AND begin + end team are present, remove them to the globalRender items. */
    if (this.strikes[beginTeam] && this.strikes[beginTeam][endTeam]) {
        this.strikes[beginTeam][endTeam] = null;
    }
}

/**
 *  Update speed for representation of accelerate traffic between two teams.
 *  @param int[beginTeam], int[endTeam] for the begining point and the end of animation,
 *  @param int[speed], to set the speed of the animation.
 */
Warzone.prototype.updateStrike = function(beginTeam,endTeam, speed){

    /* If begin team AND begin + end teams are present, update the speed of the traffic of the Strike. */
    if (this.strikes[beginTeam] && this.strikes[beginTeam][endTeam])
        this.strikes[beginTeam][endTeam].setSpeed(speed);

}

/**
 *   Add one flag capture on the scene.
 *   @param int[winnTeam], int[looseTeam] for the begining point and the end of animation,
 */
Warzone.prototype.addCapture = function(winTeam, looseTeam) {

    var graplet = new Capture(
        this.markers[winTeam].x +10,
        this.markers[winTeam].y + 10,
        this.markers[looseTeam].x + 10,
        this.markers[looseTeam].y + 10,
        30,
        (function(me, wint, looset){
            return function(){
                if (me.grapFlag[wint][looset] != null)
                {
                    /* Remove capture from captures. */
                    me.grapFlag[wint][looset] = null;

                    /* Re-enable strike display if any. */
                    if (me.strikes[wint] && me.strikes[wint][looset] != null) {
                        me.strikes[wint][looset].active = true;
                    }
                    if (me.strikes[looset] && me.strikes[looset][wint] != null) {
                        me.strikes[looset][wint].active = true;
                    }
                }
            };
        })(this, winTeam, looseTeam));

    /* If null, create 2nd dimension of the array.*/
    if (this.grapFlag[winTeam] == null)
        this.grapFlag[winTeam] = [];

    /* If begin team and end team of a flag capture are not null, update the informations 
        about the Capture. */
    if (this.grapFlag[winTeam][looseTeam] != null)
        return;

    /* If any strike in progress, disable its rendering. */

    if (this.strikes[winTeam] && this.strikes[winTeam][looseTeam] != null){

        this.strikes[winTeam][looseTeam].active = false;
    }
    if (this.strikes[looseTeam] && this.strikes[looseTeam][winTeam] != null){

        this.strikes[looseTeam][winTeam].active = false;
    }

    /* Else if begin team and end team are egal to missile attack, add the Capture to the scene. */
    this.grapFlag[winTeam][looseTeam] = graplet;

}

/**
 *  Update the value of the active services.
 *  @param int[j], for the number of the team,
 *  @param int[n], is the percent of the variation 0<n<1.
 */
Warzone.prototype.updateServices = function(j,n){
    if(n<=1 && n>=0 && j >= 0 && j < 10)
        this.markers[j].setValue(n);
}

/**
 *  Test function which generate some trafic.
 */
Warzone.prototype.thisIsWar = function() {

    /* Test missiles. */
    var random_team = function(){ return Math.floor((Math.random()*10)); };
    var random_speed = function(){ return Math.floor((Math.random()*100) + 20); };

    for (var strikes = 0; strikes <50; strikes++) {
        var origin = random_team();
        var dest = random_team();
        while (origin == dest)
            dest = random_team();
        this.addStrike(origin, dest, Math.random()+0.1);
    }


}


/**
 *  Un peu de documentation :
 *  war : zone permettant d'intéragir avec la warzone.
 *
 *  addStrike, updateStrike, removeStrike : méthodes permettant d'ajouter des
 *  missiles représentant le traffic et le update modifie la vitesse du déplacement.
 *  prend en paramètres une team et départ, une team d'arriver et une vitesse. 0<team<9 et 0<vitesse<=1.
 *
 *  AddCapture: Permet d'ajouter un grappin représentant la capture d'un drapeau entre 2 équipes.
 *  prend en paramètre une team de départ et une team d'arrivé (nombre en 0 et 9).
 *
 * ui.war.thisIsWar() : simule du traffic de façon assez... bourrin.
 *
 */
