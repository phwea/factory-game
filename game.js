/**
 * Factory Simulator Game Logic
 * Features:
 * - Processors: Generate raw materials (steel)
 * - Manufacturers: Convert raw materials into sellable items
 * - Market: Dynamic pricing based on supply/demand
 */

// ==================== GAME STATE ====================
let machineIdCounter = 0;
let gameLoopInterval = null;
let priceLoopInterval = null;

const gameState = {
    balance: 1000,
    maxStorage: 100,
    
    // Inventory
    inventory: {
        rawSteel: 0,
        steelPlates: 0,
        steelGears: 0,
        steelTools: 0
    },
    
    // Machines
    processors: [],      // Steel generators (produce raw steel)
    manufacturers: [],   // Processors that use raw steel to create processed materials
    
    // Warehouse slots system
    warehouseSlots: {
        purchased: 1,      // Start with 1 free slot
        maxPerSlot: 20,    // Each slot holds up to 20 unique machines
        baseCost: 500,     // Base cost for additional slots
        costMultiplier: 1.5 // Cost increases by 50% for each slot
    },
    
    // Market prices (dynamic)
    prices: {
        steelPlates: { base: 15, current: 15, trend: 0 },
        steelGears: { base: 25, current: 25, trend: 0 },
        steelTools: { base: 50, current: 50, trend: 0 }
    },
    
    // Machine costs (fixed per machine, no stacking bonus)
    machineCosts: {
        steelGenerator: { base: 100 },
        platePress: { base: 150 },
        gearMaker: { base: 200 },
        toolAssembler: { base: 300 }
    },
    
    // Transaction history
    transactions: []
};

// ==================== MACHINE DEFINITIONS ====================
const machineDefinitions = {
    steelGenerator: {
        name: 'Steel Generator',
        type: 'processor',
        output: 'rawSteel',
        rate: 1, // per second
        icon: '⚡'
    },
    platePress: {
        name: 'Plate Press',
        type: 'manufacturer',
        input: 'rawSteel',
        inputAmount: 2,
        output: 'steelPlates',
        outputAmount: 1,
        rate: 0.5,
        icon: '🔩'
    },
    gearMaker: {
        name: 'Gear Maker',
        type: 'manufacturer',
        input: 'rawSteel',
        inputAmount: 3,
        output: 'steelGears',
        outputAmount: 1,
        rate: 0.33,
        icon: '🔧'
    },
    toolAssembler: {
        name: 'Tool Assembler',
        type: 'manufacturer',
        input: 'steelGears',
        inputAmount: 2,
        output: 'steelTools',
        outputAmount: 1,
        rate: 0.25,
        icon: '🛠️'
    }
};

// ==================== HELPER FUNCTIONS ====================
function formatMoney(amount) {
    return '$' + amount.toFixed(0);
}

function getTotalItems() {
    return Object.values(gameState.inventory).reduce((a, b) => a + b, 0);
}

function getStoragePercentage() {
    return Math.round((getTotalItems() / gameState.maxStorage) * 100);
}

function getMachineCost(machineType) {
    const machine = gameState.machineCosts[machineType];
    return machine.base; // Fixed cost, no stacking multiplier
}

function getTotalMachineCount() {
    return gameState.processors.length + gameState.manufacturers.length;
}

function getMaxMachineCapacity() {
    return gameState.warehouseSlots.purchased * gameState.warehouseSlots.maxPerSlot;
}

function getWarehouseSlotCost() {
    const slots = gameState.warehouseSlots;
    return Math.floor(slots.baseCost * Math.pow(slots.costMultiplier, slots.purchased - 1));
}

function buyWarehouseSlot() {
    const cost = getWarehouseSlotCost();
    
    if (gameState.balance < cost) {
        showNotification('Not enough money for warehouse slot!', 'error');
        return false;
    }
    
    gameState.balance -= cost;
    gameState.warehouseSlots.purchased++;
    
    addTransaction(`Bought Warehouse Slot #${gameState.warehouseSlots.purchased}`, -cost);
    showNotification(`Purchased Warehouse Slot #${gameState.warehouseSlots.purchased}!`, 'success');
    updateUI();
    return true;
}

function toggleMachine(machineId, machineType) {
    let machines;
    if (machineType === 'processor') {
        machines = gameState.processors;
    } else {
        machines = gameState.manufacturers;
    }
    
    const machine = machines.find(m => m.id === machineId);
    if (machine) {
        machine.enabled = !machine.enabled;
        updateUI();
    }
}

function getProductionRate() {
    let rate = 0;
    gameState.processors.forEach(p => {
        if (p.enabled) {
            rate += machineDefinitions[p.type].rate;
        }
    });
    return rate.toFixed(1);
}

