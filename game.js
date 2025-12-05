/**
 * Factory Simulator - Modular Game Engine
 * =========================================
 * All game content defined in CONFIG - easy to expand!
 */

// ============================================================
// CONFIGURATION - Edit to customize the game
// ============================================================

const CONFIG = {
    settings: {
        startingBalance: 1000,
        startingStorage: 100,
        autoSaveInterval: 30000,
        productionTickRate: 1000,
        priceUpdateInterval: 5000
    },

    itemCategories: {
        raw: { name: 'Raw Materials', icon: '🪨', color: '#a3a3a3' },
        processed: { name: 'Processed', icon: '🔩', color: '#60a5fa' },
        advanced: { name: 'Advanced', icon: '⚙️', color: '#a78bfa' },
        finished: { name: 'Finished Goods', icon: '📦', color: '#4ade80' }
    },

    items: {
        rawSteel: {
            name: 'Raw Steel', icon: '🔘', category: 'raw',
            description: 'Unprocessed steel ingots', stackSize: 100
        },
        rawCopper: {
            name: 'Raw Copper', icon: '🟠', category: 'raw',
            description: 'Unprocessed copper ore', stackSize: 100
        },
        steelPlates: {
            name: 'Steel Plates', icon: '🔩', category: 'processed',
            description: 'Pressed steel plates', stackSize: 50,
            sellable: true, basePrice: 15, priceVolatility: 0.1
        },
        copperWire: {
            name: 'Copper Wire', icon: '〰️', category: 'processed',
            description: 'Thin copper wiring', stackSize: 100,
            sellable: true, basePrice: 12, priceVolatility: 0.08
        },
        steelGears: {
            name: 'Steel Gears', icon: '⚙️', category: 'processed',
            description: 'Precision machined gears', stackSize: 50,
            sellable: true, basePrice: 25, priceVolatility: 0.12
        },
        circuits: {
            name: 'Circuits', icon: '🔌', category: 'advanced',
            description: 'Basic electronic circuits', stackSize: 25,
            sellable: true, basePrice: 45, priceVolatility: 0.15
        },
        motors: {
            name: 'Motors', icon: '🔄', category: 'advanced',
            description: 'Electric motors', stackSize: 25,
            sellable: true, basePrice: 60, priceVolatility: 0.12
        },
        steelTools: {
            name: 'Steel Tools', icon: '🔧', category: 'finished',
            description: 'High-quality steel tools', stackSize: 20,
            sellable: true, basePrice: 80, priceVolatility: 0.1
        },
        machines: {
            name: 'Machines', icon: '🏭', category: 'finished',
            description: 'Industrial machinery', stackSize: 10,
            sellable: true, basePrice: 150, priceVolatility: 0.2
        }
    },

    machineCategories: {
        generator: { name: 'Generators', icon: '⚡', description: 'Produce raw materials' },
        processor: { name: 'Processors', icon: '🔧', description: 'Convert raw materials' },
        assembler: { name: 'Assemblers', icon: '🏭', description: 'Combine components' }
    },

    machines: {
        steelGenerator: {
            name: 'Steel Generator', icon: '⛏️', category: 'generator',
            description: 'Extracts raw steel', tier: 1,
            inputs: [], outputs: [{ item: 'rawSteel', amount: 1 }],
            craftTime: 1.0, baseCost: 100, costScaling: 1.15, unlocked: true
        },
        copperGenerator: {
            name: 'Copper Extractor', icon: '🟤', category: 'generator',
            description: 'Extracts raw copper', tier: 1,
            inputs: [], outputs: [{ item: 'rawCopper', amount: 1 }],
            craftTime: 1.2, baseCost: 120, costScaling: 1.15, unlocked: true
        },
        platePress: {
            name: 'Plate Press', icon: '🔩', category: 'processor',
            description: 'Presses steel into plates', tier: 1,
            inputs: [{ item: 'rawSteel', amount: 2 }],
            outputs: [{ item: 'steelPlates', amount: 1 }],
            craftTime: 2.0, baseCost: 150, costScaling: 1.15, unlocked: true
        },
        wireDrawer: {
            name: 'Wire Drawer', icon: '〰️', category: 'processor',
            description: 'Draws copper into wire', tier: 1,
            inputs: [{ item: 'rawCopper', amount: 1 }],
            outputs: [{ item: 'copperWire', amount: 2 }],
            craftTime: 1.5, baseCost: 130, costScaling: 1.15, unlocked: true
        },
        gearCutter: {
            name: 'Gear Cutter', icon: '⚙️', category: 'processor',
            description: 'Cuts precision gears', tier: 2,
            inputs: [{ item: 'rawSteel', amount: 3 }],
            outputs: [{ item: 'steelGears', amount: 1 }],
            craftTime: 3.0, baseCost: 200, costScaling: 1.18, unlocked: true
        },
        circuitAssembler: {
            name: 'Circuit Assembler', icon: '🔌', category: 'assembler',
            description: 'Assembles circuits', tier: 2,
            inputs: [{ item: 'copperWire', amount: 3 }, { item: 'steelPlates', amount: 1 }],
            outputs: [{ item: 'circuits', amount: 1 }],
            craftTime: 4.0, baseCost: 350, costScaling: 1.2, unlocked: true
        },
        motorFactory: {
            name: 'Motor Factory', icon: '🔄', category: 'assembler',
            description: 'Assembles motors', tier: 2,
            inputs: [{ item: 'steelGears', amount: 2 }, { item: 'copperWire', amount: 2 }],
            outputs: [{ item: 'motors', amount: 1 }],
            craftTime: 5.0, baseCost: 400, costScaling: 1.2, unlocked: true
        },
        toolWorkshop: {
            name: 'Tool Workshop', icon: '🔧', category: 'assembler',
            description: 'Crafts tools', tier: 3,
            inputs: [{ item: 'steelPlates', amount: 2 }, { item: 'steelGears', amount: 1 }],
            outputs: [{ item: 'steelTools', amount: 1 }],
            craftTime: 4.0, baseCost: 500, costScaling: 1.22, unlocked: true
        },
        machineAssembler: {
            name: 'Machine Assembler', icon: '🏭', category: 'assembler',
            description: 'Assembles industrial machinery', tier: 3,
            inputs: [{ item: 'motors', amount: 1 }, { item: 'circuits', amount: 2 }, { item: 'steelPlates', amount: 4 }],
            outputs: [{ item: 'machines', amount: 1 }],
            craftTime: 10.0, baseCost: 1000, costScaling: 1.25, unlocked: true
        }
    },

    warehouses: {
        baseSlots: 10,
        baseCost: 500,
        costScaling: 2.0,
        maxWarehouses: 10,
        slotUpgradeCost: 250,
        slotUpgradeAmount: 5,
        storageUpgradeCost: 200,
        storageUpgradeAmount: 50
    }
};

