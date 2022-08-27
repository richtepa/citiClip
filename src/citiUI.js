export class CitiUI{
    addCitiToUI(citi){
        let el = document.createElement("div");
        el.innerHTML = citi.text + " | " + citi.notes + " | " + citi.url + " | " + citi.tags + " | " + citi.timestamp;
        document.getElementById("citis").appendChild(el);
    }
}