document.addEventListener('deviceready', onReady);

function onReady() {
    document.getElementById("form").onsubmit = (e) => {
        e.preventDefault();
    }
}

let validator = {
    "size": () => {
        return ""
    }
}

function getErrorNode(msg) {
    let node = document.createElement("span");
    node.classList.add("err-msg");
    node.appendChild(document.createTextNode(msg));
}