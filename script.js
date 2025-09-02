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
            
            // Panel elements
            const configPanelHeader = document.getElementById('config-panel-header');
            const configPanelContent = document.getElementById('config-panel-content');
            const infoPanelHeader = document.getElementById('info-panel-header');
            const infoPanelContent = document.getElementById('info-panel-content');
            const panelsContainer = document.querySelector('.panels-container');
            
            // API configuration
            const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
            let API_KEY = '';
            let MODEL_NAME = 'deepseek/deepseek-chat-v3.1:free';
            
            // Panel state
            let panelsExpanded = true;
            
            // Conversation history
            let conversationHistory = [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant. Format your responses using Markdown for better readability. Use code blocks for code snippets.'
                }
            ];
            
            // Configure marked to render code blocks with syntax highlighting
            marked.setOptions({
                highlight: function(code, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        return hljs.highlight(code, { language: lang }).value;
                    }
                    return hljs.highlightAuto(code).value;
                }
            });
            
            // Save conversation as PDF
            async function saveAsPDF() {
                // Show loading indicator
                pdfLoading.style.display = 'flex';
                
                try {
                    // Create a new PDF document
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const margin = 20;
                    const contentWidth = pageWidth - (margin * 2);
                    let yPosition = margin;
                    
                    // Add title
                    pdf.setFontSize(20);
                    pdf.setFont(undefined, 'bold');
                    pdf.setTextColor(99, 102, 241); // Primary color
                    pdf.text('DeepSeek Chat Conversation', pageWidth / 2, yPosition, { align: 'center' });
                    yPosition += 15;
                    
                    // Add date and model info
                    pdf.setFontSize(12);
                    pdf.setFont(undefined, 'normal');
                    pdf.setTextColor(0, 0, 0);
                    const date = new Date().toLocaleString();
                    pdf.text(`Date: ${date}`, margin, yPosition);
                    yPosition += 8;
                    pdf.text(`Model: ${MODEL_NAME}`, margin, yPosition);
                    yPosition += 8;
                    pdf.text(`Total Messages: ${conversationHistory.length - 1}`, margin, yPosition);
                    yPosition += 15;
                    
                    // Add a line separator
                    pdf.setDrawColor(200, 200, 200);
                    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
                    yPosition += 10;
                    
                    // Set font for messages
                    pdf.setFontSize(11);
                    
                    // Add conversation messages
                    for (const message of conversationHistory) {
                        if (message.role === 'system') continue;
                        
                        // Check if we need a new page
                        if (yPosition > 250) {
                            pdf.addPage();
                            yPosition = margin;
                        }
                        
                        // Set message background color
                        if (message.role === 'user') {
                            pdf.setFillColor(99, 102, 241); // Primary color
                            pdf.setTextColor(255, 255, 255);
                        } else {
                            pdf.setFillColor(243, 244, 246); // Secondary color
                            pdf.setTextColor(0, 0, 0);
                        }
                        
                        // Split message into lines that fit the page width
                        const messageLines = pdf.splitTextToSize(message.content, contentWidth - 20);
                        
                        // Calculate message height
                        const lineHeight = 7;
                        const messageHeight = messageLines.length * lineHeight + 10;
                        
                        // Draw message background
                        pdf.roundedRect(margin, yPosition, contentWidth, messageHeight, 3, 3, 'F');
                        
                        // Add message text
                        pdf.text(messageLines, margin + 10, yPosition + 10);
                        
                        // Add sender label
                        pdf.setFont(undefined, 'bold');
                        if (message.role === 'user') {
                            pdf.text('User', margin + 10, yPosition + 5);
                        } else {
                            pdf.text('AI Assistant', margin + 10, yPosition + 5);
                        }
                        pdf.setFont(undefined, 'normal');
                        
                        // Update Y position for next message
                        yPosition += messageHeight + 10;
                    }
                    
                    // Add page numbers
                    const totalPages = pdf.internal.getNumberOfPages();
                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);
                        pdf.setFontSize(10);
                        pdf.setTextColor(100, 100, 100);
                        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
                    }
                    
                    // Save the PDF
                    const dateStr = new Date().toISOString().slice(0, 10);
                    pdf.save(`DeepSeek-Chat-${dateStr}.pdf`);
                    
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Error generating PDF. Please try again.');
                } finally {
                    // Hide loading indicator
                    pdfLoading.style.display = 'none';
                }
            }
            
            // Toggle panel visibility
            function togglePanels() {
                panelsExpanded = !panelsExpanded;
                
                if (panelsExpanded) {
                    configPanelContent.classList.remove('collapsed');
                    configPanelContent.classList.add('expanded');
                    infoPanelContent.classList.remove('collapsed');
                    infoPanelContent.classList.add('expanded');
                    panelsContainer.style.display = 'block';
                    togglePanelsButton.innerHTML = '<i class="fas fa-bars"></i> Hide Panels';
                } else {
                    configPanelContent.classList.remove('expanded');
                    configPanelContent.classList.add('collapsed');
                    infoPanelContent.classList.remove('expanded');
                    infoPanelContent.classList.add('collapsed');
                    // Don't hide the container completely, just minimize the content
                    togglePanelsButton.innerHTML = '<i class="fas fa-bars"></i> Show Panels';
                }
                
                // Save panel state to localStorage
                localStorage.setItem('panelsExpanded', panelsExpanded);
            }
            
            // Toggle individual panel
            function togglePanel(header, content) {
                const isExpanded = content.classList.contains('expanded');
                
                if (isExpanded) {
                    content.classList.remove('expanded');
                    content.classList.add('collapsed');
                    header.querySelector('.toggle-icon').style.transform = 'rotate(0deg)';
                } else {
                    content.classList.remove('collapsed');
                    content.classList.add('expanded');
                    header.querySelector('.toggle-icon').style.transform = 'rotate(180deg)';
                }
            }
            
            // Check for Cloudflare Pages environment variable
            function checkCloudflareEnv() {
                // This will be replaced at build time by Cloudflare Pages
                // The variable needs to be injected into the HTML during build
                const cfApiKey = '{{API_KEY}}';
                
                if (cfApiKey && cfApiKey !== '{{API_KEY}}' && cfApiKey.length > 10) {
                    // Valid Cloudflare environment variable found
                    API_KEY = cfApiKey;
                    cloudflareStatus.innerHTML = `<i class="fas fa-check-circle"></i> <span>Using API key from Cloudflare environment variable: <code>${cfApiKey.substring(0, 10)}...</code></span>`;
                    cloudflareStatus.classList.add('success');
                    return true;
                } else {
                    // No valid Cloudflare environment variable found
                    cloudflareStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>No API key found in Cloudflare environment variables. Please provide one manually.</span>';
                    cloudflareStatus.classList.add('error');
                    return false;
                }
            }
            
            // Check for saved configuration
            function initializeConfig() {
                // Load panel state from localStorage
                const savedPanelState = localStorage.getItem('panelsExpanded');
                if (savedPanelState !== null) {
                    panelsExpanded = savedPanelState === 'true';
                    if (!panelsExpanded) {
                        togglePanels();
                    }
                }
                
                const cloudflareResult = checkCloudflareEnv();
                
                // Check localStorage for model name
                const savedModel = localStorage.getItem('openrouter_model');
                if (savedModel) {
                    MODEL_NAME = savedModel;
                    modelInput.value = savedModel;
                    currentModelElement.textContent = savedModel;
                    typingModelElement.textContent = `${savedModel.split('/').pop()} is typing...`;
                }
                
                // Check localStorage for API key if Cloudflare didn't provide one
                const savedApiKey = localStorage.getItem('openrouter_api_key');
                if (savedApiKey) {
                    API_KEY = savedApiKey;
                    apiKeyInput.value = savedApiKey;
                    configStatus.innerHTML = `Configuration loaded from browser storage. Using model: <code>${MODEL_NAME}</code>`;
                    updateStatus('API key loaded', true);
                    return true;
                }
                
                // Load conversation history from localStorage if available
                const savedHistory = localStorage.getItem('conversation_history');
                if (savedHistory) {
                    try {
                        conversationHistory = JSON.parse(savedHistory);
                        // Re-render the conversation from history
                        renderConversationHistory();
                    } catch (e) {
                        console.error('Error loading conversation history:', e);
                        conversationHistory = [
                            {
                                role: 'system',
                                content: 'You are a helpful AI assistant. Format your responses using Markdown for better readability. Use code blocks for code snippets.'
                            }
                        ];
                    }
                }
                
                if (cloudflareResult) {
                    configStatus.innerHTML = `Configuration loaded from Cloudflare. Using model: <code>${MODEL_NAME}</code>`;
                    updateStatus('API key loaded', true);
                    return true;
                }
                
                configStatus.innerHTML = 'Please configure your API settings above';
                updateStatus('API key required', false);
                return false;
            }
            
            // Render conversation history
            function renderConversationHistory() {
                // Clear the chat container except for the first message
                while (chatContainer.children.length > 1) {
                    chatContainer.removeChild(chatContainer.lastChild);
                }
                
                // Add messages from history (skip system message)
                for (const message of conversationHistory) {
                    if (message.role === 'user') {
                        addMessage(message.content, 'user', false);
                    } else if (message.role === 'assistant') {
                        addMessage(message.content, 'ai', false);
                    }
                }
            }
            
            // Check if API key is available
            function checkApiKey() {
                if (!API_KEY) {
                    updateStatus('API key required', false);
                    addMessage('System: Please enter your OpenRouter API key to start chatting.', 'ai');
                    userInput.disabled = true;
                    sendButton.disabled = true;
                    return false;
                }
                
                updateStatus('API key loaded', true);
                userInput.disabled = false;
                sendButton.disabled = false;
                userInput.focus();
                return true;
            }
            
            // Update connection status UI
            function updateStatus(text, connected) {
                statusText.textContent = text;
                if (connected) {
                    statusDot.classList.add('connected');
                    statusDot.classList.remove('error');
                } else {
                    statusDot.classList.add('error');
                    statusDot.classList.remove('connected');
                }
            }
            
            // Add message to chat with markdown support
            function addMessage(text, sender, addToHistory = true) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.classList.add(sender + '-message');
                
                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                
                // Add sender icon
                const icon = document.createElement('i');
                icon.className = sender === 'ai' ? 'fas fa-robot' : 'fas fa-user';
                
                // Parse markdown if it's an AI message
                if (sender === 'ai') {
                    messageContent.innerHTML = marked.parse(text);
                } else {
                    messageContent.textContent = text;
                }
                
                messageElement.appendChild(icon);
                messageElement.appendChild(messageContent);
                
                // Add to chat container
                chatContainer.appendChild(messageElement);
                
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                // Highlight any code blocks in the message
                messageContent.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
                
                // Add to conversation history
                if (addToHistory) {
                    if (sender === 'user') {
                        conversationHistory.push({ role: 'user', content: text });
                    } else if (sender === 'ai') {
                        conversationHistory.push({ role: 'assistant', content: text });
                    }
                    
                    // Save conversation history to localStorage
                    localStorage.setItem('conversation_history', JSON.stringify(conversationHistory));
                }
            }
            
            // Show/hide typing indicator
            function setTyping(visible) {
                typingIndicator.classList.toggle('active', visible);
                if (visible) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }
            
            // Send message to API
            async function sendMessage() {
                const message = userInput.value.trim();
                if (!message) return;
                
                // Add user message to chat
                addMessage(message, 'user');
                userInput.value = '';
                sendButton.disabled = true;
                setTyping(true);
                
                try {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${API_KEY}`,
                            'HTTP-Referer': window.location.href,
                            'X-Title': 'DeepSeek Chat Interface'
                        },
                        body: JSON.stringify({
                            model: MODEL_NAME,
                            messages: conversationHistory
                        })
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error?.message || `API error: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    const aiResponse = data.choices[0].message.content;
                    
                    setTyping(false);
                    addMessage(aiResponse, 'ai');
                    updateStatus('Response received', true);
                } catch (error) {
                    setTyping(false);
                    addMessage(`Error: ${error.message}. Please check your API key and try again.`, 'ai');
                    updateStatus('API error', false);
                    console.error('Error:', error);
                }
                
                sendButton.disabled = false;
                userInput.focus();
            }
            
            // Save configuration
            function saveConfig() {
                const key = apiKeyInput.value.trim();
                const model = modelInput.value.trim();
                
                if (!key) {
                    alert('Please enter a valid API key');
                    return;
                }
                
                if (!model) {
                    alert('Please enter a model name');
                    return;
                }
                
                API_KEY = key;
                MODEL_NAME = model;
                
                localStorage.setItem('openrouter_api_key', key);
                localStorage.setItem('openrouter_model', model);
                
                currentModelElement.textContent = model;
                typingModelElement.textContent = `${model.split('/').pop()} is typing...`;
                configStatus.innerHTML = `Configuration saved. Using model: <code>${model}</code>`;
                
                // Update the status to show API key is loaded
                updateStatus('API key loaded', true);
                
                // Enable the chat input
                userInput.disabled = false;
                sendButton.disabled = false;
                userInput.focus();
                
                // Add a confirmation message
                addMessage('Configuration saved successfully. You can now start chatting!', 'ai');
            }
            
            // Clear chat history
            function clearChat() {
                if (confirm('Are you sure you want to clear the conversation history?')) {
                    conversationHistory = [
                        {
                            role: 'system',
                            content: 'You are a helpful AI assistant. Format your responses using Markdown for better readability. Use code blocks for code snippets.'
                        }
                    ];
                    
                    localStorage.removeItem('conversation_history');
                    
                    // Clear the chat container except for the first message
                    while (chatContainer.children.length > 1) {
                        chatContainer.removeChild(chatContainer.lastChild);
                    }
                    
                    addMessage('Conversation history has been cleared.', 'ai');
                }
            }
            
            // Event listeners
            sendButton.addEventListener('click', sendMessage);
            saveConfigButton.addEventListener('click', saveConfig);
            clearChatButton.addEventListener('click', clearChat);
            togglePanelsButton.addEventListener('click', togglePanels);
            savePdfButton.addEventListener('click', saveAsPDF);
            
            configPanelHeader.addEventListener('click', () => togglePanel(configPanelHeader, configPanelContent));
            infoPanelHeader.addEventListener('click', () => togglePanel(infoPanelHeader, infoPanelContent));
            
            userInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            apiKeyInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    saveConfig();
                }
            });
            
            modelInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    saveConfig();
                }
            });
            
            // Initialize the app
            initializeConfig();
            checkApiKey();
        });