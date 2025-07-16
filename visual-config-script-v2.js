// Adicione este trecho ao seu script 'visual-config-script-v2.js'

// Variável para controlar o modo de interação
let interactionMode = 'select'; // 'select' (padrão) ou 'navigate'

// Listener para receber mensagens do painel configurador
window.addEventListener('message', (event) => {
    // Verificação de segurança básica
    if (event.source !== window.parent || !event.data) {
        return;
    }

    if (event.data.type === 'SET_INTERACTION_MODE') {
        console.log('Modo de interação alterado para:', event.data.mode);
        interactionMode = event.data.mode;
    }
});

// MODIFIQUE SEU EVENT LISTENER DE CLIQUE EXISTENTE
// Onde você captura os cliques nos elementos, você precisa adicionar a lógica abaixo.
// Exemplo de como seu listener de clique deve ficar:

document.body.addEventListener('click', (e) => {
    if (new URLSearchParams(window.location.search).get('visual_config_mode') !== 'true') {
        return; // Sai se não estiver no modo de configuração
    }

    // LÓGICA DO MODO DE NAVEGAÇÃO
    if (interactionMode === 'navigate') {
        console.log('Clique em modo de navegação. Ação padrão permitida.');
        // Envia mensagem ao painel informando que a navegação ocorreu
        window.parent.postMessage({ type: 'NAVIGATION_EXECUTED' }, '*');
        // Muda o modo de volta para 'select' localmente
        interactionMode = 'select'; 
        // Não fazemos e.preventDefault(), permitindo que o clique funcione normalmente
        return; 
    }

    // SEU CÓDIGO EXISTENTE PARA SELECIONAR O ELEMENTO E ENVIAR A MENSAGEM 'VISUAL_TRACKER_EVENT'
    // ... (o restante da sua lógica de clique para o modo 'select' vem aqui)
    e.preventDefault();
    e.stopPropagation();

    // Exemplo:
    const target = e.target;
    const selector = getUniqueSelector(target); // Supondo que você tenha uma função para isso
    const eventId = `click_${target.tagName.toLowerCase()}_${Date.now()}`;
    
    window.parent.postMessage({
        type: 'VISUAL_TRACKER_EVENT',
        payload: {
            selector: selector,
            eventId: eventId,
            elementText: target.innerText.trim().slice(0, 50)
        }
    }, '*');
    
}, true); // Use a captura de eventos para pegar o evento antes de tudo