// ============================================================
// GAME STATE
// ============================================================

let machineIdCounter = 0;
let warehouseIdCounter = 1;
let currentTab = 'warehouses';
let currentWarehouseId = 0;
let currentShopCategory = 'machines';
let recipeFilter = 'all';
const activityLog = [];

const gameState = {
    balance: CONFIG.settings.startingBalance,
    maxStorage: CONFIG.settings.startingStorage,
    inventory: {},
    warehouses: [{
        id: 0, name: 'Main Warehouse', level: 1,
        maxSlots: CONFIG.warehouses.baseSlots, machines: []
    }],
    machineCounts: {},
    prices: {},
    stats: { itemsProduced: 0, itemsSold: 0, moneyEarned: 0, machinesBought: 0 }
};

// Initialize inventory and prices
Object.keys(CONFIG.items).forEach(id => {
    gameState.inventory[id] = 0;
    gameState.machineCounts[id] = 0;
    const item = CONFIG.items[id];
    if (item.sellable) {
        gameState.prices[id] = { base: item.basePrice, current: item.basePrice, trend: 0 };
    }
});
Object.keys(CONFIG.machines).forEach(id => { gameState.machineCounts[id] = 0; });

// ============================================================
// SAVE / LOAD
// ============================================================

const SAVE_KEY = 'factoryGameSave_v3';

function saveGame() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
            version: 3, timestamp: Date.now(), machineIdCounter, warehouseIdCounter,
            state: gameState
        }));
        return true;
    } catch (e) { console.error('Save failed:', e); return false; }
}

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return false;
        const data = JSON.parse(saved);
        if (data.version !== 3) return false;
        machineIdCounter = data.machineIdCounter || 0;
        warehouseIdCounter = data.warehouseIdCounter || 1;
        Object.assign(gameState, data.state);
        return true;
    } catch (e) { console.error('Load failed:', e); return false; }
}

