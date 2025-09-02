// Initialize jsPDF
const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const configStatus = document.getElementById('config-status');
    const apiKeyInput = document.getElementById('api-key-input');
    const modelInput = document.getElementById('model-input');
    const saveConfigButton = document.getElementById('save-config');
    const currentModelElement = document.getElementById('current-model');
    const typingModelElement = document.getElementById('typing-model');
    const cloudflareStatus = document.getElementById('cloudflare-status');
    const clearChatButton = document.getElementById('clear-chat');
    const togglePanelsButton = document.getElementById('toggle-panels');
    const savePdfButton = document.getElementById('save-pdf');
    const pdfLoading = document.getElementById('pdf-loading');
    
    let API_KEY = '';
    let MODEL_NAME = 'deepseek/deepseek-chat-v3.1:free';

    // Conversation history
    let conversationHistory = [
        {
            role: 'system',
            content: 'You are a helpful AI assistant. Format your responses using Markdown for better readability. Use code blocks for code snippets.'
        }
    ];

    // Add message to chat with markdown support
    function addMessage(text, sender, addToHistory = true) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender + '-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        const icon = document.createElement('i');
        icon.className = sender === 'ai' ? 'fas fa-robot' : 'fas fa-user';
        
        if (sender === 'ai' && text.includes("Thinking")) {
            messageContent.innerHTML = '<b>Thinking...</b>';
        } else {
            messageContent.innerHTML = marked.parse(text);
        }
        
        messageElement.appendChild(icon);
        messageElement.appendChild(messageContent);
        
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Highlight any code blocks in the message
        messageContent.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        if (addToHistory) {
            if (sender === 'user') {
                conversationHistory.push({ role: 'user', content: text });
            } else if (sender === 'ai') {
                conversationHistory.push({ role: 'assistant', content: text });
            }

            localStorage.setItem('conversation_history', JSON.stringify(conversationHistory));
        }
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        sendButton.disabled = true;
        setTyping(true);

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: conversationHistory
                })
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // AI thinking state
            setTyping(false);

            addMessage(aiResponse, 'ai');
        } catch (error) {
            setTyping(false);
            addMessage(`Error: ${error.message}. Please check your API key and try again.`, 'ai');
        }

        sendButton.disabled = false;
        userInput.focus();
    }

    function setTyping(visible) {
        typingIndicator.classList.toggle('active', visible);
        if (visible) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
