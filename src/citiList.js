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

    async addCiti(citi){
        const list = await this.getList();
        const updatedList = [...list, citi];
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