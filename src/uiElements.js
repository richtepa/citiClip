export class UI{

    darkModeOptions = ["auto", "dark", "light"];
    alreadyUpdated = false;

    constructor(parent, pages, saveCallback, url = undefined, helper, settings){
        this.helper = helper;
        this.el = parent;
        this.saveCallback = saveCallback;
        this.pages = [];

        if(settings.darkMode == undefined){
            settings.darkMode = "auto";
        }
        let darkmodeSettings = document.getElementsByClassName("darkmodeSettings")[0];
        if(darkmodeSettings != undefined){
            darkmodeSettings.addEventListener("click", this.changeDarkMode.bind(this), false);
        }
        this.updateDarkMode(settings.darkMode);

        for(let page of pages){
            if(url == undefined || page.data.url == url){
                this.pages.push(new uiPage(this.el, 0, this, page.data, page.citis, this.helper));
            }
        }
    }

    update(changes){
        if(this.helper.sitedataPath in changes){
            this.updateData(changes[this.helper.sitedataPath]);
        }
        /*
        if(this.helper.settingsPath in changes){
            this.updateSettings(changes[this.helper.settingsPath]);
        }
        */
    }

    updateData(changes){
        if(this.alreadyUpdated){
            this.alreadyUpdated = false;
            return;
        }
        console.log("data", changes);

        
        // remove old pages
        for(let i = 0; i < changes.oldValue.length; i++){
            let stillExists = false;
            for(let j = 0; j < changes.newValue.length; j++){
                if(changes.oldValue[i].data.url == changes.newValue[j].data.url){
                    stillExists = true;
                }
            }
            if(!stillExists){
                this.removePage(this.pages[i]);
                changes.oldValue.splice(i, 1);
            }
        }
        // add new pages
        for(let i = 0; i < changes.newValue.length; i++){
            if(changes.oldValue[i] == undefined || changes.oldValue[i].data.url != changes.newValue[i].data.url){
                this.insertPage(changes.newValue[i], i);
            } else {
                // update page parameter
                if(changes.newValue[i].data.latex != changes.oldValue[i].data.latex){
                    this.pages[i].elPageName.elLatex.innerHTML = changes.newValue[i].data.latex;
                    this.pages[i].updatePageParameter("latex", changes.newValue[i].data.latex);
                }
                // remove old citis
                for(let k = 0; k < changes.oldValue[i].citis.length; k++){
                    let stillExists = false;
                    for(let j = 0; j < changes.newValue[i].citis.length; j++){
                        if(changes.oldValue[i].citis[k].timestamp == changes.newValue[i].citis[j].timestamp){
                            stillExists = true;
                        }
                    }
                    if(!stillExists){
                        this.pages[i].removeCitation(this.pages[i].citations[k]);
                        changes.oldValue[i].citis.splice(k, 1);
                    }
                }
                // add new citis
                for(let k = 0; k < changes.newValue[i].citis.length; k++){
                    if(changes.oldValue[i].citis[k] == undefined || changes.oldValue[i].citis[k].timestamp != changes.newValue[i].citis[k].timestamp){
                        this.pages[i].insertCitation(changes.newValue[i].citis[k], k);
                    } else {
                        // update citi parameter
                        if(changes.newValue[i].citis[k].comment != changes.oldValue[i].citis[k].comment){
                            this.pages[i].citations[k].elComment.innerHTML = changes.newValue[i].citis[k].comment;
                            if(changes.newValue[i].citis[k].comment == "" && !this.pages[i].citations[k].elComment.classList.contains("hidden")){
                                this.pages[i].citations[k].elComment.classList.add("hidden");
                            } else if(changes.oldValue[i].citis[k].comment == "" && this.pages[i].citations[k].elComment.classList.contains("hidden")){
                                this.pages[i].citations[k].elComment.classList.remove("hidden");
                            }
                            this.pages[i].citations[k].updateCitiParameter("comment", changes.newValue[i].citis[k].comment);
                        }
                    }
                }
            }
        }

        /*  
        for(let i = 0; i < changes.newValue.length; i++){
            if(changes.newValue[i].data.latex != changes.oldValue[i].data.latex){
                this.pages[i].elPageName.elLatex.innerHTML = changes.newValue[i].data.latex;
                this.pages[i].updatePageParameter("latex", changes.newValue[i].data.latex);
            }
            for(let j = 0; j < changes.newValue[i].citis.length; j++){
                if(changes.newValue[i].citis[j].comment != changes.oldValue[i].citis[j].comment){
                    this.pages[i].citations[j].elComment.innerHTML = changes.newValue[i].citis[j].comment;
                    this.pages[i].citations[j].updateCitiParameter("comment", changes.newValue[i].citis[j].comment);
                }
            }
        }
        */
    }

    /*
    updateSettings(changes){
        console.log("settings", changes);
    }
    */

    async updateDarkMode(darkmode){
        this.darkmode = darkmode;

        let body = document.body;
        let darkmodeSettings = document.getElementsByClassName("darkmodeSettings")[0];
        
        for(let setting of this.darkModeOptions){
            body.classList.remove(setting);
            if(darkmodeSettings != undefined){
                darkmodeSettings.classList.remove(setting);
            }
        }

        body.classList.add(darkmode);
        darkmodeSettings.classList.add(darkmode);
    }

    async changeDarkMode(){
        let settings = await this.helper.loadSettings();

        let index = this.darkModeOptions.indexOf(this.darkmode);
        index++;
        if(index >= this.darkModeOptions.length){
            index = 0;
        }
        settings.darkMode = this.darkModeOptions[index];

        this.helper.saveSettings(settings);

        this.updateDarkMode(this.darkModeOptions[index]);
    }

    insertPage(page, index){
        this.pages.splice(index, 0, new uiPage(this.el, 0, this, page.data, page.citis, this.helper)).join();
    }

    removePage(page){
        page.destroy();
        this.pages.splice(this.pages.indexOf(page), 1);
        this.save();
    }

    save(){
        let pages = [];
        for(let page of this.pages){
            pages.push({"citis": [], "data": page.pageData});
            for(let citi of page.citations){
                pages[pages.length - 1].citis.push(citi.citationData);
            }
        }
        this.alreadyUpdated = true;
        this.saveCallback(pages);
    }
}