function resetGame() {
    if (confirm('Reset all progress?')) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// ============================================================
// UTILITIES
// ============================================================

function formatMoney(n) {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + Math.floor(n);
}

function formatNumber(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
}

function getItem(id) { return CONFIG.items[id]; }
function getMachine(id) { return CONFIG.machines[id]; }
function getWarehouse(id) { return gameState.warehouses.find(w => w.id === id); }
function getTotalItems() { return Object.values(gameState.inventory).reduce((a, b) => a + b, 0); }
function getStoragePercent() { return Math.round((getTotalItems() / gameState.maxStorage) * 100); }
function canAfford(amount) { return gameState.balance >= amount; }
function hasStorage(amount = 1) { return getTotalItems() + amount <= gameState.maxStorage; }
function hasItems(id, amount) { return (gameState.inventory[id] || 0) >= amount; }
function getAllMachines() { return gameState.warehouses.flatMap(w => w.machines); }
function getUsedSlots(whId) { const w = getWarehouse(whId); return w ? w.machines.length : 0; }

function getMachineCost(machineId) {
    const m = getMachine(machineId);
    if (!m) return Infinity;
    return Math.floor(m.baseCost * Math.pow(m.costScaling, gameState.machineCounts[machineId] || 0));
}

function getWarehouseCost() {
    return Math.floor(CONFIG.warehouses.baseCost * Math.pow(CONFIG.warehouses.costScaling, gameState.warehouses.length));
}

function addActivity(msg) {
    activityLog.unshift({ time: new Date(), message: msg });
    if (activityLog.length > 100) activityLog.pop();
    renderActivityLog();
}

function showNotification(msg, type = 'info') {
    const old = document.querySelector('.notification');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = `notification ${type} show`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}

// ============================================================
// GAME ACTIONS
// ============================================================

function buyWarehouse() {
    const cost = getWarehouseCost();
    if (gameState.warehouses.length >= CONFIG.warehouses.maxWarehouses) {
        showNotification('Max warehouses!', 'error'); return false;
    }
    if (!canAfford(cost)) { showNotification('Not enough money!', 'error'); return false; }
    
    gameState.balance -= cost;
    gameState.warehouses.push({
        id: warehouseIdCounter++,
        name: `Warehouse ${gameState.warehouses.length + 1}`,
        level: 1, maxSlots: CONFIG.warehouses.baseSlots, machines: []
    });
    addActivity('Bought new warehouse');
    showNotification('Warehouse purchased!', 'success');
    renderAll();
    return true;
}

function buyMachine(machineId, whId) {
    const machine = getMachine(machineId);
    const warehouse = getWarehouse(whId);
    if (!machine || !warehouse) return false;
    
    const cost = getMachineCost(machineId);
    if (!canAfford(cost)) { showNotification('Not enough money!', 'error'); return false; }
    if (getUsedSlots(whId) >= warehouse.maxSlots) { showNotification('No slots!', 'error'); return false; }
    
    gameState.balance -= cost;
    gameState.machineCounts[machineId]++;
    gameState.stats.machinesBought++;
    warehouse.machines.push({ id: machineIdCounter++, definitionId: machineId, progress: 0 });
    
    addActivity(`Bought ${machine.name}`);
    showNotification(`${machine.name} purchased!`, 'success');
    renderAll();
    return true;
}

function sellMachine(instanceId, whId) {
    const warehouse = getWarehouse(whId);
    if (!warehouse) return false;
    const idx = warehouse.machines.findIndex(m => m.id === instanceId);
    if (idx === -1) return false;
    
    const machine = warehouse.machines[idx];
    const def = getMachine(machine.definitionId);
    const refund = Math.floor(getMachineCost(machine.definitionId) * 0.5);
    
    warehouse.machines.splice(idx, 1);
    gameState.machineCounts[machine.definitionId]--;
    gameState.balance += refund;
    
    addActivity(`Sold ${def.name} for ${formatMoney(refund)}`);
    showNotification(`Sold for ${formatMoney(refund)}`, 'success');
    renderAll();
    return true;
}

function upgradeSlots(whId) {
    const warehouse = getWarehouse(whId);
    if (!warehouse) return false;
    const cost = CONFIG.warehouses.slotUpgradeCost * warehouse.level;
    if (!canAfford(cost)) { showNotification('Not enough money!', 'error'); return false; }
    
    gameState.balance -= cost;
    warehouse.maxSlots += CONFIG.warehouses.slotUpgradeAmount;
    warehouse.level++;
    addActivity('Upgraded warehouse slots');
    showNotification('Slots upgraded!', 'success');
    renderAll();
    return true;
}

function upgradeStorage() {
    const cost = CONFIG.warehouses.storageUpgradeCost;
    if (!canAfford(cost)) { showNotification('Not enough money!', 'error'); return false; }
    
    gameState.balance -= cost;
    gameState.maxStorage += CONFIG.warehouses.storageUpgradeAmount;
    addActivity('Upgraded storage');
    showNotification('Storage upgraded!', 'success');
    renderAll();
    return true;
}

function sellItem(itemId, amount) {
    amount = Math.min(amount, gameState.inventory[itemId] || 0);
    if (amount <= 0) return false;
    
    const price = gameState.prices[itemId];
    if (!price) return false;
    
    const total = Math.floor(price.current * amount);
    gameState.inventory[itemId] -= amount;
    gameState.balance += total;
    gameState.stats.itemsSold += amount;
    gameState.stats.moneyEarned += total;
    
    addActivity(`Sold ${amount}x ${getItem(itemId).name} for ${formatMoney(total)}`);
    showNotification(`+${formatMoney(total)}`, 'success');
    renderAll();
    return true;
}

function sellAllItems() {
    let total = 0;
    Object.entries(gameState.prices).forEach(([id, price]) => {
        const amount = gameState.inventory[id] || 0;
        if (amount > 0) {
            total += Math.floor(price.current * amount);
            gameState.stats.itemsSold += amount;
            gameState.inventory[id] = 0;
        }
    });
    if (total > 0) {
        gameState.balance += total;
        gameState.stats.moneyEarned += total;
        addActivity(`Sold all for ${formatMoney(total)}`);
        showNotification(`+${formatMoney(total)}`, 'success');
    }
    renderAll();
}

// ============================================================
// PRODUCTION
// ============================================================

function processProduction() {
    const tickSec = CONFIG.settings.productionTickRate / 1000;
    
    gameState.warehouses.forEach(warehouse => {
        warehouse.machines.forEach(machine => {
            const def = getMachine(machine.definitionId);
            if (!def) return;
            
            machine.progress += tickSec / def.craftTime;
            
            while (machine.progress >= 1) {
                const canProduce = def.inputs.every(i => hasItems(i.item, i.amount));
                const outputAmt = def.outputs.reduce((s, o) => s + o.amount, 0);
                
                if (!canProduce || !hasStorage(outputAmt)) {
                    machine.progress = Math.min(machine.progress, 1);
                    break;
                }
                
                def.inputs.forEach(i => { gameState.inventory[i.item] -= i.amount; });
                def.outputs.forEach(o => {
                    gameState.inventory[o.item] += o.amount;
                    gameState.stats.itemsProduced += o.amount;
                });
                machine.progress -= 1;
            }
        });
    });
}

function updatePrices() {
    Object.entries(gameState.prices).forEach(([id, price]) => {
        const item = getItem(id);
        const vol = item?.priceVolatility || 0.1;
        const change = (Math.random() - 0.5) * 2 * vol;
        const supply = gameState.inventory[id] || 0;
        const supplyFactor = supply > 20 ? -0.02 : supply < 5 ? 0.02 : 0;
        
        const newPrice = price.current * (1 + change + supplyFactor);
        price.trend = newPrice > price.current ? 1 : newPrice < price.current ? -1 : 0;
        price.current = Math.max(price.base * 0.5, Math.min(price.base * 2, newPrice));
    });
}

// ============================================================
// RENDERING
// ============================================================

function renderAll() {
    renderHUD();
    renderInventory();
    renderWarehouseList();
    renderCurrentTab();
    renderStatusBar();
}

function renderHUD() {
    const bal = document.getElementById('hud-balance');
    const stor = document.getElementById('hud-storage');
    const prod = document.getElementById('hud-production');
    if (bal) bal.textContent = formatMoney(gameState.balance);
    if (stor) stor.textContent = `${getTotalItems()}/${gameState.maxStorage}`;
    if (prod) {
        let rate = 0;
        getAllMachines().forEach(m => {
            const def = getMachine(m.definitionId);
            if (def) def.outputs.forEach(o => { rate += o.amount / def.craftTime; });
        });
        prod.textContent = rate.toFixed(1) + '/s';
    }
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    
    grid.innerHTML = Object.entries(CONFIG.items).map(([id, item]) => {
        const count = gameState.inventory[id] || 0;
        return `
            <div class="inv-slot ${count === 0 ? 'empty' : ''}" data-item="${id}" title="${item.name}: ${count}">
                <span class="slot-icon">${item.icon}</span>
                <span class="slot-count">${count > 0 ? formatNumber(count) : ''}</span>
            </div>
        `;
    }).join('');
    
    const bar = document.getElementById('storage-bar-fill');
    const txt = document.getElementById('storage-text');
    if (bar) bar.style.width = getStoragePercent() + '%';
    if (txt) txt.textContent = `${getTotalItems()} / ${gameState.maxStorage}`;
}

function renderWarehouseList() {
    const list = document.getElementById('warehouse-list');
    if (!list) return;
    
    list.innerHTML = gameState.warehouses.map(wh => `
        <div class="warehouse-card" data-wh-id="${wh.id}">
            <div class="warehouse-card-header">
                <span class="warehouse-icon">🏭</span>
                <span class="warehouse-name">${wh.name}</span>
                <span class="warehouse-level">Lv.${wh.level}</span>
            </div>
            <div class="warehouse-stats-grid">
                <div class="warehouse-stat">
                    <span class="warehouse-stat-label">Slots</span>
                    <span class="warehouse-stat-value">${wh.machines.length}/${wh.maxSlots}</span>
                </div>
                <div class="warehouse-stat">
                    <span class="warehouse-stat-label">Machines</span>
                    <span class="warehouse-stat-value">${wh.machines.length}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update warehouse cost button
    const costEl = document.getElementById('warehouse-cost');
    if (costEl) costEl.textContent = formatMoney(getWarehouseCost());
}

function renderCurrentTab() {
    if (currentTab === 'machines') renderMachinesTab();
    else if (currentTab === 'shop') renderShopTab();
    else if (currentTab === 'market') renderMarketTab();
    else if (currentTab === 'recipes') renderRecipesTab();
}

function renderMachinesTab() {
    const warehouse = getWarehouse(currentWarehouseId);
    if (!warehouse) return;
    
    const nameEl = document.getElementById('current-warehouse-name');
    const slotsEl = document.getElementById('wh-slots');
    if (nameEl) nameEl.textContent = warehouse.name;
    if (slotsEl) slotsEl.textContent = `${warehouse.machines.length}/${warehouse.maxSlots}`;
    
    const list = document.getElementById('machine-list');
    if (!list) return;
    
    if (warehouse.machines.length === 0) {
        list.innerHTML = '<div class="empty-state">No machines. Buy some from the Shop!</div>';
    } else {
        const grouped = {};
        warehouse.machines.forEach(m => {
            if (!grouped[m.definitionId]) grouped[m.definitionId] = [];
            grouped[m.definitionId].push(m);
        });
        
        list.innerHTML = Object.entries(grouped).map(([defId, machines]) => {
            const def = getMachine(defId);
            const sellPrice = Math.floor(getMachineCost(defId) * 0.5);
            return `
                <div class="machine-item">
                    <div class="machine-icon">${def.icon}</div>
                    <div class="machine-info">
                        <span class="machine-name">${def.name} <span class="machine-count">×${machines.length}</span></span>
                        <span class="machine-output">${def.outputs.map(o => `${(o.amount / def.craftTime).toFixed(1)} ${getItem(o.item).name}/s`).join(', ')}</span>
                    </div>
                    <button class="btn btn-small btn-danger" data-sell-machine="${machines[0].id}">Sell ${formatMoney(sellPrice)}</button>
                </div>
            `;
        }).join('');
    }
    
    const slotsCost = document.getElementById('slots-cost');
    const storageCost = document.getElementById('storage-cost');
    if (slotsCost) slotsCost.textContent = formatMoney(CONFIG.warehouses.slotUpgradeCost * warehouse.level);
    if (storageCost) storageCost.textContent = formatMoney(CONFIG.warehouses.storageUpgradeCost);
}

function renderShopTab() {
    const content = document.getElementById('shop-content');
    if (!content) return;
    
    let html = '';
    
    if (currentShopCategory === 'machines') {
        Object.entries(CONFIG.machineCategories).forEach(([catId, cat]) => {
            const machines = Object.entries(CONFIG.machines).filter(([, m]) => m.category === catId);
            if (machines.length === 0) return;
            
            html += `<div class="shop-category"><h4>${cat.icon} ${cat.name}</h4><div class="shop-items">`;
            machines.forEach(([id, machine]) => {
                const cost = getMachineCost(id);
                const affordable = canAfford(cost);
                const owned = gameState.machineCounts[id] || 0;
                html += `
                    <div class="shop-item ${!affordable ? 'disabled' : ''}" data-machine-id="${id}">
                        <div class="shop-item-icon">${machine.icon}</div>
                        <div class="shop-item-info">
                            <span class="shop-item-name">${machine.name}</span>
                            <span class="shop-item-desc">${machine.description}</span>
                            <span class="shop-item-stats">${machine.outputs.map(o => `${getItem(o.item).icon} ${(o.amount / machine.craftTime).toFixed(1)}/s`).join(' ')}</span>
                        </div>
                        <div class="shop-item-right">
                            <span class="shop-item-owned">Owned: ${owned}</span>
                            <span class="shop-item-cost">${formatMoney(cost)}</span>
                            <button class="btn btn-small btn-success" data-buy-machine="${id}" ${!affordable ? 'disabled' : ''}>Buy</button>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;
        });
    } else if (currentShopCategory === 'warehouses') {
        const cost = getWarehouseCost();
        const affordable = canAfford(cost) && gameState.warehouses.length < CONFIG.warehouses.maxWarehouses;
        html = `
            <div class="shop-category"><h4>🏭 New Warehouse</h4><div class="shop-items">
                <div class="shop-item ${!affordable ? 'disabled' : ''}">
                    <div class="shop-item-icon">🏭</div>
                    <div class="shop-item-info">
                        <span class="shop-item-name">Warehouse</span>
                        <span class="shop-item-desc">${CONFIG.warehouses.baseSlots} machine slots</span>
                        <span class="shop-item-stats">Current: ${gameState.warehouses.length}/${CONFIG.warehouses.maxWarehouses}</span>
                    </div>
                    <div class="shop-item-right">
                        <span class="shop-item-cost">${formatMoney(cost)}</span>
                        <button class="btn btn-small btn-success" id="shop-buy-warehouse" ${!affordable ? 'disabled' : ''}>Buy</button>
                    </div>
                </div>
            </div></div>
        `;
    } else if (currentShopCategory === 'upgrades') {
        const wh = getWarehouse(currentWarehouseId);
        const slotCost = wh ? CONFIG.warehouses.slotUpgradeCost * wh.level : 0;
        html = `
            <div class="shop-category"><h4>⬆️ Upgrades</h4><div class="shop-items">
                <div class="shop-item ${!canAfford(slotCost) ? 'disabled' : ''}">
                    <div class="shop-item-icon">📦</div>
                    <div class="shop-item-info">
                        <span class="shop-item-name">+${CONFIG.warehouses.slotUpgradeAmount} Slots</span>
                        <span class="shop-item-desc">Add slots to ${wh?.name || 'warehouse'}</span>
                    </div>
                    <div class="shop-item-right">
                        <span class="shop-item-cost">${formatMoney(slotCost)}</span>
                        <button class="btn btn-small btn-success" id="shop-upgrade-slots">Buy</button>
                    </div>
                </div>
                <div class="shop-item ${!canAfford(CONFIG.warehouses.storageUpgradeCost) ? 'disabled' : ''}">
                    <div class="shop-item-icon">🗄️</div>
                    <div class="shop-item-info">
                        <span class="shop-item-name">+${CONFIG.warehouses.storageUpgradeAmount} Storage</span>
                        <span class="shop-item-desc">Increase global storage</span>
                    </div>
                    <div class="shop-item-right">
                        <span class="shop-item-cost">${formatMoney(CONFIG.warehouses.storageUpgradeCost)}</span>
                        <button class="btn btn-small btn-success" id="shop-upgrade-storage">Buy</button>
                    </div>
                </div>
            </div></div>
        `;
    }
    
    content.innerHTML = html;
}