// ==================== MACHINE MANAGEMENT ====================
function buyMachine(machineType) {
    const cost = getMachineCost(machineType);
    
    if (gameState.balance < cost) {
        showNotification('Not enough money!', 'error');
        return false;
    }
    
    // Check if we have room in warehouse slots
    if (getTotalMachineCount() >= getMaxMachineCapacity()) {
        showNotification('No warehouse slots available! Buy more slots.', 'error');
        return false;
    }
    
    gameState.balance -= cost;
    
    const definition = machineDefinitions[machineType];
    const machine = {
        id: ++machineIdCounter,
        type: machineType,
        lastProcess: Date.now(),
        enabled: true // Machines start enabled by default
    };
    
    if (definition.type === 'processor') {
        gameState.processors.push(machine);
    } else {
        gameState.manufacturers.push(machine);
    }
    
    addTransaction(`Bought ${definition.name}`, -cost);
    showNotification(`Purchased ${definition.name}!`, 'success');
    updateUI();
    return true;
}

// ==================== PRODUCTION LOOP ====================
function processProduction() {
    const now = Date.now();
    
    // Process all processors (only if enabled)
    gameState.processors.forEach(processor => {
        if (!processor.enabled) {
            processor.lastProcess = now; // Keep time updated even when disabled
            return;
        }
        
        const definition = machineDefinitions[processor.type];
        const timePassed = (now - processor.lastProcess) / 1000;
        const itemsToAdd = Math.floor(timePassed * definition.rate);
        
        if (itemsToAdd > 0 && getTotalItems() < gameState.maxStorage) {
            const canAdd = Math.min(itemsToAdd, gameState.maxStorage - getTotalItems());
            gameState.inventory[definition.output] += canAdd;
            processor.lastProcess = now;
        } else if (itemsToAdd > 0) {
            processor.lastProcess = now; // Still update time even if storage full
        }
    });
    
    // Process all manufacturers (only if enabled)
    gameState.manufacturers.forEach(manufacturer => {
        if (!manufacturer.enabled) {
            manufacturer.lastProcess = now; // Keep time updated even when disabled
            return;
        }
        
        const definition = machineDefinitions[manufacturer.type];
        const timePassed = (now - manufacturer.lastProcess) / 1000;
        const cyclesAvailable = Math.floor(timePassed * definition.rate);
        
        if (cyclesAvailable > 0) {
            const inputAvailable = Math.floor(gameState.inventory[definition.input] / definition.inputAmount);
            const cyclesToRun = Math.min(cyclesAvailable, inputAvailable);
            
            if (cyclesToRun > 0 && getTotalItems() < gameState.maxStorage) {
                const canProduce = Math.min(
                    cyclesToRun * definition.outputAmount,
                    gameState.maxStorage - getTotalItems()
                );
                const actualCycles = Math.floor(canProduce / definition.outputAmount);
                
                if (actualCycles > 0) {
                    gameState.inventory[definition.input] -= actualCycles * definition.inputAmount;
                    gameState.inventory[definition.output] += actualCycles * definition.outputAmount;
                }
            }
            manufacturer.lastProcess = now;
        }
    });
}

// ==================== MARKET FUNCTIONS ====================
function updateMarketPrices() {
    Object.keys(gameState.prices).forEach(item => {
        const priceData = gameState.prices[item];
        const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
        
        // Supply pressure: more items = lower price
        const inventoryKey = item.charAt(0).toLowerCase() + item.slice(1);
        const supplyPressure = gameState.inventory[inventoryKey] > 20 ? -0.02 : 0.01;
        
        const change = priceData.base * (variation + supplyPressure);
        priceData.current = Math.max(
            priceData.base * 0.5,
            Math.min(priceData.base * 2, priceData.current + change)
        );
        
        priceData.trend = change > 0 ? 1 : (change < 0 ? -1 : 0);
    });
}

function sellItem(itemKey, amount) {
    if (gameState.inventory[itemKey] < amount) {
        showNotification('Not enough items to sell!', 'error');
        return false;
    }
    
    const priceData = gameState.prices[itemKey];
    if (!priceData) {
        showNotification('Invalid item!', 'error');
        return false;
    }
    
    const revenue = Math.floor(priceData.current * amount);
    gameState.inventory[itemKey] -= amount;
    gameState.balance += revenue;
    
    addTransaction(`Sold ${amount} ${itemKey.replace(/([A-Z])/g, ' $1').trim()}`, revenue);
    showNotification(`Sold for $${revenue}!`, 'success');
    updateUI();
    return true;
}

