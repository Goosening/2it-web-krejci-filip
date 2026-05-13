// Archimedes' Lab - Core Logic

// Simulation State
const state = {
    liquidDensity: 1000,
    objectType: 'duck',
    submersion: 0.5,
    objects: {
        duck: { name: 'Gumová kachnička', density: 200, emoji: '🦆', color: '#ffec33' },
        crown: { name: 'Zlatá koruna', density: 19300, emoji: '👑', color: '#ffd700' },
        cube: { name: 'Ocelová kostka', density: 7800, emoji: '🧊', color: '#a0a0a0' },
        wood: { name: 'Dřevěný špalek', density: 600, emoji: '🪵', color: '#8b4513' }
    },
    gravity: 10 // Simplification for kids (10 N/kg)
};

// DOM Elements
const tank = document.getElementById('tank');
const water = document.getElementById('water');
const simObject = document.getElementById('simulation-object');
const fVzDisplay = document.getElementById('fvz-display');
const fGDisplay = document.getElementById('fg-display');
const depthSlider = document.getElementById('depth-slider');
const depthVal = document.getElementById('depth-val');
const statusMsg = document.getElementById('status-msg');
const arrowUp = document.getElementById('arrow-up');
const arrowDown = document.getElementById('arrow-down');

// Event Listeners
document.getElementById('liquid-select').addEventListener('change', (e) => {
    state.liquidDensity = parseInt(e.target.value);
    updateSimulation();
});

document.getElementById('object-select').addEventListener('change', (e) => {
    state.objectType = e.target.value;
    updateSimulation();
});

depthSlider.addEventListener('input', (e) => {
    state.submersion = e.target.value / 100;
    depthVal.innerText = e.target.value;
    updateSimulation();
});

// Simulation Logic
function updateSimulation() {
    const obj = state.objects[state.objectType];
    const volume = 0.001; // Constant unit volume for simplicity 1dm^3
    
    // F_vz = V_ponorena * rho_kapalina * g
    // V_ponorena = volume * state.submersion
    const fVz = (volume * state.submersion) * state.liquidDensity * state.gravity;
    
    // F_g = m * g = (V * rho_objekt) * g
    const fG = (volume * obj.density) * state.gravity;
    
    // UI Updates
    fVzDisplay.innerText = fVz.toFixed(2);
    fGDisplay.innerText = fG.toFixed(2);
    
    // Object appearance
    simObject.innerText = obj.emoji;
    simObject.style.background = 'transparent';
    
    // Position Logic
    // Top position 0% is top of tank, 100% is bottom.
    // Water starts at 40% from top (height 60%).
    const waterTop = 40; 
    let finalPos = waterTop;

    if (fVz < fG) {
        // Sinks
        finalPos = 100 - 15; // Bottom
        statusMsg.innerText = "L + Ratio + Potápí se! ⚓";
        statusMsg.style.color = "#ef4444";
    } else if (fVz > fG) {
        // Floats
        finalPos = waterTop - (state.submersion * 10); // Slightly above water line
        statusMsg.innerText = "W Rizz + Plave! ✅";
        statusMsg.style.color = "#4ade80";
    } else {
        // Hovers
        finalPos = waterTop + 20;
        statusMsg.innerText = "Sigma Neutrality ✨";
        statusMsg.style.color = "#00f2ff";
    }
    
    // Smooth position update
    requestAnimationFrame(() => {
        simObject.style.top = finalPos + "%";
        arrowUp.style.height = (fVz * 2.5) + "px";
        arrowDown.style.height = (fG * 2.5) + "px";
        
        // Add a 'shake' if it sinks too fast
        if (fVz < fG * 0.5) {
            tank.classList.add('shake');
            setTimeout(() => tank.classList.remove('shake'), 500);
        }
    });
}

// Mini-Game Logic: Level 1
// Mini-Game State
let currentGameLevel = 1;
let selectedCrown = null;
let shipLoad = 0;
const maxShipLoad = 5;

function setupGame() {
    renderLevel();
}

