export class UI{
    constructor(parent, pages, saveCallback, url = undefined){
        this.el = parent;
        this.saveCallback = saveCallback;
        this.pages = [];

        for(let page of pages){
            if(url == undefined || page.data.url == url){
                this.pages.push(new uiPage(this.el, 0, this, page.data, page.citis));
            }
        }
    }

    insertPage(page, index){
        this.pages = this.pages.splice(index, 0, new uiPage(this.el, 0, this, page.data, page.citis)).join();
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
        this.saveCallback(pages);
    }
}

export class uiPage{
    constructor(parentElement, elementIndex, parent, pageData, pageCitis){
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
            this.citations.push(new uiCitation(this.el, 0, this, this.pageData, citi));
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
        this.citations = this.citations.splice(index, 0, new uiCitation(this.el, 0, this, this.pageData, citation)).join();
        //this.parent.save();
    }

    removeCitation(citation){
        citation.destroy();
        this.citations.splice(this.citations.indexOf(citation), 1);
        this.parent.save();
    }


    updatePageParameter(page, parameter, value){
        page.pageData[parameter] = value;
        this.parent.save();
    }
}



export class uiCitation{
    constructor(parentElement, elementIndex, parent, pageData, citationData){
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
            this.updateCitiParameter(this, "comment", event.target.innerHTML);
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

    updateCitiParameter(citi, parameter, value){
        // ToDo
        citi.citationData[parameter] = value;
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
            this.parent.updatePageParameter(this, "latex", event.target.innerHTML);
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
                    //if(text != "undefined"){
                    //    window.open(url + "#:~:text=" + text, "_blank").focus();
                    //} else {
                        window.open(url, "_blank").focus();
                    //}
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