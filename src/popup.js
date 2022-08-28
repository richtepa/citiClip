import {CitiList} from "./citiList.js";
import {CitiUI} from "./citiUI.js";
import {Helper} from "./helper.js";
let citiList = new CitiList();
let citiUI = new CitiUI();
let helper = new Helper();
console.log(citiList.PATH);


document.getElementById("button").onclick = function(){
    addCiti();
}
document.getElementById("page").onclick = function(){
    chrome.tabs.create({
            url: "list.html",
            selected: true
    });
}

window.onload = function(){
    showAllCitis();
}


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

async function showAllCitis(){
    let list = await citiList.getList();
    for(let page of list){
        citiUI.addPageToUI(page);
    }
}


