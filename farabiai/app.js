const chatMessages = document.getElementById('chatMessages');
const heroGreetingView = document.getElementById('heroGreetingView');
const bottomInputWrapper = document.getElementById('bottomInputWrapper');
const chatForm = document.getElementById('chatForm');
const heroForm = document.getElementById('heroForm');
const userInput = document.getElementById('userInput');
const heroInput = document.getElementById('heroInput');
const historyList = document.getElementById('historyList');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

// Model UI Elemanları
const modelBadge = document.getElementById('modelBadge');
const modelDropdownMenu = document.getElementById('modelDropdownMenu');
const activeModelTitle = document.getElementById('activeModelTitle');
const activeModelSub = document.getElementById('activeModelSub');
const sidebarTitle = document.getElementById('sidebarTitle');
const sidebarLogo = document.getElementById('sidebarLogo');
const heroLogoImg = document.getElementById('heroLogoImg');
const themeIcon = document.getElementById('themeIcon');

// Dify Model Tanımları ve Nginx Proxy Yolları (API Key'ler Nginx Tarafındadır)
const MODELS = {
  farabi: {
    id: "farabi",
    title: "Farabi AI",
    sub: "Beta",
    proxyBase: "/api/dify-farabi",
    logo: "https://btugecerken.com/farabiai-Photoroom.png",
    disclaimer: "Farabi AI (Beta) felsefe ve genel bilgi sistemidir, hata yapabilir."
  },
  btu: {
    id: "btu",
    title: "BTÜ Geçerken AI",
    sub: "V2.1",
    proxyBase: "/api/dify-btu",
    logo: "https://cdn1.site-media.eu/images/114/22934790/GeerkenLogo-Photoroom-82aMDiSMSNM52OeysD1XRQ-EgWrwxwoIVNv8WhyNw0qWA.png",
    disclaimer: "BTÜ Geçerken AI V2.1 kampüs ve topluluk asistanıdır, hata yapabilir."
  }
};

let activeModelKey = localStorage.getItem('farabi_selected_model') || 'farabi';
let selectedFile = null;

// ==========================================================================
// 1. TEMA YÖNETİMİ
// ==========================================================================
function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  } else {
    document.body.classList.remove('dark-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('farabi_theme', isDark ? 'dark' : 'light');
  if (themeIcon) {
    themeIcon.classList.toggle('fa-sun', isDark);
    themeIcon.classList.toggle('fa-moon', !isDark);
  }
}

const savedTheme = localStorage.getItem('farabi_theme');
applyTheme(savedTheme === 'dark');

// ==========================================================================
// 2. OTURUM YÖNETİMİ
// ==========================================================================
let sessions = JSON.parse(localStorage.getItem('farabi_chat_sessions') || '[]');
let currentSessionId = localStorage.getItem('farabi_active_session_id') || null;

function saveSessions() {
  localStorage.setItem('farabi_chat_sessions', JSON.stringify(sessions));
  localStorage.setItem('farabi_active_session_id', currentSessionId);
  renderSidebarHistory();
}

function getCurrentSession() {
  return sessions.find(s => s.id === currentSessionId);
}

function updateModelUI(modelKey) {
  const model = MODELS[modelKey];
  if (!model) return;

  activeModelTitle.textContent = model.title;
  activeModelSub.textContent = model.sub;
  sidebarTitle.textContent = model.title;
  
  if (sidebarLogo) sidebarLogo.src = model.logo;
  if (heroLogoImg) heroLogoImg.src = model.logo;

  const d1 = document.getElementById('aiDisclaimer1');
  const d2 = document.getElementById('aiDisclaimer2');
  if (d1) d1.textContent = model.disclaimer;
  if (d2) d2.textContent = model.disclaimer;

  document.getElementById('item-farabi')?.classList.toggle('active', modelKey === 'farabi');
  document.getElementById('item-btu')?.classList.toggle('active', modelKey === 'btu');
}

function selectModel(modelKey) {
  activeModelKey = modelKey;
  localStorage.setItem('farabi_selected_model', modelKey);
  updateModelUI(modelKey);
  closeModelDropdown();

  const session = getCurrentSession();
  if (session) {
    session.modelKey = modelKey;
    saveSessions();
  }
}

function toggleModelDropdown(e) {
  e.stopPropagation();
  const isOpen = modelDropdownMenu.classList.toggle('show');
  modelBadge.classList.toggle('open', isOpen);
}

function closeModelDropdown() {
  modelDropdownMenu.classList.remove('show');
  modelBadge.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!modelBadge.contains(e.target) && !modelDropdownMenu.contains(e.target)) {
    closeModelDropdown();
  }
});

