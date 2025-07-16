// =================================================================
// SCRIPT DE CONFIGURAÇÃO VISUAL - VERSÃO FINAL (BASEADO NO SEU ORIGINAL)
// =================================================================
(function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('visual_config_mode') !== 'true' || window.self === window.top) {
        return;
    }

    // --- LÓGICA DO MODO DE NAVEGAÇÃO ---
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    console.log('✅ Script Final (com prompt) ATIVADO. Sinal de "pronto" enviado.');

    let interactionMode = 'select'; // 'select' ou 'navigate'

    window.addEventListener('message', (event) => {
        if (event.source !== window.parent || !event.data || !event.data.type) { return; }
        if (event.data.type === 'SET_INTERACTION_MODE') {
            interactionMode = event.data.mode;
            console.log('▶️ Modo alterado para: ' + interactionMode.toUpperCase());
        }
    });
    // --- FIM DA LÓGICA DE NAVEGAÇÃO ---

    const style = document.createElement('style');
    style.innerHTML = `[data-vcs-highlight] { outline: 3px dashed #FF8C00 !important; cursor: pointer !important; }`;
    document.head.appendChild(style);

    document.addEventListener('mouseover', e => {
        document.querySelectorAll('[data-vcs-highlight]').forEach(el => el.removeAttribute('data-vcs-highlight'));
        const target = e.target.closest('a, button, input[type="submit"], input[type="button"]');
        if (target) target.setAttribute('data-vcs-highlight', 'true');
    });

    const getCssSelector = (el) => {
        if (!(el instanceof Element)) return; let path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase(); if (el.id) { selector += '#' + el.id.trim(); path.unshift(selector); break; }
            else { let sib = el, nth = 1; while (sib = sib.previousElementSibling) { if (sib.nodeName.toLowerCase() == selector) nth++; } if (nth != 1) selector += ":nth-of-type("+nth+")"; }
            path.unshift(selector); el = el.parentNode;
        } return path.join(" > ");
    };

    document.addEventListener('click', (e) => {
        // --- VERIFICAÇÃO DO MODO DE NAVEGAÇÃO ---
        if (interactionMode === 'navigate') {
            console.log('🌐 Modo Navegação: Clique permitido.');
            window.parent.postMessage({ type: 'NAVIGATION_EXECUTED' }, '*');
            interactionMode = 'select';
            return; // Permite a ação padrão do clique e interrompe o script aqui
        }
        // --- FIM DA VERIFICAÇÃO ---

        const target = e.target.closest('a, button, input[type="submit"], input[type="button"]');
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();

        const suggestedName = (target.innerText || target.value || 'evento').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        const eventId = prompt('Dê um nome para este evento:', suggestedName);

        if (eventId) {
            const selector = getCssSelector(target);
            const eventData = { type: 'VISUAL_TRACKER_EVENT', payload: { selector: selector, eventId: eventId, elementText: (target.innerText || target.value) } };
            window.parent.postMessage(eventData, '*');
        }
        target.removeAttribute('data-vcs-highlight');
    }, true);
})();