function renderMarketTab() {
    const list = document.getElementById('market-list');
    if (!list) return;
    
    const sellable = Object.entries(CONFIG.items).filter(([, item]) => item.sellable);
    
    list.innerHTML = sellable.map(([id, item]) => {
        const price = gameState.prices[id];
        const owned = gameState.inventory[id] || 0;
        const trendIcon = price.trend > 0 ? '↑' : price.trend < 0 ? '↓' : '→';
        const trendClass = price.trend > 0 ? 'up' : price.trend < 0 ? 'down' : '';
        
        return `
            <div class="market-item">
                <div class="market-icon">${item.icon}</div>
                <div class="market-info">
                    <span class="market-name">${item.name}</span>
                    <span class="market-owned">${owned} owned</span>
                </div>
                <div class="market-price">
                    <span class="price-value">${formatMoney(price.current)}</span>
                    <span class="price-trend ${trendClass}">${trendIcon}</span>
                </div>
                <div class="market-actions">
                    <input type="number" class="amount-input" data-item="${id}" value="1" min="1" max="${Math.max(1, owned)}">
                    <button class="btn btn-small btn-success" data-sell-item="${id}" ${owned === 0 ? 'disabled' : ''}>Sell</button>
                </div>
            </div>
        `;
    }).join('') + `
        <div class="market-item sell-all">
            <div class="market-info"><span class="market-name">Sell All Items</span></div>
            <button class="btn btn-success" id="sell-all-btn">Sell All</button>
        </div>
    `;
}

