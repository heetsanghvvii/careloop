import http from 'node:http';
import { URL } from 'node:url';
import { WhatsAppBotEngine } from './whatsappBotEngine.js';

const PORT = process.env.PORT || 4000;
const botEngine = new WhatsAppBotEngine();

// Safe request body parsing with strict 64KB limit
const parseRawAndJsonBody = (req, maxBytes = 65536) => {
  return new Promise((resolve, reject) => {
    let rawBody = '';
    let bytesReceived = 0;
    
    req.on('data', chunk => {
      bytesReceived += chunk.length;
      if (bytesReceived > maxBytes) {
        req.destroy();
        reject(new Error(`Payload too large: exceeded ${maxBytes} bytes limit`));
        return;
      }
      rawBody += chunk.toString();
    });

    req.on('end', () => {
      try {
        const json = rawBody ? JSON.parse(rawBody) : {};
        resolve({ rawBody, json });
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
};

const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3005',
  'http://127.0.0.1:3005',
  'https://sheetsanghvvii.github.io',
  'https://careloop-health.web.app',
  'https://careloop-health.firebaseapp.com'
]);

if (process.env.ALLOWED_ORIGIN) {
  ALLOWED_ORIGINS.add(process.env.ALLOWED_ORIGIN);
}

const getCorsHeaders = (req) => {
  const origin = req?.headers?.origin;
  const isAllowed = !origin || ALLOWED_ORIGINS.has(origin) || process.env.NODE_ENV !== 'production';
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || 'http://localhost:3000') : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Hub-Signature-256',
    'Access-Control-Max-Age': '86400'
  };
};

const sendJson = (res, statusCode, data, req = null) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...getCorsHeaders(req)
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // Handle CORS Preflight with restricted origin validation
  if (req.method === 'OPTIONS') {
    res.writeHead(204, getCorsHeaders(req));
    res.end();
    return;
  }

  // 0. Landing Page & API Gateway Dashboard (Sanitized - No Plaintext Secrets)
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Careloop WhatsApp Gateway · Port 4000</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #FBFBFA;
      color: #18231C;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 760px;
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E8EAE7;
      border-radius: 20px;
      padding: 36px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #F0F2EF;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 44px;
      height: 44px;
      background: #2D6A4F;
      color: #FFF;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 18px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #18231C;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #6C7570;
    }
    .status-pill {
      background: #EBF7EE;
      color: #2D6A4F;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2D6A4F;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
    .cta-banner {
      background: #18231C;
      color: #FFF;
      border-radius: 14px;
      padding: 20px 24px;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .cta-banner h3 {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .cta-banner p {
      font-size: 13px;
      color: #A3B18A;
    }
    .cta-btn {
      background: #2D6A4F;
      color: #FFF;
      padding: 10px 20px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
      white-space: nowrap;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #2D6A4F;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      margin-top: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .card {
      background: #F8F9F7;
      border: 1px solid #E8EAE7;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .card-title {
      font-size: 12px;
      color: #6C7570;
      margin-bottom: 4px;
    }
    .card-value {
      font-size: 14px;
      font-weight: 600;
      color: #18231C;
    }
    .endpoints-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #F8F9F7;
      border: 1px solid #E8EAE7;
      border-radius: 10px;
      padding: 12px 16px;
    }
    .method-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      margin-right: 10px;
      display: inline-block;
    }
    .method-badge.get { background: #EBF7EE; color: #2D6A4F; }
    .method-badge.post { background: #E8F0FE; color: #1A73E8; }
    .endpoint-path {
      font-family: monospace;
      font-size: 13px;
      color: #18231C;
    }
    .test-link {
      font-size: 12px;
      color: #2D6A4F;
      font-weight: 600;
      text-decoration: none;
    }
    .interactive-tester {
      margin-top: 24px;
      background: #F4F6F3;
      border: 1px solid #DFE2DC;
      border-radius: 14px;
      padding: 20px;
    }
    .tester-row {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }
    .input-box {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #CCD2C9;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .btn-send {
      background: #2D6A4F;
      color: #FFF;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }
    .output-box {
      margin-top: 14px;
      background: #18231C;
      color: #D8F3DC;
      font-family: monospace;
      font-size: 12px;
      padding: 14px;
      border-radius: 8px;
      display: none;
      white-space: pre-wrap;
    }
    .chips {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .chip {
      background: #FFF;
      border: 1px solid #CCD2C9;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      color: #2D6A4F;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <div class="logo-badge">C</div>
        <div>
          <div class="brand-title">Careloop WhatsApp Engine</div>
          <div class="brand-subtitle">Meta Cloud API Webhook Gateway · Port 4000</div>
        </div>
      </div>
      <div class="status-pill">
        <div class="status-dot"></div>
        ONLINE & READY
      </div>
    </div>

    <!-- Redirection to Port 3000 -->
    <div class="cta-banner">
      <div>
        <h3>Looking for the Careloop Web Platform?</h3>
        <p>The Practitioner Dashboard, Marketing Site & Client Portal run on Port 3000.</p>
      </div>
      <a href="http://localhost:3000" class="cta-btn">Open Web App (Port 3000) →</a>
    </div>

    <!-- Gateway Specs (Sanitized) -->
    <div class="section-title">Gateway Specs</div>
    <div class="grid">
      <div class="card">
        <div class="card-title">Port Assignment</div>
        <div class="card-value">4000 (Backend / API)</div>
      </div>
      <div class="card">
        <div class="card-title">Meta Verify Token</div>
        <div class="card-value">Configured via META_VERIFY_TOKEN (Protected)</div>
      </div>
      <div class="card">
        <div class="card-title">Frontend App</div>
        <div class="card-value"><a href="http://localhost:3000" style="color:#2D6A4F; text-decoration:none;">http://localhost:3000</a></div>
      </div>
      <div class="card">
        <div class="card-title">Supported Commands</div>
        <div class="card-value">DONE, SKIP, HELP, STATUS</div>
      </div>
    </div>

    <!-- Endpoints List -->
    <div class="section-title">Active API Endpoints</div>
    <div class="endpoints-list">
      <div class="endpoint-item">
        <div>
          <span class="method-badge get">GET</span>
          <span class="endpoint-path">/api/health</span>
        </div>
        <a href="/api/health" target="_blank" class="test-link">Run Health Check ↗</a>
      </div>
      <div class="endpoint-item">
        <div>
          <span class="method-badge get">GET</span>
          <span class="endpoint-path">/api/bot/deeplink?phone=+919876543210</span>
        </div>
        <a href="/api/bot/deeplink?phone=+919876543210&name=Sarah%20Chen&program=Habit%20Reset&day=1" target="_blank" class="test-link">Generate wa.me Link ↗</a>
      </div>
      <div class="endpoint-item">
        <div>
          <span class="method-badge post">POST</span>
          <span class="endpoint-path">/api/webhook/whatsapp</span>
        </div>
        <span style="font-size:11px; color:#6C7570;">Meta Cloud Ingress (HMAC-SHA256 Protected)</span>
      </div>
      <div class="endpoint-item">
        <div>
          <span class="method-badge post">POST</span>
          <span class="endpoint-path">/api/bot/simulate</span>
        </div>
        <span style="font-size:11px; color:#6C7570;">Simulate Message Ingestion (₹0 Sandbox)</span>
      </div>
    </div>

    <!-- Live Test Console -->
    <div class="section-title">Test WhatsApp Bot Live</div>
    <div class="interactive-tester">
      <div style="font-size:13px; font-weight:600; color:#18231C;">Type a participant check-in command to test the engine:</div>
      <div class="tester-row">
        <input type="text" id="cmdInput" class="input-box" placeholder="Try DONE, SKIP, HELP, or STATUS..." value="DONE">
        <button onclick="testCommand()" class="btn-send">Send to Engine</button>
      </div>
      <div class="chips">
        <span style="font-size:11px; color:#6C7570; align-self:center;">Quick test:</span>
        <span class="chip" onclick="quickFill('DONE')">DONE</span>
        <span class="chip" onclick="quickFill('SKIP felt fatigued today')">SKIP</span>
        <span class="chip" onclick="quickFill('HELP knee pain during squats')">HELP</span>
        <span class="chip" onclick="quickFill('STATUS')">STATUS</span>
      </div>
      <div id="outputBox" class="output-box"></div>
    </div>
  </div>

  <script>
    function quickFill(text) {
      document.getElementById('cmdInput').value = text;
      testCommand();
    }

    async function testCommand() {
      const text = document.getElementById('cmdInput').value;
      const box = document.getElementById('outputBox');
      box.style.display = 'block';
      box.textContent = 'Processing through Careloop WhatsAppBotEngine...';
      try {
        const res = await fetch('/api/bot/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            participant: {
              name: 'Sarah Chen',
              phone: '+91 98765 00000',
              currentDay: 1,
              totalDays: 21,
              streakDays: 0
            }
          })
        });
        const data = await res.json();
        box.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        box.textContent = 'Error: ' + err.message;
      }
    }
  </script>
</body>
</html>`);
    return;
  }

  // 1. Health check
  if (pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, {
      status: 'healthy',
      service: 'Careloop WhatsApp Bot Server',
      version: '1.0.0',
      isLiveMetaConfigured: botEngine.isLive,
      timestamp: new Date().toISOString()
    }, req);
    return;
  }

  // 2. Meta WhatsApp Webhook Verification (GET)
  if (pathname === '/api/webhook/whatsapp' && req.method === 'GET') {
    const mode = reqUrl.searchParams.get('hub.mode');
    const token = reqUrl.searchParams.get('hub.verify_token');
    const challenge = reqUrl.searchParams.get('hub.challenge');

    const result = botEngine.verifyWebhook(mode, token, challenge);
    if (result.verified) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(result.challenge);
    } else {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden: Verification failed');
    }
    return;
  }

  // 3. Meta WhatsApp Incoming Webhook (POST with HMAC-SHA256 Signature Verification)
  if (pathname === '/api/webhook/whatsapp' && req.method === 'POST') {
    try {
      const { rawBody, json } = await parseRawAndJsonBody(req);
      
      const sigHeader = req.headers['x-hub-signature-256'];
      const sigVerification = await botEngine.verifyWebhookSignature(rawBody, sigHeader);
      
      if (!sigVerification.verified) {
        sendJson(res, 401, { error: 'Unauthorized: Meta signature verification failed', details: sigVerification.error }, req);
        return;
      }

      const result = await botEngine.processIncomingMessage(json);
      sendJson(res, 200, result, req);
    } catch (err) {
      sendJson(res, 400, { error: 'Invalid webhook payload', message: err.message }, req);
    }
    return;
  }

  // 4. Interactive Simulation Endpoint for Frontend UI (POST)
  // Strictly enforces simulateOnly: true so no real Meta messages can ever be dispatched
  if (pathname === '/api/bot/simulate' && req.method === 'POST') {
    try {
      const { json: body } = await parseRawAndJsonBody(req);
      const text = body.message || 'Done';
      const participant = body.participant || {
        name: 'Sarah Chen',
        phone: '+91 98765 43210',
        currentDay: 13,
        totalDays: 21,
        streakDays: 6,
        programTitle: '21-Day Habit & Metabolic Reset'
      };

      const syntheticPayload = {
        entry: [{
          changes: [{
            value: {
              contacts: [{ profile: { name: participant.name } }],
              messages: [{
                from: participant.phone,
                id: 'wamid.' + Date.now(),
                type: 'text',
                text: { body: text }
              }]
            }
          }]
        }]
      };

      const result = await botEngine.processIncomingMessage(syntheticPayload, { 
        participant,
        simulateOnly: true // Absolute guardrail
      });
      sendJson(res, 200, result, req);
    } catch (err) {
      sendJson(res, 500, { error: err.message }, req);
    }
    return;
  }

  // 5. Click-to-WhatsApp Deep Link Generator (GET)
  if (pathname === '/api/bot/deeplink' && req.method === 'GET') {
    const phone = reqUrl.searchParams.get('phone') || '+91 98765 43210';
    const name = reqUrl.searchParams.get('name') || 'Sarah Chen';
    const program = reqUrl.searchParams.get('program') || 'Habit Reset';
    const day = reqUrl.searchParams.get('day') || '1';

    const link = botEngine.generateClickToWhatsAppLink(phone, name, program, day, [
      'Morning Hydration',
      '20-min Sunlight Walk'
    ]);

    sendJson(res, 200, { link }, req);
    return;
  }

  // 404 Not Found
  sendJson(res, 404, { error: 'Not Found', path: pathname }, req);
});

server.listen(PORT, () => {
  console.log(`🤖 Careloop WhatsApp Bot Server listening on http://localhost:${PORT}`);
  console.log(`📡 Webhook URL endpoint: http://localhost:${PORT}/api/webhook/whatsapp`);
});
