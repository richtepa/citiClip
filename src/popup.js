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

window.onload = function(){
    showAllCitis();
}


async function addCiti(){
    let url = await helper.getURL();
    let citi = {
        "text": "text",
        "notes": "notesBuffer",
        "url": url,
        "tags": [],
        "timestamp": new Date().valueOf()
    }
    citiList.addCiti(citi);
    citiUI.addCitiToUI(citi);
}

async function showAllCitis(){
    let list = await citiList.getList();
    for(let citi of list){
        citiUI.addCitiToUI(citi);
    }
}


