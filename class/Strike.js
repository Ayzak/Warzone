/**
 *	Network strike visualization.
 *	Speed is variable depending on.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

/** 
 *  Construct.
 *  @param int[x1], int[y1], for begining coordonate,
 *  @param int[x2], int[y2], for the end coordonate.
 */
function Strike (x1, y1, x2, y2, speed) {

    /**************************************************************************
     * Initial position and rotation.
     *************************************************************************/

    /* Save origin and target coordinates. */
	this.x = Math.min(x1, x2);
	this.y = Math.min(y1, y2);
    this.x1 = x1 - this.x;
	this.y1 = y1 - this.y;
	this.x2 = x2 - this.x;
	this.y2 = y2 - this.y;

    /* Compute height and width. */
    this.height = Math.abs(y2-y1);
    this.width = Math.abs(x2-x1);

    /* Active */
    this.active = true;

    /**************************************************************************
     * Canvas creation.
     *************************************************************************/

	/* Retrieve our image. */
	this.img = (new Loader()).getImage("template/pictures/striker.png");

	/* Pythagore and calcul of segment with point (x,y) on an orthonormal landmark. */
	this.traffic = document.createElement('canvas');
	this.traffic.id = 'traffic';
	this.traffic.width = Math.sqrt( Math.pow(this.width , 2) + Math.pow(this.height, 2))*2;
	this.traffic.height = this.img.height;
	this.traffic_ctx = this.traffic.getContext('2d');

    /* Compute basic rotation. */
    if (this.height >= (this.traffic.width/2))
        this.height = this.traffic.width/2;
    this.rotation = Math.asin(( this.height ) / (this.traffic.width/2));

	/*Canvas on memory.*/
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext("2d");
	this.canvas.id = "incli";
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    /* Compute deltas. */
    var dw = Math.abs((this.img.height / 2) * Math.cos(this.rotation - Math.PI/2));
    var dh = Math.abs((this.img.height / 2) * Math.sin(this.rotation - Math.PI/2));
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
	this.setSpeed(speed);

}

/**
 *  Function will compute all new position of the warzone when the windows will be resize.
 *  @param int[x1] int[y1], for new position on X and Y axes in begining,
 *  @param int[x2] int[y2], for new position on X and Y axes at the end,
 */
Strike.prototype.setPosition = function(x1, y1, x2, y2) {
    this.x = Math.min(x1, x2);
    this.y = Math.min(y1, y2);
    this.x1 = x1 - this.x;
    this.y1 = y1 - this.y;
    this.x2 = x2 - this.x;
    this.y2 = y2 - this.y;

    /* Compute height and width. */
    this.height = Math.abs(y2-y1);
    this.width = Math.abs(x2-x1);

    this.traffic.width = Math.sqrt( Math.pow(this.width , 2) + Math.pow(this.height, 2))*2;
    this.traffic.height = this.img.height;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    /* Update deltas. */
    var dw = Math.abs((this.img.height / 2) * Math.cos(this.rotation - Math.PI/2));
    var dh = Math.abs((this.img.height / 2) * Math.sin(this.rotation - Math.PI/2));
    this.width += 2*dw;
    this.canvas.width = this.width;
    this.height += 2*dh;
    this.canvas.height = this.height;
    this.x -= dw;
    this.y -= dh;
    this.dw = dw;
    this.dh = dh;

    this.setSpeed(this.speed);

}

/**
 *  Calcul of the direction.
 *  @return canvas to draw on main stage.
 */
Strike.prototype.render = function (){

    /*****************************************
     * Place rocket in a temporary canvas
     ****************************************/

	/* Clear the drawing zone. */
	this.traffic_ctx.clearRect(0,0,this.traffic.width,this.traffic.height);

	this.traffic_ctx.save();

	/* Instructions for the cut picture on the canvas.*/
	for (var i=0; i<this.nblocks; i++)
	{
		this.traffic_ctx.drawImage(
			this.img,
			0,
			0,
			this.img.width,
			this.img.height,
			this.offset + i*this.gap,
			0,
			this.img.width,
			this.img.height
		);
	}

	/* Restoration of the original context for restart an other drawing. */
	this.traffic_ctx.restore();

    /*****************************************
     * Place rocket in the final canvas
     ****************************************/

	/* Save context. */
    this.context.save();

	/* Clear rect, translate and rotate (ready to draw). */
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
	this.context.translate(this.x1+this.dw, this.y1+this.dh);
    this.context.rotate(this.rotation);

	/* Render. */
	this.context.drawImage(
		this.traffic,
		0,
		0,
		this.traffic.width,
		this.traffic.height,
		0,
		-this.traffic.height/4,
		this.traffic.width/2,
		this.traffic.height/2
	);

    /* Restore context. */
	this.context.restore();


    /* Return rendered canvas. */
	return this.canvas;

}

/* Animation.*/
Strike.prototype.nextFrame = function (){

	/* Let's move the strikers.*/
	this.offset += this.doffset;
	if (this.offset >= (-this.img.width + this.gap)) {
		this.offset = -this.img.width;
	}
}

/**
 *  Setter which modify the value for the speed.
 *  @param int[new_speed] for the new speed.
 */
Strike.prototype.setSpeed = function (new_speed) {
	this.speed = new_speed;

    this.nblock_min = 1;
    /* The traffic.width is *2 for anti-aliasing. */
    this.nblock_max = (this.traffic.width/(this.img.width * 2)); 
    /* Number of blocks we can put on the scene. */
    this.nblocks = this.speed * this.nblock_max;
    /* Particular cases. */
    if (this.nblocks < this.nblock_min)
        this.nblocks = this.nblock_min;

    /* Gap is the espacement between blocks (fire). */
    this.gap = (this.traffic.width - (this.nblocks*this.img.width))/this.nblocks + this.img.width;

    /* Speed for the avencement of the fire. */
    this.doffset = this.speed*this.speed*(this.gap/8);

}


