export class Helper{
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
}