// ==UserScript==
// @name         BHV links for chess.com
// @version      2025.09.01
// @description  puts a BHV button into the left menubar, replaces archive game links to BHV links
// @author       bmacho

// @match        https://www.chess.com/game/live/*
// @match        https://www.chess.com/games/archive*
// @match        https://www.chess.com/member/*
// @match        https://www.chess.com/play*

// @icon         data:image/gif;base64,R0lGODlhEAAQAPIAAAAAAE13N2CQPG6fQpK7SAAAAAAAAAAAACH5BAUKAAAALAAAAAAQABAAAAM1CLrTsxAKQlqI0VksnbgcM3yhaIGcoH1oGrylSMZAM5fO22a5zmkDHSwiUBWFO6SQFVEKFwkAOw==

// @namespace    none
// @updateURL    https://github.com/bmacho/bughouse-viewer/raw/main/BHV-links.user.js
// @run-at       document-idle
// @grant        none

// ==/UserScript==

// ============ Settings ============ //

window.replace_archive = true
window.put_BHV_button  = true


// ======== Handle page type ========= //

window.PageType = {
    profile : "profile" ,      //  https://chess.com/member/bmacho
    games   : "games" ,        //  https://chess.com/member/bmacho/games
    play    : "play" ,         //  https://www.chess.com/play/online/doubles-bughouse
    // ^ put BHV button there before seeking games
    game    : "game" ,         //  https://www.chess.com/game/live/72363735187
    // ^ the page of a single game
    archive : "archive" ,      //  https://www.chess.com/games/archive/bmacho
    // ^ legacy, possible chess.com will remove them soon
}

window.pageType = (() => {
   // recognize which page are we on
   let path  = location.pathname                    // e.g. "/game/live"
   let paths = location.pathname.split('/')         // e.g. ['', 'game', 'live']

   if (path.slice(0, 11) == "/game/live/" )         return PageType.game    ;
   if (path.slice(0,  5) == "/play")                return PageType.play  ;
   if (path.slice(0, 14) == "/games/archive")       return PageType.archive ;
   if (paths[1] == "member" && !paths[3])           return PageType.profile ;
   if (paths[1] == "member" && paths[3] == "games") return PageType.games ;
})()

console.info(`BHV userscript:\n\n
PageType is ${pageType}`)


// ========= Put BHV button ========== //


if ( put_BHV_button && ( pageType == PageType.play || pageType == PageType.game ) ) {

    console.info(`BHV userscript:\n\n
Put the BHV button`)


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




// ========= Modify game links ========== //


if ( replace_archive && ( pageType == PageType.profile || pageType == PageType.games || pageType == PageType.archive ) ) {
    console.info(`BHV userscript:\n\n
Change links`)


    window.getTbody = (pType) => {
        // gets tbody according to page type (currently both 3 page type works the same way)
        // returns undefined if tbody is not found ( might be constructed later )
        return document.getElementsByTagName("tbody")[0]
    }

    let shouldReplaceRow = (row, pType) => {
        return row.innerHTML.includes('-bughouse"') && !row.innerHTML.includes('https://bmacho.github.io/bughouse-viewer/')
    }

    let modifyRow = (row, pType) => {
        if (shouldReplaceRow(row,pType)) {
            if (pType == PageType.archive) {
                row.innerHTML = row.innerHTML
                    .replaceAll("https://www.chess.com/game/live/", "https://bmacho.github.io/bughouse-viewer/view.html?game_id=")
                    .replaceAll("https://www.chess.com/analysis/game/live/", "https://bmacho.github.io/bughouse-viewer/view.html?game_id=")
            } else {
                // pageType is profile or games
                row.innerHTML = row.innerHTML.replaceAll("/game/live/", "https://bmacho.github.io/bughouse-viewer/view.html?game_id=")
            }
        }
    }

    var replaceTbody = (pType) => {
        // looks for a table full of rows for games
        // if there isn't one, returns
        // if there is one, replaces bughouse games with BHV links
        // is called in every 0.2 seconds
        window.tb = getTbody(pType)
        if (!tb) return ;

        for (let row of tb.children) {
            modifyRow(row, pType)
        }
    }

    setInterval( replaceTbody , 200, pageType );

}