function renderRecipesTab() {
    const content = document.getElementById('recipe-content');
    if (!content) return;
    
    const recipes = Object.entries(CONFIG.machines).map(([id, m]) => ({
        id, ...m,
        inputItems: m.inputs.map(i => ({ ...i, ...getItem(i.item) })),
        outputItems: m.outputs.map(o => ({ ...o, ...getItem(o.item) }))
    }));
    
    const filtered = recipeFilter === 'all' ? recipes : recipes.filter(r => r.category === recipeFilter);
    
    content.innerHTML = `
        <div class="recipe-filters">
            <button class="filter-btn ${recipeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            ${Object.entries(CONFIG.machineCategories).map(([id, cat]) => `
                <button class="filter-btn ${recipeFilter === id ? 'active' : ''}" data-filter="${id}">${cat.icon} ${cat.name}</button>
            `).join('')}
        </div>
        <div class="recipe-list">
            ${filtered.map(r => `
                <div class="recipe-card">
                    <div class="recipe-header">
                        <span class="recipe-machine">${r.icon} ${r.name}</span>
                        <span class="recipe-time">⏱️ ${r.craftTime}s</span>
                    </div>
                    <div class="recipe-flow">
                        <div class="recipe-inputs">
                            ${r.inputs.length === 0 ? '<span class="no-input">No inputs</span>' :
                                r.inputItems.map(i => `
                                    <div class="recipe-item" title="${i.name}">
                                        <span class="recipe-item-icon">${i.icon}</span>
                                        <span class="recipe-item-amount">×${i.amount}</span>
                                    </div>
                                `).join('')}
                        </div>
                        <div class="recipe-arrow">→</div>
                        <div class="recipe-outputs">
                            ${r.outputItems.map(o => `
                                <div class="recipe-item" title="${o.name}">
                                    <span class="recipe-item-icon">${o.icon}</span>
                                    <span class="recipe-item-amount">×${o.amount}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="recipe-rate">${r.outputs.map(o => `${(o.amount / r.craftTime).toFixed(2)}/s`).join(', ')}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderActivityLog() {
    const log = document.getElementById('activity-log');
    if (!log) return;
    
    log.innerHTML = activityLog.length === 0 
        ? '<div class="log-entry">Welcome to Factory Simulator!</div>'
        : activityLog.slice(0, 20).map(e => {
            const t = e.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return `<div class="log-entry"><span class="log-time">[${t}]</span> ${e.message}</div>`;
        }).join('');
}

function renderStatusBar() {
    const wh = document.getElementById('status-warehouses');
    const mach = document.getElementById('status-machines');
    if (wh) wh.textContent = gameState.warehouses.length;
    if (mach) mach.textContent = getAllMachines().length;
}

// ============================================================
// TAB SWITCHING
// ============================================================

function switchTab(tabId) {
    currentTab = tabId;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });
    
    renderCurrentTab();
}

function openWarehouse(id) {
    currentWarehouseId = id;
    switchTab('machines');
}

// ============================================================
// EVENT HANDLING
// ============================================================

function setupEvents() {
    // Use event delegation for all clicks
    document.addEventListener('click', e => {
        const target = e.target;
        
        // Tab buttons
        if (target.closest('.tab-btn')) {
            const btn = target.closest('.tab-btn');
            switchTab(btn.dataset.tab);
            return;
        }
        
        // Warehouse cards
        if (target.closest('.warehouse-card')) {
            const card = target.closest('.warehouse-card');
            const id = parseInt(card.dataset.whId);
            openWarehouse(id);
            return;
        }
        
        // Shop tabs
        if (target.closest('.shop-tab')) {
            const tab = target.closest('.shop-tab');
            currentShopCategory = tab.dataset.category;
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.toggle('active', t === tab));
            renderShopTab();
            return;
        }
        
        // Recipe filters
        if (target.closest('.filter-btn')) {
            recipeFilter = target.closest('.filter-btn').dataset.filter;
            renderRecipesTab();
            return;
        }
        
        // Buy machine (shop)
        if (target.dataset.buyMachine) {
            buyMachine(target.dataset.buyMachine, currentWarehouseId);
            return;
        }
        
        // Sell machine
        if (target.dataset.sellMachine) {
            sellMachine(parseInt(target.dataset.sellMachine), currentWarehouseId);
            return;
        }
        
        // Sell item (market)
        if (target.dataset.sellItem) {
            const id = target.dataset.sellItem;
            const input = document.querySelector(`.amount-input[data-item="${id}"]`);
            sellItem(id, parseInt(input?.value) || 1);
            return;
        }
        
        // Sell all
        if (target.id === 'sell-all-btn') {
            sellAllItems();
            return;
        }
        
        // Buy warehouse (main button)
        if (target.id === 'buy-warehouse-btn' || target.closest('#buy-warehouse-btn')) {
            buyWarehouse();
            return;
        }
        
        // Shop buy warehouse
        if (target.id === 'shop-buy-warehouse') {
            buyWarehouse();
            return;
        }
        
        // Upgrade slots
        if (target.id === 'upgrade-slots-btn' || target.closest('#upgrade-slots-btn') || target.id === 'shop-upgrade-slots') {
            upgradeSlots(currentWarehouseId);
            return;
        }
        
        // Upgrade storage
        if (target.id === 'upgrade-storage-btn' || target.closest('#upgrade-storage-btn') || target.id === 'shop-upgrade-storage') {
            upgradeStorage();
            return;
        }
        
        // Back button
        if (target.id === 'back-to-warehouses' || target.closest('#back-to-warehouses')) {
            switchTab('warehouses');
            return;
        }
        
        // Settings
        if (target.id === 'settings-btn' || target.closest('#settings-btn')) {
            document.getElementById('settings-modal')?.classList.add('active');
            return;
        }
        
        // Close settings
        if (target.id === 'close-settings' || target.id === 'settings-modal') {
            document.getElementById('settings-modal')?.classList.remove('active');
            return;
        }
        
        // Save
        if (target.id === 'save-btn' || target.closest('#save-btn')) {
            saveGame();
            showNotification('Game saved!', 'success');
            return;
        }
        
        // Export
        if (target.id === 'export-save-btn') {
            saveGame();
            const data = localStorage.getItem(SAVE_KEY);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `factory-save-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showNotification('Save exported!', 'success');
            return;
        }
        
        // Reset
        if (target.id === 'reset-game-btn') {
            resetGame();
            return;
        }
    });
    
    // Import file
    document.getElementById('import-save-input')?.addEventListener('change', e => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                try {
                    localStorage.setItem(SAVE_KEY, ev.target.result);
                    location.reload();
                } catch (err) {
                    showNotification('Invalid save file', 'error');
                }
            };
            reader.readAsText(file);
        }
    });
}

// ============================================================
// GAME LOOPS
// ============================================================

function gameLoop() {
    processProduction();
    renderHUD();
    renderInventory();
}

function priceLoop() {
    updatePrices();
    if (currentTab === 'market') renderMarketTab();
}

// ============================================================
// INITIALIZATION
// ============================================================

function init() {
    const loaded = loadGame();
    
    setupEvents();
    renderAll();
    renderActivityLog();
    
    if (loaded) {
        addActivity('Game loaded');
        showNotification('Game loaded!', 'success');
    } else {
        addActivity('Welcome to Factory Simulator!');
        addActivity('Click a warehouse to get started');
    }
    
    // Start loops
    setInterval(gameLoop, CONFIG.settings.productionTickRate);
    setInterval(priceLoop, CONFIG.settings.priceUpdateInterval);
    setInterval(() => { saveGame(); console.log('Auto-saved'); }, CONFIG.settings.autoSaveInterval);
    
    window.addEventListener('beforeunload', saveGame);
    console.log('🏭 Factory Simulator initialized!');
}

document.addEventListener('DOMContentLoaded', init);
