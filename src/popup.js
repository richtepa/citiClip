import {Helper} from "./helper.js";
import {UI} from "./uiElements.js";
let helper = new Helper();

let ui;

window.onload = function(){
    showAllCitis();
    document.getElementById("page").onclick = function(){
        helper.openInNewTab("list.html", true);
    }
}


async function showAllCitis(){
    let pages = await helper.loadData();
    let url = await helper.getURL();

    let isSamePage = false;
    for(let page of pages){
        if(page.data.url == url){
            isSamePage = true;
        }
    }

    if(!isSamePage){
        helper.openInNewTab("list.html", true);
        return;
    }
    ui = new UI(document.getElementById("list"), pages, save, url);
}

async function save(data){
    helper.saveData(data);
}