//import {CitiList} from "./citiList.js";
//let citiList = new CitiList();
import {Helper} from "./helper.js";
let helper = new Helper();

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": 'Add to CitiClip',
        "contexts": ["selection"],
        "id": "addSelectionToCitiClip"
    });
});
    
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    let page = {
        "url": tab.url.split("#")[0],
        "title": tab.title,
        "favicon": tab.favIconUrl,
        "timestamp": new Date().valueOf(),
        "latex": tab.title
    }
    let citi = {
        "text": info.selectionText,
        "comment": "",
        "tags": [],
        "timestamp": new Date().valueOf()
    };
    let res = helper.addCiti(page, citi);
})