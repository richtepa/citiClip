import {Helper} from "./helper.js";
import {UI} from "./uiElements.js";
let helper = new Helper();

window.onload = function(){
    load();
}

async function load(){
    let settings = await helper.loadSettings();
    let pages = await helper.loadData();
    let ui = new UI(document.getElementById("list"), pages, save, undefined, helper, settings);
}

async function save(data){
    helper.saveData(data);
}
