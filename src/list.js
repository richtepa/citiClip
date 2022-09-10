import {Helper} from "./helper.js";
import {UI} from "./uiElements.js";
let helper = new Helper();

let ui;

window.onload = function(){
    showAllCitis();
}


async function showAllCitis(){
    let pages = await helper.loadData();
    ui = new UI(document.getElementById("list"), pages, save);
}

async function save(data){
    helper.saveData(data);
}

