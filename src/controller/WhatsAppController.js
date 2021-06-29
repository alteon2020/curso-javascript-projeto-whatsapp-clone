class WhatsAppController {
    constructor() {
        console.log('WhatsAppController OK');
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
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

    /*
     * Aplica prototipos para facilitar a manipulação do DOM  
    */

    elementsPrototype() {
        Element.prototype.hide = function () {
            this.style.display = 'none';
            return this;
        }
        Element.prototype.show = function () {
            this.style.display = 'block';
            return this;
        }
        Element.prototype.toggle = function () {
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        }
        Element.prototype.on = function (events, fn) {
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
            });
            return this;
        }
        Element.prototype.css = function (styles) {
            for (let name in styles) {
                this.style[name] = styles[name];
            }
            return this;
        }
        Element.prototype.addClass = function (name) {
            this.classList.add(name);
            return this;
        }
        Element.prototype.removeClass = function (name) {
            this.classList.remove(name);
        }
        Element.prototype.toggleClass = function (name) {
            this.classList.toggle(name);
            return this;
        }
        Element.prototype.hasClass = function (name) {
            return this.classList.contains(name);
        }

    }
    /* 
     * Metódo que inicia todos os eventos
     *
     */
    initEvents() {

        //Abre o painel de edição de foto
        this.el.myPhoto.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();
            setTimeout(() => {
                this.el.panelEditProfile.addClass('open');
            }, 300);

        });

        //Fecha o painel de adição de foto
        this.el.btnClosePanelEditProfile.on('click', e => {
            this.el.panelEditProfile.removeClass('open');
        });

        //Abre o painel de novo contato
        this.el.btnNewContact.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelAddContact.show();
            setTimeout(() => {
                this.el.panelAddContact.addClass('open');
            }, 300);

        });

        //Fecha o painel de novo contato
        this.el.btnClosePanelAddContact.on('click', e => {
            this.el.panelAddContact.removeClass('open');
        });

        // clique e opções da conversa
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {
            item.on('click', e => {
                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                });
            });
        });

        // Evento do botão de anexo de arquivos diversos
        this.el.btnAttach.on('click', e => {
            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this));
        });

        //Evento para anexar foto
        this.el.btnAttachPhoto.on('click', e => {
            console.log('photo');
        });
        //Evento para anexar camera
        this.el.btnAttachCamera.on('click', e => {
            console.log('Camera');
        });
        //Evento para anexar foto
        this.el.btnAttachDocument.on('click', e => {
            console.log('Document');
        });
        //Evento para anexar foto
        this.el.btnAttachContact.on('click', e => {
            console.log('contact');
        });
    }
    closeMenuAttach(e) {
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    }
    //Fecha os paineis para não sobrepor um ao outro
    closeAllLeftPanel() {
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();
    }
}

