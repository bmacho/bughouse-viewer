
// this js function eats a string coming from the JSON
// https://www.chess.com/callback/live/game/GAME_ID
// .game.moveList

// that string is an algebraic-like notation of 
// crazyhouse or bughouse half-games

// the output consist of an array of moves in a format that 
// Fiery's 2 decade old bug.js can eat

//

// chesscom movelist format: 
// every move are denoted by 2 letters, 

// regular moves: letter of the initial, then the end square of the piece
// castles: letter of the initial, then the end square of the king
// en passants: letter of the initial, then the end square of the pawn

// drops: letter of the piece &,-,*,+,= -> q,n,r,b,p, then the end square
// promotions: letter of the promoting pawn's square, then one of the
// letters of "{~}" "(^)" "[_]" "@#$" that mean
// pawn to move left/straigth/right, and promote to q,n,r,b 

//  

// bug.js bpgn viewer's algebraic notation:

// pawn move and en passnat in e2e4 format, without p
// piece move in Be1c4 format
// castle: o-o,
// drop: P@g4
// promotion: g7h8=Q

// 

// we keep track of the whole board, but not the promoted pieces, so 
// if someone wants to make an other BH/ZH viewer can't use this output
// because of the missing data of the pieces in hand

var n = "mC0SbsZJCJSJlB5Qgv=CfHCvdv6ZsJ!TJT2T=292=V70=C86HQZQV2?!-L+G+l0CvCGlclQC&46Z-IZ84787*Z78Z087IC+SCT-RLRYRT!-80878!T802^07=07Y0^YP-J"

// n = "=GXHGP"

// game id: https://www.chess.com/live/game/6496655714

function parseMoveList ( s ) {

	// split the string into an array by 2 characters
	var moves_by_two = []
	for (var i = 0; i < s.length; i += 2) {
		moves_by_two.push(s.substring(i, i + 2)) }	

	// some global variables
	var whosTurn = 1 				//  0 -> w, 1 -> b
	function set_piece_size (s) {
		return ( whosTurn ) ? s.toLowerCase() : s.toUpperCase() }
	
	var brd = {
		"a8":"r","b8":"n","c8":"b","d8":"q","e8":"k","f8":"b","g8":"n","h8":"r",
		"a7":"p","b7":"p","c7":"p","d7":"p","e7":"p","f7":"p","g7":"p","h7":"p",
		"a6":".","b6":".","c6":".","d6":".","e6":".","f6":".","g6":".","h6":".",
		"a5":".","b5":".","c5":".","d5":".","e5":".","f5":".","g5":".","h5":".",
		"a4":".","b4":".","c4":".","d4":".","e4":".","f4":".","g4":".","h4":".",
		"a3":".","b3":".","c3":".","d3":".","e3":".","f3":".","g3":".","h3":".",
		"a2":"P","b2":"P","c2":"P","d2":"P","e2":"P","f2":"P","g2":"P","h2":"P",
		"a1":"R","b1":"N","c1":"B","d1":"Q","e1":"K","f1":"B","g1":"N","h1":"R"}

   var pieces		= "qnrbpk" 			// Q N R B P K

	var drops		= "&-*+="   		// Q N R B P
	
	var promotes	= "{~}(^)[_]@#$"	// Q N R B

	var mv = []				// list that contains the output objects

	// ----------------------------------------------------- //

	// ----------------------------------------------------- //

	// the main loop that does all the things

	for (var i = 0; i < moves_by_two.length; i++) {
		
		var moved = false
		whosTurn = i%2 	// 0 for white
		turnNum = Math.floor(i/2+1)
		moveNum = i+1

		so = moves_by_two[i][0]
		ta = moves_by_two[i][1]		// letter of source and target squares, or drop/promotion

		var moveObj = {}

		if ( isDrop() ) {
			doDrop()
			moved = true
		}
		
		if ( isPromotion() ) {
			doPromotion()
			moved = true
		}

		if ( isEnPassant() ) {
			doEnPassant()
			moved = true
		}

		if ( isCastle() ) {
			doCastle()
			moved = true
		}

		if ( !moved ) {
			doRegularMove()
			moved = true
		}
		
	console.log(turnNum + ": " + mv[mv.length -1])
	logboard(brd)
	}


	// ----------------------------------------------------- //

	// ----------------------------------------------------- //
	

	// -------- recognise the moves --------- //


	function isDrop() {
		return "&-*+=".includes( so ) }
	
	function isPromotion() {
		return 	"{~}(^)[_]@#$".includes ( ta ) }
		
	function isEnPassant() {
		// we recognise en passant if a pawn moves diagonally 
		// and its target square was empty
		
		var is_pawnmove = "pP".includes( brd[ sq(so) ] ) 
		
		if (is_pawnmove) {
			var diagonally = ( sq(so)[0] != sq(ta)[0] )
			var emptytarget = ( brd[ sq(ta) ] == "." )
		
			return diagonally && emptytarget 
		} else {
			return false}
	}

	function isCastle() {	

		var is_kingmove = "kK".includes( brd[ sq(so) ] )
		var kingmove = sq(so) + sq(ta) 
		
		is_castle = is_kingmove && (
			(kingmove == "e1g1") || 
			(kingmove == "e1c1") || 
			(kingmove == "e8g8") || 
			(kingmove == "e8c8") 
		)
			
		return is_castle
	}
		
	function isRegularMove() {
		return true }


	// ---------- do the moves ----------- //


	function doCastle() {

		var kingmove = sq(so) + sq(ta) 
		var a = []
		
		if (kingmove == "e1g1") {
			brd["h1"] = "."
			brd["f1"] = "R"
			mv.push(  "O-O" )		
		}

		if (kingmove == "e1c1") {
			brd["a1"] = "."
			brd["d1"] = "R"
			mv.push(  "O-O-O" )		
		}
		
		if (kingmove == "e8g8") {
			brd["h8"] = "."
			brd["f8"] = "r"
			mv.push(  "o-o" )		
		}
		
		if (kingmove == "e8c8") {
			brd["a8"] = "."
			brd["d8"] = "r"
			mv.push(  "o-o-o" )		
		}	

		brd[ sq(ta) ] = brd[ sq(so) ]
		brd[ sq(so) ] = "."
		
	}

	function doRegularMove() {

		brd[ sq(ta) ] = brd[ sq(so) ]
		brd[ sq(so) ] = "."

		var is_pawnmove = "pP".includes( brd[ sq(ta) ] ) 

		if (is_pawnmove) {
			mv.push( sq(so) + sq(ta) )
		} else {
			mv.push( brd[sq(ta)].toUpperCase() + sq(so) + sq(ta) )
		}
	}

	function doDrop() {
		// & - * + = drop Q N R B P
		var piece = "QNRBP"[ "&-*+=".indexOf(so) ]
		brd [ sq(ta) ] = set_piece_size( piece )
		
		mv.push( piece + "@" + sq(ta) )
	}

	function doEnPassant () {
		// clean the square below the pawn
		if ( sq(ta)[1] == 6 ) {
			brd[sq(ta)[0] + 5] = "."}
		if ( sq(ta)[1] == 3 ) {
			brd[sq(ta)[0] + 4] = "."}		
			
		brd[ sq(ta) ] = brd[ sq(so) ]
		brd[ sq(so) ] = "."
		
		mv.push( sq(so) + sq(ta) )
	}

	function doPromotion () {
		// {~} (^) [_] @#$
		// the group decides if we promote to Q N R B, 
		// and the mod 3 decides if the promoting pawn lowers, equals or increases file
		
		var promotes = "{~}(^)[_]@#$"
		var files = "abcdefgh"

		var promote_to = "qnrb"[ Math.floor( promotes.indexOf(ta) / 3 ) ] 

		var file_change = ( promotes.indexOf(ta) % 3 ) - 1
		
		var newrank = (sq(so)[1] == 7) ? 8 : 1

		var ta_sq = files[  files.indexOf( sq(so)[0] ) + file_change ] + newrank

		brd [ sq(so) ] = "."
		brd [ta_sq] = set_piece_size( promote_to ) 
		
		mv.push( sq(so) + ta_sq + "=" + promote_to.toUpperCase() )		
	}

	return mv
}

