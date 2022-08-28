export class CitiUI{

    addPageToUI(page){
        let el = document.createElement("div");
        el.classList.add("page");
        document.getElementById("list").appendChild(el);
        let citis = page.citis.reverse();
        for(let citi of citis){
            this.addCitiToUI(citi, el);
        }
        this.addPageBoxToUI(page, el);
    }


    addCitiToUI(citi, parent){
        let el = document.createElement("div");
        el.classList.add("citi");
        this.addTimestampToUI(citi.timestamp, el);
        this.addTextToUI(citi.text, el);
        this.addIconsToUI(el, ["copy", "open", "comment", "delete"]);
        parent.appendChild(el);
    }

    addTimestampToUI(timestamp, parent){
        let el = document.createElement("div");
        el.innerHTML = new Date(timestamp).toLocaleString();
        el.classList.add("timestamp");
        parent.appendChild(el);
    }

    addTextToUI(text, parent){
        let el = document.createElement("div");
        el.innerHTML = text;
        el.classList.add("text");
        parent.appendChild(el);
    }

    addIconsToUI(parent, iconNames){
        let icons = document.createElement("div");
        icons.classList.add("icons");
        for(let type of iconNames){
            let el = document.createElement("div");
            el.classList.add("icon");
            el.classList.add(type);
            icons.appendChild(el);
        }
        parent.appendChild(icons);
    }




    addPageBoxToUI(page, parent){
        let el = document.createElement("div");
        el.classList.add("pageBox");
        this.addFaviconToUI(page.data.favicon, el);
        this.addPageNameToUI(page.data.title, page.data.url, el);
        this.addIconsToUI(el, ["copy", "open", "copyPage", "delete"]);
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

    addPageNameToUI(name, url, parent){
        let el = document.createElement("div");
        el.classList.add("pageName");
        el.innerHTML = name;
        this.addUrlToUI(url, el);
        parent.appendChild(el);
    }
    
    addUrlToUI(url, parent){
        let el = document.createElement("div");
        el.classList.add("url");
        el.innerHTML = url;
        parent.appendChild(el);
    }


}