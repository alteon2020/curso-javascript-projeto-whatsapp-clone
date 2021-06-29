class WhatsAppController {
    constructor() {
        console.log('WhatsAppController OK');

        this.loadElements();
    }
/*
 * Pega todos os ids da página e chama a função pra transformar em camelCase
 */

    loadElements() {
        this.el = {};
        document.querySelectorAll('[id]').forEach(element => {
            this.el[Format.getCamelCase(element.id)] = element;
        });
    }
}

