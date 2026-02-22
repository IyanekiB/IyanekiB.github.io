/* ============================================================
   projects.js — Project data registry + card renderer
   To add a new project: push an entry to PROJECTS and create
   the corresponding HTML page in /projects/.
   ============================================================ */

'use strict';

const PROJECTS = [
  {
    id: 'neura-glove',
    title: 'NEURA Glove',
    category: 'Senior Design · ML',
    date: 'Aug – Dec 2025',
    description: 'ML-powered smart glove achieving 21-point 3D hand pose reconstruction with ≤50ms latency using LSTM networks and Kalman filtering for Unity VR hand tracking.',
    tags: ['Python', 'LSTM', 'Kalman Filter', 'Unity VR', 'MediaPipe', 'IMU'],
    gradient: 'linear-gradient(135deg, #1a0533 0%, #4a2090 40%, #6c63ff 70%, #00d9ff 100%)',
    icon: '✋',
    href: 'projects/neura-glove.html',
  },
  {
    id: 'disease-prediction',
    title: 'Disease-Symptom Prediction',
    category: 'Machine Learning',
    date: 'Jun – Aug 2025',
    description: 'Multi-model ML pipeline benchmarking Random Forest, SVM, and MLP classifiers on symptom text data, achieving ≥99% accuracy with NLP preprocessing and 10-seed validation.',
    tags: ['Python', 'scikit-learn', 'Random Forest', 'NLP', 'NLTK', 'Pandas'],
    gradient: 'linear-gradient(135deg, #001a0d 0%, #005533 40%, #00aa66 75%, #00d9ff 100%)',
    icon: '🧬',
    href: 'projects/disease-prediction.html',
  },
  {
    id: 'train-simulation',
    title: 'Train System Simulation',
    category: 'Systems Software',
    date: 'Jan – Apr 2025',
    description: 'Full-scale rail system simulation with centralized traffic control, wayside signaling, and physics-based train motion using a real-time MVC architecture at 0.1-second control resolution.',
    tags: ['Python', 'PyQt', 'MVC', 'CTC', 'Real-Time Systems', 'Conda'],
    gradient: 'linear-gradient(135deg, #1a0e00 0%, #7a4500 40%, #c07000 75%, #ffd166 100%)',
    icon: '🚆',
    href: 'projects/train-simulation.html',
  },
  {
    id: 'civilization-replica',
    title: 'Java Civilization VI Replica',
    category: 'Software Engineering',
    date: 'Sept – Dec 2024',
    description: 'Modular Civilization-style strategy game with city, unit, and combat mechanics built using OOP and Extreme Programming, achieving 90%+ test coverage through Test-Driven Development.',
    tags: ['Java', 'JUnit', 'TDD', 'OOP', 'Gradle', 'Git'],
    gradient: 'linear-gradient(135deg, #1a0300 0%, #6b1500 40%, #b02000 75%, #ff5733 100%)',
    icon: '⚔️',
    href: 'projects/civilization-replica.html',
  },
  {
    id: 'mips-cpu',
    title: '32-bit MIPS CPU',
    category: 'Computer Architecture',
    date: 'Sept – Dec 2024',
    description: 'Multi-cycle 32-bit MIPS processor implemented in VHDL with FSM-based control, external memory interfacing, and validation via Tcl simulation and Zynq/BRAM C/C++ testing on FPGA.',
    tags: ['VHDL', 'Vivado', 'MIPS32', 'FSM', 'Zynq', 'C++'],
    gradient: 'linear-gradient(135deg, #00001a 0%, #001066 40%, #0033cc 75%, #6c63ff 100%)',
    icon: '💾',
    href: 'projects/mips-cpu.html',
  },
];

/**
 * Renders project cards into a container element.
 * @param {string} containerId — ID of the grid container
 * @param {string} base — base path prefix ('' or '../')
 */
function renderProjectCards(containerId, base = './') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = PROJECTS.map((p, i) => `
    <a class="project-card"
       href="${base}${p.href}"
       data-animate="fade-up"
       data-delay="${i + 1}"
       aria-label="${p.title} — ${p.category}">
      <div class="project-card-thumb"
           style="--card-gradient: ${p.gradient};"
           aria-hidden="true">
        <span class="project-card-icon">${p.icon}</span>
      </div>
      <div class="project-card-body">
        <div class="project-card-meta">
          <span class="project-card-category">${p.category}</span>
          <span class="project-card-date">${p.date}</span>
        </div>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-desc">${p.description}</p>
        <div class="project-card-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </a>
  `).join('');
}

// Auto-render if grid exists on page load
document.addEventListener('DOMContentLoaded', () => {
  const base = window.location.pathname.includes('/projects/') ? '../' : './';
  renderProjectCards('projects-grid', base);
});
