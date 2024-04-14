import './style.css'

function component() {

    const h1 = document.createElement("h1");
    h1.innerHTML = "Hello World";
    h1.classList.add('hello')

    return h1;
}

document.body.appendChild(component());