export class uiPage{
    constructor(parentElement, elementIndex, parent, pageData, pageCitis, helper){
        this.helper = helper;
        this.pageData = pageData;
        this.pageCitis = pageCitis;
        this.parent = parent;

        this.el = document.createElement("div");
        this.el.classList.add("page");
        if(parentElement.hasChildNodes()){
            parentElement.insertBefore(this.el, parentElement.childNodes[elementIndex]);
        } else {
            parentElement.appendChild(this.el);
        }

        let citis = this.pageCitis;
        this.citations = [];
        for(let citi of citis){
            this.citations.push(new uiCitation(this.el, 0, this, this.pageData, citi, this.helper));
        }

        this.elHr = document.createElement("hr");
        this.el.appendChild(this.elHr);

        this.elPageBox = document.createElement("div");
        this.elPageBox.classList.add("pageBox");
        this.el.appendChild(this.elPageBox);

        this.elFavicon = new uiFavicon(this.elPageBox, 0, this, this.pageData);
        this.elPageName = new uiPageName(this.elPageBox, 1, this, this.pageData);

        this.elIcons = document.createElement("div");
        this.elIcons.classList.add("icons");
        this.elPageBox.appendChild(this.elIcons);
        this.icons = [];
        for(let type of ["copyPage", "copy", "open", "delete", "action"]){
            this.icons.push(new uiIcon(this.elIcons, this.icons.length, this, this.pageData, undefined, type));
        }

    }