// Sidebar İşlemleri
function openSidebar() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
  } else {
    sidebar.classList.remove('collapsed');
  }
}

function closeSidebar() {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  } else {
    sidebar.classList.add('collapsed');
  }
}

function toggleSidebar() {
  if (window.innerWidth <= 768) {
    const isOpen = sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active', isOpen);
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', toggleSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// Dosya Seçme / Yükleme
function triggerFileInput(target) {
  const fileInput = document.getElementById(`${target}FileInput`);
  if (fileInput) fileInput.click();
}

function handleFileSelected(event, target) {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile = file;

  const previewBar = document.getElementById(`${target}FilePreview`);
  const fileNameEl = document.getElementById(`${target}FileName`);
  if (previewBar && fileNameEl) {
    fileNameEl.textContent = file.name;
    previewBar.classList.remove('hidden');
  }
}

function clearSelectedFile(target) {
  selectedFile = null;
  const fileInput = document.getElementById(`${target}FileInput`);
  if (fileInput) fileInput.value = '';

  const previewBar = document.getElementById(`${target}FilePreview`);
  if (previewBar) previewBar.classList.add('hidden');
}

async function uploadFileToDify(file) {
  const currentModel = MODELS[activeModelKey] || MODELS.farabi;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user', currentSessionId || 'guest_user');

  // Nginx proxy üzerinden dosya yüklenir (Auth sunucuda basılır)
  const res = await fetch(`${currentModel.proxyBase}/files/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Dosya yüklenemedi: HTTP ${res.status}`);
  }

  const ext = file.name.split('.').pop().toLowerCase();
  let fileType = 'custom';

  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
  const audioExts = ['mp3', 'wav', 'm4a', 'amr', 'ogg'];
  const videoExts = ['mp4', 'mov', 'webm', 'mpeg'];
  const docExts = ['pdf', 'xlsx', 'xls', 'csv', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'md', 'html', 'json'];

  if (imageExts.includes(ext) || file.type.startsWith('image/')) {
    fileType = 'image';
  } else if (audioExts.includes(ext) || file.type.startsWith('audio/')) {
    fileType = 'audio';
  } else if (videoExts.includes(ext) || file.type.startsWith('video/')) {
    fileType = 'video';
  } else if (docExts.includes(ext) || file.type.startsWith('text/')) {
    fileType = 'document';
  }

  return {
    type: fileType,
    transfer_method: 'local_file',
    upload_file_id: data.id
  };
}

// Oturum Yönetimi
function createNewSession() {
  const newSession = {
    id: 'session_' + Date.now(),
    title: 'Yeni sohbet',
    modelKey: activeModelKey,
    conversations: {
      farabi: null,
      btu: null
    },
    messages: []
  };
  sessions.unshift(newSession);
  currentSessionId = newSession.id;
  saveSessions();
  loadCurrentSession();
  clearSelectedFile('hero');
  clearSelectedFile('chat');
  if (window.innerWidth <= 768) closeSidebar();
}

function switchSession(id) {
  currentSessionId = id;
  const sess = getCurrentSession();
  if (sess && sess.modelKey) {
    activeModelKey = sess.modelKey;
    updateModelUI(activeModelKey);
  }
  saveSessions();
  loadCurrentSession();
  clearSelectedFile('hero');
  clearSelectedFile('chat');
  if (window.innerWidth <= 768) closeSidebar();
}

function deleteSession(e, id) {
  e.stopPropagation();
  sessions = sessions.filter(s => s.id !== id);
  if (currentSessionId === id) {
    currentSessionId = sessions.length > 0 ? sessions[0].id : null;
  }
  if (!currentSessionId) {
    createNewSession();
    return;
  }
  saveSessions();
  loadCurrentSession();
}

function renderSidebarHistory() {
  historyList.innerHTML = '';
  sessions.forEach(sess => {
    const item = document.createElement('div');
    item.className = `history-item ${sess.id === currentSessionId ? 'active' : ''}`;
    item.onclick = () => switchSession(sess.id);

    const modelBadgeName = sess.modelKey === 'btu' ? 'BTÜ' : 'Farabi';

    item.innerHTML = `
      <span class="history-item-title"><i class="fa-regular fa-message" style="margin-right:6px; font-size:11px;"></i>[${modelBadgeName}] ${sess.title}</span>
      <button class="btn-del-history" title="Sil" onclick="deleteSession(event, '${sess.id}')">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    historyList.appendChild(item);
  });
}

function loadCurrentSession() {
  let session = getCurrentSession();
  if (!session) {
    createNewSession();
    return;
  }

  if (!session.conversations) {
    session.conversations = { farabi: null, btu: null };
  }

  if (session.modelKey) {
    activeModelKey = session.modelKey;
    updateModelUI(activeModelKey);
  }

  chatMessages.innerHTML = '';

  if (!session.messages || session.messages.length === 0) {
    heroGreetingView.classList.remove('hidden');
    chatMessages.classList.add('hidden');
    bottomInputWrapper.classList.add('hidden');
  } else {
    heroGreetingView.classList.add('hidden');
    chatMessages.classList.remove('hidden');
    bottomInputWrapper.classList.remove('hidden');
    session.messages.forEach((m, idx) => appendMessageUI(m.text, m.sender, m.fileName, idx));
  }
}

// ==========================================================================
// 3. SOHBETİ DIŞA AKTARMA (EXPORT TO MARKDOWN)
// ==========================================================================
window.exportCurrentChat = function() {
  const session = getCurrentSession();
  if (!session || !session.messages || session.messages.length === 0) {
    alert("Dışa aktarılacak mesaj bulunamadı.");
    return;
  }

  const model = MODELS[session.modelKey] || MODELS.farabi;
  let mdContent = `# Sohbet Kaydı: ${session.title}\n`;
  mdContent += `**Model:** ${model.title} (${model.sub})\n`;
  mdContent += `**Tarih:** ${new Date().toLocaleString('tr-TR')}\n\n---\n\n`;

  session.messages.forEach(m => {
    const senderName = m.sender === 'user' ? 'Kullanıcı' : model.title;
    mdContent += `### ${senderName}\n`;
    if (m.fileName) {
      mdContent += `📎 *Eklenen Dosya:* ${m.fileName}\n\n`;
    }
    mdContent += `${m.text}\n\n---\n\n`;
  });

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.title.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ_-]/g, '_')}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ==========================================================================
// 4. DIFY İLE OTOMATİK AKILLI BAŞLIK ÜRETİCİ
// ==========================================================================
async function generateSmartTitle(sessionId, userMessage) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session || !userMessage) return;

  const currentModel = MODELS[session.modelKey] || MODELS.farabi;
  const prompt = `Aşağıdaki kullanıcı mesajına göre sohbet geçmişi için en fazla 3-4 kelimelik, net, noktalama işareti ve tırnak içermeyen kısa bir konu başlığı yaz. Sadece başlığı ver:\n"${userMessage}"`;

  try {
    const res = await fetch(`${currentModel.proxyBase}/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: {},
        query: prompt,
        response_mode: "blocking",
        user: "title_generator"
      })
    });

    if (res.ok) {
      const data = await res.json();
      let title = data.answer ? data.answer.trim().replace(/^["']|["']$/g, '') : '';
      if (title && title.length < 35) {
        session.title = title;
        saveSessions();
      }
    }
  } catch (err) {
    console.warn("Akıllı başlık üretimi başarısız:", err);
  }
}

// ==========================================================================
// 5. MARKDOWN, KOD BLOKLARI VE AKSİYON ARAÇ ÇUBUĞU
// ==========================================================================
function formatMarkdownWithCode(text) {
  if (!text) return "";

  let formatted = text.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang.trim() || 'kod';
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return `
      <div class="code-block-container">
        <div class="code-block-header">
          <span><i class="fa-solid fa-code" style="margin-right:5px;"></i>${language}</span>
          <button class="btn-copy-code" onclick="copyCodeBlock(this)">
            <i class="fa-regular fa-copy"></i> Kopyala
          </button>
        </div>
        <pre class="code-block-content"><code>${escapedCode}</code></pre>
      </div>
    `;
  });

  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  formatted = formatted
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  return formatted;
}

window.copyCodeBlock = function(btn) {
  const codeEl = btn.closest('.code-block-container').querySelector('pre code');
  if (!codeEl) return;

  const rawText = codeEl.innerText;
  navigator.clipboard.writeText(rawText).then(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Kopyalandı!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-copy"></i> Kopyala';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error("Panoya kopyalama başarısız:", err);
  });
};

function createMsgActionsToolbar(messageIndex) {
  const toolbar = document.createElement('div');
  toolbar.className = 'msg-actions-toolbar';

  toolbar.innerHTML = `
    <button class="msg-action-btn" title="Beğen" onclick="handleFeedback(this, 'like')">
      <i class="fa-regular fa-thumbs-up"></i>
    </button>
    <button class="msg-action-btn" title="Beğenme" onclick="handleFeedback(this, 'dislike')">
      <i class="fa-regular fa-thumbs-down"></i>
    </button>
    <button class="msg-action-btn" title="Yeniden Yanıtla" onclick="reanswerMessage(${messageIndex})">
      <i class="fa-solid fa-arrows-rotate"></i>
    </button>
    <button class="msg-action-btn" title="Tümünü Kopyala" onclick="copyEntireMessage(this)">
      <i class="fa-regular fa-copy"></i>
    </button>
    <button class="msg-action-btn" title="Paylaş" onclick="shareMessage(this)">
      <i class="fa-solid fa-arrow-up-right-from-square"></i>
    </button>
  `;

  return toolbar;
}

window.handleFeedback = function(btn, type) {
  const parent = btn.parentElement;
  const likeBtn = parent.querySelector('button[title="Beğen"]');
  const dislikeBtn = parent.querySelector('button[title="Beğenme"]');

  if (type === 'like') {
    const isAlreadyLiked = likeBtn.classList.contains('active-like');
    likeBtn.classList.toggle('active-like', !isAlreadyLiked);
    dislikeBtn.classList.remove('active-dislike');
  } else {
    const isAlreadyDisliked = dislikeBtn.classList.contains('active-dislike');
    dislikeBtn.classList.toggle('active-dislike', !isAlreadyDisliked);
    likeBtn.classList.remove('active-like');
  }
};

window.copyEntireMessage = function(btn) {
  const msgDiv = btn.closest('.msg-bot');
  if (!msgDiv) return;

  const textClone = msgDiv.cloneNode(true);
  const tb = textClone.querySelector('.msg-actions-toolbar');
  if (tb) tb.remove();

  navigator.clipboard.writeText(textClone.innerText.trim()).then(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      btn.classList.remove('copied');
    }, 2000);
  });
};

window.shareMessage = function(btn) {
  const msgDiv = btn.closest('.msg-bot');
  if (!msgDiv) return;

  const textClone = msgDiv.cloneNode(true);
  const tb = textClone.querySelector('.msg-actions-toolbar');
  if (tb) tb.remove();
  const textToShare = textClone.innerText.trim();

  if (navigator.share) {
    navigator.share({
      title: 'Farabi AI Yanıtı',
      text: textToShare,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(textToShare).then(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
      }, 2000);
    });
  }
};

window.reanswerMessage = function(targetIndex) {
  const session = getCurrentSession();
  if (!session || !session.messages) return;

  let lastUserMsg = null;
  for (let i = targetIndex - 1; i >= 0; i--) {
    if (session.messages[i] && session.messages[i].sender === 'user') {
      lastUserMsg = session.messages[i].text;
      break;
    }
  }

  if (lastUserMsg) {
    handleSendMessage(lastUserMsg, 'chat');
  }
};

// ==========================================================================
// 6. STREAMING API İSTEĞİ
// ==========================================================================
async function askAIStream(prompt, filePayload, onChunk, retryWithoutConv = false) {
  const session = getCurrentSession();
  const currentModel = MODELS[activeModelKey] || MODELS.farabi;

  if (!session.conversations) {
    session.conversations = { farabi: null, btu: null };
  }

  const convId = retryWithoutConv ? null : session.conversations[activeModelKey];

  const payload = {
    inputs: {},
    query: prompt,
    response_mode: "streaming",
    user: currentSessionId || "guest_user",
    files: filePayload ? [filePayload] : []
  };

  if (convId) {
    payload.conversation_id = convId;
  }

  // İstek Nginx proxy endpoint'ine gider (Authorization Nginx tarafından eklenir)
  const response = await fetch(`${currentModel.proxyBase}/chat-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData.message || `HTTP ${response.status}`;

    if (errMsg.includes("Conversation Not Exists") && !retryWithoutConv) {
      session.conversations[activeModelKey] = null;
      saveSessions();
      return await askAIStream(prompt, filePayload, onChunk, true);
    }

    throw new Error(errMsg);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullAnswer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const json = JSON.parse(line.slice(6));
          if (json.event === "message" || json.event === "agent_message") {
            fullAnswer += json.answer || "";
            onChunk(fullAnswer);
          }
          if (json.conversation_id && session) {
            session.conversations[activeModelKey] = json.conversation_id;
            saveSessions();
          }
        } catch (e) {
          // Parçalı verileri yut
        }
      }
    }
  }

  return fullAnswer;
}

