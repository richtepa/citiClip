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
        citi.citiID = citi.timestamp;

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

    async removeCiti(url, citiID){
        const list = await this.getList();
        
        let updatedList = [...list];
        for(let p of updatedList){
            if(p.data.url == url){
                for(let i = 0; i < p.citis.length; i++){
                    if(p.citis[i].citiID == citiID){
                        p.citis.splice(i, 1);
                        break;
                    }
                }
                if(p.citis.length == 0){
                    updatedList.splice(updatedList.indexOf(p), 1);
                }
                break;
            }
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

    async removePage(url){
        const list = await this.getList();
        
        let updatedList = [...list];
        for(let p of updatedList){
            if(p.data.url == url){
                updatedList.splice(updatedList.indexOf(p), 1);
                break;
            }
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

    async updateCitiParameter(url, citiID, parameter, value){ 
        const list = await this.getList();
        
        let updatedList = [...list];
        for(let p of updatedList){
            if(p.data.url == url){
                for(let i = 0; i < p.citis.length; i++){
                    if(p.citis[i].citiID == citiID){
                        p.citis[i][parameter] = value;
                        break;
                    }
                }
                break;
            }
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

    async updatePageParameter(url, parameter, value){
        const list = await this.getList();
        
        let updatedList = [...list];
        for(let p of updatedList){
            if(p.data.url == url){
                p.data[parameter] = value;
                break;
            }
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