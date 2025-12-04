// Frontend chat logic for Prateek AI
const API_BASE = 'https://prateek-ai-bpe1.vercel.app'; // <<-- your Vercel production domain (no trailing slash necessary)
const chatEl = document.getElementById('chat');
const form = document.getElementById('composer');
const input = document.getElementById('prompt');
const modelSelect = document.getElementById('model-select');

function appendMessage(text, role='bot'){
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
  // simple line breaks support
  div.innerHTML = text.replace(/\n/g, '<br/>');
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function setLoading(loading){
  if(loading){
    const n = document.createElement('div');
    n.className = 'msg bot';
    n.id = '__loading';
    n.textContent = 'Thinking...';
    chatEl.appendChild(n);
    chatEl.scrollTop = chatEl.scrollHeight;
  } else {
    const el = document.getElementById('__loading');
    if(el) el.remove();
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if(!prompt) return;
  appendMessage(prompt, 'user');
  input.value = '';
  setLoading(true);
  try{
    const model = modelSelect.value;
    const res = await fetch(API_BASE + '/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ prompt, model })
    });
    setLoading(false);
    if(!res.ok){
      const text = await res.text();
      appendMessage('Error: ' + (text || res.statusText));
      return;
    }
    const data = await res.json();
    if(data?.message) appendMessage(data.message, 'bot');
    else appendMessage('No response from server', 'bot');
  }catch(err){
    setLoading(false);
    appendMessage('Request failed: ' + err.message, 'bot');
  }
});

// welcome
appendMessage('Hi — I am Prateek AI. Ask anything about Maths, Physics, or programming!', 'bot');
