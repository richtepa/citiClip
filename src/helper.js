export class Helper{

    PATH = "citiClipData";
    sync = true;

    async getTab(){
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                resolve(tabs[0]);
            });
        });
    }
    
    async getURL(){
        let tab = await this.getTab();
        return tab.url;
    }

    async loadData(){
        return new Promise((resolve, reject) => {
            chrome.storage[this.sync ? "sync": "local"].get([this.PATH], (result) => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                if(result[this.PATH]?.citazions == undefined){
                    resolve([]);
                    return;
                }
                console.log(result[this.PATH].citazions);
                resolve(result[this.PATH].citazions);
            });
        });
    }
    
    async saveData(data){
        return new Promise((resolve, reject) => {
            chrome.storage[this.sync ? "sync": "local"].set({ [this.PATH]: {"citazions" : data} }, () => {           
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