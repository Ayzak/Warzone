/**
 *  Draw an grapnel animation which go grap the flags to the team who loose his flag.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

/** 
 *  Construct.
 *  @param int[x1], int[y1], for begining coordonate,
 *  @param int[x2], int[y2], for the end coordonate.
 *  @param function[callback], for the return.
 */
var Capture = function (x1, y1, x2, y2, speed, callback){

 	/**************************************************************************
     * Initial position and rotation.
     *************************************************************************/

     /* Save callback if any */
     if (callback != null)
     	this.removeCallback = callback;

    /* Save origin and target coordinates. */
	this.x = Math.min(x1, x2);
	this.y = Math.min(y1, y2);
    this.x1 = x1 - this.x;
	this.y1 = y1 - this.y;
	this.x2 = x2 - this.x;
	this.y2 = y2 - this.y;

    /**************************************************************************
     * Canvas creation.
     *************************************************************************/

	/* Retrieve our image. */
	this.graplet = (new Loader()).getImage("template/pictures/grappin-only.png");
	this.grapletFlag = (new Loader()).getImage("template/pictures/grappin-flag.png");

	this.route = document.createElement('canvas');
	this.route.id = "way_to_grap";

    /* Compute height and width. */
    this.height = Math.abs(y2-y1);
    this.width = Math.abs(x2-x1);

	/* Pythagore and calcul of segment with point (x,y) on an orthonormal landmark. */
	this.route.width = Math.sqrt( Math.pow(this.width , 2) + Math.pow(this.height, 2))*2;
	this.route.height = this.graplet.height;
	this.route_ctx = this.route.getContext('2d');

	/* Compute basic rotation. */
    if (this.height >= (this.route.width/2))
        this.height = this.route.width/2;
    this.rotation = Math.asin(( this.height ) / (this.route.width/2));

	/*Canvas on memory.*/
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext("2d");
	this.canvas.id = "incli";
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    /* Compute deltas. */
    var dw = Math.abs((this.graplet.height / 2) * Math.cos(this.rotation - Math.PI/2));
    var dh = Math.abs((this.graplet.height / 2) * Math.sin(this.rotation - Math.PI/2));
    this.width += 2*dw;
    this.canvas.width = this.width;
    this.height += 2*dh;
    this.canvas.height = this.height;
    this.x -= dw;
    this.y -= dh;
    this.dw = dw;
    this.dh = dh;

    /***************************************************************************
     * Adjustments.
     **************************************************************************/

    if (this.y2 > this.y1) {
        if (this.x2 < this.x1) {
            this.rotation = -Math.PI - this.rotation;
        } else if (this.x2 == this.x1) {
            this.rotation = Math.PI/2;
        }
    } else if (this.y2 <= this.y1) {
        if (this.x2 < this.x1) {
            this.rotation -= Math.PI;
        } else if (this.x2 > this.x1) {
            this.rotation = -this.rotation;
        } else if (this.x2 == this.x1) {
            this.rotation = -Math.PI/2;
        }
    }

	/* Properties of our animation. */
	this.offset = 0;
	this.speed = speed;

	/* Estate of the graplet's animation. */
	this.state = 0;

}

/**
 *  Function will compute all new position of the warzone when the windows will be resize.
 *  @param int[x1] int[y1], for new position on X and Y axes in begining,
 *  @param int[x2] int[y2], for new position on X and Y axes at the end,
 */
Capture.prototype.setPosition = function(x1, y1, x2, y2) {

    this.x = Math.min(x1, x2);
    this.y = Math.min(y1, y2);
    this.x1 = x1 - this.x;
    this.y1 = y1 - this.y;
    this.x2 = x2 - this.x;
    this.y2 = y2 - this.y;

    /* Compute height and width. */
    this.height = Math.abs(y2-y1);
    this.width = Math.abs(x2-x1);
    this.route.width = Math.sqrt( Math.pow(this.width , 2) + Math.pow(this.height, 2))*2;
    this.route.height = this.graplet.height;

    /* Update deltas. */
    var dw = Math.abs((this.graplet.height / 2) * Math.cos(this.rotation - Math.PI/2));
    var dh = Math.abs((this.graplet.height / 2) * Math.sin(this.rotation - Math.PI/2));
    this.width += 2*dw;
    this.canvas.width = this.width;
    this.height += 2*dh;
    this.canvas.height = this.height;
    this.x -= dw;
    this.y -= dh;
    this.dw = dw;
    this.dh = dh;

}

/**
 *  Calcul of the direction.
 *  @return canvas to draw on main stage.
 */
Capture.prototype.render = function (){

    /*****************************************
     * Place graplet in a temporary canvas
     ****************************************/

	/* Clear the drawing zone. */
	this.route_ctx.clearRect(0,0,this.route.width,this.route.height);

	switch (this.state) { 

		case 0 :

			this.route_ctx.save();

			this.route_ctx.beginPath();
			this.route_ctx.fillStyle='grey';
			this.route_ctx.fillRect(0, (this.route.height/2) - 2, this.offset, 4);

			/* Instructions for the cut picture on the canvas.*/
				this.route_ctx.drawImage(
				this.graplet,
					0,
					0,
					this.graplet.width,
					this.graplet.height,
					this.offset,
					0,
					this.graplet.width,
					this.graplet.height
				);

			/* Restoration of the original context for restart an other drawing. */
			this.route_ctx.restore();

		break;

		case 1 :

			this.route_ctx.save();
			this.route_ctx.fillStyle='grey';
			this.route_ctx.fillRect(0, (this.route.height/2) - 2, this.offset, 4);

			/* Instructions for the cut picture on the canvas. */
				this.route_ctx.drawImage(
				this.grapletFlag,
					0,
					0,
					this.grapletFlag.width,
					this.grapletFlag.height,
					this.offset,
					0,
					this.grapletFlag.width,
					this.grapletFlag.height
				);

			/* Restoration of the original context for restart an other drawing. */
			this.route_ctx.restore();

		break;


		default :
		break;
	}


    /*****************************************
     * Place graplet in the final canvas
     ****************************************/

	/* Save context. */
    this.context.save();

	/* Clear rect, translate and rotate (ready to draw). */
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
	this.context.translate(this.x1+this.dw, this.y1+this.dh);
    this.context.rotate(this.rotation);



	/* Render. */
	this.context.drawImage(
		this.route,
		0,
		0,
		this.route.width,
		this.route.height,
		0,
		-this.route.height/4,
		this.route.width/2,
		this.route.height/2
	);

    /* Restore context. */
	this.context.restore();


    /* Return rendered canvas. */
	return this.canvas;

}

/**
 * Animation.
 */
Capture.prototype.nextFrame = function (){

	switch(this.state) {
		case 0:
			this.offset += this.speed;
			if (this.offset >= this.route.width) {
				this.offset = this.route.width;
				this.state = 1;
			}
			break

		case 1:
			this.offset -= this.speed/3;
			if (this.offset <= -this.graplet.width) {
				if (this.removeCallback != null)
					this.removeCallback();
			}
	}
}

/**
 *  Modification of the value for the direction or speed.
 *  @param int[new_speed] for the new speed.
 */
Capture.prototype.setSpeed = function (new_speed) {

	this.speed = new_speed;

}
