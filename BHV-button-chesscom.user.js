// ==UserScript==
// @name         BHV link to chess.com
// @version      2021-08-07
// @description  puts a BHV link into the left menubar, below the diamond
// @author       bmacho
// @match        https://www.chess.com/game/live/*
// @match        https://www.chess.com/live*
// @icon         data:image/gif;base64,R0lGODlhEAAQAPIAAAAAAE13N2CQPG6fQpK7SAAAAAAAAAAAACH5BAUKAAAALAAAAAAQABAAAAM1CLrTsxAKQlqI0VksnbgcM3yhaIGcoH1oGrylSMZAM5fO22a5zmkDHSwiUBWFO6SQFVEKFwkAOw==
// @namespace    none
// @grant        none
// @updateURL    none
// @downloadURL  none
// @run-at       document-idle
// ==/UserScript==

// waits until the menu appears, then calls add_button()

var sidebar_upper;

(function wait(){
    sidebar_upper = document.getElementById("sb").children[2];
    if ( sidebar_upper ) {
        add_button()
    } else {
    setTimeout(wait, 100);}})();


function add_button() {

    var review_button = document.createElement("div");

	review_button.innerHTML = "[review game]"
    review_button.style.textAlign = "center"
    review_button.style.marginRight = "auto"
    review_button.style.marginLeft = "auto"

    review_button.style.cursor = "pointer"
    review_button.addEventListener ("click", openBHV)
    review_button.addEventListener ("auxclick", openBHV)

    sidebar_upper.appendChild(review_button)

}


function openBHV() {
	// we put semicolons here so the code can be copy-pasted as a bookmarklet

    var game_id, flip ;

    if (location.pathname == "/live") {

		game_id = location.hash.substr(3) ;

		flip = ( document.getElementById("game-board").classList.contains("flipped") ) ? "&flip=true" : "" ;

		} ;

    if (location.pathname.slice(0, 11) == "/game/live/") {

		game_id = location.pathname.slice(11) ;

		flip = ( document.getElementById("board-dailyGame-" + game_id).classList.contains("flipped") ) ? "&flip=true" : "" ;

		} ;

    window.open("https://bmacho.github.io/bughouse-viewer/view.html?game_id=" + game_id + flip, "_blank") ;

}
