// Sistema de Inventario de Cajones - App Logic
// Base de datos simulada (localStorage)

let currentUser = null;
let inventoryData = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    checkLogin();
});

// Event Listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Capture form
    const captureForm = document.getElementById('capture-form');
    if (captureForm) {
        captureForm.addEventListener('submit', handleCapture);
    }

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('capture-date').value = today;
    document.getElementById('dashboard-date').value = today;
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-user').value;
    
    if (username) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        showMainApp();
    }
}

function checkLogin() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showMainApp();
    }
}

function showMainApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    document.getElementById('current-user').textContent = getUserDisplayName(currentUser);
    
    // Load today's entries
    updateTodayEntries();
    updateDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

function getUserDisplayName(username) {
    const displayNames = {
        'Carmen': 'Carmen (Brocoli)',
        'Jorge': 'Jorge Alberto',
        'Guadalupe': 'Guadalupe Segura',
        'Alejandro': 'Alejandro Soto',
        'Jose_Gomez': 'José Gómez',
        'Rene': 'René',
        'Adolfo': 'Adolfo',
        'Jose_Manuel': 'José Manuel Jiménez',
        'Rafa': 'Rafa',
        'Daniel': 'Daniel (Covemex)',
        'Tavo': 'Tavo (Báscula)',
        'Ivan': 'Ivan (Admin)'
    };
    return displayNames[username] || username;
}

// Tabs
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Update content based on tab
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'history') {
        loadHistory();
    }
}

// Capture Functionality
function handleCapture(e) {
    e.preventDefault();
    
    const entry = {
        id: Date.now(),
        date: document.getElementById('capture-date').value,
        time: new Date().toLocaleTimeString('es-MX'),
        user: currentUser,
        location: document.getElementById('location').value,
        cajonesArmables: parseInt(document.getElementById('cajones-armables').value) || 0,
        cajonesRotos: parseInt(document.getElementById('cajones-rotos').value) || 0,
        cajonesAzules: parseInt(document.getElementById('cajones-azules').value) || 0,
        cajonesBlancos: parseInt(document.getElementById('cajones-blancos').value) || 0,
        notas: document.getElementById('notas').value
    };
    
    // Add to inventory
    inventoryData.push(entry);
    saveData();
    
    // Show success message
    showAlert('✅ Inventario guardado correctamente', 'success');
    
    // Clear form
    clearForm();
    
    // Update today's entries
    updateTodayEntries();
    updateDashboard();
}

function clearForm() {
    document.getElementById('location').value = '';
    document.getElementById('cajones-armables').value = '0';
    document.getElementById('cajones-rotos').value = '0';
    document.getElementById('cajones-azules').value = '0';
    document.getElementById('cajones-blancos').value = '0';
    document.getElementById('notas').value = '';
}

function updateLocationFields() {
    // Placeholder for future location-specific logic
}

