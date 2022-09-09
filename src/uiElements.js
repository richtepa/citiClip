export class UI{
    constructor(parent, pages){
        this.el = parent;
        this.pages = [];

        for(let page of pages){
            this.pages.push(new uiPage(this.el, page.data, page.citis));
        }
    }
}

export class uiPage{
    constructor(parentElement, pageData, pageCitis){
        this.pageData = pageData;
        this.pageCitis = pageCitis;
        this.parentElement = parentElement;

        this.el = document.createElement("div");
        this.el.classList.add("page");
        this.parentElement.appendChild(this.el);

        let citis = this.pageCitis.reverse();
        this.citations = [];
        for(let citi of citis){
            this.citations.push(new uiCitation(this.el, this, this.pageData, citi));
        }

        this.elPageBox = document.createElement("div");
        this.elPageBox.classList.add("pageBox");
        this.el.appendChild(this.elPageBox);

        this.elFavicon = new uiFavicon(this.elPageBox, this, this.pageData);
        this.elPageName = new uiPageName(this.elPageBox, this, this.pageData);

        this.elIcons = document.createElement("div");
        this.elIcons.classList.add("icons");
        this.elPageBox.appendChild(this.elIcons);
        this.icons = [];
        for(let type of ["copyPage", "copy", "open", "delete"]){
            this.icons.push(new uiIcon(this.elIcons, this, this.pageData, undefined, type));
        }

    }

    updatePageParameter(){
        // ToDo
    }

    remove(){
        // ToDO
    }
}



export class uiCitation{
    constructor(parentElement, parent, pageData, citationData){
        this.citationData = citationData;
        this.parent = parent;
        this.pageData = pageData;

        this.el = document.createElement("div");
        this.el.classList.add("citi");
        parentElement.appendChild(this.el);

        this.elTimestamp = new uiTimestamp(this.el, this, this.citationData);
        this.elText = new uiText(this.el, this, this.citationData);

        this.elIcons = document.createElement("div");
        this.elIcons.classList.add("icons");
        this.el.appendChild(this.elIcons);
        this.icons = [];
        for(let type of ["comment", "copy", "open", "delete"]){
            this.icons.push(new uiIcon(this.elIcons, this, this.pageData, this.citationData, type));
        }
    }
}






export class uiFavicon{
    constructor(parentElement, parent, pageData){
        this.parent = parent;
        this.pageData = pageData;

        this.el = document.createElement("div");
        this.el.classList.add("favicon");
        if(this.pageData.favicon == undefined){
            this.pageData.favicon = "images/icons/favicon.svg";
        }
        this.el.style.backgroundImage = "url(" + this.pageData.favicon + ")";
        parentElement.appendChild(this.el);
    }
}

export class uiPageName{
    constructor(parentElement, parent, pageData){
        this.parent = parent;
        this.pageData = pageData;

        this.el = document.createElement("div");
        this.el.classList.add("pageName");
        this.el.innerHTML = pageData.title;
        parentElement.appendChild(this.el);

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
            this.parent.citiList.updatePageParameter(url, "latex", event.target.innerHTML);
        }).bind(this);

    }
}

export class uiTimestamp{
    constructor(parentElement, parent, citiData){
        this.parent = parent;
        this.citiData = citiData;

        this.el = document.createElement("div");
        this.el.classList.add("timestamp");
        this.el.innerHTML = new Date(this.citiData.timestamp).toLocaleString();
        parentElement.appendChild(this.el);
    }
}

export class uiText{
    constructor(parentElement, parent, citiData){
        this.parent = parent;
        this.citiData = citiData;

        this.el = document.createElement("div");
        this.el.innerHTML = this.citiData.text;
        this.el.classList.add("text");
        parentElement.appendChild(this.el);
        // ToDo this.addCommentToUI(comment, el);
    }
}




export class uiIcon{
    constructor(parentElement, parent, pageData, citationData, type){
        // ToDo: correct for citations not only page

        this.parent = parent;
        this.pageData = pageData;
        this.type = type;
        this.pageData = pageData;
        this.citationData = citationData;

        this.el = document.createElement("div");
        this.el.classList.add("icon");
        this.el.classList.add(type);
        parentElement.appendChild(this.el);

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
                    break;
                case "copy":
                    let copy;
                    if(text == "undefined" || text == undefined){
                        copy = url;
                    } else {
                        copy = text;
                    }

                    navigator.clipboard.writeText(copy);
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
                    // ToDo
                    break;
            }
        }).bind(this));
    }
}