var morpionObj = {
	// nombre de case en vertical
	verticale : 3,
	// nombre de case en horizontal
	horizontale : 3,
	// la taille de prendra chaque case
	nombreWidth : 0,
	// la grande div qui contient les cases
	interfaceJeux : document.getElementById('bloc-morpion'),
	// les case de jeux
	elementCss : document.getElementsByClassName('caseBloc'),
	// tableau à l'image des case de jeux
	tableIndiceNegatif : [],
	// div modal body
	modalVictoire : document.getElementById('modal-body'),
	// div new partie
	buttonNewPartie : document.getElementById('new-button'),
	// tableau contenant la somme de toute les combinaisons
	tableVerifIa : [],
	// tableau qui garde les indices où le user click;
	tableUserClickIndice : [],
	// tableau indice de l'IA
	tableIndiceIa : [],
	// winner paragraph
	winnerParagraph : document.getElementById('winner-p'),
	init : function(){
		morpionObj.createAndAppendElement();
		morpionObj.giveWidthHeightElement();
		morpionObj.createHumanIcon();
		morpionObj.writeTableIndiceNegatif();
		morpionObj.initialiseGame();
	},
	initialiseGame : function(){
		morpionObj.buttonNewPartie.addEventListener('click',function(){
			// initialise les deux tableaux indices ia et users
			morpionObj.tableIndiceIa = [];
			morpionObj.tableIndiceNegatif = [];
			// remplissage des tableaux vide
			morpionObj.writeTableIndiceNegatif();
			morpionObj.modalVictoire.style.display = "none";
			while(document.getElementById('human-icon')){
				document.getElementById('human-icon').parentNode.removeChild(document.getElementById('human-icon'));
			};
			while(document.getElementById('testeElement')){
				document.getElementById('testeElement').parentNode.removeChild(document.getElementById('testeElement'))
			}
		}) 
	},
	createAndAppendElement : function(){
		// bouble de création des cases: le nombre de case depend des 2 variables verticale&horizontale
		for(var i = 0, c = morpionObj.interfaceJeux.length; i<morpionObj.verticale*morpionObj.horizontale; i++){
			var divElement = document.createElement('div');
			divElement.id = i;
			divElement.className = "caseBloc";
			morpionObj.interfaceJeux.appendChild(divElement);
		}
	},
	giveWidthHeightElement : function(){
		// calcul de la taille qu'on doit donner à chaque case
		morpionObj.nombreWidth = 100/morpionObj.verticale;
		// attribution de cette taille à chaque case en enlevant la part du bordeur
		for(var i = 0, c = morpionObj.elementCss.length; i < c; i++){
			morpionObj.elementCss[i].style.height = (morpionObj.nombreWidth-0.425)+"%";
			morpionObj.elementCss[i].style.width = (morpionObj.nombreWidth-0.425)+"%";
		}
	},
	victoireIa : function(){
		morpionObj.tableIndiceIa = [];
		morpionObj.writeTableIndiceNegatif();
		morpionObj.winnerParagraph.innerText = "L'IA vous à gagné!";
		morpionObj.modalVictoire.style.display = "block";
	},
	victoireUsers : function(){
		morpionObj.tableIndiceNegatif = [];
		morpionObj.writeTableIndiceNegatif();
		morpionObj.winnerParagraph.innerText = "Vous avez gagnez!";
		morpionObj.modalVictoire.style.display = "block";
	},
	writeTableIndiceNegatif : function(){
		for(var i=0, len=morpionObj.verticale*morpionObj.horizontale; i<len; i++){
			morpionObj.tableIndiceNegatif.push(1);
			morpionObj.tableIndiceIa.push(1);
		}
	},
	verticaleVerifacation : function(debut,fin,indiceCombinaisson){
		// console.log(morpionObj.tableIndiceIa);
		var som = 0, somIa = 0;
		// somme des combinaisons gagnante
		for(var i = debut; i<fin; i++){
			som = som+morpionObj.tableIndiceNegatif[i];
			somIa = somIa+morpionObj.tableIndiceIa[i];
		}
		if (somIa==0) {
			morpionObj.victoireIa();
		};
		morpionObj.tableVerifIa[indiceCombinaisson]=som;
		
		// si som =0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
		if (som==0) {
			morpionObj.victoireUsers();
		}
	},
	horizontaleVerification : function(debut,fin,indiceCombinaisson){
		var som = 0, somIa = 0;
		for(var i = debut; i<fin; i++){
			som = som+morpionObj.tableIndiceNegatif[i];
			somIa = somIa+morpionObj.tableIndiceIa[i];
			i = i+2;
		}
		if (somIa==0) {
			morpionObj.victoireIa();
		};
		morpionObj.tableVerifIa[indiceCombinaisson]=som;
		
		// si som=0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
		if (som==0) {
			morpionObj.victoireUsers();
		}
	},
	diagonale1Verification : function(debut,fin,indiceCombinaisson){
		var som = 0, somIa = 0;
		for(var i = debut; i<fin; i++){
			som = som+morpionObj.tableIndiceNegatif[i];
			somIa = somIa+morpionObj.tableIndiceIa[i];
			i = i+3;
		}
		if (somIa==0) {
			morpionObj.victoireIa();
		};
		morpionObj.tableVerifIa[indiceCombinaisson]=som;
		
		// si som =0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
		if (som==0) {
			morpionObj.victoireUsers();
		}
	},
	diagonale2Verification : function(debut,fin,indiceCombinaisson){
		var som = 0, somIa = 0;
		for(var i = debut; i<fin; i++){
			som = som+morpionObj.tableIndiceNegatif[i];
			somIa = somIa+morpionObj.tableIndiceIa[i];
			i = i+1;
		}
		if (somIa==0) {
			morpionObj.victoireIa();
		};
		morpionObj.tableVerifIa[indiceCombinaisson]=som;
		if (morpionObj.tableVerifIa.length>2) {
			// tableau des sommes des combinaisons
			// console.log(morpionObj.tableVerifIa);
		};
		// si som =0 initialisation du tableau des indices, remettre les indice à 1, et affichage victoire
		if (som==0) {
			morpionObj.victoireUsers();
		}
	},
	lanceVerification : function(){
		// vertical
		morpionObj.verticaleVerifacation(0,3,0);
		morpionObj.verticaleVerifacation(3,6,1);
		morpionObj.verticaleVerifacation(6,9,2);
		// horizontal
		morpionObj.horizontaleVerification(0,7,3);
		morpionObj.horizontaleVerification(1,8,4);
		morpionObj.horizontaleVerification(2,9,5);
		// diagonal1
		morpionObj.diagonale1Verification(0,9,6);
		// diagonal2
		morpionObj.diagonale2Verification(2,7,7);
	},
	createHumanIcon : function(){
		// identification de la case coché par le joueur humain
		for(var j = 0; j < morpionObj.elementCss.length; j++){
			morpionObj.elementCss[j].addEventListener('click', function(e){
				// currentTarget est celui sur lequel on a appliqué l'evenement
				var comptUsersClick = document.getElementsByClassName('human-icon');
				// on selectionne tous les enfant de la case coché
				var tableIfCaseIsSelect = e.currentTarget.childNodes;
				// on verifie s'il à deja un enfant alors il ne peut plus jouer dans la meme case
				if (tableIfCaseIsSelect.length < 1) {
					// au click dans une case on met la position de la case dans le tableau à 0
					morpionObj.tableIndiceNegatif[this.id] = 0;
					// lance la fonction qui verifie les combinaison pour cherche victoire
					morpionObj.lanceVerification();
					var humanIcon = document.createElement('div');
					humanIcon.id = "human-icon";
					humanIcon.className = "human-icon";
					e.currentTarget.appendChild(humanIcon);
				}
				// ici je recupère la somme la plus petite des combinaisons
				// et je fais une boucle sur le tableau qui contient toute les sommes de combinaison pour trouver 
				// les combinaison qui on les plus petite somme(l'indice length donne le numeros de la combinaison)
				var combinaisonPlusPetiteSomme = [];
				var plusPetiteSomme = Math.min(...morpionObj.tableVerifIa);
				for(var i=0, c=morpionObj.tableVerifIa.length; i<c; i++){
					if (morpionObj.tableVerifIa[i]==plusPetiteSomme) {
						combinaisonPlusPetiteSomme.push(i);
					};
				}
				// recuperation des indices où le users click
				morpionObj.tableUserClickIndice.push(parseInt(this.id));
				// end
				console.log(combinaisonPlusPetiteSomme);
				// generation nombre aleatoire
				var nombreAleatoire = Math.floor(Math.random()*9);
				// end
				for(var i=0, c=combinaisonPlusPetiteSomme.length; i<c;i++){
					switch(combinaisonPlusPetiteSomme[i]){
						case 0:
							for(var j=0; j<3; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=4
								};
							}
						break;
						case 1:
							for(var j=3; j<6; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=6
								};
							}
						break;
						case 2:
							for(var j=6; j<9; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=9
								};
							}
						break;
						case 3:
							for(var j=0; j<7; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=7
								};
								j=j+2;
							}
						break;
						case 4:
							for(var j=1; j<8; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=8
								};
								j=j+2;
							}
						break;
						case 5:
							for(var j=2; j<9; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=9
								};
								j=j+2;
							}
						break;
						case 6:
							for(var j=0; j<9; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=9
								};
								j=j+3;
							}
						break;
						case 7:
							for(var j=2; j<7; j++){
								if (!document.getElementById(''+j+'').hasChildNodes()) {
									nombreAleatoire=j;
									j=7
								};
								j=j+1;
							}
						break;
						default:
							alert("attention une combinaison inconnue!!!");
						break;
					}
				}
				console.log(plusPetiteSomme);
				
				// console.log(morpionObj.tableUserClickIndice);
				var testeElement = document.createElement('div');
				testeElement.id = "testeElement";
				testeElement.className = "testeElement";
				

				// verifie si nombre aleatoire est egale a une case deja joué par le users
				while(morpionObj.elementCss[nombreAleatoire].hasChildNodes()){
					nombreAleatoire = Math.floor(Math.random()*9);
					console.log('computer'+comptUsersClick)
					if (comptUsersClick.length>4) break;
				}
				if(plusPetiteSomme==2) {
					morpionObj.tableIndiceIa[nombreAleatoire]=0;
					setTimeout(function(){
						morpionObj.elementCss[nombreAleatoire].appendChild(testeElement);
					},1000)
					// lance la fonction qui verifie les combinaison pour cherche victoire
					setTimeout(function(){morpionObj.lanceVerification()},1500)
					// il ya 2 cases vide sur ces combinaisons
				}else if(plusPetiteSomme==1){
					morpionObj.tableIndiceIa[nombreAleatoire]=0;
					setTimeout(function(){
						morpionObj.elementCss[nombreAleatoire].appendChild(testeElement);
					},1000)
					// lance la fonction qui verifie les combinaison pour cherche victoire
					setTimeout(function(){morpionObj.lanceVerification()},1500)
					// il y a 1 case vide sur ces combinaisons
				}else{
					// il y a 0 case vide et victioire ou match null
				}
			})
		}
	}
}
morpionObj.init();
