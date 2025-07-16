// =================================================================
// SCRIPT DE CONFIGURAÇÃO VISUAL v2.2 (COM HANDSHAKE)
// =================================================================

// Verifica se está no modo de configuração visual antes de executar qualquer coisa
if (new URLSearchParams(window.location.search).get('visual_config_mode') === 'true') {
    // AVISA O PAINEL QUE O IFRAME ESTÁ PRONTO PARA RECEBER COMANDOS
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    console.log('✅ Modo de Configuração Visual Ativado. Sinal de "pronto" enviado ao painel.');

    // Variável para controlar o modo de interação: 'select' (padrão) ou 'navigate'
    let interactionMode = 'select';

    // Listener para receber mensagens do painel configurador (iframe pai)
    window.addEventListener('message', (event) => {
        // Verificações de segurança: garantir que a mensagem vem do pai e tem dados
        if (event.source !== window.parent || !event.data || !event.data.type) {
            return;
        }

        if (event.data.type === 'SET_INTERACTION_MODE') {
            interactionMode = event.data.mode;
            console.log(`▶️ Modo de Interação alterado para: ${interactionMode.toUpperCase()}`);
        }
    });

    /**
     * Adiciona o listener de clique ao corpo do documento.
     */
    document.body.addEventListener('click', (e) => {
        // LÓGICA DE DECISÃO PRINCIPAL
        if (interactionMode === 'navigate') {
            // --- MODO NAVEGAÇÃO ---
            console.log('🌐 MODO NAVEGAÇÃO: Clique permitido. Enviando notificação para o painel.');
            window.parent.postMessage({ type: 'NAVIGATION_EXECUTED' }, '*');
            interactionMode = 'select'; // Retorna o modo para 'select' imediatamente
        } else {
            // --- MODO SELEÇÃO ---
            e.preventDefault();
            e.stopPropagation();
            console.log('👆 MODO SELEÇÃO: Elemento interceptado.');
            const target = e.target;
            const selector = getUniqueSelector(target);
            const eventId = `click-on-${target.tagName.toLowerCase()}`;
            const elementText = target.innerText || target.value || '';
            window.parent.postMessage({
                type: 'VISUAL_TRACKER_EVENT',
                payload: {
                    selector: selector,
                    eventId: eventId,
                    elementText: elementText.trim().slice(0, 50)
                }
            }, '*');
        }
    }, true); 

    /**
     * Função para gerar um seletor CSS único para um elemento.
     */
    function getUniqueSelector(el) {
        if (!el instanceof Element) return;
        let path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                let sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector)
                        nth++;
                }
                if (nth != 1)
                    selector += ":nth-of-type("+nth+")";
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }
}