function renderLevel() {
    const gameScreen = document.getElementById('game-screen');
    
    if (currentGameLevel === 1) {
        gameScreen.innerHTML = `
            <h3>Level 1: Najdi falešnou korunu!</h3>
            <p>Máš dvě koruny. Jedna je ze zlata a druhá je sus. Která vytlačí víc vody?</p>
            <div class="game-visual">
                <div class="crown-drop-zone">
                    <div class="crown" id="crown-1" onclick="selectCrown('crown-1')">👑 A</div>
                    <div class="crown" id="crown-2" onclick="selectCrown('crown-2')">👑 B</div>
                </div>
                <div class="beakers">
                    <div class="beaker"><div class="water-level" id="game-water"></div></div>
                </div>
            </div>
            <button class="btn-secondary" onclick="checkLevel1()">Ověřit výsledek</button>
        `;
    } else if (currentGameLevel === 2) {
        gameScreen.innerHTML = `
            <h3>Level 2: Cargo Sigma (Nalož loď)</h3>
            <p>Nalož loď bednami, aby měla co největší rizz, ale nepotopek ji! (Max 5 beden)</p>
            <div class="game-visual">
                <div class="ship-area">
                    <div class="ship-container">
                        <div class="game-ship" id="game-ship">🚢
                            <div class="cargo-display" id="cargo-count">📦 x 0</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-controls">
                <button class="btn-secondary" onclick="addCargo()">Přidat bednu 📦</button>
                <button class="btn-primary" onclick="checkLevel2()">Odeslat loď</button>
            </div>
        `;
    } else if (currentGameLevel === 3) {
        gameScreen.innerHTML = `
            <h3>Level 3: Submarine Rizz (Neutralita)</h3>
            <p>Uprav zátěž ponorky tak, aby se vznášela přesně v označený zóně!</p>
            <div class="game-visual">
                <div class="tank sub-tank">
                    <div class="target-zone">🎯 CÍL</div>
                    <div class="game-sub" id="game-sub">🚀</div>
                </div>
            </div>
            <div class="game-controls">
                <input type="range" id="sub-ballast" min="0" max="100" value="50" oninput="updateSub()">
                <p>Zátěž: <span id="ballast-val">50</span>%</p>
                <button class="btn-primary" onclick="checkLevel3()">Udržet hloubku</button>
            </div>
        `;
    }
}

function selectCrown(id) {
    selectedCrown = id;
    const crowns = document.querySelectorAll('.crown');
    crowns.forEach(c => c.style.borderColor = 'rgba(255, 255, 255, 0.1)');
    document.getElementById(id).style.borderColor = 'var(--primary)';
    
    const water = document.getElementById('game-water');
    water.style.height = (id === 'crown-2') ? "75%" : "60%";
}

function checkLevel1() {
    if (selectedCrown === 'crown-2') {
        winLevel("MEGA W SIGMA! Koruna B vytlačila víc vody (menší hustota). Jsi gigachad.");
    } else {
        alert("L + Ratio! Tahle vypadá legit. Zkus tu druhou.");
    }
}

function addCargo() {
    if (shipLoad < 7) {
        shipLoad++;
        const cargoDisplay = document.getElementById('cargo-count');
        const ship = document.getElementById('game-ship');
        
        if (cargoDisplay) cargoDisplay.innerText = `📦 x ${shipLoad}`;
        
        // Fix: Keep translateX(-50%) so ship stays centered!
        ship.style.transform = `translateX(-50%) translateY(${shipLoad * 15}px)`;
        
        if (shipLoad > 5) {
            ship.innerHTML = `💥💀 <div class="cargo-display" id="cargo-count">📦 x ${shipLoad}</div>`;
        }
    }
}

function checkLevel2() {
    if (shipLoad === 5) {
        winLevel("W SIGMA CARGO! Loď je naložená na max a nepotopila se. To je ten správnej balanc.");
    } else if (shipLoad > 5) {
        alert("L + Ratio + Potopil jsi to! Moc beden, kámo.");
        shipLoad = 0;
        renderLevel();
    } else {
        alert("Málo rizzu! Můžeš naložit víc beden (max 5).");
    }
}

let subDepth = 50;
function updateSub() {
    const val = document.getElementById('sub-ballast').value;
    document.getElementById('ballast-val').innerText = val;
    const sub = document.getElementById('game-sub');
    subDepth = val;
    sub.style.top = val + "%";
}

function checkLevel3() {
    if (subDepth >= 40 && subDepth <= 60) {
        winLevel("ULTIMATE SIGMA MOMENT! Ponorka má neutrální vztlak. Ovládl jsi fyziku, no cap.");
    } else {
        alert("Mimo zónu! Seřiď ten balanc, ty skibidi.");
    }
}

function winLevel(msg) {
    document.body.classList.add('flash-success');
    setTimeout(() => document.body.classList.remove('flash-success'), 1000);
    
    const gameScreen = document.getElementById('game-screen');
    gameScreen.innerHTML = `
        <h3 style="color: #4ade80">QUEST COMPLETED! 🏆</h3>
        <p>${msg}</p>
        <div class="confetti">✨✨✨</div>
        <button class="btn-primary" onclick="nextLevel()">Další Level</button>
    `;
}

function nextLevel() {
    currentGameLevel++;
    if (currentGameLevel > 3) currentGameLevel = 1;
    shipLoad = 0;
    selectedCrown = null;
    renderLevel();
}

// Initializing
window.onload = () => {
    updateSimulation();
    setupGame();
    console.log("Archimedes Lab Ready! 🌊");
};
