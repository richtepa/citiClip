//import {CitiList} from "./citiList.js";
//import {CitiUI} from "./citiUI.js";
import {Helper} from "./helper.js";
import {UI} from "./uiElements.js";
//let citiList = new CitiList();
//let citiUI = new CitiUI(citiList);
let helper = new Helper();

let ui;

window.onload = function(){
    showAllCitis();
}


async function showAllCitis(){
    //let list = await citiList.getList();
    let pages = await helper.loadData();

    ui = new UI(document.getElementById("list"), pages, save);
    
    /*
    for(let page of pages){
        citiUI.addPageToUI(page);
    }
    citiUI.eventListeners();
    */
}

async function save(data){
    helper.saveData(data);
}

