class Format {
    /*
     * Retorna os id's dos elementos transformados em CamelCase
    */
    static getCamelCase(text) {
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }
}