export function initCodeTerminal() {
  const terminalContent = document.getElementById('terminal-code-body');
  const tabButtons = document.querySelectorAll('.terminal-tab');

  if (!terminalContent) return;

  const codeSnippets = {
    security: `[00:14:02] INITIALIZING ZERO-TRUST HANDSHAKE...
[00:14:03] AUTH_KEY: 0x9F4A882E11... [ENCRYPTED SHA-256]
[00:14:03] VERIFYING QUANTUM-RESISTANT KEM KEYS... OK
[00:14:04] CYBER_FIREWALL: 0 MALICIOUS PACKETS DETECTED
[00:14:05] ACTIVE LATENCY: 4.2ms | EDGE NODES: 2,480
[00:14:06] SYSTEM STATE: SECURE // 100% ISOLATED`,

    ai: `import { RBSNeuralEngine } from '@rbs/core-ai';

const matrix = new RBSNeuralEngine({
  mode: 'autonomous_cyber_defense',
  precision: 'fp16',
  gpuCluster: 'us-east-cluster-09'
});

await matrix.deployRealTimeMonitor({
  autoMitigate: true,
  threatResponseTimeMs: 0.8
});

console.log("RBS AI MATRIX ACTIVE - SCANNING DATA STREAMS...");`,

    cloud: `cluster_config:
  region: multi-region-global
  auto_scaling:
    min_instances: 50
    max_instances: 10000
    target_cpu_utilization: 65%
  cyber_shield:
    ddos_mitigation: ACTIVE_L7
    encryption: AES-256-GCM
    zero_downtime_failover: true`
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('bg-purple-deep/40', 'border-purple-neon', 'text-white');
        b.classList.add('text-gray-400', 'border-transparent');
      });

      btn.classList.add('bg-purple-deep/40', 'border-purple-neon', 'text-white');
      btn.classList.remove('text-gray-400', 'border-transparent');

      const tabKey = btn.dataset.tab;
      if (codeSnippets[tabKey]) {
        animateTerminalText(terminalContent, codeSnippets[tabKey]);
      }
    });
  });

  // Typewriter line animation
  function animateTerminalText(container, text) {
    container.textContent = '';
    let i = 0;
    const speed = 12;

    function type() {
      if (i < text.length) {
        container.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Run initial animation
  animateTerminalText(terminalContent, codeSnippets.security);
}
