export class CitiUI{


    constructor(citiList){
        this.citiList = citiList;
    }

    addPageToUI(page){
        let el = document.createElement("div");
        el.classList.add("page");
        el.setAttribute("url", page.data.url);
        document.getElementById("list").appendChild(el);
        let citis = page.citis.reverse();
        for(let citi of citis){
            this.addCitiToUI(citi, page, el);
        }
        this.addPageBoxToUI(page, el);
    }

    addSmallPageToUI(page){
        let el = document.createElement("div");
        el.classList.add("page");
        el.setAttribute("url", page.data.url);
        document.getElementById("list").appendChild(el);
        let citis = page.citis.reverse();
        for(let citi of citis){
            this.addSmallCitiToUI(citi, page, el);
        }
    }

    removePageFromUI(url){
        let els = document.getElementsByClassName("page");
        for(let el of els){
            if(el.getAttribute("url") == url){
                el.remove();
            }
        }
    }

    addCitiToUI(citi, page, parent){
        let el = document.createElement("div");
        el.classList.add("citi");
        el.setAttribute("url", page.data.url);
        el.setAttribute("citiID", citi.citiID);
        this.addTimestampToUI(citi.timestamp, el);
        this.addTextToUI(citi.text, citi.comment, el);
        this.addIconsToUI(el, ["comment", "copy", "open", "delete"], page.data.url, citi.text, citi.citiID);
        parent.appendChild(el);
    }

    addSmallCitiToUI(citi, page, parent){
        let el = document.createElement("div");
        el.classList.add("citi");
        el.setAttribute("url", page.data.url);
        el.setAttribute("citiID", citi.citiID);
        this.addTextToUI(citi.text, citi.comment, el);
        parent.appendChild(el);
    }

    removeCitiFromUI(url, citiID){
        let els = document.getElementsByClassName("citi");
        for(let el of els){
            if(el.getAttribute("url") == url && el.getAttribute("citiID") == citiID){
                el.remove();
            }
        }
        if(els.length == 0){
            this.removePageFromUI(url);
        }
    }

    addTimestampToUI(timestamp, parent){
        let el = document.createElement("div");
        el.innerHTML = new Date(timestamp).toLocaleString();
        el.classList.add("timestamp");
        parent.appendChild(el);
    }

    addTextToUI(text, comment, parent){
        let el = document.createElement("div");
        el.innerHTML = text;
        el.classList.add("text");
        parent.appendChild(el);
        this.addCommentToUI(comment, el);
    }

    addCommentToUI(comment, parent){
        let el = document.createElement("div");
        el.classList.add("commentBox");
        parent.appendChild(el);
        el.contentEditable = true;
        if(comment != ""){
            el.innerHTML = comment;
        } else {
            el.classList.add("hidden");
        }
        el.onblur = (function(event){
            let url = el.parentNode.parentNode.getAttribute("url");
            let citiID = el.parentNode.parentNode.getAttribute("citiID");
            this.citiList.updateCitiParameter(url, citiID, "comment", event.target.innerHTML);
        }).bind(this);
    }

    addIconsToUI(parent, iconNames, url, text, citiID, title, timestamp){
        let icons = document.createElement("div");
        icons.classList.add("icons");
        icons.setAttribute("url", url);
        icons.setAttribute("text", text);
        icons.setAttribute("citiID", citiID);
        icons.setAttribute("title", title);
        icons.setAttribute("timestamp", timestamp);
        for(let type of iconNames){
            let el = document.createElement("div");
            el.classList.add("icon");
            el.classList.add(type);
            icons.appendChild(el);
        }
        parent.appendChild(icons);
    }

    toggleHiddenComment(url, citiID){   
        let els = document.getElementsByClassName("citi");
        for(let el of els){
            if(el.getAttribute("url") == url && el.getAttribute("citiID") == citiID){
                let node = el.childNodes[1].childNodes[1];
                node.classList.toggle("hidden");
                if(!node.classList.contains("hidden")){
                    node.focus();
                }
            }
        }
    }




