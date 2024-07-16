class ElementDecorator {
    constructor(element) {
        this.element = element;
    }
    applyStyle() {
        throw new Error("Method 'applyStyle()' must be implemented.");
    }
}

class DayNightDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) {
            this.element.classList.add('day');
        } else {
            this.element.classList.add('night');
        }
    }
}

class ButtonDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 18) {
            this.element.classList.add('btnNight');
        }
    }
}

class InputDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 18) {
            this.element.classList.add('usernameNight', 'contraseñaNight');
        }
    }
}

class ContentDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 18) {
            this.element.classList.add('contentNight');
        }
    }
}

class NavDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 18) {
            this.element.classList.add('menuContainerNight');
            const links = this.element.querySelectorAll('.navbar ul li a');
            links.forEach(link => link.classList.add('navbarNight'));
        }
    }
}

class FooterDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 18) {
            this.element.classList.add('footerNight');
        }
    }
}
class BodyDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 18) {
            this.element.classList.add('bodyNight');
        }
    }
}
class headerDecorator extends ElementDecorator {
    applyStyle() {
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 18) {
            this.element.classList.add('headerNight');
        }
    }
}

function applyDecorators() {
    const fullSection = document.querySelector('.full');
    const contentSection = document.querySelector('.content');
    const buttons = document.querySelectorAll('.btn');
    const inputs = document.querySelectorAll('.username, .contraseña');
    const nav = document.querySelector('.menuContainer');
    const footer = document.querySelector('.footer');
    const body = document.querySelector('.body');
    const header = document.querySelector('.header');

    if (header) {
        const decoratedHeader = new headerDecorator(header);
        decoratedHeader.applyStyle();
    }
    if (body) {
        const decoratedBody = new BodyDecorator(body);
        decoratedBody.applyStyle();
    }
    if (fullSection) {
        const decoratedFullSection = new DayNightDecorator(fullSection);
        decoratedFullSection.applyStyle();
    }

    if (contentSection) {
        const decoratedContentSection = new ContentDecorator(contentSection);
        decoratedContentSection.applyStyle();
    }

    buttons.forEach(button => {
        const decoratedButton = new ButtonDecorator(button);
        decoratedButton.applyStyle();
    });
    inputs.forEach(input => {
        const decoratedInput = new InputDecorator(input);
        decoratedInput.applyStyle();
    });

    if (nav) {
        const decoratedNav = new NavDecorator(nav);
        decoratedNav.applyStyle();
    }

    if (footer) {
        const decoratedFooter = new FooterDecorator(footer);
        decoratedFooter.applyStyle();
    }
}

document.addEventListener('DOMContentLoaded', applyDecorators);
