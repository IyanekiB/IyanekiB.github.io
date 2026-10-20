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
    image: '/assets/images/NeuraGlove.jpg',
    imageDims: [1200, 1600],
    href: 'projects/neura-glove.html',
  },
  {
    id: 'disease-prediction',
    title: 'Disease-Symptom Prediction',
    category: 'Machine Learning',
    date: 'Jun – Aug 2025',
    description: 'Multi-model ML pipeline benchmarking Random Forest, SVM, and MLP classifiers on symptom text data, achieving ≥99% accuracy with NLP preprocessing and 10-seed validation.',
    tags: ['Python', 'scikit-learn', 'Random Forest', 'NLP', 'NLTK', 'Pandas'],
    image: '/assets/images/DiseasePred.jpg',
    imageDims: [600, 559],
    href: 'projects/disease-prediction.html',
  },
  {
    id: 'train-simulation',
    title: 'Train System Simulation',
    category: 'Systems Software',
    date: 'Jan – Apr 2025',
    description: 'Full-scale rail system simulation with centralized traffic control, wayside signaling, and physics-based train motion using a real-time MVC architecture at 0.1-second control resolution.',
    tags: ['Python', 'PyQt', 'MVC', 'CTC', 'Real-Time Systems', 'Conda'],
    image: '/assets/images/TrainModel.jpg',
    imageDims: [702, 678],
    href: 'projects/train-simulation.html',
  },
  {
    id: 'civilization-replica',
    title: 'Java Civilization VI Replica',
    category: 'Software Engineering',
    date: 'Sept – Dec 2024',
    description: 'Modular Civilization-style strategy game with city, unit, and combat mechanics built using OOP and Extreme Programming, achieving 90%+ test coverage through Test-Driven Development.',
    tags: ['Java', 'JUnit', 'TDD', 'OOP', 'Gradle', 'Git'],
    image: '/assets/images/SimCiv.jpg',
    imageDims: [633, 533],
    href: 'projects/civilization-replica.html',
  },
  {
    id: 'mips-cpu',
    title: '32-bit MIPS CPU',
    category: 'Computer Architecture',
    date: 'Sept – Dec 2024',
    description: 'Multi-cycle 32-bit MIPS processor implemented in VHDL with FSM-based control, external memory interfacing, and validation via Tcl simulation and Zynq/BRAM C/C++ testing on FPGA.',
    tags: ['VHDL', 'Vivado', 'MIPS32', 'FSM', 'Zynq', 'C++'],
    image: '/assets/images/MIPS32.jpg',
    imageDims: [1490, 446],
    href: 'projects/mips-cpu.html',
  },
];

/**
 * Renders projects as a loose scatter of real photographs.
 * @param {string} containerId — ID of the container
 * @param {string} base — base path prefix ('' or '../')
 */
function renderProjectCards(containerId, base = './') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const placements = ['a', 'b', 'c'];
  const remarkAfter = 1; // insert a short remark after the second project

  const cards = PROJECTS.map((p, i) => {
    const placement = placements[i % placements.length];
    const card = `
    <a class="work-item work-item-${placement}"
       href="${base}${p.href}"
       data-animate="fade-up"
       data-delay="${(i % 5) + 1}">
      <span class="work-item-name">${p.title} — ${p.category}, ${p.date}</span>
      <div class="work-item-figure">
        <img src="${p.image}" alt="${p.title}" width="${p.imageDims[0]}" height="${p.imageDims[1]}" loading="${i === 0 ? 'eager' : 'lazy'}">
      </div>
      <span class="work-item-desc">${p.description}</span>
    </a>`;

    if (i === remarkAfter) {
      return card + `
    <p class="work-remark" data-animate="fade-up">Five projects. One habit: open the box, see why it works, change it on purpose.</p>`;
    }
    return card;
  }).join('');

  container.innerHTML = cards;
}

// Auto-render if grid exists on page load
document.addEventListener('DOMContentLoaded', () => {
  const base = window.location.pathname.includes('/projects/') ? '../' : './';
  renderProjectCards('projects-grid', base);
});
