export class Helper{

    sitedataPath = "citiClipData";
    settingsPath = "settings";
    sync = true;

    async getActiveTab(){
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                resolve(tabs[0]);
            });
        });
    }

    async openInNewTab(url, selected){
        chrome.tabs.create({
                url: url,
                selected: selected
        });
    }

    async openTab(url){
        let tabs = await chrome.tabs.query({});
        for(let tab of tabs){
            if(tab.url.split("#")[0].split("?")[0] == url.split("#")[0].split("?")[0]){
                chrome.tabs.update(tab.id, {active: true});
                return;
            }
        }
        this.openInNewTab(url, true);
    }
    
    async getURL(long = false){
        let tab = await this.getActiveTab();
        console.log(tab);
        if(long){
            return tab.url;
        } else {
            return tab.url.split("#")[0].split("?")[0];
        }
    }

    async loadSettings(){
        return new Promise((resolve, reject) => {
            chrome.storage[this.sync ? "sync": "local"].get([this.settingsPath], (result) => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                if(result[this.settingsPath] == undefined){
                    resolve({});
                    return;
                }
                console.log(result[this.settingsPath]);
                resolve(result[this.settingsPath]);
            });
        });
    }

    async saveSettings(data){
        return new Promise((resolve, reject) => {
            chrome.storage[this.sync ? "sync": "local"].set({ [this.settingsPath]: data }, () => {           
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                resolve(data);
            });
        });
    }

    async loadData(){
        return new Promise((resolve, reject) => {
            chrome.storage[this.sync ? "sync": "local"].get([this.sitedataPath], (result) => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                if(result[this.sitedataPath] == undefined){
                    resolve([]);
                    return;
                }
                console.log(result[this.sitedataPath]);
                resolve(result[this.sitedataPath]);
            });
        });
    }
    
    async saveData(data){
        return new Promise((resolve, reject) => {
            chrome.storage[this.sync ? "sync": "local"].set({ [this.sitedataPath]: data}, () => {           
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                resolve(data);
            });
        });
    }

    async addCiti(page, citi){
        const list = await this.loadData();

        let pageExists = false;
        let updatedList = [...list];
        for(let p of updatedList){
            if(p.data.url == page.url){
                p.citis.push(citi);
                pageExists = true;
                break;
            }
        }
        if(!pageExists){
            updatedList.push({
                "data": page,
                "citis": [citi]
            });
        }

        this.saveData(updatedList);
    }
}