function sellAllItems() {
    let totalRevenue = 0;
    let itemsSold = 0;
    
    ['steelPlates', 'steelGears', 'steelTools'].forEach(itemKey => {
        const amount = gameState.inventory[itemKey];
        if (amount > 0) {
            const priceData = gameState.prices[itemKey];
            if (priceData) {
                const revenue = Math.floor(priceData.current * amount);
                gameState.inventory[itemKey] = 0;
                totalRevenue += revenue;
                itemsSold += amount;
            }
        }
    });
    
    if (itemsSold > 0) {
        gameState.balance += totalRevenue;
        addTransaction(`Sold ${itemsSold} items`, totalRevenue);
        showNotification(`Sold ${itemsSold} items for $${totalRevenue}!`, 'success');
    } else {
        showNotification('No items to sell!', 'error');
    }
    
    updateUI();
}

function addTransaction(description, amount) {
    gameState.transactions.unshift({
        time: new Date().toLocaleTimeString(),
        description,
        amount
    });
    
    // Keep only last 10 transactions
    if (gameState.transactions.length > 10) {
        gameState.transactions.pop();
    }
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Create toast notification element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// ==================== UI UPDATE FUNCTIONS ====================
function updateUI() {
    // Update status bar
    document.getElementById('status-balance').textContent = gameState.balance.toFixed(0);
    document.getElementById('status-storage').textContent = `${getTotalItems()}/${gameState.maxStorage}`;
    document.getElementById('status-production').textContent = `${getProductionRate()}/s`;
    
    // Update home page stats
    document.getElementById('home-processor-count').textContent = gameState.processors.length;
    document.getElementById('home-manufacturer-count').textContent = gameState.manufacturers.length;
    document.getElementById('home-production-rate').textContent = `${getProductionRate()}/s`;
    document.getElementById('home-raw-materials').textContent = gameState.inventory.rawSteel;
    document.getElementById('home-processed-items').textContent = 
        gameState.inventory.steelPlates + gameState.inventory.steelGears + gameState.inventory.steelTools;
    document.getElementById('home-storage-used').textContent = `${getStoragePercentage()}%`;
    document.getElementById('home-balance').textContent = formatMoney(gameState.balance);
    document.getElementById('home-steel-price').textContent = formatMoney(gameState.prices.steelPlates.current);
    document.getElementById('home-item-price').textContent = formatMoney(gameState.prices.steelTools.current);
    
    // Update warehouse inventory
    document.getElementById('inv-raw-steel').textContent = gameState.inventory.rawSteel;
    document.getElementById('inv-steel-plates').textContent = gameState.inventory.steelPlates;
    document.getElementById('inv-steel-gears').textContent = gameState.inventory.steelGears;
    document.getElementById('inv-steel-tools').textContent = gameState.inventory.steelTools;
    document.getElementById('storage-current').textContent = getTotalItems();
    document.getElementById('storage-max').textContent = gameState.maxStorage;
    document.getElementById('storage-progress').style.width = `${getStoragePercentage()}%`;
    
    // Update warehouse slots info
    document.getElementById('warehouse-slots-used').textContent = getTotalMachineCount();
    document.getElementById('warehouse-slots-max').textContent = getMaxMachineCapacity();
    document.getElementById('warehouse-slot-price').textContent = formatMoney(getWarehouseSlotCost());
    document.getElementById('warehouse-slots-progress').style.width = 
        `${Math.round((getTotalMachineCount() / getMaxMachineCapacity()) * 100)}%`;
    
    // Update machine costs
    document.getElementById('steel-generator-price').textContent = formatMoney(getMachineCost('steelGenerator'));
    document.getElementById('plate-press-price').textContent = formatMoney(getMachineCost('platePress'));
    document.getElementById('gear-maker-price').textContent = formatMoney(getMachineCost('gearMaker'));
    document.getElementById('tool-assembler-price').textContent = formatMoney(getMachineCost('toolAssembler'));
    
    // Update processor list
    updateMachineList('processor-list', gameState.processors);
    updateMachineList('manufacturer-list', gameState.manufacturers);
    
    // Update market prices
    document.getElementById('market-balance').textContent = gameState.balance.toFixed(0);
    document.getElementById('market-plate-price').textContent = formatMoney(gameState.prices.steelPlates.current);
    document.getElementById('market-gear-price').textContent = formatMoney(gameState.prices.steelGears.current);
    document.getElementById('market-tool-price').textContent = formatMoney(gameState.prices.steelTools.current);
    
    // Update price trends
    updatePriceTrend('plate-trend', gameState.prices.steelPlates.trend);
    updatePriceTrend('gear-trend', gameState.prices.steelGears.trend);
    updatePriceTrend('tool-trend', gameState.prices.steelTools.trend);
    
    // Update sell panel
    document.getElementById('sell-plates-owned').textContent = `${gameState.inventory.steelPlates} owned`;
    document.getElementById('sell-gears-owned').textContent = `${gameState.inventory.steelGears} owned`;
    document.getElementById('sell-tools-owned').textContent = `${gameState.inventory.steelTools} owned`;
    
    // Update transaction history
    updateTransactionHistory();
}

function updateMachineList(listId, machines) {
    const list = document.getElementById(listId);
    const machineType = listId === 'processor-list' ? 'processor' : 'manufacturer';
    
    if (machines.length === 0) {
        list.innerHTML = '<div class="machine-item"><span style="color: var(--text-secondary);">No machines yet</span></div>';
        return;
    }
    
    // Show each machine individually with toggle button
    list.innerHTML = machines.map(machine => {
        const definition = machineDefinitions[machine.type];
        const statusClass = machine.enabled ? 'enabled' : 'disabled';
        const toggleText = machine.enabled ? 'ON' : 'OFF';
        const toggleClass = machine.enabled ? 'toggle-on' : 'toggle-off';
        return `
            <div class="machine-item ${statusClass}">
                <div class="machine-info">
                    <span class="machine-name">${definition.icon} ${definition.name}</span>
                    <span class="machine-output">Output: ${definition.rate}/s</span>
                </div>
                <button class="toggle-btn ${toggleClass}" onclick="toggleMachine(${machine.id}, '${machineType}')">
                    ${toggleText}
                </button>
            </div>
        `;
    }).join('');
}

function updatePriceTrend(elementId, trend) {
    const element = document.getElementById(elementId);
    if (trend > 0) {
        element.textContent = '↑';
        element.className = 'price-trend up';
    } else if (trend < 0) {
        element.textContent = '↓';
        element.className = 'price-trend down';
    } else {
        element.textContent = '→';
        element.className = 'price-trend';
    }
}

function updateTransactionHistory() {
    const historyList = document.getElementById('transaction-history');
    
    if (gameState.transactions.length === 0) {
        historyList.innerHTML = '<div class="history-item placeholder">No transactions yet</div>';
        return;
    }
    
    historyList.innerHTML = gameState.transactions.map(t => `
        <div class="history-item">
            <span class="history-type">${t.description}</span>
            <span class="history-amount">${t.amount >= 0 ? '+' : ''}${formatMoney(t.amount)}</span>
        </div>
    `).join('');
}

// ==================== NAVIGATION ====================
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.dataset.page;
            
            // Update buttons
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update pages
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${targetPage}-page`) {
                    page.classList.add('active');
                }
            });
        });
    });
}

// ==================== EVENT HANDLERS ====================
function setupEventHandlers() {
    // Quick actions on home page
    document.getElementById('quick-buy-processor').addEventListener('click', () => {
        buyMachine('steelGenerator');
    });
    
    document.getElementById('quick-sell-items').addEventListener('click', () => {
        sellAllItems();
    });
    
    // Warehouse buy buttons
    document.getElementById('buy-steel-generator').addEventListener('click', () => {
        buyMachine('steelGenerator');
    });
    
    document.getElementById('buy-plate-press').addEventListener('click', () => {
        buyMachine('platePress');
    });
    
    document.getElementById('buy-gear-maker').addEventListener('click', () => {
        buyMachine('gearMaker');
    });
    
    document.getElementById('buy-tool-assembler').addEventListener('click', () => {
        buyMachine('toolAssembler');
    });
    
    // Market sell buttons
    document.getElementById('sell-plates-btn').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('sell-plates-amount').value) || 1;
        sellItem('steelPlates', amount);
    });
    
    document.getElementById('sell-gears-btn').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('sell-gears-amount').value) || 1;
        sellItem('steelGears', amount);
    });
    
    document.getElementById('sell-tools-btn').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('sell-tools-amount').value) || 1;
        sellItem('steelTools', amount);
    });
    
    document.getElementById('sell-all-btn').addEventListener('click', () => {
        sellAllItems();
    });
    
    // Warehouse slot button
    document.getElementById('buy-warehouse-slot').addEventListener('click', () => {
        buyWarehouseSlot();
    });
}

// ==================== GAME LOOP ====================
function gameLoop() {
    processProduction();
    updateUI();
}

function priceLoop() {
    updateMarketPrices();
    updateUI();
}

// ==================== INITIALIZATION ====================
function init() {
    setupNavigation();
    setupEventHandlers();
    updateUI();
    
    // Clear any existing intervals (in case of re-initialization)
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (priceLoopInterval) clearInterval(priceLoopInterval);
    
    // Start game loops
    gameLoopInterval = setInterval(gameLoop, 100); // 10 times per second for smooth production
    priceLoopInterval = setInterval(priceLoop, 5000); // Update prices every 5 seconds
    
    console.log('🏭 Factory Simulator initialized!');
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
