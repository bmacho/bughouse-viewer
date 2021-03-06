// global variable: hide_elo

function bpgn(gameA, gameB, movesA, movesB) {
	mv = JSON.parse( getMoveOrder(gameA, gameB) )

	function set_piece_size (a,s) {
		return ( a%2 ) ? s.toLowerCase() : s.toUpperCase() }
	
	var out = bpgn_header()

	stampsA = gameA.game.moveTimestamps.split(',')
	stampsB = gameB.game.moveTimestamps.split(',')
	
	i = 0
	a = 0
	b = 0 				 // current move 
	
	while (i < stampsA.length + stampsB.length) {

		if (mv[i].p == "A" && a < movesA.length) {
			turnNum = Math.floor(a/2)+1
			stamp = Math.max(0.1, stampsA[a]/10 )  //
			
			out += " " + turnNum + set_piece_size(a,"A") + ". " + movesA[a] + " {" + stamp + "}" 

			mv[i].id = turnNum + set_piece_size(a,"A")
			mv[i].fen = movesA[a] 

			a++
		}
				
		if (mv[i].p == "B" && b < movesB.length) {
			turnNum = Math.floor(b/2)+1
			stamp = Math.max(0.1, stampsB[b]/10)
			
			out += " " + turnNum + set_piece_size(b,"B") + ". " + movesB[b] + " {" + stamp + "}" 

			mv[i].id = turnNum + set_piece_size(b,"B")
			mv[i].fen = movesB[b] 
			
			b++
		}
		
		i++
	}

	console.log(mv)

// if hide_elo is declared and true than we don't show elo 
let show_elo = !( typeof hide_elo !== 'undefined' && hide_elo == true )

let resMes = ( show_elo ) ? gameA.game.resultMessage : "game over"

	out += "{" + resMes + "}  *"
	return out
}


function getMoveOrder (gameA, gameB) {
	// calculates the moving time and then the move order
	// returns a list of objects that has the ID and the moving time
	
	var initialTime = gameA.game.baseTime1
	var timeIncrement = gameA.game.timeIncrement1*10

	// these will contain the amount of time that has passed
	var	tA = [],
		tB = []

	function getMoveTimes (moveTimestamps) {
		//	timestamps from chess.com in a list, it has the 
		// remaining times of the players in alternating order
		// only matters when there is a time increment 

		var stamps = moveTimestamps.split(",") 
		stamps[-1] = initialTime 	// adding a -1th element does not
											// change the arrays length
		
		var moveTime = []				// this will contain the times when
											// the move actual happens 

		// the i-th moveTime
		for (var i = 0; i < stamps.length; i++) {
			var remainingTime = stamps[i] - (- stamps[i-1])
			var sumGivenTime = 2*initialTime + (i+1)*timeIncrement
			
			moveTime[i] = sumGivenTime - remainingTime
		}

		return moveTime
	}

	tA = getMoveTimes( gameA.game.moveTimestamps )
	tB = getMoveTimes( gameB.game.moveTimestamps )

	var globalMoves = []
	
	var a = 0
	var b = 0 // indexes when we go throught tA and tB
		
	for (var i = 0; i < tA.length + tB.length ; i++ ){

		var mv = {}
		
		var tAempty = ( tA.length == a )
		var tBempty = ( tB.length == b ) 
		
		var bothNonEmpty = !tAempty && !tBempty
		
		if ( (bothNonEmpty && tB[b] < tA[a]) || tAempty ) {
			mv.p = "B"
			mv.t  = tB[b]
			globalMoves[i] = mv
			b++
		} else {
			mv.p = "A"
			mv.t  = tA[a]
			globalMoves[i] = mv
			a++
		}
	}
	
	return JSON.stringify(globalMoves)
}


function bpgn_header ( ) {
	
// if hide_elo is declared and true than we don't show elo 
let show_elo = !( typeof hide_elo !== 'undefined' && hide_elo == true )
	
let Aname = show_elo ? gameA.game.pgnHeaders.White : "SouthWest"
let aname = show_elo ? gameA.game.pgnHeaders.Black : "NordWest"
let Bname = show_elo ? gameB.game.pgnHeaders.White : "NordEast"
let bname = show_elo ? gameB.game.pgnHeaders.Black : "SouthEast"


function getRandomInt(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


let Aelo = show_elo ? gameA.game.pgnHeaders.WhiteElo : getRandomInt(100,3000) + "?"
let aelo = show_elo ? gameA.game.pgnHeaders.BlackElo : getRandomInt(100,3000) + "?"
let Belo = show_elo ? gameB.game.pgnHeaders.WhiteElo : getRandomInt(100,3000) + "?"
let belo = show_elo ? gameB.game.pgnHeaders.BlackElo : getRandomInt(100,3000) + "?"


	var bpgn_string="";
	bpgn_string += '[Event "'+gameA.game.pgnHeaders.Event+'"]\n'
	bpgn_string += '[Site "'+gameA.game.pgnHeaders.Site+'"]\n'
	bpgn_string += '[Date "'+gameA.game.pgnHeaders.Date+'"]\n'									// possibly the end date in PDT?
	bpgn_string += '[Time "'+gameA.game.pgnHeaders.EndTime+'"]\n' 							// this is the time of the end of a match
																												// TODO: substract game length from it
	bpgn_string += '[WhiteA "'+Aname+'"][WhiteAElo "'+Aelo+'"]\n'
	bpgn_string += '[BlackA "'+aname+'"][BlackAElo "'+aelo+'"]\n'
	bpgn_string += '[WhiteB "'+Bname+'"][WhiteBElo "'+Belo+'"]\n'
	bpgn_string += '[BlackB "'+bname+'"][BlackBElo "'+belo+'"]\n'
	bpgn_string += '[TimeControl "'+gameA.game.pgnHeaders.TimeControl+'"]\n'
	bpgn_string += '[Result "'+gameA.game.pgnHeaders.Result+'"]\n\n'
	
	bpgn_string += '{C:' + gameA.game.pgnHeaders.Date + ' ' +  gameA.game.pgnHeaders.EndTime + ' bughouse game between ' +
		Aname + ' (' +  Aelo +') and ' +
		bname + ' (' +  belo +') vs. ' +
		aname + ' (' +  aelo +') and ' +
		Bname + ' (' +  Belo +').' +
		'\nboard A: chess.com/live/game/' + gameA.game.id + 
		'\nboard B: chess.com/live/game/' + gameB.game.id + 
	'}'

	return bpgn_string
}