    destroy(){
        this.el.parentNode.removeChild(this.el);
    }

    remove(){
        this.parent.removePage(this);
    }


    insertCitation(citation, index){
        this.citations.splice(index, 0, new uiCitation(this.el, 0, this, this.pageData, citation, this.helper)).join();
        //this.parent.save();
    }

    removeCitation(citation){
        citation.destroy();
        this.citations.splice(this.citations.indexOf(citation), 1);
        this.parent.save();
    }


    updatePageParameter(parameter, value){
        this.pageData[parameter] = value;
        this.parent.save();
    }
}



export class uiCitation{
    constructor(parentElement, elementIndex, parent, pageData, citationData, helper){
        this.helper = helper;
        this.citationData = citationData;
        this.parent = parent;
        this.pageData = pageData;

        this.el = document.createElement("div");
        this.el.classList.add("citi");
        if(parentElement.hasChildNodes()){
            parentElement.insertBefore(this.el, parentElement.childNodes[elementIndex]);
        } else {
            parentElement.appendChild(this.el)
        }

        this.timestamp = new uiTimestamp(this.el, 0, this, this.citationData);
        this.text = new uiText(this.el, 1, this, this.citationData);
        
        this.elComment = document.createElement("div");
        this.elComment.classList.add("commentBox");
        this.text.el.appendChild(this.elComment);
        this.elComment.contentEditable = true;
        if(citationData.comment != ""){
            this.elComment.innerHTML = citationData.comment;
        } else {
            this.elComment.classList.add("hidden");
        }
        this.elComment.onblur = (function(event){
            this.updateCitiParameter("comment", event.target.innerHTML);
        }).bind(this);

        this.elIcons = document.createElement("div");
        this.elIcons.classList.add("icons");
        this.el.appendChild(this.elIcons);
        this.icons = [];
        for(let type of ["comment", "copy", "open", "delete", "action"]){
            this.icons.push(new uiIcon(this.elIcons, this.icons.length, this, this.pageData, this.citationData, type));
        }
    }

    destroy(){
        this.el.parentNode.removeChild(this.el);
    }

    remove(){
        this.parent.removeCitation(this);
    }

    updateCitiParameter(parameter, value){
        // ToDo
        this.citationData[parameter] = value;
        this.parent.parent.save();
    }
}






export class uiFavicon{
    constructor(parentElement, elementIndex, parent, pageData){
        this.parent = parent;
        this.pageData = pageData;

        this.el = document.createElement("div");
        this.el.classList.add("favicon");
        if(this.pageData.favicon == undefined){
            this.pageData.favicon = "images/icons/favicon.svg";
        }
        this.el.style.backgroundImage = "url(" + this.pageData.favicon + ")";
        if(parentElement.hasChildNodes()){
            parentElement.insertBefore(this.el, parentElement.childNodes[elementIndex]);
        } else {
            parentElement.appendChild(this.el)
        }
    }

    destroy(){
        this.el.parentNode.removeChild(this.el);
    }
}

export class uiPageName{
    constructor(parentElement, elementIndex, parent, pageData){
        this.parent = parent;
        this.pageData = pageData;

        this.el = document.createElement("div");
        this.el.classList.add("pageName");
        this.el.innerHTML = pageData.title;
        if(parentElement.hasChildNodes()){
            parentElement.insertBefore(this.el, parentElement.childNodes[elementIndex]);
        } else {
            parentElement.appendChild(this.el)
        }

        this.elLink = document.createElement("a");
        this.elLink.href = pageData.url;
        this.elUrl = document.createElement("div");
        this.elUrl.classList.add("url");
        this.elUrl.innerHTML = pageData.url;
        this.elLink.appendChild(this.elUrl);
        this.el.appendChild(this.elLink);

        this.elLatex = document.createElement("div");
        this.elLatex.contentEditable = true;
        this.elLatex.classList.add("latex");
        this.elLatex.innerHTML = pageData.latex;
        this.el.appendChild(this.elLatex);
        this.elLatex.onblur = (function(event){
            let url = this.pageData.url;
            this.parent.updatePageParameter("latex", event.target.innerHTML);
        }).bind(this);
    }

