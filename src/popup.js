import {CitiList} from "./citiList.js";
import {CitiUI} from "./citiUI.js";
import {Helper} from "./helper.js";
let citiList = new CitiList();
let citiUI = new CitiUI(citiList);
let helper = new Helper();


document.getElementById("page").onclick = function(){
    chrome.tabs.create({
            url: "list.html",
            selected: true
    });
}
document.getElementById("page").onclick = function(){
    addMenu();
}


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
        addMenu();
    }
}

function addMenu(){
    console.log("addMenu");
}

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