function appendMessageUI(text, sender, fileName = null, msgIndex = null) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender === 'user' ? 'msg-user' : 'msg-bot'}`;

  let fileHtml = '';
  if (fileName) {
    fileHtml = `<div class="msg-file-badge"><i class="fa-solid fa-paperclip"></i> ${fileName}</div>`;
  }

  msgDiv.innerHTML = fileHtml + formatMarkdownWithCode(text);

  if (sender === 'bot') {
    const session = getCurrentSession();
    const index = msgIndex !== null ? msgIndex : (session?.messages?.length || 0);
    msgDiv.appendChild(createMsgActionsToolbar(index));
  }

  chatMessages.appendChild(msgDiv);

  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 30);
}

function addMessageToCurrentSession(text, sender, fileName = null) {
  heroGreetingView.classList.add('hidden');
  chatMessages.classList.remove('hidden');
  bottomInputWrapper.classList.remove('hidden');

  const session = getCurrentSession();
  const nextIndex = session ? session.messages.length : 0;
  
  appendMessageUI(text, sender, fileName, nextIndex);
  
  if (session) {
    session.messages.push({ text, sender, fileName });
    if (sender === 'user' && session.title === 'Yeni sohbet') {
      session.title = (fileName ? `[Dosya] ` : '') + text.slice(0, 20) + (text.length > 20 ? '...' : '');
      generateSmartTitle(session.id, text);
    }
    saveSessions();
  }
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'msg msg-bot';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(typingDiv);
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 30);
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function handleSendMessage(message, target = 'chat') {
  if (!message.trim() && !selectedFile) return;

  const currentFile = selectedFile;
  const fileName = currentFile ? currentFile.name : null;

  addMessageToCurrentSession(message || (fileName ? `${fileName} gönderildi.` : ''), 'user', fileName);

  if (userInput) {
    userInput.value = '';
    userInput.style.height = 'auto';
  }
  if (heroInput) {
    heroInput.value = '';
    heroInput.style.height = 'auto';
  }
  clearSelectedFile(target);

  showTypingIndicator();

  try {
    let filePayload = null;
    if (currentFile) {
      filePayload = await uploadFileToDify(currentFile);
    }

    let botMsgDiv = null;

    const botReply = await askAIStream(
      message || "Bu dosyayı analiz eder misin?", 
      filePayload, 
      (currentText) => {
        if (!botMsgDiv) {
          removeTypingIndicator();
          botMsgDiv = document.createElement('div');
          botMsgDiv.className = 'msg msg-bot';
          chatMessages.appendChild(botMsgDiv);
        }

        botMsgDiv.innerHTML = formatMarkdownWithCode(currentText);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    );

    removeTypingIndicator();

    const session = getCurrentSession();
    if (session) {
      const msgIndex = session.messages.length;
      session.messages.push({ text: botReply, sender: 'bot' });
      saveSessions();

      if (botMsgDiv) {
        botMsgDiv.appendChild(createMsgActionsToolbar(msgIndex));
      }
    }
  } catch (err) {
    console.error("Model Hatası:", err);
    removeTypingIndicator();
    addMessageToCurrentSession(`⚠️ Hata: ${err.message}`, 'bot');
  }
}

// ==========================================================================
// 7. TEXTAREA AUTO-GROW VE SHIFT+ENTER DİNLENMESİ
// ==========================================================================
function setupTextarea(textareaEl, formEl, target) {
  if (!textareaEl) return;

  textareaEl.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 160) + 'px';
  });

  textareaEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(this.value, target);
    }
  });

  if (formEl) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage(textareaEl.value, target);
    });
  }
}

setupTextarea(heroInput, heroForm, 'hero');
setupTextarea(userInput, chatForm, 'chat');

// Başlangıç
updateModelUI(activeModelKey);

if (!sessions || sessions.length === 0) {
  createNewSession();
} else {
  if (!currentSessionId) currentSessionId = sessions[0].id;
  renderSidebarHistory();
  loadCurrentSession();
}