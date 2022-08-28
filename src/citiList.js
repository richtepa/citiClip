export class CitiList {

    PATH = "citiClipData";

    async getList() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([this.PATH], (result) => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                console.log(result);
                if(result[this.PATH]?.citazions == undefined){
                    resolve([]);
                    return;
                }
                const list = result[this.PATH].citazions;
                resolve(list);
            });
        });
    }

    async addCiti(page, citi){
        const list = await this.getList();
        
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

        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [this.PATH]: {"citazions" : updatedList} }, () => {           
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                }
                resolve(updatedList);
            });
        });
    }
}