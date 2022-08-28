import {CitiList} from "./citiList.js";
let citiList = new CitiList();

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
        "favicon": tab.favIconUrl
    }
    let citi = {
        "text": info.selectionText,
        "notes": "notesBuffer",
        "tags": [],
        "timestamp": new Date().valueOf()
    };
    citiList.addCiti(page, citi);
})