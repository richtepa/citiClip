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
    let citi = {
        "text": info.selectionText,
        "notes": "notesBuffer",
        "url": tab.url,
        "tags": [],
        "timestamp": new Date().valueOf()
    }
    citiList.addCiti(citi);
})