function sq( s ) {
	// converts a chess.com one-letter notation into a regular square notation 

	var sq = {
		"4": "a8", "5": "b8", "6": "c8", "7": "d8", "8": "e8", "9": "f8", "!": "g8", "?": "h8",
		"W": "a7", "X": "b7", "Y": "c7", "Z": "d7", "0": "e7", "1": "f7", "2": "g7", "3": "h7",
		"O": "a6", "P": "b6", "Q": "c6", "R": "d6", "S": "e6", "T": "f6", "U": "g6", "V": "h6",
		"G": "a5", "H": "b5", "I": "c5", "J": "d5", "K": "e5", "L": "f5", "M": "g5", "N": "h5",
		"y": "a4", "z": "b4", "A": "c4", "B": "d4", "C": "e4", "D": "f4", "E": "g4", "F": "h4",
		"q": "a3", "r": "b3", "s": "c3", "t": "d3", "u": "e3", "v": "f3", "w": "g3", "x": "h3",
		"i": "a2", "j": "b2", "k": "c2", "l": "d2", "m": "e2", "n": "f2", "o": "g2", "p": "h2",
		"a": "a1", "b": "b1", "c": "c1", "d": "d1", "e": "e1", "f": "f1", "g": "g1", "h": "h1" 
	}
	
	return sq[s]
}


function logboard ( brd ) {
	// draws a chessboard into the js console logs
	// input brd object must be in {"a8": "R", ... } format
	
	var output = ""
	
	for (var r = 8; r >= 1; r -= 1) {

		for (var f = 1; f <= 8; f += 1) { 
			coord = "abcdefgh"[f-1] + r
			output += brd[coord] 
		}

		output += "\n"
	}
	
	console.log(output)
}
