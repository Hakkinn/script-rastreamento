// =================================================================
// SCRIPT DE CONFIGURAÇÃO VISUAL v2.1 (CORRIGIDO)
// =================================================================

// Verifica se está no modo de configuração visual antes de executar qualquer coisa
if (new URLSearchParams(window.location.search).get('visual_config_mode') === 'true') {
    console.log('✅ Modo de Configuração Visual Ativado.');

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
     * Usar 'true' (fase de captura) garante que este listener rode antes de qualquer
     * outro listener de clique no elemento, permitindo-nos decidir se o bloqueamos ou não.
     */
    document.body.addEventListener('click', (e) => {

        // LÓGICA DE DECISÃO PRINCIPAL
        if (interactionMode === 'navigate') {
            // --- MODO NAVEGAÇÃO ---
            // 1. Não previne o comportamento padrão do clique. O link/botão funcionará normalmente.
            console.log('🌐 MODO NAVEGAÇÃO: Clique permitido. Enviando notificação para o painel.');

            // 2. Avisa o painel que a interação ocorreu para que ele desative o modo.
            window.parent.postMessage({ type: 'NAVIGATION_EXECUTED' }, '*');

            // 3. Retorna o modo para 'select' imediatamente para a próxima interação.
            interactionMode = 'select';

            // 4. NÃO chama preventDefault/stopPropagation, permitindo que o clique original aconteça.

        } else {
            // --- MODO SELEÇÃO (Comportamento padrão do configurador) ---
            // 1. Previne o comportamento padrão do clique (abrir link, pop-up, etc.).
            e.preventDefault();
            e.stopPropagation();

            console.log('👆 MODO SELEÇÃO: Elemento interceptado.');

            // 2. Pega as informações do elemento clicado.
            const target = e.target;
            const selector = getUniqueSelector(target);
            const eventId = `click-on-${target.tagName.toLowerCase()}`;
            const elementText = target.innerText || target.value || '';

            // 3. Envia os dados do elemento para o painel.
            window.parent.postMessage({
                type: 'VISUAL_TRACKER_EVENT',
                payload: {
                    selector: selector,
                    eventId: eventId,
                    elementText: elementText.trim().slice(0, 50)
                }
            }, '*');
        }
    }, true); // O 'true' para usar a fase de captura é essencial.

    /**
     * Função para gerar um seletor CSS único para um elemento.
     * Esta função é robusta para encontrar o melhor seletor possível.
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
