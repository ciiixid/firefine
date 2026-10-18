(function () {
    if (window.TelegramLiveChatLoaded) return;
    window.TelegramLiveChatLoaded = true;

    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const scriptSrc = currentScript ? currentScript.src : '';
    const scriptDomain = scriptSrc ? new URL(scriptSrc).origin : 'http://localhost:3000';

    let visitorToken = localStorage.getItem('tg_livechat_token');
    if (!visitorToken) {
        visitorToken = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('tg_livechat_token', visitorToken);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        #tg-chat-container {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
            z-index: 999999;
            position: fixed;
            bottom: 24px;
            right: 24px;
            -webkit-font-smoothing: antialiased;
        }
        #tg-chat-btn {
            background: rgba(29, 29, 31, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            color: white;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
        }
        #tg-chat-btn:hover {
            transform: scale(1.08);
            background: rgba(0, 0, 0, 0.95);
        }
        #tg-chat-box {
            position: absolute;
            bottom: 72px;
            right: 0;
            width: 370px;
            height: 500px;
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.6);
            animation: tgGlassFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes tgGlassFadeIn {
            from { opacity: 0; transform: translateY(12px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        #tg-chat-header {
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 16px 18px;
            font-weight: 600;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.4);
            color: #1d1d1f;
        }
        .tg-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .tg-avatar {
            width: 32px;
            height: 32px;
            background: rgba(0, 113, 227, 0.1);
            color: #0071e3;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid rgba(0, 113, 227, 0.2);
        }
        #tg-chat-close {
            cursor: pointer;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            color: #1d1d1f;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            font-size: 16px;
        }
        #tg-chat-close:hover {
            background: rgba(0, 0, 0, 0.1);
        }
        #tg-chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .tg-msg {
            max-width: 78%;
            padding: 11px 15px;
            border-radius: 16px;
            font-size: 13.5px;
            line-height: 1.45;
            word-wrap: break-word;
            box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }
        .tg-msg.user {
            background: linear-gradient(135deg, #0071e3 0%, #4599ff 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        .tg-msg.admin {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #1d1d1f;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
        #tg-chat-input-area {
            padding: 14px 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            display: flex;
            gap: 10px;
            align-items: center;
        }
        #tg-chat-input {
            flex: 1;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 18px;
            outline: none;
            font-size: 13.5px;
            color: #1d1d1f;
            transition: all 0.2s;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
        }
        #tg-chat-input:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: #0071e3;
            box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15), inset 0 1px 2px rgba(0,0,0,0.03);
        }
        #tg-chat-send {
            background: #0071e3;
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s, background 0.2s;
            box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
        }
        #tg-chat-send:hover {
            background: #0077ed;
            transform: scale(1.06);
        }
        #tg-chat-send svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'tg-chat-container';
    container.innerHTML = `
        <div id="tg-chat-box">
            <div id="tg-chat-header">
                <div class="tg-header-left">
                    <div class="tg-avatar">S</div>
                    <div>
                        <div style="font-size: 14px; font-weight: 600; line-height: 1.2;">Support</div>
                        <div style="font-size: 11px; color: #86868b; font-weight: 400; margin-top: 2px;">Powered by <b><a href="https://ciiix.github.io/showcase/firefine.html">Firefine</a></b></div>
                    </div>
                </div>
                <button id="tg-chat-close">&times;</button>
            </div>
            <div id="tg-chat-messages">
                <div class="tg-msg admin">Hello! Send us a message and our team will reply shortly.</div>
            </div>
            <div id="tg-chat-input-area">
                <input type="text" id="tg-chat-input" placeholder="Message..." />
                <button id="tg-chat-send">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
        <div id="tg-chat-btn" title="Open support chat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
    `;
    document.body.appendChild(container);

    const chatBtn = document.getElementById('tg-chat-btn');
    const chatBox = document.getElementById('tg-chat-box');
    const closeBtn = document.getElementById('tg-chat-close');
    const sendBtn = document.getElementById('tg-chat-send');
    const inputField = document.getElementById('tg-chat-input');
    const messagesContainer = document.getElementById('tg-chat-messages');

    let isOpen = false;
    let pollInterval = null;

    chatBtn.onclick = () => {
        isOpen = !isOpen;
        chatBox.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) {
            fetchMessages();
            pollInterval = setInterval(fetchMessages, 4000);
            scrollToBottom();
        } else {
            clearInterval(pollInterval);
        }
    };

    closeBtn.onclick = () => {
        isOpen = false;
        chatBox.style.display = 'none';
        clearInterval(pollInterval);
    };

    async function fetchMessages() {
        try {
            const response = await fetch(`${scriptDomain}/api/messages/${visitorToken}`);
            const result = await response.json();
            if (result.success && result.data) {
                renderMessages(result.data);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    }

    function renderMessages(messages) {
        messagesContainer.innerHTML = `<div class="tg-msg admin">Hello! Send us a message and our team will reply shortly.</div>`;
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `tg-msg ${msg.sender}`;
            msgDiv.textContent = msg.message;
            messagesContainer.appendChild(msgDiv);
        });
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        inputField.value = '';

        const tempDiv = document.createElement('div');
        tempDiv.className = `tg-msg user`;
        tempDiv.textContent = text;
        messagesContainer.appendChild(tempDiv);
        scrollToBottom();

        try {
            await fetch(`${scriptDomain}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitor_token: visitorToken, message: text })
            });
            fetchMessages();
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }

    sendBtn.onclick = sendMessage;
    inputField.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
})();