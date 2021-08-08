import { Format } from './../util/Format';
import { CameraController } from './CameraController';
import { MicrophoneController } from './MicrophoneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { Firebase } from './../util/Firebase';
import { User } from '../model/User';

export class WhatsAppController {
    constructor() {
        console.log('WhatsAppController OK');
        this._firebase = new Firebase();
        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();

    }

    initAuth() {
        this._firebase.initAuth()
            .then(response => {
                this._user = new User(response.user.email);

                this._user.on('datachange', data => {
                    document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';
                    this.el.inputNamePanelEditProfile.innerHTML = data.name;
                    if(data.photo) {
                        let photo = this.el.imgPanelEditProfile;
                        photo.src = data.photo;
                        photo.show();
                        this.el.imgDefaultPanelEditProfile.hide();

                        let photo2 = this.el.myPhoto.querySelector('img');
                        photo2.src = data.photo;
                        photo2.show();
                    }
                });

                this._user.name = response.user.displayName;
                this._user.email = response.user.email;
                this._user.photo = response.user.photoURL;
                this._user.save().then(()=>{
                    this.el.appContent.css({
                        display:'flex'
                    });
                });

                
            })
            .catch(err => {
                console.log(err);
            });
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

        HTMLFormElement.prototype.getForm = function(){
            return new FormData(this);
        }

        HTMLFormElement.prototype.toJSON = function(){
            let json = this.getForm().forEach((value, key)=>{
                json[key] = value;
            });

            return json;     
        }


    }

    /* 
     * Metódo que inicia todos os eventos
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

        this.el.photoContainerEditProfile.on('click', e=>{

            this.el.inputProfilePhoto.click();
        });

        this.el.inputNamePanelEditProfile.on('keypress', e=>{
            if(e.key === 'Enter'){
                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }
        });

        this.el.btnSavePanelEditProfile.on('click', e=>{
            
            this.el.btnSavePanelEditProfile.disabled = true;
            this._user.name = this.el.inputNamePanelEditProfile.innerHTML;
            this._user.save().then(()=>{
                this.el.btnSavePanelEditProfile.disabled = false;
            });
        });

        this.el.formPanelAddContact.on('submit', e=>{
            e.preventDefault();
            let formData = new FormData(this.el.formPanelAddContact);
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
            this.el.inputPhoto.click();
        });

        this.el.inputPhoto.on('change', e => {
            console.log(this.el.inputPhoto.files);
            [...this.el.inputPhoto.files].forEach(file => {
                console.log(file);
            })
        });

        //Evento para anexar camera
        //Abre o painel de tirar foto
        this.el.btnAttachCamera.on('click', e => {
            this.closeAllMainPanel();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'height': 'calc(100% - 120px)',
            });

            this._camera = new CameraController(this.el.videoCamera);
        });

        //Fecha o painel de tirar foto
        this.el.btnClosePanelCamera.on('click', e => {
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();
        });

        // Evento para tirar foto 
        this.el.btnTakePicture.on('click', e => {
            // chama o método da câmera
            let dataUrl = this._camera.takePicture();
            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();
        });

        //Botão para tirar a foto novamente
        this.el.btnReshootPanelCamera.on('click', e => {
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();
        });

        //Botão para enviar a foto
        this.el.btnSendPicture.on('click', e => {
            console.log(this.el.pictureCamera.src);
        });


        //Evento para anexar documento
        this.el.btnAttachDocument.on('click', e => {
            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                'height': 'calc(100% - 120px)',
            });
            this.el.inputDocument.click();
        });

        //Capturando o arquivo
        this.el.inputDocument.on('change', e => {
            if (this.el.inputDocument.files.length) {

                this.el.panelDocumentPreview.css({
                    'height': '1%'
                });
                let file = this.el.inputDocument.files[0];
                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result => {
                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 120px)'
                    });

                    console.log(file.type);

                }).catch(err => {
                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 120px)'
                    });
                    switch (file.type) {
                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                            break;
                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;
                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;
                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;
                    }
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                });
            }
        });

        //fecha o painel de documento
        this.el.btnClosePanelDocumentPreview.on('click', e => {
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
        });

        //Botão que envia o documento
        this.el.btnSendDocument.on('click', e => {
            console.log("Send document");
        });

        //Evento para anexar contato
        this.el.btnAttachContact.on('click', e => {
            this.el.modalContacts.show();
        });

        //Fecha o modal de contato
        this.el.btnCloseModalContacts.on('click', e => {
            this.el.modalContacts.hide();
        });

        //Evento de microfone
        this.el.btnSendMicrophone.on('click', e => {

            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', audio => {

                this._microphoneController.startRecorder();
            });

            this._microphoneController.on('recordtimer', timer => {

                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);

            });

        });

        //Fecha o microphone
        this.el.btnCancelMicrophone.on('click', e => {
            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();
        });

        //Envia o audio do microphone
        this.el.btnFinishMicrophone.on('click', e => {
            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();
        });

        // Campo de digitação
        this.el.inputText.on('keypress', e => {
            if (e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault();
                this.el.btnSend.click();
            }
        });

        this.el.inputText.on('keyup', e => {
            if (this.el.inputText.innerHTML.length) {
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
            } else {
                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();
            }
        });

        //Envia mensagem
        this.el.btnSend.on('click', e => {
            console.log(this.el.inputText.innerHTML);
        });

        //Botão dos emojis

        this.el.btnEmojis.on('click', e => {
            this.el.panelEmojis.toggleClass('open');
        });
        // escolhe os emojis
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
            emoji.on('click', e => {
                let img = this.el.imgEmojiDefault.cloneNode();
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name => {
                    img.classList.add(name);
                });
                //Adicionar o emoji em qualquer local do texto
                let cursor = window.getSelection();
                if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {
                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                let range = document.createRange();
                range = cursor.getRangeAt(0);
                range.deleteContents();

                let frag = document.createDocumentFragment();
                frag.appendChild(img);
                range.insertNode(frag);
                range.setStartAfter(img);
                this.el.inputText.dispatchEvent(new Event('keyup'));
            });
        });




    }

    //Fecha o painel de microphone
    closeRecordMicrophone() {
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
    }
    //Fecha os paineis principais
    closeAllMainPanel() {
        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');
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

