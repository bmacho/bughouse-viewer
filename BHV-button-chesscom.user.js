// ==UserScript==
// @name         BHV link to chess.com
// @namespace    https://github.com/bmacho/bughouse-viewer/
// @version      2021-05-07
// @description  puts a BHV link under the diamond, into the left menubar
// @author       bmacho
// @match        https://www.chess.com/game/live/*
// @match        https://www.chess.com/live*
// @icon         https://www.google.com/s2/favicons?domain=chess.com
// @grant        none
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
	review_button.innerHTML = "<a href='javascript:void(0)' >[review game]</a>"
    review_button.style.textAlign = "center"
    review_button.addEventListener ("click", openBHV)

    document.getElementsByClassName("menu top")[0].appendChild(review_button)

}


function openBHV() {

    let game_id = ""

    if (location.pathname == "/live") game_id = location.hash.substr(3)

    if (location.pathname.slice(0, 11) == "/game/live/") game_id = location.pathname.slice(11)

    window.open("https://bmacho.github.io/bughouse-viewer/view.html?game_id=" + game_id, "_blank")

}