    addPageBoxToUI(page, parent){
        let el = document.createElement("div");
        el.classList.add("pageBox");
        this.addFaviconToUI(page.data.favicon, el);
        this.addPageNameToUI(page.data.title, page.data.url, page.data.latex, el);
        this.addIconsToUI(el, ["copyPage", "copy", "open", "delete"], page.data.url, undefined, undefined, page.data.title, page.data.timestamp);
        parent.appendChild(el);
    }

    addFaviconToUI(url, parent){
        let el = document.createElement("div");
        el.classList.add("favicon");
        if(url == undefined){
            url = "images/icons/favicon.svg";
        }
        el.style.backgroundImage = "url(" + url + ")";
        parent.appendChild(el);
    }

    addPageNameToUI(name, url, latex, parent){
        let el = document.createElement("div");
        el.classList.add("pageName");
        el.innerHTML = name;
        this.addUrlToUI(url, el);
        this.addLatexToUI(latex, el);
        parent.appendChild(el);
    }
    
    addUrlToUI(url, parent){
        let a = document.createElement("a");
        a.href = url;
        let el = document.createElement("div");
        el.classList.add("url");
        el.innerHTML = url;
        a.appendChild(el);
        parent.appendChild(a);
    }

    addLatexToUI(latex, parent){
        let el = document.createElement("div");
        el.contentEditable = true;
        el.classList.add("latex");
        el.innerHTML = latex;
        parent.appendChild(el);
        el.onblur = (function(event){
            let url = el.parentNode.parentNode.parentNode.getAttribute("url");
            this.citiList.updatePageParameter(url, "latex", event.target.innerHTML);
        }).bind(this);
    }





    eventListeners(){
        let els;
        
        els = document.getElementsByClassName("open");
        for(let el of els){
            el.onclick = function(){
                let url = el.parentNode.getAttribute("url");
                let text = el.parentNode.getAttribute("text");
                //if(text != "undefined"){
                //    window.open(url + "#:~:text=" + text, "_blank").focus();
                //} else {
                    window.open(url, "_blank").focus();
                //}
            }
        }

        els = document.getElementsByClassName("copy");
        for(let el of els){
            el.onclick = function(){
                let url = el.parentNode.getAttribute("url");
                let text = el.parentNode.getAttribute("text");

                let copy;
                if(text == "undefined"){
                    copy = url;
                } else {
                    copy = text;
                }
                navigator.clipboard.writeText(copy);
            }
        }

        els = document.getElementsByClassName("comment");
        for(let el of els){
            el.onclick = (function(){
                let url = el.parentNode.getAttribute("url");
                let citiID = el.parentNode.getAttribute("citiID");
                this.toggleHiddenComment(url, citiID);
            }).bind(this);
        }

        els = document.getElementsByClassName("delete");
        for(let el of els){
            el.onclick = (function(){
                let url = el.parentNode.getAttribute("url");
                let citiID = el.parentNode.getAttribute("citiID");
                if(citiID == "undefined"){
                    this.removePageFromUI(url);
                    this.citiList.removePage(url);
                } else {
                    this.removeCitiFromUI(url, citiID);
                    this.citiList.removeCiti(url, citiID);
                }
            }).bind(this);
        }

        els = document.getElementsByClassName("copyPage");
        for(let el of els){
            el.onclick = function(){

                let latex = el.parentElement.parentElement.childNodes[1].childNodes[2].innerHTML.replace(" ", "_");
                let url = el.parentElement.getAttribute("url");
                let title = el.parentElement.getAttribute("title");
                let lastchecked = new Date(parseInt(el.parentElement.getAttribute("timestamp"))).toLocaleDateString();


                let copy = ""
                copy += `@misc{${latex},\r\n`;
                copy += `title = {${title}},\r\n`;
                copy += `url = {${url}},\r\n`;
                copy += `lastchecked = {${lastchecked}},\r\n`;
                //copy += `author = {${author}},\r\n`;
                //copy += `editor = {${editor}},\r\n`;
                //copy += `originalyear = {${originalyear}},\r\n`;
                copy += `}`;

                navigator.clipboard.writeText(copy);
            }
        }
    }
}