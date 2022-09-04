import {CitiList} from "./citiList.js";
import {CitiUI} from "./citiUI.js";
import {Helper} from "./helper.js";
let citiList = new CitiList();
let citiUI = new CitiUI(citiList);
let helper = new Helper();


document.getElementById("page").onclick = function(){
    openListInNewTab();
}
/*
document.getElementById("new").onclick = function(){
    addMenu();
}
*/

window.onload = function(){
    showAllLocalCitis();
}

async function showAllLocalCitis(){
    let pages = await citiList.getList();
    let url = await helper.getURL();
    let pageFound = false;
    for(let page of pages){
        if(page.data.url == url){
            citiUI.addSmallPageToUI(page);
            pageFound = true;
            break;
        }
    }
    if(!pageFound){
        openListInNewTab();
    }
}

function openListInNewTab(){
    chrome.tabs.create({
            url: "list.html",
            selected: true
    });
}





/*
async function addMenu(){
    let tab = await helper.getTab();
    document.getElementById("new").classList.remove("hidden");
    debugger;
    document.getElementById("url").innerHTML = tab.url;
    document.getElementById("title").innerHTML = tab.title;
}

function save(){
    // save
    closeAddMenu();
}

function closeAddMenu(){
    document.getElementById("new").classList.add("hidden");
}
*/

/*
async function addCiti(){
    let url = await helper.getURL();
    let page = {
        "url": url
    };
    let citi = {
        "text": "text",
        "notes": "notesBuffer",
        "url": url,
        "tags": [],
        "timestamp": new Date().valueOf()
    }
    citiList.addCiti(page, citi);
    citiUI.addCitiToUI(page, citi);
}
*/