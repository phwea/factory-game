/**
 * Factory Simulator Game Logic
 * Features:
 * - Processors: Generate raw materials (steel)
 * - Manufacturers: Convert raw materials into sellable items
 * - Market: Dynamic pricing based on supply/demand
 */

// ==================== GAME STATE ====================
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
    processors: [],
    manufacturers: [],
    
    // Market prices (dynamic)
    prices: {
        steelPlates: { base: 15, current: 15, trend: 0 },
        steelGears: { base: 25, current: 25, trend: 0 },
        steelTools: { base: 50, current: 50, trend: 0 }
    },
    
    // Machine costs (increase with each purchase)
    machineCosts: {
        steelGenerator: { base: 100, count: 0 },
        platePress: { base: 150, count: 0 },
        gearMaker: { base: 200, count: 0 },
        toolAssembler: { base: 300, count: 0 }
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
    return Math.floor(machine.base * Math.pow(1.15, machine.count));
}

function getProductionRate() {
    let rate = 0;
    gameState.processors.forEach(p => {
        rate += machineDefinitions[p.type].rate;
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
    
    gameState.balance -= cost;
    gameState.machineCosts[machineType].count++;
    
    const definition = machineDefinitions[machineType];
    const machine = {
        id: Date.now() + Math.random(),
        type: machineType,
        lastProcess: Date.now()
    };
    
    if (definition.type === 'processor') {
        gameState.processors.push(machine);
    } else {
        gameState.manufacturers.push(machine);
    }
    
    addTransaction(`Bought ${definition.name}`, -cost);
    updateUI();
    return true;
}

// ==================== PRODUCTION LOOP ====================
function processProduction() {
    const now = Date.now();
    
    // Process all processors
    gameState.processors.forEach(processor => {
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
    
    // Process all manufacturers
    gameState.manufacturers.forEach(manufacturer => {
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
    // Simple console notification for now
    console.log(`[${type.toUpperCase()}] ${message}`);
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
    
    if (machines.length === 0) {
        list.innerHTML = '<div class="machine-item"><span style="color: var(--text-secondary);">No machines yet</span></div>';
        return;
    }
    
    // Group machines by type
    const grouped = {};
    machines.forEach(machine => {
        if (!grouped[machine.type]) {
            grouped[machine.type] = 0;
        }
        grouped[machine.type]++;
    });
    
    list.innerHTML = Object.entries(grouped).map(([type, count]) => {
        const definition = machineDefinitions[type];
        return `
            <div class="machine-item">
                <div class="machine-info">
                    <span class="machine-name">${definition.icon} ${definition.name}</span>
                    <span class="machine-output">Output: ${definition.rate}/s</span>
                </div>
                <span class="machine-status">x${count}</span>
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
    
    // Start game loops
    setInterval(gameLoop, 100); // 10 times per second for smooth production
    setInterval(priceLoop, 5000); // Update prices every 5 seconds
    
    console.log('🏭 Factory Simulator initialized!');
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
