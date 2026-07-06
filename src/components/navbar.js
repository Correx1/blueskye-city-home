import navbarHtml from './navbar.html?raw';

class AppNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = navbarHtml;
  }
}

if (!customElements.get('app-navbar')) {
  customElements.define('app-navbar', AppNavbar);
}
