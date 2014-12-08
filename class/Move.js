/**
 *  Function to add on the memory the current position and the futur positions of teams ducring
 *  the rank variation.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */

 /** 
  *  Constructor
  *  @param int[team's numéro], int[actual position], int[new position]
  */
var Move = function(team, curPos, newPos) {
	
    /* Team will be change. */
	this.team = team;
	/* The current position of the team. */
	this.curpos = curPos;
	/* The futur position of the team. */
	this.newpos = newPos;
	/* The offset for the variation. */
	this.offset = (newPos - curPos)/20;

}

/**
 *  Setter for the current position that will change.
 *  @param int[actual position]
 */
Move.prototype.setPosition = function(curPos) {

    this.curPos = curPos;

}

/**
 *  Getter to add the current position on memory.
 */
Move.prototype.getPosition = function() {
	
    return this.curPos;

}

/**
 * The nextFrame for the animation with the GlobalRender.
 */
Move.prototype.nextFrame = function() {

    /* If variation of the team > 0. */
	if (Math.abs(this.curpos - this.newpos) > 0) {
		this.curpos += this.offset;
		/* If variation. */
		if (this.offset > 0) {
			/* If the current position >= the new position. */
			if (this.curpos >= this.newpos)
				this.curpos = this.newpos;
		} else {
			/* If the current position <= the new position. */
			if (this.curpos <= this.newpos)
				this.curpos = this.newpos;
		}
		
		this.team.offset = this.curpos;
	}
}
