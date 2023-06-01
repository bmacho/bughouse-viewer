// ==UserScript==
// @name         BHV links for chess.com
// @version      2023.06.01
// @description  puts a BHV button into the left menubar, replaces archive game links to BHV links
// @author       bmacho

// @match        https://www.chess.com/game/live/*
// @match        https://www.chess.com/games/archive*
// @match        https://www.chess.com/member/*

// @icon         data:image/gif;base64,R0lGODlhEAAQAPIAAAAAAE13N2CQPG6fQpK7SAAAAAAAAAAAACH5BAUKAAAALAAAAAAQABAAAAM1CLrTsxAKQlqI0VksnbgcM3yhaIGcoH1oGrylSMZAM5fO22a5zmkDHSwiUBWFO6SQFVEKFwkAOw==

// @namespace    none
// @grant        none
// @updateURL    https://github.com/bmacho/bughouse-viewer/raw/main/BHV-links.user.js
// @run-at       document-idle
// ==/UserScript==

let replace_archive = true
let put_BHV_button  = true

let is_member    = location.pathname.slice(0, 8)  == "/member/"
let is_archive   = location.pathname.slice(0, 15) == "/games/archive/"

let is_livegame   = location.pathname.slice(0, 11) == "/game/live/"




if ( put_BHV_button && is_livegame ) {

    console.log( "live game or an archive" )

    // waits until the menu appears, then calls add_button()
    var sidebar_upper;
    (function wait(){

        let sidebar_upper = document.getElementById("sb").children[2];
        if ( sidebar_upper ) {
            add_button( sidebar_upper )
        } else {
            setTimeout(wait, 100);
        }

    })();

} 

if ( replace_archive && (is_archive || is_member ) ) {

    // waits until the table loads
    var tbody;
    (function wait(){

        let tbody = document.getElementsByTagName("tbody")[0]
        if ( tbody ) {

            // for debug purposes
            console.log(tbody)
            window.tb = tbody


            if (is_member) {
                for (let ch of tbody.children) {
                    replaceArchive_Member(ch)
                }
            }

            if (is_archive) {
                for (let ch of tbody.children) {
                    replaceArchive_Archive(ch)
                }
            }
        } else {
            setTimeout(wait, 50);
        }

    })();

}




function replaceArchive_Archive ( row ) {
// call it on the '.children' of the 'tbody' of the table that contains links to archive games
// on a /games/archive page

    let isbughouse = row.innerHTML.includes(' bughouse"') // it is a row that points to a bughouse game
    if ( isbughouse ) {
        row.innerHTML = row.innerHTML
            .replaceAll("https://www.chess.com/game/live/", "https://bmacho.github.io/bughouse-viewer/view.html?game_id=")
            .replaceAll("https://www.chess.com/analysis/game/live/", "https://bmacho.github.io/bughouse-viewer/view.html?game_id=")
    }
}

function replaceArchive_Member ( row ) {
// call it on the '.children' of the 'tbody' of the table that contains links to archive games
// on a /member page

    let isbughouse = row.innerHTML.includes(' bughouse"') // it is a row that points to a bughouse game
    if ( isbughouse ) {
        row.innerHTML = row.innerHTML
            .replaceAll("/game/live/", "https://bmacho.github.io/bughouse-viewer/view.html?game_id=")
    }
}

function add_button( sidebar_upper ) {

    var review_button = document.createElement("div");

    review_button.innerHTML = "[open in BHV]"
    review_button.style.textAlign = "center"
    review_button.style.marginRight = "auto"
    review_button.style.marginLeft = "auto"

    review_button.style.cursor = "pointer"
    review_button.addEventListener ("click", openBHV)
    review_button.addEventListener ("auxclick", openBHV)

    sidebar_upper.appendChild(review_button)

}

function openBHV() {
	// we put semicolons here so the code can be copy-pasted for the bookmarklet

    let game_id = location.pathname.slice(11) ;
    let board_obj = document.getElementById("board-single") ;

    let flip = board_obj ? board_obj.classList.contains("flipped") ? "&flip=true" : "" : "" ;

    window.open("https://bmacho.github.io/bughouse-viewer/view.html?game_id=" + game_id + flip, "_blank") ;

}
