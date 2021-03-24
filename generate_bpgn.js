function bpgn(gameA, gameB, movesA, movesB) {
	mv = JSON.parse( getMoveOrder(gameA, gameB) )

	a = 0
	b = 0 				// current move 
	var whosTurn = 0  // 
	
	function set_piece_size (a,s) {
		return ( a%2 ) ? s.toLowerCase() : s.toUpperCase() }
	
	var out = bpgn_header()
	for (var i = 0; i < mv.length ; i++) {

		if (mv[i].p == "A") {

			// there is an out-indexing somewhere, maybe?
			if (!movesA[a]) break 

			// bug.js doesn't like if the time fall below 1
			// so we don't let it
			turnNum = Math.floor(a/2)+1
			out += " " + turnNum + set_piece_size(a,"A") + ". " + movesA[a] + " {" + Math.max(1, (gameA.game.moveTimestamps.split(',')[a]/10).toFixed(3) ) + "}" 
			a++
		} else {
			
			// there is an out-indexing somewhere, maybe?
			if (!movesB[b]) break 
			
			turnNum = Math.floor(b/2)+1
			out += " " + turnNum + set_piece_size(b,"B") + ". " + movesB[b] + " {" + Math.max(1, (gameB.game.moveTimestamps.split(',')[b]/10).toFixed(3) ) + "}" 
			b++
		}
	}
	
	// if there are remaining moves that we hasn't used yet somehow
	while (movesA[a]) {
		out += " " + turnNum + set_piece_size(a,"A") + ". " + movesA[a] + " {" + Math.max(1, (gameA.game.moveTimestamps.split(',')[a]/10).toFixed(3) ) + "}" 
		a++
	}

	while (movesB[b]) {
		out += " " + turnNum + set_piece_size(b,"B") + ". " + movesB[b] + " {" + Math.max(1, (gameA.game.moveTimestamps.split(',')[b]/10).toFixed(3) ) + "}" 
		b++
	}

	out += "{" + gameA.game.resultMessage + "}  *"
	return out
}


function getMoveOrder (gameA, gameB) {
	// if the moves happen simultaneously then boardA will be first
	
	var initialTime = gameA.game.baseTime1
	var timeIncrement = gameA.game.timeIncrement1*10

	// these will contain the amount of time that has passed
	var	tA = [],
			tB = []

	function getMoveTimes (moveTimestamps) {
		//	timestamps from chess.com in a list, it has the 
		// remaining times of the players in alternating order

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

	console.log("Timestamps: ", tA, tB)

	var globalMoves = []
	ind = 0
	
	var sumlength = tA.length + tB.length +1
	for (var i = 0; i < sumlength ; i++ ){
		var mv = {}
		var tAempty = ( tA.length == 0 )
		var tBempty = ( tB.length == 0 )			

		var bothNonEmpty = !tAempty && !tBempty
			
		if ( (bothNonEmpty && tB[0] < tA[0]) || tAempty ) {
			mv.p = "B"
			mv.t  = tB.shift() 
			globalMoves[ind] = mv
			ind ++ 
		} else {
			mv.p = "A"
			mv.t  = tA.shift() 
			globalMoves[ind] = mv
			ind ++
		}
	}
	
	return JSON.stringify(globalMoves)
}


function bpgn_header ( ) {
	var bpgn_string="";
	bpgn_string += '[Event "'+gameA.game.pgnHeaders.Event+'"]'
	bpgn_string += '[Site "'+gameA.game.pgnHeaders.Site+'"]'
	bpgn_string += '[Date "'+gameA.game.pgnHeaders.Date+'"]'									// possibly the end date in PDT?
	bpgn_string += '[Time "'+gameA.game.pgnHeaders.EndTime+'"]' 							// this is the time of the end of a match
																												// TODO: substract game length from it
	bpgn_string += '[WhiteA "'+gameA.game.pgnHeaders.White+'"][WhiteAElo "'+gameA.game.pgnHeaders.WhiteElo+'"]'
	bpgn_string += '[BlackA "'+gameA.game.pgnHeaders.Black+'"][BlackAElo "'+gameA.game.pgnHeaders.BlackElo+'"]'
	bpgn_string += '[WhiteB "'+gameB.game.pgnHeaders.White+'"][WhiteBElo "'+gameB.game.pgnHeaders.WhiteElo+'"]'
	bpgn_string += '[BlackB "'+gameB.game.pgnHeaders.Black+'"][BlackBElo "'+gameB.game.pgnHeaders.BlackElo+'"]'
	bpgn_string += '[TimeControl "'+gameA.game.pgnHeaders.TimeControl+'"]'
	bpgn_string += '{C:chess.com/live/game/'+gameA.game.id+' and chess.com/live/game/' +gameB.game.id+ '}'
	return bpgn_string
}

