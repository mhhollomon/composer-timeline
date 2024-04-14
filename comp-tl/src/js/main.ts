// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

function component() {

    const h1 = document.createElement("h1");
    h1.innerHTML = "Hello World";
    h1.classList.add('hello')

    return h1;
}

document.body.appendChild(component());