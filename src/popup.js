import {Helper} from "./helper.js";
import {UI} from "./uiElements.js";
let helper = new Helper();

window.onload = function(){
    load();
    document.getElementById("page").onclick = function(){
        helper.openInNewTab("list.html", true);
    }
}

async function load(){
    let pages = await helper.loadData();
    let settings = await helper.loadSettings();
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

    let ui = new UI(document.getElementById("list"), pages, save, url, helper, settings);
}

async function save(data){
    helper.saveData(data);
}