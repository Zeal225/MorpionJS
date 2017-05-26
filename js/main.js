var morpionObj = {
	// nombre de case en vertical
	verticale : 3,
	// nombre de case en horizontal
	horizontale : 3,
	// la taille de prendra chaque case
	nombreWidth : 0,
	// la grande div qui contient les cases
	interfaceJeux : null,
	// les case de jeux
	elementCss : null,
	// tableau à l'image des case de jeux
	tableIndiceNegatif : [],
	// div modal body
	modalVictoire : null,
	// div new partie
	buttonNewPartie : null,
	// tableau contenant la somme de toute les combinaisons
	tableVerifIa : [],
	// tableau contenant la somme des combinaisons de l'ia
	tableFaireGagnerIa : [],
	// tableau qui garde les indices où le user click;
	tableUserClickIndice : [],
	// tableau indice de l'IA
	tableIndiceIa : [],
	// winner paragraph
	winnerParagraph : null,
	// contient l'indice des combinaison plus petit de l'ia
	tableIndiceCombinaisonIa : [],
	// tableau l'indice des combinaison plus petit des case de l'ia
	tableCombinaisonPetitIa : [],
	// contient le plus element du tableau en haut
	renvoiPetitElement : null,
	// compteur nombre de case deja jouer
	comptCaseJouer : 0,
	// variable de teste
	quiJoue : false,
	// compteur de victoire pour user
	compteurUser : null,
	compteurUserElement : null,
	// compteur de victoire pour l'ia
	compteurIa : null,
	compteurIaElement : null,
	// compteur de match null
	compteurMatchNul : null,
	compteurMatchNulElement : null,

	init : function(){
		this.interfaceJeux = document.getElementById('bloc-morpion');
		this.elementCss = document.getElementsByClassName('caseBloc');
		this.modalVictoire = document.getElementById('modal-body');
		this.winnerParagraph = document.getElementById('winner-p');
		this.compteurUserElement = document.getElementById('case-user');
		this.compteurIaElement = document.getElementById('case-ia');
		this.compteurMatchNulElement = document.getElementById('case-match-null');
		morpionObj.interfaceObj.createAndAppendElement();
		morpionObj.interfaceObj.giveWidthHeightElement();
		morpionObj.uiObj.createHumanIcon();
		morpionObj.uiObj.initialiseGame();
		morpionObj.uiObj.writeTableIndiceNegatif();
	},

	interfaceObj : {
		createAndAppendElement : function()
		{
			// bouble de création des cases: le nombre de case depend des 2 variables verticale&horizontale
			for(var i = 0; i<morpionObj.verticale*morpionObj.horizontale; i++){
				var divElement = document.createElement('div');
				divElement.id = i;
				divElement.className = "caseBloc";
				morpionObj.interfaceJeux.appendChild(divElement);
			}
		},
		giveWidthHeightElement : function()
		{
			// calcul de la taille qu'on doit donner à chaque case
			morpionObj.nombreWidth = 100/morpionObj.verticale;
			// attribution de cette taille à chaque case en enlevant la part du bordeur
			for(var i = 0, c = morpionObj.elementCss.length; i < c; i++){
				morpionObj.elementCss[i].style.height = (morpionObj.nombreWidth-0.425)+"%";
				morpionObj.elementCss[i].style.width = (morpionObj.nombreWidth-0.425)+"%";
			}
		}
	},

	uiObj : {
		initialiseGame : function()
		{
			this.buttonNewPartie = document.getElementById('new-button');
			var _self = this;
			this.buttonNewPartie.addEventListener('click', function()
			{
				// on met quiJoue a son oppose pour determiner qui de l'ia ou le user joue.
				morpionObj.quiJoue = !morpionObj.quiJoue;
				console.log(morpionObj.quiJoue);
				// initialise les deux tableaux indices ia et users
				morpionObj.tableIndiceIa = [];
				morpionObj.tableIndiceNegatif = [];
				// initialiser le compteur des case coche qui detecte si je jeux est fini ou pas
				morpionObj.comptCaseJouer = 0;
				// remplissage des tableaux vide
				_self.writeTableIndiceNegatif();
				morpionObj.modalVictoire.style.display = "none";
				morpionObj.modalVictoire.style.backgroundColor = null;
				while(document.getElementById('human-icon')){
					document.getElementById('human-icon').parentNode.removeChild(document.getElementById('human-icon'));
				};
				while(document.getElementById('testeElement')){
					document.getElementById('testeElement').parentNode.removeChild(document.getElementById('testeElement'))
				}
				// si quiJoue = false user joue sinon l'ia joue
				if (morpionObj.quiJoue) {
					var nombreAleatoire = Math.floor(Math.random()*9);
					var testeElement = document.createElement('div');
					testeElement.id = "testeElement";
					testeElement.className = "testeElement";
					morpionObj.elementCss[nombreAleatoire].appendChild(testeElement);
					// il faut mettre le 1 de la case coche par l'ia a 
					morpionObj.tableIndiceIa[nombreAleatoire]=0;
					// incrementer le compteur du nombre de case coche
					morpionObj.comptCaseJouer += 1;
					// optionnel
					morpionObj.iaObj.calculSomIa.init();
				};
			})
		},
		victoireUsers : function()
		{
			morpionObj.tableIndiceNegatif = [];
			this.writeTableIndiceNegatif();
			morpionObj.winnerParagraph.innerText = "Vous avez gagnez!";
			morpionObj.modalVictoire.style.display = "block";
			morpionObj.compteurUser +=1;
			morpionObj.compteurUserElement.innerText = morpionObj.compteurUser;
			console.log(morpionObj.compteurUser);
		},
		matchNull : function()
		{
			morpionObj.tableIndiceNegatif = [];
			this.writeTableIndiceNegatif();
			morpionObj.winnerParagraph.innerText = "Hoopp match null!";
			morpionObj.modalVictoire.style.display = "block";
			morpionObj.modalVictoire.style.backgroundColor = "rgba(255,0,0,0.5)";
			morpionObj.compteurMatchNul +=1;
			morpionObj.compteurMatchNulElement.innerText = morpionObj.compteurMatchNul;
		},
		writeTableIndiceNegatif : function()
		{
			for(var i=0, len=morpionObj.verticale*morpionObj.horizontale; i<len; i++){
				morpionObj.tableIndiceNegatif.push(1);
				morpionObj.tableIndiceIa.push(1);
			}
		},
		verticaleVerifacation : function(debut,fin,indiceCombinaisson)
		{
			// console.log(morpionObj.tableIndiceIa);
			var som = 0, somIa = 0;
			// somme des combinaisons gagnante
			for(var i = debut; i<fin; i++){
				som = som+morpionObj.tableIndiceNegatif[i];
				somIa = somIa+morpionObj.tableIndiceIa[i];
			}
			if (somIa==0) {
				morpionObj.iaObj.victoireIa();
			}
			if (somIa==1) {
				morpionObj.tableIndiceCombinaisonIa[indiceCombinaisson]=indiceCombinaisson;
			};
			morpionObj.tableVerifIa[indiceCombinaisson]=som;
			
			// si som =0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
			if (som==0) {
				this.victoireUsers();
			}
		},
		horizontaleVerification : function(debut,fin,indiceCombinaisson)
		{
			var som = 0, somIa = 0;
			for(var i = debut; i<fin; i++){
				som = som+morpionObj.tableIndiceNegatif[i];
				somIa = somIa+morpionObj.tableIndiceIa[i];
				i = i+2;
			}
			if (somIa==0) {
				morpionObj.iaObj.victoireIa();
			}
			if (somIa==1) {
				morpionObj.tableIndiceCombinaisonIa[indiceCombinaisson]=indiceCombinaisson;
			};
			morpionObj.tableVerifIa[indiceCombinaisson]=som;
			
			// si som=0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
			if (som==0) {
				this.victoireUsers();
			}
		},
		diagonale1Verification : function(debut,fin,indiceCombinaisson)
		{
			var som = 0, somIa = 0;
			for(var i = debut; i<fin; i++){
				som = som+morpionObj.tableIndiceNegatif[i];
				somIa = somIa+morpionObj.tableIndiceIa[i];
				i = i+3;
			}
			if (somIa==0) {
				morpionObj.iaObj.victoireIa();
			}
			if (somIa==1) {
				morpionObj.tableIndiceCombinaisonIa[indiceCombinaisson]=indiceCombinaisson;
			};
			morpionObj.tableVerifIa[indiceCombinaisson]=som;
			
			// si som =0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
			if (som==0) {
				this.victoireUsers();
			}
		},
		diagonale2Verification : function(debut,fin,indiceCombinaisson)
		{
			var som = 0, somIa = 0;
			for(var i = debut; i<fin; i++){
				som = som+morpionObj.tableIndiceNegatif[i];
				somIa = somIa+morpionObj.tableIndiceIa[i];
				i = i+1;
			}
			if (somIa==0) {
				morpionObj.iaObj.victoireIa();
			}
			if (somIa==1) {
				morpionObj.tableIndiceCombinaisonIa[indiceCombinaisson]=indiceCombinaisson;
			};
			morpionObj.tableVerifIa[indiceCombinaisson]=som;

			// si som =0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
			if (som==0) {
				this.victoireUsers();
			}
		},
		lanceVerification : function()
		{
			// vertical
			this.verticaleVerifacation(0,3,0);
			this.verticaleVerifacation(3,6,1);
			this.verticaleVerifacation(6,9,2);
			// horizontal
			this.horizontaleVerification(0,7,3);
			this.horizontaleVerification(1,8,4);
			this.horizontaleVerification(2,9,5);
			// diagonal1
			this.diagonale1Verification(0,9,6);
			// diagonal2
			this.diagonale2Verification(2,7,7);
		},
		createHumanIcon : function()
		{
			var _self = this;
			// identification de la case coché par le joueur humain
			for(var j = 0; j < morpionObj.elementCss.length; j++)
			{
				morpionObj.elementCss[j].addEventListener('click', function(e)
				{
					// on selectionne tous les enfant de la case coché
					this.tableIfCaseIsSelect = e.currentTarget.childNodes;
					// on verifie s'il à deja un enfant alors il ne peut plus jouer dans la meme case
					if (this.tableIfCaseIsSelect.length < 1) {
						// au click dans une case on met la position de la case dans le tableau à 0
						morpionObj.tableIndiceNegatif[this.id] = 0;
						// lance la fonction qui verifie les combinaison pour cherche victoire
						
						_self.lanceVerification();

						this.humanIcon = document.createElement('div');
						this.humanIcon.id = "human-icon";
						this.humanIcon.className = "human-icon";
						e.currentTarget.appendChild(this.humanIcon);
						morpionObj.comptCaseJouer += 1;

						// ici appel a la fonction iaFunction qui contient tous le 
						// code concernant les actions de l'ia
						// on lance cette fonction dans cette condition pour empecher
						// que l'ia joue quand le user click sur une case deja coche
						morpionObj.iaObj.iaFunction();
					}
					morpionObj.iaObj.siTouteCaseCocher();
				})
			}
		}
	},
	
	iaObj : {
		victoireIa : function()
		{
			morpionObj.tableIndiceIa = [];
			morpionObj.uiObj.writeTableIndiceNegatif();
			morpionObj.winnerParagraph.innerText = "L'IA vous à gagné!";
			morpionObj.modalVictoire.style.display = "block";
			morpionObj.compteurIa +=1;
			morpionObj.compteurIaElement.innerText = morpionObj.compteurIa;
		},
		siTouteCaseCocher : function()
		{
			// quand toute les sont cocher, on verifie pour voir si y a 0 dans la table donc l'ia gagne
			// on fait pas de match null
			var siIaGagne = false;
			for (var i = 0, c=morpionObj.tableFaireGagnerIa.length; i < c; i++) {
				if (morpionObj.tableFaireGagnerIa[i]==0) {
					siIaGagne=true;
					i=c;
				}
				else{
					siIaGagne = false;
				}
			};
			// si compteur des case a cocher est 9 donc jeux terminer et match null
			console.log(morpionObj.comptCaseJouer);
			if (morpionObj.comptCaseJouer==9 && !siIaGagne) {
				morpionObj.uiObj.matchNull();
			};
		},
		calculSomIa : {
			init : function()
			{
				this.verticaleVerification(0, 3, 0);
				this.verticaleVerification(3, 6, 1);
				this.verticaleVerification(6, 9, 2);

				this.horizontaleVerification(0, 7, 3);
				this.horizontaleVerification(1, 8, 4);
				this.horizontaleVerification(2, 9, 5);

				this.diagonale1Verification(0, 9, 6);

				this.diagonale2Verification(2, 7, 7);

				morpionObj.tableCombinaisonPetitIa = [];
				morpionObj.renvoiPetitElement = Math.min(...morpionObj.tableFaireGagnerIa);
				for (var i = 0; i < morpionObj.tableFaireGagnerIa.length; i++) {
					if (morpionObj.tableFaireGagnerIa[i]==morpionObj.renvoiPetitElement) {
						morpionObj.tableCombinaisonPetitIa.push(i);
					};
				};
				// console.log(morpionObj.tableFaireGagnerIa);
			},
			verticaleVerification : function(debut,fin,indiceCombinaison)
			{
				var somIa = 0;
				// somme des combinaisons gagnante
				for(var i = debut; i<fin; i++){
					somIa = somIa+morpionObj.tableIndiceIa[i];
				}
				if (somIa==0) {
					morpionObj.iaObj.victoireIa();
				};
				morpionObj.tableFaireGagnerIa[indiceCombinaison]=somIa;
			},
			horizontaleVerification : function(debut,fin,indiceCombinaison)
			{
				var somIa = 0;
				for(var i = debut; i<fin; i++){
					somIa = somIa+morpionObj.tableIndiceIa[i];
					i = i+2;
				}
				if (somIa==0) {
					morpionObj.iaObj.victoireIa();
				};
				morpionObj.tableFaireGagnerIa[indiceCombinaison]=somIa;
			},
			diagonale1Verification : function(debut,fin,indiceCombinaison)
			{
				var somIa = 0;
				for(var i = debut; i<fin; i++){
					somIa = somIa+morpionObj.tableIndiceIa[i];
					i = i+3;
				}
				if (somIa==0) {
					morpionObj.iaObj.victoireIa();
				};
				morpionObj.tableFaireGagnerIa[indiceCombinaison]=somIa;
			},
			diagonale2Verification : function(debut,fin,indiceCombinaison)
			{
				var somIa = 0;
				for(var i = debut; i<fin; i++){
					somIa = somIa+morpionObj.tableIndiceIa[i];
					i = i+1;
				}
				if (somIa==0) {
					morpionObj.iaObj.victoireIa();
				};
				morpionObj.tableFaireGagnerIa[indiceCombinaison]=somIa;
			}
		},
		iaFunction : function()
		{
			// ici tout ce qui concerne l'ia dans cet jeux
			// currentTarget est celui sur lequel on a appliqué l'evenement
			this.comptUsersClick = document.getElementsByClassName('human-icon');

			// ici je recupère la somme la plus petite des combinaisons
			// et je fais une boucle sur le tableau qui contient toute les sommes de combinaison pour trouver 
			// les combinaison qui on les plus petite somme(l'indice i donne le numeros de la combinaison)
			var combinaisonPlusPetiteSomme = [];
			var plusPetiteSomme = Math.min(...morpionObj.tableVerifIa);
			for(var i=0, c=morpionObj.tableVerifIa.length; i<c; i++){
				if (morpionObj.tableVerifIa[i]==plusPetiteSomme) {
					// tableau contenant la combinaison ou user a plus de chance
					combinaisonPlusPetiteSomme.push(i);
				};
			}
			// recuperation des indices où le users click
			morpionObj.tableUserClickIndice.push(parseInt(this.id));
			// end

			// generation nombre aleatoire
			var nombreAleatoire = Math.floor(Math.random()*9);
			// end
			
			// function qui minimise la chance du joueur
			determineNombreAleatoire = function(tableData){
				// cette fonction parcour le tableau plusPetitcombinaison et trouve les cases
				// vide pour jouer( cet tableau renvoi les combinaison qui maximise la 
				// chance de l'user) en fonction de la combinaison on donne valeur a nombre aleatoire
				// console.log(tableData);
				for(var i=0, c=tableData.length; i<c;i++){
					switch(tableData[i]){
						case 0:
							for(var j=0; j<3; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=4
								};
							}
							// i=c;
						break;
						case 1:
							for(var j=3; j<6; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=6
								};
							}
							// i=c;
						break;
						case 2:
							for(var j=6; j<9; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=9
								};
							}
							// i=c;
						break;
						case 3:
							for(var j=0; j<7; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=7
								};
								j=j+2;
							}
							// i=c;
						break;
						case 4:
							for(var j=1; j<8; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=8
								};
								j=j+2;
							}
							// i=c;
						break;
						case 5:
							for(var j=2; j<9; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=9
								};
								j=j+2;
							}
							// i=c;
						break;
						case 6:
							for(var j=0; j<9; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=9
								};
								j=j+3;
							}
							// i=c;
						break;
						case 7:
							for(var j=2; j<7; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=7
								};
								j=j+1;
							}
							// i=c;
						break;
						default:
							alert("attention une combinaison inconnue!!!");
						break;
					}
				}
			}
			// cette fonction est chargee de bloquer le user de gagner
			determineNombreAleatoire(combinaisonPlusPetiteSomme)
			// console.log(combinaisonPlusPetiteSomme);

			var testeElement = document.createElement('div');
			testeElement.id = "testeElement";
			testeElement.className = "testeElement";

			// verifie si nombre aleatoire est egale a une case deja joué par le users
			while(morpionObj.elementCss[nombreAleatoire].hasChildNodes()){
				nombreAleatoire = Math.floor(Math.random()*9);
				if (this.comptUsersClick.length>4) break;
			}

			// cette ligne empêche l'ia de cocher une case quand il n'y a plus de case vide
			if (this.comptUsersClick.length>4) plusPetiteSomme=0;

			if(plusPetiteSomme==2) {
				if (morpionObj.renvoiPetitElement==1) {
					// console.log('play!')
					determineNombreAleatoire(morpionObj.tableCombinaisonPetitIa)
				};
				morpionObj.tableIndiceIa[nombreAleatoire]=0;
				morpionObj.iaObj.calculSomIa.init();
				morpionObj.comptCaseJouer += 1;
				setTimeout(function(){
					morpionObj.elementCss[nombreAleatoire].appendChild(testeElement);
				},100)
				// lance la fonction qui verifie les combinaison pour cherche victoire
				setTimeout(function(){morpionObj.uiObj.lanceVerification()},1000)
				// il ya 2 cases vide sur ces combinaisons
			}else if(plusPetiteSomme==1){
				if (morpionObj.renvoiPetitElement==1) {
					// console.log('play!')
					determineNombreAleatoire(morpionObj.tableCombinaisonPetitIa)
				};
				morpionObj.tableIndiceIa[nombreAleatoire]=0;
				morpionObj.iaObj.calculSomIa.init();
				morpionObj.comptCaseJouer += 1;
				setTimeout(function(){
					morpionObj.elementCss[nombreAleatoire].appendChild(testeElement);
				},100)
				// lance la fonction qui verifie les combinaison pour cherche victoire
				setTimeout(function(){morpionObj.uiObj.lanceVerification()},1000)
				// il y a 1 case vide sur ces combinaisons
			}else{
				// il y a 0 case vide et victioire ou match null
			}
		}
	}
}


window.addEventListener('load', function()
{
	morpionObj.init();
})

