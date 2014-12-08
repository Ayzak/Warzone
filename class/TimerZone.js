/**
 *  Decompte prenant en compte l'heure de début et l'heure de fin : 12h de 20h à 8h .
 */

var TimerZone = function() {
	/*on récupère l'élément d'affichage.*/
	this.TimerZone = document.getElementById("decompte");
	
	/*Fin de l'évènement.*/
	this.date_fin = new Date ("Jun 29 08:00:00 2014");
	
	/*Phrase précédent le compte à rebourt.*/
	this.prefixe = "End : ";

	this.tempRestant();

	this.Timer="";
}

/**
 *  Compute
 */
TimerZone.prototype.tempRestant = function(){

	/*Total restant en secondes: /1000 car le résultat de la soustraction est en millisecondes.*/
	/*Prise en compte de la date actuelle et de la date de fin de l'évènement pour
	pouvoir créer un différentiel et donc un décompte.*/
	this.total_restant = (this.date_fin - new Date() ) / 1000;

	/* On fait nos opérations.*/

	/*Calcul des jours restant.*/
	this.jours = Math.floor(this.total_restant / (60 * 60 * 24));
	/*Calcul des heures restantes.*/
	this.heures = Math.floor((this.total_restant - (this.jours * 60 * 60 * 24)) / (60 * 60));
	/* Calcul des minutes restantes.*/
	this.minutes = Math.floor((this.total_restant - ((this.jours * 60 * 60 * 24 + this.heures * 60 * 60))) / 60);
	/* Calcul des secondes restantes.*/
	this.secondes = Math.floor(this.total_restant - ((this.jours * 60 * 60 * 24 + this.heures * 60 * 60 + this.minutes * 60)));

	return this.render();

}

/**
 *  Rendu.
 */
TimerZone.prototype.render = function(){

	if (this.total_restant > 0){

		/*Amélioration du rendu:
			-on enlève les valeurs et mots à 0
			-on enlève les s inutiles.*/

		var mot_jour = "Days,";
		var mot_heure = "h,";
		var mot_minute = "m,";
		var mot_seconde = "s";

		/* jour(s).*/
		if (this.jours == 0){

			this.jours = '';
			mot_jour = '';

		}else if (this.jours == 1){

			mot_jour = "jour:";
		}

		/*Heure(s).*/
		if (this.heures == 0){

			this.heures = '';
			mot_heure = '';

		}else if (this.heures == 1){

			mot_heure = "heure:";

		}

		/* Minute(s).*/
		if (this.minutes == 0){

			this.minutes = '';
			mot_minute = '';

		}else if (this.minutes == 1){

			mot_minute = "minute:";
		}

		/*Seconde(s).*/
		if (this.secondes == 0){

			this.secondes = '0';
			mot_seconde = 's';

		}else if (this.secondes == 1){
			mot_seconde = "s";
		}

		/*Rendu.*/
		this.Timer = this.prefixe + 
							this.jours + ' ' + mot_jour 
							+ ' ' + this.heures + ' ' + mot_heure 
							+ ' ' + this.minutes + ' ' + mot_minute 
							+ ' ' + ' ' + this.secondes + ' ' + mot_seconde ;

	}else{

		this.Timer = "Fin de l'épreuve !";
	}
	
	return this.Timer;
}

/** 
 *  Actualisation de la page.
 */
TimerZone.prototype.refresh = function (){

	setTimeout((function(me){
						return function(){
							me.tempRestant();
							};
						})(this), 1000);

}

/**
  *  Setter for the end date.
  */
TimerZone.prototype.setValue = function (date){

	this.date_fin = date;

}


