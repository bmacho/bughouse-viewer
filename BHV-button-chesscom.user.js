// ==UserScript==
// @name         BHV link to chess.com
// @version      2021-05-22
// @description  puts a BHV link under the diamond, into the left menubar
// @author       bmacho
// @match        https://www.chess.com/game/live/*
// @match        https://www.chess.com/live*
// @icon         https://www.google.com/s2/favicons?domain=chess.com
// @namespace    none
// @grant        none
// @updateURL    none
// @downloadURL  none
// @run-at       document-idle
// ==/UserScript==

// waits until the menu appears, then calls add_button()
(function wait(){
    var menu_exists = document.getElementsByClassName("menu top")[0];
    if (menu_exists) {
        add_button()
    } else {
    setTimeout(wait, 100);}})();


function add_button() {

    var review_button = document.createElement("strong");
	review_button.innerHTML = "[review game]"
    review_button.style.textAlign = "center"
    review_button.style.cursor = "pointer"
    review_button.addEventListener ("click", openBHV)
    review_button.addEventListener ("auxclick", openBHV)

    document.getElementsByClassName("menu top")[0].appendChild(review_button)

}


function openBHV() {

    let game_id = ""

    let flip = (document.getElementsByClassName("flipped")[0]) ? "&flip=true" : ""

    if (location.pathname == "/live") game_id = location.hash.substr(3)

    if (location.pathname.slice(0, 11) == "/game/live/") game_id = location.pathname.slice(11)

    window.open("https://bmacho.github.io/bughouse-viewer/view.html?game_id=" + game_id + flip, "_blank")

}