    destroy(){
        this.el.parentNode.removeChild(this.el);
    }
}

export class uiTimestamp{
    constructor(parentElement, elementIndex, parent, citiData){
        this.parent = parent;
        this.citiData = citiData;

        this.el = document.createElement("div");
        this.el.classList.add("timestamp");
        this.el.innerHTML = new Date(this.citiData.timestamp).toLocaleString();
        if(parentElement.hasChildNodes()){
            parentElement.insertBefore(this.el, parentElement.childNodes[elementIndex]);
        } else {
            parentElement.appendChild(this.el)
        }
    }

    destroy(){
        this.el.parentNode.removeChild(this.el);
    }
}

export class uiText{
    constructor(parentElement, elementIndex, parent, citiData){
        this.parent = parent;
        this.citiData = citiData;

        this.el = document.createElement("div");
        this.el.innerHTML = this.citiData.text;
        this.el.classList.add("text");
        if(parentElement.hasChildNodes()){
            parentElement.insertBefore(this.el, parentElement.childNodes[elementIndex]);
        } else {
            parentElement.appendChild(this.el)
        }
    }

    destroy(){
        this.el.parentNode.removeChild(this.el);
    }
}




export class uiIcon{
    constructor(parentElement, elementIndex, parent, pageData, citationData, type){
        this.parent = parent;
        this.pageData = pageData;
        this.type = type;
        this.pageData = pageData;
        this.citationData = citationData;

        this.el = document.createElement("div");
        this.el.classList.add("icon");
        this.el.classList.add(type);
        if(parentElement.hasChildNodes()){
            parentElement.insertBefore(this.el, parentElement.childNodes[elementIndex]);
        } else {
            parentElement.appendChild(this.el)
        }

        this.el.addEventListener("click", (function(event){
            let url = this.pageData.url;
            let title = this.pageData.title;
            let text;
            if(this.citationData != undefined){
                text = this.citationData.text;
            }

            switch(this.type){
                case "copyPage":
                    let latex = this.pageData.latex.replace(" ", "_");
                    let lastchecked = new Date(parseInt(this.pageData.timestamp)).toLocaleDateString();

                    let copyLatex = ""
                    copyLatex += `@misc{${latex},\r\n`;
                    copyLatex += `title = {${title}},\r\n`;
                    copyLatex += `url = {${url}},\r\n`;
                    copyLatex += `lastchecked = {${lastchecked}},\r\n`;
                    //copyLatex += `author = {${author}},\r\n`;
                    //copyLatex += `editor = {${editor}},\r\n`;
                    //copyLatex += `originalyear = {${originalyear}},\r\n`;
                    copyLatex += `}`;

                    navigator.clipboard.writeText(copyLatex);

                    this.el.classList.add("done");
                    window.setTimeout((function(){
                        this.el.classList.remove("done");
                    }).bind(this), 2500);
                    break;
                case "copy":
                    let copy;
                    if(text == "undefined" || text == undefined){
                        copy = url;
                    } else {
                        copy = text;
                    }

                    navigator.clipboard.writeText(copy);

                    this.el.classList.add("done");
                    window.setTimeout((function(){
                        this.el.classList.remove("done");
                    }).bind(this), 2500);
                    break;
                case "open":
                    this.parent.helper.openTab(url);
                    break;
                case "delete":
                    this.parent.remove();
                    break;
                case "comment":
                    this.parent.elComment.classList.toggle("hidden");
                    if(!this.parent.elComment.classList.contains("hidden")){
                        this.parent.elComment.focus();
                    }
                    break;
            }
        }).bind(this));
    }

    destroy(){
        this.el.parentNode.removeChild(this.el);
    }
}