// Today's Entries
function updateTodayEntries() {
    const today = document.getElementById('capture-date').value;
    const todayEntries = inventoryData.filter(entry => entry.date === today && entry.user === currentUser);
    
    const container = document.getElementById('today-entries');
    
    if (todayEntries.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay registros para hoy</div>';
        return;
    }
    
    container.innerHTML = todayEntries.map(entry => `
        <div class="entry-card">
            <div class="entry-card-header">
                <span class="entry-location">${entry.location}</span>
                <span class="entry-time">${entry.time}</span>
            </div>
            <div class="entry-details">
                <div class="entry-detail"><strong>Armables:</strong> ${entry.cajonesArmables}</div>
                <div class="entry-detail"><strong>Rotos:</strong> ${entry.cajonesRotos}</div>
                <div class="entry-detail"><strong>Azules:</strong> ${entry.cajonesAzules}</div>
                <div class="entry-detail"><strong>Blancos:</strong> ${entry.cajonesBlancos}</div>
            </div>
            ${entry.notas ? `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #666;">📝 ${entry.notas}</div>` : ''}
        </div>
    `).join('');
}

// Dashboard
function updateDashboard() {
    const selectedDate = document.getElementById('dashboard-date').value;
    const dayEntries = inventoryData.filter(entry => entry.date === selectedDate);
    
    // Calculate totals
    const totals = {
        armables: 0,
        rotos: 0,
        azules: 0,
        blancos: 0,
        locations: dayEntries.length
    };
    
    dayEntries.forEach(entry => {
        totals.armables += entry.cajonesArmables;
        totals.rotos += entry.cajonesRotos;
        totals.azules += entry.cajonesAzules;
        totals.blancos += entry.cajonesBlancos;
    });
    
    // Update stats cards
    document.getElementById('total-armables').textContent = totals.armables.toLocaleString();
    document.getElementById('total-rotos').textContent = totals.rotos.toLocaleString();
    document.getElementById('total-locations').textContent = totals.locations;
    document.getElementById('total-blancos').textContent = totals.blancos.toLocaleString();
    
    // Zone breakdown
    const zoneBreakdown = calculateZoneBreakdown(dayEntries);
    displayZoneBreakdown(zoneBreakdown);
    
    // Detailed table
    displayDetailedInventory(dayEntries);
}

function calculateZoneBreakdown(entries) {
    const zones = {
        'Zona Aguilares': [],
        'Zona Querétaro': [],
        'Zona Irapuato': [],
        'Zona Norte': [],
        'Transporte': [],
        'Zona Centro': []
    };
    
    const zoneMapping = {
        'Patio Aguilares': 'Zona Aguilares',
        'Campo Aguilares': 'Zona Aguilares',
        'San Isidro': 'Zona Aguilares',
        'Pozo Alto 2': 'Zona Aguilares',
        'Sofia': 'Zona Aguilares',
        'Santa Teresa': 'Zona Aguilares',
        'Castillo': 'Zona Querétaro',
        'San Cristobal 6': 'Zona Querétaro',
        'Comercializadora': 'Zona Irapuato',
        'Buena Vista': 'Zona Irapuato',
        'María Isabel Alatorre': 'Zona Irapuato',
        'Marquesado Guadalupe Rafa': 'Zona Irapuato',
        'Marquesado Guadalupe Juan': 'Zona Irapuato',
        'Capilla Guadalupe': 'Zona Irapuato',
        'Agrícola Nieto': 'Zona Irapuato',
        'Agustín Sañudo': 'Zona Irapuato',
        'Doña Rosa': 'Zona Irapuato',
        'San Javier': 'Zona Irapuato',
        'INV Estancia': 'Zona Irapuato',
        'Vegamex': 'Zona Irapuato',
        'Mina 2': 'Zona Norte',
        'Altamira': 'Zona Norte',
        'Bella Vista': 'Zona Norte',
        'Purísima': 'Zona Norte',
        'Plataformas GAB': 'Transporte',
        'Cajas Espinaca GAB': 'Transporte',
        'Camiones Pato': 'Transporte',
        'Plataforma Externos Mina': 'Transporte',
        'Termos Externos Mina': 'Transporte',
        'Camiones Mina': 'Transporte',
        'Covemex': 'Zona Centro'
    };
    
    entries.forEach(entry => {
        const zone = zoneMapping[entry.location] || 'Otros';
        if (zones[zone]) {
            zones[zone].push(entry);
        }
    });
    
    return zones;
}

function displayZoneBreakdown(zoneBreakdown) {
    const container = document.getElementById('zone-summary');
    let html = '';
    
    for (const [zone, entries] of Object.entries(zoneBreakdown)) {
        if (entries.length === 0) continue;
        
        const totals = {
            armables: entries.reduce((sum, e) => sum + e.cajonesArmables, 0),
            rotos: entries.reduce((sum, e) => sum + e.cajonesRotos, 0),
            azules: entries.reduce((sum, e) => sum + e.cajonesAzules, 0),
            blancos: entries.reduce((sum, e) => sum + e.cajonesBlancos, 0)
        };
        
        html += `
            <div class="zone-card">
                <div class="zone-header">${zone}</div>
                <div class="zone-stats">
                    <div class="zone-stat">
                        <div class="zone-stat-label">Armables</div>
                        <div class="zone-stat-value">${totals.armables.toLocaleString()}</div>
                    </div>
                    <div class="zone-stat">
                        <div class="zone-stat-label">Rotos</div>
                        <div class="zone-stat-value" style="color: #ff6b6b;">${totals.rotos.toLocaleString()}</div>
                    </div>
                    <div class="zone-stat">
                        <div class="zone-stat-label">Azules</div>
                        <div class="zone-stat-value">${totals.azules.toLocaleString()}</div>
                    </div>
                    <div class="zone-stat">
                        <div class="zone-stat-label">Blancos</div>
                        <div class="zone-stat-value">${totals.blancos.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html || '<div class="empty-state">No hay datos para mostrar</div>';
}

function displayDetailedInventory(entries) {
    const container = document.getElementById('detailed-inventory');
    
    if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay registros para mostrar</div>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Ubicación</th>
                    <th>Responsable</th>
                    <th>Armables</th>
                    <th>Rotos</th>
                    <th>Azules</th>
                    <th>Blancos</th>
                    <th>Hora</th>
                    <th>Notas</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    entries.forEach(entry => {
        html += `
            <tr>
                <td><strong>${entry.location}</strong></td>
                <td>${getUserDisplayName(entry.user)}</td>
                <td>${entry.cajonesArmables.toLocaleString()}</td>
                <td style="color: #ff6b6b;">${entry.cajonesRotos.toLocaleString()}</td>
                <td>${entry.cajonesAzules.toLocaleString()}</td>
                <td>${entry.cajonesBlancos.toLocaleString()}</td>
                <td>${entry.time}</td>
                <td>${entry.notas || '-'}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// History
function loadHistory() {
    // Populate location filter
    const locations = [...new Set(inventoryData.map(e => e.location))];
    const select = document.getElementById('history-location');
    select.innerHTML = '<option value="">Todas</option>' + 
        locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
    
    // Show all history initially
    filterHistory();
}

function filterHistory() {
    const from = document.getElementById('history-from').value;
    const to = document.getElementById('history-to').value;
    const location = document.getElementById('history-location').value;
    
    let filtered = inventoryData;
    
    if (from) {
        filtered = filtered.filter(e => e.date >= from);
    }
    
    if (to) {
        filtered = filtered.filter(e => e.date <= to);
    }
    
    if (location) {
        filtered = filtered.filter(e => e.location === location);
    }
    
    displayHistory(filtered);
}

function displayHistory(entries) {
    const container = document.getElementById('history-results');
    
    if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state">No se encontraron registros</div>';
        return;
    }
    
    // Group by date
    const byDate = {};
    entries.forEach(entry => {
        if (!byDate[entry.date]) {
            byDate[entry.date] = [];
        }
        byDate[entry.date].push(entry);
    });
    
    let html = '';
    
    // Sort dates descending
    const sortedDates = Object.keys(byDate).sort().reverse();
    
    sortedDates.forEach(date => {
        const dateEntries = byDate[date];
        const totals = {
            armables: dateEntries.reduce((sum, e) => sum + e.cajonesArmables, 0),
            rotos: dateEntries.reduce((sum, e) => sum + e.cajonesRotos, 0)
        };
        
        html += `
            <div class="zone-card" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div class="zone-header">📅 ${formatDate(date)}</div>
                    <div style="font-size: 0.9rem; color: #666;">
                        Total Armables: <strong style="color: #667eea;">${totals.armables.toLocaleString()}</strong> | 
                        Rotos: <strong style="color: #ff6b6b;">${totals.rotos.toLocaleString()}</strong>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Ubicación</th>
                            <th>Responsable</th>
                            <th>Armables</th>
                            <th>Rotos</th>
                            <th>Azules</th>
                            <th>Blancos</th>
                            <th>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dateEntries.map(entry => `
                            <tr>
                                <td>${entry.location}</td>
                                <td>${getUserDisplayName(entry.user)}</td>
                                <td>${entry.cajonesArmables.toLocaleString()}</td>
                                <td style="color: #ff6b6b;">${entry.cajonesRotos.toLocaleString()}</td>
                                <td>${entry.cajonesAzules.toLocaleString()}</td>
                                <td>${entry.cajonesBlancos.toLocaleString()}</td>
                                <td>${entry.time}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Export Functions
function exportToExcel() {
    const date = document.getElementById('export-date').value;
    if (!date) {
        showAlert('⚠️ Por favor selecciona una fecha', 'error');
        return;
    }
    
    const entries = inventoryData.filter(e => e.date === date);
    
    if (entries.length === 0) {
        showAlert('⚠️ No hay datos para exportar en esta fecha', 'error');
        return;
    }
    
    // Create CSV content
    let csv = 'Ubicación,Responsable,Cajones Armables,Cajones Rotos,Cajones Azules,Cajones Blancos,Hora,Notas\n';
    
    entries.forEach(entry => {
        csv += `"${entry.location}","${getUserDisplayName(entry.user)}",${entry.cajonesArmables},${entry.cajonesRotos},${entry.cajonesAzules},${entry.cajonesBlancos},"${entry.time}","${entry.notas}"\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_cajones_${date}.csv`;
    link.click();
    
    showAlert('✅ Archivo Excel descargado correctamente', 'success');
}

function exportToCSV() {
    if (inventoryData.length === 0) {
        showAlert('⚠️ No hay datos para exportar', 'error');
        return;
    }
    
    let csv = 'Fecha,Ubicación,Responsable,Cajones Armables,Cajones Rotos,Cajones Azules,Cajones Blancos,Hora,Notas\n';
    
    inventoryData.forEach(entry => {
        csv += `"${entry.date}","${entry.location}","${getUserDisplayName(entry.user)}",${entry.cajonesArmables},${entry.cajonesRotos},${entry.cajonesAzules},${entry.cajonesBlancos},"${entry.time}","${entry.notas}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_completo_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showAlert('✅ Archivo CSV descargado correctamente', 'success');
}

function printReport() {
    const date = document.getElementById('dashboard-date').value;
    const entries = inventoryData.filter(e => e.date === date);
    
    if (entries.length === 0) {
        showAlert('⚠️ No hay datos para imprimir', 'error');
        return;
    }
    
    // Create print window
    const printWindow = window.open('', '_blank');
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Inventario - ${formatDate(date)}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #667eea; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #667eea; color: white; }
                .totals { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            </style>
        </head>
        <body>
            <h1>Reporte de Inventario de Cajones</h1>
            <h2>Fecha: ${formatDate(date)}</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Ubicación</th>
                        <th>Responsable</th>
                        <th>Armables</th>
                        <th>Rotos</th>
                        <th>Azules</th>
                        <th>Blancos</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
                    ${entries.map(entry => `
                        <tr>
                            <td>${entry.location}</td>
                            <td>${getUserDisplayName(entry.user)}</td>
                            <td>${entry.cajonesArmables}</td>
                            <td>${entry.cajonesRotos}</td>
                            <td>${entry.cajonesAzules}</td>
                            <td>${entry.cajonesBlancos}</td>
                            <td>${entry.time}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="totals">
                <h3>Totales</h3>
                <p><strong>Total Cajones Armables:</strong> ${entries.reduce((sum, e) => sum + e.cajonesArmables, 0).toLocaleString()}</p>
                <p><strong>Total Cajones Rotos:</strong> ${entries.reduce((sum, e) => sum + e.cajonesRotos, 0).toLocaleString()}</p>
                <p><strong>Total Cajones Azules:</strong> ${entries.reduce((sum, e) => sum + e.cajonesAzules, 0).toLocaleString()}</p>
                <p><strong>Total Cajones Blancos:</strong> ${entries.reduce((sum, e) => sum + e.cajonesBlancos, 0).toLocaleString()}</p>
                <p><strong>Ubicaciones Reportadas:</strong> ${entries.length}</p>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
}

// Utility Functions
function saveData() {
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
}

function loadData() {
    const saved = localStorage.getItem('inventoryData');
    if (saved) {
        inventoryData = JSON.parse(saved);
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const container = document.querySelector('.tab-content.active');
    if (container) {
        container.insertBefore(alert, container.firstChild);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${day} de ${months[parseInt(month) - 1]} de ${year}`;
}

// Demo Data (optional - for testing)
function loadDemoData() {
    const today = new Date().toISOString().split('T')[0];
    
    inventoryData = [
        {
            id: 1,
            date: today,
            time: '07:21:39',
            user: 'Carmen',
            location: 'San Isidro',
            cajonesArmables: 105,
            cajonesRotos: 0,
            cajonesAzules: 0,
            cajonesBlancos: 0,
            notas: 'Tabla San Isidro'
        },
        {
            id: 2,
            date: today,
            time: '07:21:50',
            user: 'Guadalupe',
            location: 'Castillo',
            cajonesArmables: 149,
            cajonesRotos: 0,
            cajonesAzules: 0,
            cajonesBlancos: 0,
            notas: ''
        },
        {
            id: 3,
            date: today,
            time: '07:22:17',
            user: 'Jose_Gomez',
            location: 'Plataformas GAB',
            cajonesArmables: 168,
            cajonesRotos: 0,
            cajonesAzules: 0,
            cajonesBlancos: 0,
            notas: '4 camiones c/42a c/u'
        }
    ];
    
    saveData();
    showAlert('✅ Datos de demostración cargados', 'success');
    updateTodayEntries();
    updateDashboard();
}

// Uncomment to load demo data
// loadDemoData();
