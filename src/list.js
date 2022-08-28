import {CitiList} from "./citiList.js";
import {CitiUI} from "./citiUI.js";
import {Helper} from "./helper.js";
let citiList = new CitiList();
let citiUI = new CitiUI(citiList);
let helper = new Helper();


window.onload = function(){
    showAllCitis();
}


async function showAllCitis(){
    let list = await citiList.getList();
    let pages = list.reverse();
    for(let page of pages){
        citiUI.addPageToUI(page);
    }
    citiUI.eventListeners();
}

