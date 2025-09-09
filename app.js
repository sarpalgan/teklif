// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// Mobile bottom navigation
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

// Menu items and content areas
const menuItems = document.querySelectorAll('.menu-item');
const contentModules = document.querySelectorAll('.content-module');
const contentTitle = document.getElementById('contentTitle');
const contentSubtitle = document.getElementById('contentSubtitle');

// Mobile menu toggle
function toggleMobileMenu() {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// Close mobile menu
function closeMobileMenuHandler() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
}

// Mobile bottom navigation handler
function handleMobileNavigation(moduleKey) {
    // Update mobile nav active state
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.module === moduleKey) {
            item.classList.add('active');
        }
    });
    
    // Switch to the module
    switchModule(moduleKey);
}

// Initialize mobile navigation
function initMobileNavigation() {
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const moduleKey = item.dataset.module;
            if (moduleKey === 'settings') {
                // Handle settings - could open a modal or navigate to settings
                showNotification('Ayarlar sayfası yakında eklenecek', 'info');
                return;
            }
            handleMobileNavigation(moduleKey);
        });
    });
    
    // Set default active state for dashboard
    const dashboardNavItem = document.querySelector('.mobile-nav-item[data-module="dashboard"]');
    if (dashboardNavItem) {
        dashboardNavItem.classList.add('active');
    }
}

// Show notification function
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Dark mode functionality
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    } else {
        html.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    }
}

// Initialize dark mode toggles
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleDesktop = document.getElementById('darkModeToggleDesktop');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (darkModeToggleDesktop) {
        darkModeToggleDesktop.addEventListener('click', toggleDarkMode);
    }
}

// Module content configuration
const moduleConfig = {
    dashboard: {
        title: 'Dashboard',
        subtitle: 'Genel bakış ve önemli bilgiler'
    },
    teklif: {
        title: 'Teklif İşlemleri',
        subtitle: 'Teklif oluşturma, düzenleme ve yönetim'
    },
    urun: {
        title: 'Ürün İşlemleri',
        subtitle: 'Ürün ekleme, düzenleme ve stok yönetimi'
    },
    musteri: {
        title: 'Müşteri İşlemleri',
        subtitle: 'Müşteri ekleme, düzenleme ve ilişki yönetimi'
    }
};

// Switch content module
function switchModule(moduleKey) {
    // Update menu active state (desktop sidebar)
    menuItems.forEach(item => {
        item.classList.remove('active', 'bg-primary-50', 'text-primary-600');
        if (item.dataset.module === moduleKey) {
            item.classList.add('active', 'bg-primary-50', 'text-primary-600');
        }
    });

    // Update mobile nav active state
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.module === moduleKey) {
            item.classList.add('active');
        }
    });

    // Hide all content modules
    contentModules.forEach(module => {
        module.classList.add('hidden');
    });

    // Show selected module
    const targetModule = document.getElementById(`${moduleKey}-content`);
    if (targetModule) {
        targetModule.classList.remove('hidden');
    }

    // Update header
    const config = moduleConfig[moduleKey];
    if (config) {
        contentTitle.textContent = config.title;
        contentSubtitle.textContent = config.subtitle;
    }

    // Close mobile menu if open
    closeMobileMenuHandler();

    // Initialize module-specific functionality
    if (moduleKey === 'teklif') {
        // Initialize Teklif İşlemleri module
        if (!teklifIslemleri) {
            teklifIslemleri = new TeklifIslemleri();
        }
    } else if (moduleKey === 'urun') {
        // Initialize Ürün İşlemleri module
        if (!urunIslemleri) {
            urunIslemleri = new UrunIslemleri();
        }
    } else if (moduleKey === 'musteri') {
        // Initialize Müşteri İşlemleri module
        if (!musteriIslemleri) {
            musteriIslemleri = new MusteriIslemleri();
        }
    }

    // Close mobile menu on module switch
    if (window.innerWidth < 1024) {
        closeMobileMenuHandler();
    }
}

// Event listeners
// Mobile menu button removed - using bottom navigation
closeMobileMenu?.addEventListener('click', closeMobileMenuHandler);
overlay?.addEventListener('click', closeMobileMenuHandler);

// Menu item click handlers
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const moduleKey = item.dataset.module;
        switchModule(moduleKey);
    });
});

// Close mobile menu when clicking outside on larger screens
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.add('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        closeMobileMenuHandler();
    }
});

// Initialize with dashboard active
document.addEventListener('DOMContentLoaded', () => {
    switchModule('dashboard');
});

// Touch gesture support for mobile menu
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe left to close menu
        if (diffX > 50 && window.innerWidth < 1024) {
            closeMobileMenuHandler();
        }
        // Swipe right from left edge to open menu
        if (diffX < -50 && touchStartX < 50 && window.innerWidth < 1024) {
            toggleMobileMenu();
        }
    }

    touchStartX = 0;
    touchStartY = 0;
});

// Accessibility improvements
menuItems.forEach(item => {
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const moduleKey = item.dataset.module;
            switchModule(moduleKey);
        }
    });
});

// Add loading states and smooth transitions
function showLoading(element) {
    element.style.opacity = '0.5';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Simulate loading for better UX (optional)
function simulateModuleLoading(moduleKey) {
    const targetModule = document.getElementById(`${moduleKey}-content`);
    if (targetModule) {
        showLoading(targetModule);
        setTimeout(() => {
            hideLoading(targetModule);
        }, 300);
    }
}

console.log('İş Yönetim Sistemi başarıyla yüklendi!');

// Teklif İşlemleri Module
class TeklifIslemleri {
    constructor() {
        this.selectedProducts = [];
        this.companies = [];
        this.customers = [];
        this.products = [];
        this.currentTab = 'yeni-teklif';
        this.gonderilmisTelifler = [];
        this.taslakTeklifler = [];
        
        this.init();
        this.loadMockData();
    }

    init() {
        this.bindEvents();
        this.setupAutoComplete();
        this.loadTabContent();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.teklif-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Form submission
        const form = document.getElementById('yeni-teklif-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitTeklif();
            });
        }

        // Product search
        const productSearch = document.getElementById('urun-arama');
        if (productSearch) {
            productSearch.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // Modal events
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Export buttons
        document.getElementById('export-gonderilen')?.addEventListener('click', () => {
            this.exportData('gonderilen');
        });
        
        document.getElementById('export-taslak')?.addEventListener('click', () => {
            this.exportData('taslak');
        });

        // Form validation
        this.setupFormValidation();
    }

    setupAutoComplete() {
        // Company autocomplete
        const sirketInput = document.getElementById('sirket-adi');
        if (sirketInput) {
            sirketInput.addEventListener('input', (e) => {
                this.showDropdown('sirket', e.target.value);
            });
        }

        // Customer autocomplete
        const musteriInput = document.getElementById('musteri-adi');
        if (musteriInput) {
            musteriInput.addEventListener('input', (e) => {
                this.showDropdown('musteri', e.target.value);
            });
        }

        // Click outside to close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.relative')) {
                this.hideAllDropdowns();
            }
        });
    }

    showDropdown(type, query) {
        const dropdown = document.getElementById(`${type}-dropdown`);
        if (!dropdown) return;

        let data = type === 'sirket' ? this.companies : this.customers;
        
        if (query.length < 2) {
            dropdown.classList.add('hidden');
            return;
        }

        const filtered = data.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        dropdown.innerHTML = '';
        
        if (filtered.length === 0) {
            dropdown.innerHTML = '<div class="px-3 py-2 text-gray-500">Sonuç bulunamadı</div>';
        } else {
            filtered.forEach(item => {
                const div = document.createElement('div');
                div.className = 'px-3 py-2 hover:bg-gray-100 cursor-pointer';
                div.textContent = item.name;
                div.addEventListener('click', () => {
                    document.getElementById(`${type}-adi`).value = item.name;
                    dropdown.classList.add('hidden');
                    this.validateForm();
                });
                dropdown.appendChild(div);
            });
        }

        dropdown.classList.remove('hidden');
    }

    searchProducts(query) {
        const dropdown = document.getElementById('urun-dropdown');
        if (!dropdown) return;

        if (query.length < 2) {
            dropdown.classList.add('hidden');
            return;
        }

        const filtered = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) &&
            !this.selectedProducts.find(sp => sp.id === product.id)
        );

        dropdown.innerHTML = '';
        
        if (filtered.length === 0) {
            dropdown.innerHTML = '<div class="px-3 py-2 text-gray-500">Sonuç bulunamadı</div>';
        } else {
            filtered.forEach(product => {
                const div = document.createElement('div');
                div.className = 'px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between';
                div.innerHTML = `
                    <span>${product.name}</span>
                    <span class="text-sm text-gray-500">${product.price} ${product.currency}</span>
                `;
                div.addEventListener('click', () => {
                    this.addProduct(product);
                    document.getElementById('urun-arama').value = '';
                    dropdown.classList.add('hidden');
                });
                dropdown.appendChild(div);
            });
        }

        dropdown.classList.remove('hidden');
    }

    addProduct(product) {
        const selectedProduct = {
            ...product,
            quantity: 1,
            customPrice: product.price
        };

        this.selectedProducts.push(selectedProduct);
        this.renderSelectedProducts();
        this.calculateTotal();
        this.validateForm();
    }

    removeProduct(productId) {
        this.selectedProducts = this.selectedProducts.filter(p => p.id !== productId);
        this.renderSelectedProducts();
        this.calculateTotal();
        this.validateForm();
    }

    renderSelectedProducts() {
        const container = document.getElementById('secilen-urunler');
        if (!container) return;

        container.innerHTML = '';

        this.selectedProducts.forEach(product => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 p-4 rounded-lg border';
            div.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-800">${product.name}</h4>
                    <button class="text-red-500 hover:text-red-700" onclick="teklifIslemleri.removeProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Miktar</label>
                        <input
                            type="number"
                            min="1"
                            value="${product.quantity}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            onchange="teklifIslemleri.updateQuantity(${product.id}, this.value)"
                        >
                    </div>
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Birim Fiyat</label>
                        <input
                            type="number"
                            step="0.01"
                            value="${product.customPrice}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            onchange="teklifIslemleri.updatePrice(${product.id}, this.value)"
                        >
                    </div>
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Döviz</label>
                        <select
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            onchange="teklifIslemleri.updateCurrency(${product.id}, this.value)"
                        >
                            <option value="TL" ${product.currency === 'TL' ? 'selected' : ''}>TL</option>
                            <option value="USD" ${product.currency === 'USD' ? 'selected' : ''}>USD</option>
                            <option value="EUR" ${product.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                        </select>
                    </div>
                </div>
                <div class="mt-3 text-right">
                    <span class="text-sm text-gray-600">Toplam: </span>
                    <span class="font-semibold">${(product.quantity * product.customPrice).toFixed(2)} ${product.currency}</span>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateQuantity(productId, quantity) {
        const product = this.selectedProducts.find(p => p.id === productId);
        if (product) {
            product.quantity = parseInt(quantity) || 1;
            this.renderSelectedProducts();
            this.calculateTotal();
        }
    }

    updatePrice(productId, price) {
        const product = this.selectedProducts.find(p => p.id === productId);
        if (product) {
            product.customPrice = parseFloat(price) || 0;
            this.renderSelectedProducts();
            this.calculateTotal();
        }
    }

    updateCurrency(productId, currency) {
        const product = this.selectedProducts.find(p => p.id === productId);
        if (product) {
            product.currency = currency;
            this.renderSelectedProducts();
            this.calculateTotal();
        }
    }

    calculateTotal() {
        let total = 0;
        const currency = this.selectedProducts[0]?.currency || 'TL';
        
        this.selectedProducts.forEach(product => {
            total += product.quantity * product.customPrice;
        });

        const totalElement = document.getElementById('toplam-tutar');
        if (totalElement) {
            totalElement.textContent = `${total.toFixed(2)} ${currency}`;
        }
    }

    setupFormValidation() {
        const inputs = ['sirket-adi', 'musteri-adi'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.validateForm());
            }
        });
    }

    validateForm() {
        const sirketAdi = document.getElementById('sirket-adi')?.value.trim();
        const musteriAdi = document.getElementById('musteri-adi')?.value.trim();
        const hasProducts = this.selectedProducts.length > 0;
        
        const submitBtn = document.getElementById('teklif-olustur-btn');
        if (submitBtn) {
            const isValid = sirketAdi && musteriAdi && hasProducts;
            submitBtn.disabled = !isValid;
        }
    }

    async submitTeklif() {
        const submitBtn = document.getElementById('teklif-olustur-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Gönderiliyor...';
            submitBtn.disabled = true;

            const formData = {
                sirket_adi: document.getElementById('sirket-adi').value,
                musteri_adi: document.getElementById('musteri-adi').value,
                teklif_tarihi: new Date().toISOString(),
                teklif_no: this.generateTeklifNo(),
                toplam_tutar: this.calculateTotalAmount(),
                doviz_cinsi: 'TL',
                durum: 'taslak',
                kullanici_id: 1 // Default user
            };

            // Save to Supabase
            await dbService.create('teklifler', formData);
            
            // Also send webhook if needed
            try {
                await dbService.sendWebhook({
                    ...formData,
                    urunler: this.selectedProducts
                });
            } catch (webhookError) {
                console.warn('Webhook hatası:', webhookError);
            }

            alert('Teklif başarıyla oluşturuldu!');
            this.resetForm();
                
            // Switch to sent offers tab
            this.switchTab('gonderilen');

        } catch (error) {
            console.error('Teklif gönderme hatası:', error);
            alert('Teklif gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    generateTeklifNo() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `TK${year}${month}${day}${random}`;
    }

    calculateTotalAmount() {
        return this.selectedProducts.reduce((total, product) => {
            return total + (product.quantity * product.customPrice);
        }, 0);
    }

    resetForm() {
        document.getElementById('yeni-teklif-form').reset();
        this.selectedProducts = [];
        this.renderSelectedProducts();
        this.calculateTotal();
        this.validateForm();
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.teklif-tab').forEach(tab => {
            tab.classList.remove('active', 'border-primary-600', 'text-primary-600');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active', 'border-primary-600', 'text-primary-600');
            }
        });

        // Show/hide tab content
        document.querySelectorAll('.teklif-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        // Load tab-specific data
        if (tabName === 'gonderilen') {
            this.loadGonderilmisTelifler();
        } else if (tabName === 'taslak') {
            this.loadTaslakTeklifler();
        }
    }

    async loadGonderilmisTelifler() {
        try {
            const teklifler = await dbService.getAll('teklifler');
            this.gonderilmisTelifler = teklifler?.filter(t => t.durum === 'gonderildi') || [];
            
            const tbody = document.getElementById('gonderilen-tbody');
            if (!tbody) return;

            tbody.innerHTML = '';
            
            this.gonderilmisTelifler.forEach((teklif, index) => {
                const row = this.createTableRow(teklif, index, 'gonderilen');
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Gönderilmiş teklifler yükleme hatası:', error);
            this.gonderilmisTelifler = [];
        }
    }

    async loadTaslakTeklifler() {
        try {
            const teklifler = await dbService.getAll('teklifler');
            this.taslakTeklifler = teklifler?.filter(t => t.durum === 'taslak') || [];
            
            const tbody = document.getElementById('taslak-tbody');
            if (!tbody) return;

            tbody.innerHTML = '';
            
            this.taslakTeklifler.forEach((teklif, index) => {
                const row = this.createTableRow(teklif, index, 'taslak');
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Taslak teklifler yükleme hatası:', error);
            this.taslakTeklifler = [];
        }
    }

    createTableRow(teklif, index, type) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        
        const formattedDate = new Date(teklif.teklif_tarihi).toLocaleDateString('tr-TR');
        const formattedAmount = `${(teklif.toplam_tutar || 0).toFixed(2)} ${teklif.doviz_cinsi || 'TL'}`;
        
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded" value="${index}">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${teklif.teklif_no}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${teklif.sirket_adi}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${teklif.musteri_adi}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formattedDate}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formattedAmount}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                    onclick="teklifIslemleri.previewTeklif(${teklif.teklif_kodu}, '${type}')"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                >
                    <i class="fas fa-eye"></i> Önizle
                </button>
                <button 
                    onclick="teklifIslemleri.downloadTeklif(${index}, '${type}')"
                    class="text-green-600 hover:text-green-900"
                >
                    <i class="fas fa-download"></i> İndir
                </button>
            </td>
        `;
        
        return tr;
    }

    previewTeklif(index, type) {
        const teklif = type === 'gonderilen' ? this.gonderilmisTelifler[index] : this.taslakTeklifler[index];
        
        const modal = document.getElementById('teklif-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (!modal || !modalContent) return;

        const formattedDate = new Date(teklif.tarih).toLocaleDateString('tr-TR');
        const total = teklif.toplam?.toFixed(2) || '0.00';
        const currency = teklif.urunler[0]?.currency || 'TL';

        modalContent.innerHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">Teklif Bilgileri</h4>
                        <div class="space-y-2 text-sm">
                            <div><span class="font-medium">Teklif No:</span> ${teklif.teklifNo}</div>
                            <div><span class="font-medium">Tarih:</span> ${formattedDate}</div>
                            <div><span class="font-medium">Durum:</span> 
                                <span class="px-2 py-1 rounded text-xs ${type === 'gonderilen' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                    ${type === 'gonderilen' ? 'Gönderildi' : 'Taslak'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">Müşteri Bilgileri</h4>
                        <div class="space-y-2 text-sm">
                            <div><span class="font-medium">Şirket:</span> ${teklif.sirketAdi}</div>
                            <div><span class="font-medium">Müşteri:</span> ${teklif.musteriAdi}</div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-800 mb-3">Ürünler</h4>
                    <div class="overflow-x-auto">
                        <table class="w-full border border-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Miktar</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Toplam</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${teklif.urunler.map(urun => `
                                    <tr>
                                        <td class="px-4 py-2 text-sm text-gray-900">${urun.name}</td>
                                        <td class="px-4 py-2 text-sm text-gray-900">${urun.quantity}</td>
                                        <td class="px-4 py-2 text-sm text-gray-900">${urun.customPrice} ${urun.currency}</td>
                                        <td class="px-4 py-2 text-sm text-gray-900">${(urun.quantity * urun.customPrice).toFixed(2)} ${urun.currency}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-medium text-gray-700">Genel Toplam:</span>
                        <span class="text-xl font-bold text-primary-600">${total} ${currency}</span>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('teklif-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    downloadTeklif(index, type) {
        const teklif = type === 'gonderilen' ? this.gonderilmisTelifler[index] : this.taslakTeklifler[index];
        
        // Create and download JSON file
        const dataStr = JSON.stringify(teklif, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `teklif_${teklif.teklifNo}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    exportData(type) {
        const data = type === 'gonderilen' ? this.gonderilmisTelifler : this.taslakTeklifler;
        
        if (data.length === 0) {
            this.showError('Dışa aktarılacak veri bulunamadı.');
            return;
        }

        // Create CSV content
        const headers = ['Teklif No', 'Şirket', 'Müşteri', 'Tarih', 'Toplam', 'Durum'];
        const csvContent = [
            headers.join(','),
            ...data.map(teklif => [
                teklif.teklifNo,
                teklif.sirketAdi,
                teklif.musteriAdi,
                new Date(teklif.tarih).toLocaleDateString('tr-TR'),
                `${teklif.toplam?.toFixed(2)} ${teklif.urunler[0]?.currency || 'TL'}`,
                type === 'gonderilen' ? 'Gönderildi' : 'Taslak'
            ].join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_teklifler_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    hideAllDropdowns() {
        ['sirket-dropdown', 'musteri-dropdown', 'urun-dropdown'].forEach(id => {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        });
    }

    showSuccess(message) {
        // Simple success notification (you can replace with a proper toast library)
        alert(`✅ ${message}`);
    }

    showError(message) {
        // Simple error notification (you can replace with a proper toast library)
        alert(`❌ ${message}`);
    }

    loadMockData() {
        // Mock companies data
        this.companies = [
            { id: 1, name: 'ABC Teknoloji A.Ş.' },
            { id: 2, name: 'XYZ İnşaat Ltd.' },
            { id: 3, name: 'Demo Yazılım A.Ş.' },
            { id: 4, name: 'Test Elektrik Ltd.' },
            { id: 5, name: 'Örnek Makine A.Ş.' }
        ];

        // Mock customers data
        this.customers = [
            { id: 1, name: 'Mehmet Yılmaz' },
            { id: 2, name: 'Ayşe Kaya' },
            { id: 3, name: 'Can Demir' },
            { id: 4, name: 'Elif Çelik' },
            { id: 5, name: 'Murat Özkan' }
        ];

        // Mock products data
        this.products = [
            { id: 1, name: 'Laptop Dell XPS 13', price: 25000, currency: 'TL' },
            { id: 2, name: 'iPhone 15 Pro', price: 1200, currency: 'USD' },
            { id: 3, name: 'Samsung Monitor 27"', price: 800, currency: 'EUR' },
            { id: 4, name: 'Wireless Klavye', price: 150, currency: 'TL' },
            { id: 5, name: 'Gaming Mouse', price: 75, currency: 'USD' },
            { id: 6, name: 'USB Hub', price: 45, currency: 'EUR' },
            { id: 7, name: 'Webcam HD', price: 300, currency: 'TL' },
            { id: 8, name: 'Headphone Sony', price: 250, currency: 'USD' }
        ];

        // Mock sent offers
        this.gonderilmisTelifler = [
            {
                teklifNo: 'TK20250908001',
                sirketAdi: 'ABC Teknoloji A.Ş.',
                musteriAdi: 'Mehmet Yılmaz',
                tarih: '2025-09-08T10:30:00Z',
                toplam: 26200,
                urunler: [
                    { id: 1, name: 'Laptop Dell XPS 13', quantity: 1, customPrice: 25000, currency: 'TL' },
                    { id: 4, name: 'Wireless Klavye', quantity: 8, customPrice: 150, currency: 'TL' }
                ],
                durum: 'Gönderildi'
            },
            {
                teklifNo: 'TK20250907002',
                sirketAdi: 'XYZ İnşaat Ltd.',
                musteriAdi: 'Ayşe Kaya',
                tarih: '2025-09-07T14:15:00Z',
                toplam: 1200,
                urunler: [
                    { id: 2, name: 'iPhone 15 Pro', quantity: 1, customPrice: 1200, currency: 'USD' }
                ],
                durum: 'Gönderildi'
            }
        ];

        // Mock draft offers
        this.taslakTeklifler = [
            {
                teklifNo: 'TK20250908003',
                sirketAdi: 'Demo Yazılım A.Ş.',
                musteriAdi: 'Can Demir',
                tarih: '2025-09-08T09:00:00Z',
                toplam: 800,
                urunler: [
                    { id: 3, name: 'Samsung Monitor 27"', quantity: 1, customPrice: 800, currency: 'EUR' }
                ],
                durum: 'Taslak'
            }
        ];
    }

    loadTabContent() {
        // Initialize with first tab active
        this.switchTab('yeni-teklif');
    }
}

// Initialize when teklif module is loaded
let teklifIslemleri;

// Ürün İşlemleri Module
class UrunIslemleri {
    constructor() {
        this.urunler = [];
        this.currentTab = 'yeni-urun';
        this.filteredUrunler = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.editingUrun = null;
        
        this.init();
        this.loadMockData();
    }

    init() {
        this.bindEvents();
        this.setupImageHandling();
        this.loadTabContent();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.urun-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Form submission
        const form = document.getElementById('yeni-urun-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitUrun();
            });
        }

        // Edit form submission
        const editForm = document.getElementById('urun-duzenle-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateUrun();
            });
        }

        // Currency change
        const dovizSelect = document.getElementById('doviz-cinsi');
        if (dovizSelect) {
            dovizSelect.addEventListener('change', (e) => {
                this.updateCurrencyDisplay(e.target.value);
            });
        }

        // Form validation
        this.setupFormValidation();

        // Filter events
        this.setupFilterEvents();

        // Modal events
        this.setupModalEvents();
    }

    setupImageHandling() {
        // Radio button toggle
        const radioButtons = document.querySelectorAll('input[name="gorsel-type"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.toggleImageInput(e.target.value);
            });
        });

        // File upload
        const fileInput = document.getElementById('urun-gorsel-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files[0]);
            });
        }

        // URL test
        const urlTestBtn = document.getElementById('url-test-btn');
        if (urlTestBtn) {
            urlTestBtn.addEventListener('click', () => {
                this.testImageUrl();
            });
        }

        // Remove image
        const removeImageBtn = document.getElementById('remove-image');
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                this.removeImage();
            });
        }
    }

    setupFormValidation() {
        const inputs = ['urun-adi', 'urun-aciklama', 'urun-fiyat', 'doviz-cinsi'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.validateForm());
                input.addEventListener('blur', () => this.validateField(id));
            }
        });
    }

    setupFilterEvents() {
        const filters = ['filter-urun-adi', 'filter-doviz', 'filter-min-fiyat', 'filter-max-fiyat'];
        filters.forEach(id => {
            const filter = document.getElementById(id);
            if (filter) {
                filter.addEventListener('input', () => this.applyFilters());
            }
        });

        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    setupModalEvents() {
        const closeModal = document.getElementById('close-urun-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeEditModal());
        }

        const cancelEdit = document.getElementById('cancel-edit');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => this.closeEditModal());
        }

        const saveEdit = document.getElementById('save-edit');
        if (saveEdit) {
            saveEdit.addEventListener('click', () => this.updateUrun());
        }

        // Real-time validasyon için event listener'lar
        const editInputs = [
            'edit-urun-adi',
            'edit-urun-aciklama', 
            'edit-urun-fiyat',
            'edit-doviz-cinsi',
            'edit-urun-gorsel-url'
        ];

        editInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', () => this.validateEditForm());
                input.addEventListener('input', () => {
                    // Hata varsa temizle
                    const errorElement = document.getElementById(inputId + '-error');
                    if (errorElement && !errorElement.classList.contains('hidden')) {
                        this.hideFieldError(input, errorElement);
                    }
                });
            }
        });
    }

    toggleImageInput(type) {
        const uploadSection = document.getElementById('upload-section');
        const urlSection = document.getElementById('url-section');
        
        if (type === 'upload') {
            uploadSection.classList.remove('hidden');
            urlSection.classList.add('hidden');
        } else {
            uploadSection.classList.add('hidden');
            urlSection.classList.remove('hidden');
        }
        
        this.clearImagePreview();
    }

    handleFileUpload(file) {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showFieldError('urun-gorsel', 'Lütfen geçerli bir görsel dosyası seçin.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showFieldError('urun-gorsel', 'Dosya boyutu 5MB\'dan küçük olmalıdır.');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showImagePreview(e.target.result);
            this.hideFieldError('urun-gorsel');
        };
        reader.readAsDataURL(file);
    }

    async testImageUrl() {
        const urlInput = document.getElementById('urun-gorsel-url');
        const url = urlInput.value.trim();
        
        if (!url) {
            this.showFieldError('urun-gorsel', 'Lütfen bir URL girin.');
            return;
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            this.showFieldError('urun-gorsel', 'Geçerli bir URL girin.');
            return;
        }

        const testBtn = document.getElementById('url-test-btn');
        const originalText = testBtn.innerHTML;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Test ediliyor...';
        testBtn.disabled = true;

        try {
            // Test image loading
            const img = new Image();
            img.onload = () => {
                this.showImagePreview(url);
                this.hideFieldError('urun-gorsel');
                testBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Geçerli URL';
                testBtn.disabled = false;
                setTimeout(() => {
                    testBtn.innerHTML = originalText;
                }, 2000);
            };
            
            img.onerror = () => {
                this.showFieldError('urun-gorsel', 'URL\'den görsel yüklenemedi. Lütfen geçerli bir görsel URL\'si girin.');
                testBtn.innerHTML = originalText;
                testBtn.disabled = false;
            };
            
            img.src = url;
            
        } catch (error) {
            this.showFieldError('urun-gorsel', 'URL test edilirken bir hata oluştu.');
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }
    }

    showImagePreview(src) {
        const previewContainer = document.getElementById('image-preview');
        const previewImage = document.getElementById('preview-image');
        
        previewImage.src = src;
        previewContainer.classList.remove('hidden');
    }

    removeImage() {
        this.clearImagePreview();
        document.getElementById('urun-gorsel-file').value = '';
        document.getElementById('urun-gorsel-url').value = '';
    }

    clearImagePreview() {
        const previewContainer = document.getElementById('image-preview');
        const previewImage = document.getElementById('preview-image');
        
        previewContainer.classList.add('hidden');
        previewImage.src = '';
    }

    updateCurrencyDisplay(currency) {
        const currencySpan = document.getElementById('fiyat-currency');
        if (currencySpan) {
            currencySpan.textContent = currency || 'TL';
        }
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        let isValid = true;
        const value = field.value.trim();

        switch (fieldId) {
            case 'urun-adi':
                if (!value) {
                    this.showFieldError(fieldId, 'Ürün adı zorunludur.');
                    isValid = false;
                } else if (value.length < 2) {
                    this.showFieldError(fieldId, 'Ürün adı en az 2 karakter olmalıdır.');
                    isValid = false;
                } else {
                    this.hideFieldError(fieldId);
                }
                break;

            case 'urun-aciklama':
                if (!value) {
                    this.showFieldError(fieldId, 'Ürün açıklaması zorunludur.');
                    isValid = false;
                } else if (value.length < 10) {
                    this.showFieldError(fieldId, 'Ürün açıklaması en az 10 karakter olmalıdır.');
                    isValid = false;
                } else {
                    this.hideFieldError(fieldId);
                }
                break;

            case 'urun-fiyat':
                const price = parseFloat(value);
                if (!value) {
                    this.showFieldError(fieldId, 'Fiyat zorunludur.');
                    isValid = false;
                } else if (isNaN(price) || price <= 0) {
                    this.showFieldError(fieldId, 'Geçerli bir fiyat girin.');
                    isValid = false;
                } else {
                    this.hideFieldError(fieldId);
                }
                break;

            case 'doviz-cinsi':
                if (!value) {
                    this.showFieldError(fieldId, 'Döviz cinsi seçimi zorunludur.');
                    isValid = false;
                } else {
                    this.hideFieldError(fieldId);
                }
                break;
        }

        return isValid;
    }

    validateForm() {
        const fields = ['urun-adi', 'urun-aciklama', 'urun-fiyat', 'doviz-cinsi'];
        let isValid = true;

        fields.forEach(fieldId => {
            if (!this.validateField(fieldId)) {
                isValid = false;
            }
        });

        const submitBtn = document.getElementById('urun-ekle-btn');
        if (submitBtn) {
            submitBtn.disabled = !isValid;
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    hideFieldError(fieldId) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    async submitUrun() {
        if (!this.validateForm()) return;

        const submitBtn = document.getElementById('urun-ekle-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Ekleniyor...';
            submitBtn.disabled = true;

            // Get form data
            const formData = this.getFormData();
            
            // Create new product data for Supabase
            const newUrun = {
                urun_adi: formData.name,
                urun_aciklama: formData.description,
                birim_fiyat: formData.price,
                doviz_cinsi: formData.currency,
                gorsel_url: formData.imageUrl,
                eklenme_tarihi: new Date().toISOString()
            };

            await dbService.create('urun_listesi', newUrun);
            
            alert('Ürün başarıyla eklendi!');
            this.resetForm();
            
            // Switch to product list tab
            this.switchTab('urun-listesi');

        } catch (error) {
            console.error('Ürün ekleme hatası:', error);
            alert('Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    getFormData() {
        const urunAdi = document.getElementById('urun-adi').value.trim();
        const urunAciklama = document.getElementById('urun-aciklama').value.trim();
        const urunFiyat = parseFloat(document.getElementById('urun-fiyat').value);
        const dovizCinsi = document.getElementById('doviz-cinsi').value;
        
        // Get image data
        let gorselUrl = '';
        const gorselType = document.querySelector('input[name="gorsel-type"]:checked').value;
        
        if (gorselType === 'upload') {
            const fileInput = document.getElementById('urun-gorsel-file');
            if (fileInput.files[0]) {
                // In a real app, you would upload to a server and get URL
                gorselUrl = document.getElementById('preview-image').src;
            }
        } else {
            gorselUrl = document.getElementById('urun-gorsel-url').value.trim();
        }

        return {
            name: urunAdi,
            description: urunAciklama,
            price: urunFiyat,
            currency: dovizCinsi,
            imageUrl: gorselUrl
        };
    }

    resetForm() {
        document.getElementById('yeni-urun-form').reset();
        this.clearImagePreview();
        this.toggleImageInput('upload');
        this.updateCurrencyDisplay('TL');
        
        // Clear all error messages
        const errorElements = document.querySelectorAll('[id$="-error"]');
        errorElements.forEach(el => el.classList.add('hidden'));
        
        this.validateForm();
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.urun-tab').forEach(tab => {
            tab.classList.remove('active', 'border-primary-600', 'text-primary-600');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active', 'border-primary-600', 'text-primary-600');
            }
        });

        // Show/hide tab content
        document.querySelectorAll('.urun-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        // Load tab-specific data
        if (tabName === 'urun-listesi') {
            this.loadUrunListesi();
        }
    }

    async loadUrunListesi() {
        try {
            const urunler = await dbService.getAll('urun_listesi');
            this.urunler = urunler || [];
            this.applyFilters();
        } catch (error) {
            console.error('Ürün listesi yükleme hatası:', error);
            this.urunler = [];
            this.renderUrunTable();
        }
    }

    applyFilters() {
        const nameFilter = document.getElementById('filter-urun-adi').value.toLowerCase();
        const currencyFilter = document.getElementById('filter-doviz').value;
        const minPrice = parseFloat(document.getElementById('filter-min-fiyat').value) || 0;
        const maxPrice = parseFloat(document.getElementById('filter-max-fiyat').value) || Infinity;

        this.filteredUrunler = this.urunler.filter(urun => {
            const nameMatch = (urun.urun_adi || '').toLowerCase().includes(nameFilter);
            const currencyMatch = !currencyFilter || urun.doviz_cinsi === currencyFilter;
            const priceMatch = (urun.birim_fiyat || 0) >= minPrice && (urun.birim_fiyat || 0) <= maxPrice;
            
            return nameMatch && currencyMatch && priceMatch;
        });

        this.currentPage = 1;
        this.renderUrunTable();
    }

    clearFilters() {
        document.getElementById('filter-urun-adi').value = '';
        document.getElementById('filter-doviz').value = '';
        document.getElementById('filter-min-fiyat').value = '';
        document.getElementById('filter-max-fiyat').value = '';
        this.applyFilters();
    }

    renderUrunTable() {
        const tbody = document.getElementById('urunler-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredUrunler.slice(startIndex, endIndex);

        pageItems.forEach((urun, index) => {
            const globalIndex = startIndex + index;
            const row = this.createUrunTableRow(urun, globalIndex);
            tbody.appendChild(row);
        });

        this.updatePaginationInfo();
    }

    createUrunTableRow(urun, index) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        
        const truncatedDescription = (urun.urun_aciklama || '').length > 50 
            ? urun.urun_aciklama.substring(0, 50) + '...'
            : (urun.urun_aciklama || '');

        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded" value="${index}">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${urun.gorsel_url ? 
                    `<img src="${urun.gorsel_url}" alt="${urun.urun_adi}" class="w-12 h-12 object-cover rounded-md">` :
                    '<div class="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center"><i class="fas fa-image text-gray-400"></i></div>'
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${urun.urun_adi}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900" title="${urun.urun_aciklama || ''}">
                ${truncatedDescription}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${(urun.birim_fiyat || 0).toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${urun.doviz_cinsi || 'TL'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                    onclick="urunIslemleri.editUrun(${urun.urun_kodu})"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                >
                    <i class="fas fa-edit"></i> Düzenle
                </button>
                <button 
                    onclick="urunIslemleri.deleteUrun(${urun.urun_kodu})"
                    class="text-red-600 hover:text-red-900"
                >
                    <i class="fas fa-trash"></i> Sil
                </button>
            </td>
        `;
        
        return tr;
    }

    updatePaginationInfo() {
        const info = document.getElementById('urunler-info');
        if (info) {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredUrunler.length);
            info.textContent = `${startIndex}-${endIndex} arası ${this.filteredUrunler.length} kayıttan`;
        }
    }

    async editUrun(urunId) {
        try {
            const urunler = await dbService.getAll('urun_listesi');
            const urun = urunler.find(u => u.urun_kodu === urunId);
            
            if (!urun) {
                alert('Ürün bulunamadı!');
                return;
            }

            this.editingUrun = urun;
            
            // Fill form
            document.getElementById('edit-urun-id').value = urun.urun_kodu;
            document.getElementById('edit-urun-adi').value = urun.urun_adi || '';
            document.getElementById('edit-urun-aciklama').value = urun.urun_aciklama || '';
            document.getElementById('edit-urun-fiyat').value = urun.birim_fiyat || '';
            document.getElementById('edit-doviz-cinsi').value = urun.doviz_cinsi || 'TL';
            
            // Görsel URL alanını doldur
            const gorselUrlInput = document.getElementById('edit-urun-gorsel-url');
            if (gorselUrlInput) {
                gorselUrlInput.value = urun.gorsel_url || '';
            }
            
            // Show current image if exists
            const currentImagePreview = document.getElementById('edit-current-image-preview');
            const currentImageDiv = document.getElementById('edit-current-image');
            
            if (urun.gorsel_url && currentImagePreview && currentImageDiv) {
                currentImagePreview.src = urun.gorsel_url;
                currentImageDiv.classList.remove('hidden');
            } else if (currentImageDiv) {
                currentImageDiv.classList.add('hidden');
            }
            
            // Show modal
            document.getElementById('urun-duzenle-modal').classList.remove('hidden');
        } catch (error) {
            console.error('Ürün düzenlemesi hatası:', error);
            alert('Ürün bilgileri alınırken hata oluştu!');
        }
    }

    closeEditModal() {
        document.getElementById('urun-duzenle-modal').classList.add('hidden');
        this.editingUrun = null;
    }

    validateEditForm() {
        let isValid = true;

        // Ürün adı kontrolü
        const urunAdi = document.getElementById('edit-urun-adi');
        const urunAdiError = document.getElementById('edit-urun-adi-error') || this.createErrorElement('edit-urun-adi-error');
        if (!urunAdi.value.trim()) {
            this.showFieldError(urunAdi, urunAdiError, 'Ürün adı gereklidir');
            isValid = false;
        } else {
            this.hideFieldError(urunAdi, urunAdiError);
        }

        // Ürün açıklama kontrolü
        const urunAciklama = document.getElementById('edit-urun-aciklama');
        const urunAciklamaError = document.getElementById('edit-urun-aciklama-error') || this.createErrorElement('edit-urun-aciklama-error');
        if (!urunAciklama.value.trim()) {
            this.showFieldError(urunAciklama, urunAciklamaError, 'Ürün açıklama gereklidir');
            isValid = false;
        } else {
            this.hideFieldError(urunAciklama, urunAciklamaError);
        }

        // Fiyat kontrolü
        const urunFiyat = document.getElementById('edit-urun-fiyat');
        const urunFiyatError = document.getElementById('edit-urun-fiyat-error') || this.createErrorElement('edit-urun-fiyat-error');
        const fiyat = parseFloat(urunFiyat.value);
        if (!urunFiyat.value || isNaN(fiyat) || fiyat <= 0) {
            this.showFieldError(urunFiyat, urunFiyatError, 'Geçerli bir fiyat giriniz');
            isValid = false;
        } else {
            this.hideFieldError(urunFiyat, urunFiyatError);
        }

        // Döviz cinsi kontrolü
        const dovizCinsi = document.getElementById('edit-doviz-cinsi');
        const dovizCinsiError = document.getElementById('edit-doviz-cinsi-error') || this.createErrorElement('edit-doviz-cinsi-error');
        if (!dovizCinsi.value) {
            this.showFieldError(dovizCinsi, dovizCinsiError, 'Döviz cinsi seçiniz');
            isValid = false;
        } else {
            this.hideFieldError(dovizCinsi, dovizCinsiError);
        }

        // Görsel URL kontrolü (opsiyonel ama geçerli olmalı)
        const gorselUrl = document.getElementById('edit-urun-gorsel-url');
        if (gorselUrl) {
            const gorselUrlError = document.getElementById('edit-urun-gorsel-url-error') || this.createErrorElement('edit-urun-gorsel-url-error');
            if (gorselUrl.value.trim() && !this.isValidUrl(gorselUrl.value.trim())) {
                this.showFieldError(gorselUrl, gorselUrlError, 'Geçerli bir URL giriniz');
                isValid = false;
            } else {
                this.hideFieldError(gorselUrl, gorselUrlError);
            }
        }

        return isValid;
    }

    createErrorElement(id) {
        const errorElement = document.createElement('div');
        errorElement.id = id;
        errorElement.className = 'text-red-500 text-sm mt-1';
        return errorElement;
    }

    showFieldError(field, errorElement, message) {
        field.classList.add('border-red-500');
        errorElement.textContent = message;
        if (!errorElement.parentNode) {
            field.parentNode.appendChild(errorElement);
        }
        errorElement.classList.remove('hidden');
    }

    hideFieldError(field, errorElement) {
        field.classList.remove('border-red-500');
        if (errorElement.parentNode) {
            errorElement.classList.add('hidden');
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async updateUrun() {
        if (!this.editingUrun) return;

        // Form validasyonu
        if (!this.validateEditForm()) return;

        try {
            const urunId = parseInt(document.getElementById('edit-urun-id').value);
            
            const updateData = {
                urun_adi: document.getElementById('edit-urun-adi').value.trim(),
                urun_aciklama: document.getElementById('edit-urun-aciklama').value.trim(),
                birim_fiyat: parseFloat(document.getElementById('edit-urun-fiyat').value),
                doviz_cinsi: document.getElementById('edit-doviz-cinsi').value
            };

            // Görsel URL alanı varsa ekle
            const gorselUrlInput = document.getElementById('edit-urun-gorsel-url');
            if (gorselUrlInput) {
                updateData.gorsel_url = gorselUrlInput.value.trim();
            }

            await dbService.update('urun_listesi', urunId, updateData);
            
            // Close modal and refresh list
            this.closeEditModal();
            await this.loadUrunListesi();
            
            alert('Ürün başarıyla güncellendi!');
        } catch (error) {
            console.error('Ürün güncelleme hatası:', error);
            alert('Ürün güncellenirken hata oluştu!');
        }
    }

    async deleteUrun(urunId) {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

        try {
            await dbService.delete('urun_listesi', urunId);
            await this.loadUrunListesi();
            alert('Ürün başarıyla silindi!');
        } catch (error) {
            console.error('Ürün silme hatası:', error);
            alert('Ürün silinirken hata oluştu!');
        }
    }

    showSuccess(message) {
        // Simple success notification (you can replace with a proper toast library)
        alert(`✅ ${message}`);
    }

    showError(message) {
        // Simple error notification (you can replace with a proper toast library)
        alert(`❌ ${message}`);
    }

    loadMockData() {
        // Mock products data
        this.urunler = [
            {
                id: 1,
                name: 'Laptop Dell XPS 13',
                description: 'Yüksek performanslı ultrabook, 13.3" 4K dokunmatik ekran, Intel Core i7 işlemci, 16GB RAM, 512GB SSD',
                price: 25000,
                currency: 'TL',
                imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
                createdAt: '2025-09-01T10:00:00Z'
            },
            {
                id: 2,
                name: 'iPhone 15 Pro',
                description: 'En yeni iPhone modeli, A17 Pro çip, ProRAW desteği, 48MP kamera sistemi, Titanium tasarım',
                price: 1200,
                currency: 'USD',
                imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
                createdAt: '2025-09-02T11:30:00Z'
            },
            {
                id: 3,
                name: 'Samsung Monitor 27"',
                description: '4K UHD monitör, HDR10 desteği, USB-C bağlantı, 60Hz yenileme hızı, profesyonel kullanım için ideal',
                price: 800,
                currency: 'EUR',
                imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop',
                createdAt: '2025-09-03T14:15:00Z'
            },
            {
                id: 4,
                name: 'Wireless Klavye',
                description: 'Mekanik hisli kablosuz klavye, RGB aydınlatma, 2.4GHz bağlantı, uzun pil ömrü',
                price: 150,
                currency: 'TL',
                imageUrl: '',
                createdAt: '2025-09-04T09:20:00Z'
            },
            {
                id: 5,
                name: 'Gaming Mouse',
                description: 'Yüksek DPI gaming mouse, programlanabilir tuşlar, ergonomik tasarım, RGB aydınlatma',
                price: 75,
                currency: 'USD',
                imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&h=200&fit=crop',
                createdAt: '2025-09-05T16:45:00Z'
            }
        ];

        this.filteredUrunler = [...this.urunler];
    }

    loadTabContent() {
        // Initialize with first tab active
        this.switchTab('yeni-urun');
    }
}

// Initialize when urun module is loaded
let urunIslemleri;

// Müşteri İşlemleri Module
class MusteriIslemleri {
    constructor() {
        this.musteriler = [];
        this.currentTab = 'yeni-musteri';
        this.filteredMusteriler = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.editingMusteri = null;
        
        this.init();
    }

    async init() {
        this.bindEvents();
        this.setupFormValidation();
        await this.loadMusteriListesi();
        this.loadTabContent();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.musteri-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Form submission
        const form = document.getElementById('yeni-musteri-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitMusteri();
            });
        }

        // Edit form submission
        const editForm = document.getElementById('musteri-duzenle-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateMusteri();
            });
        }

        // Filter events
        this.setupFilterEvents();

        // Modal events
        this.setupModalEvents();
    }

    setupFormValidation() {
        const requiredFields = ['sirket-adi-musteri'];
        const emailFields = ['sirket-mail', 'kisi-mail'];
        
        requiredFields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.validateForm());
                input.addEventListener('blur', () => this.validateField(id));
            }
        });

        emailFields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('blur', () => this.validateEmailField(id));
            }
        });

        // Phone number formatting
        const phoneFields = ['sirket-telefon', 'kisi-telefon-dahili', 'kisi-telefon-mobil'];
        phoneFields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => this.formatPhoneNumber(e.target));
            }
        });
    }

    setupFilterEvents() {
        const filters = ['filter-sirket-adi', 'filter-kisi-adi', 'filter-ulke'];
        filters.forEach(id => {
            const filter = document.getElementById(id);
            if (filter) {
                filter.addEventListener('input', () => this.applyFilters());
            }
        });

        const clearBtn = document.getElementById('clear-musteri-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    setupModalEvents() {
        const closeModal = document.getElementById('close-musteri-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeEditModal());
        }

        const cancelEdit = document.getElementById('cancel-musteri-edit');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => this.closeEditModal());
        }

        const saveEdit = document.getElementById('save-musteri-edit');
        if (saveEdit) {
            saveEdit.addEventListener('click', () => this.updateMusteri());
        }

        // Real-time validasyon için event listener'lar
        const editInputs = [
            'edit-sirket-adi',
            'edit-sirket-adres',
            'edit-sirket-sehir',
            'edit-sirket-ulke',
            'edit-sirket-telefon',
            'edit-sirket-mail',
            'edit-kisi-adi',
            'edit-kisi-unvan',
            'edit-kisi-telefon-dahili',
            'edit-kisi-telefon-mobil',
            'edit-kisi-mail'
        ];

        editInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', () => this.validateEditMusteriForm());
                input.addEventListener('input', () => {
                    // Hata varsa temizle
                    const errorElement = document.getElementById(inputId + '-error');
                    if (errorElement && !errorElement.classList.contains('hidden')) {
                        this.hideFieldError(input, errorElement);
                    }
                });
            }
        });
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        let isValid = true;
        const value = field.value.trim();

        switch (fieldId) {
            case 'sirket-adi-musteri':
                if (!value) {
                    this.showFieldError(fieldId, 'Şirket adı zorunludur.');
                    isValid = false;
                } else if (value.length < 2) {
                    this.showFieldError(fieldId, 'Şirket adı en az 2 karakter olmalıdır.');
                    isValid = false;
                } else {
                    this.hideFieldError(fieldId);
                }
                break;
        }

        return isValid;
    }

    validateEmailField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        const value = field.value.trim();
        if (!value) {
            this.hideFieldError(fieldId);
            return true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showFieldError(fieldId, 'Geçerli bir e-mail adresi girin.');
            return false;
        } else {
            this.hideFieldError(fieldId);
            return true;
        }
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.startsWith('90')) {
            value = value.substring(2);
        }
        
        if (value.length >= 10) {
            if (value.length === 10) {
                // Mobile format: (5XX) XXX XXXX
                if (value.startsWith('5')) {
                    value = `+90 (${value.substring(0, 3)}) ${value.substring(3, 6)} ${value.substring(6)}`;
                } else {
                    // Landline format: (XXX) XXX XXXX
                    value = `+90 (${value.substring(0, 3)}) ${value.substring(3, 6)} ${value.substring(6)}`;
                }
            }
        }
        
        input.value = value;
    }

    validateForm() {
        const sirketAdi = document.getElementById('sirket-adi-musteri')?.value.trim();
        
        const submitBtn = document.getElementById('musteri-ekle-btn');
        if (submitBtn) {
            const isValid = sirketAdi && sirketAdi.length >= 2;
            submitBtn.disabled = !isValid;
        }

        return sirketAdi && sirketAdi.length >= 2;
    }

    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    hideFieldError(fieldId) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    async submitMusteri() {
        if (!this.validateForm()) return;

        const submitBtn = document.getElementById('musteri-ekle-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Ekleniyor...';
            submitBtn.disabled = true;

            // Get form data
            const formData = this.getFormData();
            
            // Add to database
            const newMusteri = await dbService.createMusteri(formData);
            
            this.showSuccess('Müşteri başarıyla eklendi!');
            this.resetForm();
            
            // Reload data from database
            await this.loadMusteriListesi();
            
            // Switch to customer list tab
            this.switchTab('musteri-listesi');

        } catch (error) {
            console.error('Müşteri ekleme hatası:', error);
            this.showError('Müşteri eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    getFormData() {
        return {
            // Şirket bilgileri
            sirketAdi: document.getElementById('sirket-adi-musteri').value.trim(),
            sirketAdres: document.getElementById('sirket-adres').value.trim(),
            sirketSehir: document.getElementById('sirket-sehir').value.trim(),
            sirketUlke: document.getElementById('sirket-ulke').value,
            sirketTelefon: document.getElementById('sirket-telefon').value.trim(),
            sirketMail: document.getElementById('sirket-mail').value.trim(),
            
            // Kişi bilgileri
            kisiAdi: document.getElementById('kisi-adi').value.trim(),
            kisiUnvan: document.getElementById('kisi-unvan').value.trim(),
            kisiTelefonDahili: document.getElementById('kisi-telefon-dahili').value.trim(),
            kisiTelefonMobil: document.getElementById('kisi-telefon-mobil').value.trim(),
            kisiMail: document.getElementById('kisi-mail').value.trim()
        };
    }

    resetForm() {
        document.getElementById('yeni-musteri-form').reset();
        
        // Clear all error messages
        const errorElements = document.querySelectorAll('[id$="-error"]');
        errorElements.forEach(el => el.classList.add('hidden'));
        
        this.validateForm();
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.musteri-tab').forEach(tab => {
            tab.classList.remove('active', 'border-primary-600', 'text-primary-600');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active', 'border-primary-600', 'text-primary-600');
            }
        });

        // Show/hide tab content
        document.querySelectorAll('.musteri-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        // Load tab-specific data
        if (tabName === 'musteri-listesi') {
            this.loadMusteriListesi();
        }
    }

    async loadMusterilerFromDB() {
        try {
            this.musteriler = await dbService.getAll('musteri_listesi');
            this.filteredMusteriler = [...this.musteriler];
            console.log('Müşteriler veritabanından yüklendi:', this.musteriler.length);
        } catch (error) {
            console.error('Müşteri yükleme hatası:', error);
            this.musteriler = [];
            this.filteredMusteriler = [];
        }
    }

    async loadMusteriListesi() {
        await this.loadMusterilerFromDB();
        this.applyFilters();
    }

    applyFilters() {
        const sirketFilter = document.getElementById('filter-sirket-adi').value.toLowerCase();
        const kisiFilter = document.getElementById('filter-kisi-adi').value.toLowerCase();
        const ulkeFilter = document.getElementById('filter-ulke').value;

        this.filteredMusteriler = this.musteriler.filter(musteri => {
            const sirketMatch = (musteri.sirket_adi || '').toLowerCase().includes(sirketFilter);
            const kisiMatch = (musteri.kisi_adi || '').toLowerCase().includes(kisiFilter);
            const ulkeMatch = !ulkeFilter || musteri.sirket_ulke === ulkeFilter;
            
            return sirketMatch && kisiMatch && ulkeMatch;
        });

        this.currentPage = 1;
        this.renderMusteriTable();
    }

    clearFilters() {
        document.getElementById('filter-sirket-adi').value = '';
        document.getElementById('filter-kisi-adi').value = '';
        document.getElementById('filter-ulke').value = '';
        this.applyFilters();
    }

    renderMusteriTable() {
        const tbody = document.getElementById('musteriler-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredMusteriler.slice(startIndex, endIndex);

        pageItems.forEach((musteri, index) => {
            const globalIndex = startIndex + index;
            const row = this.createMusteriTableRow(musteri, globalIndex);
            tbody.appendChild(row);
        });

        this.updatePaginationInfo();
    }

    createMusteriTableRow(musteri, index) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        
        const sehirUlke = [musteri.sirket_sehir, musteri.sirket_ulke].filter(x => x).join(', ');
        const telefon = musteri.kisi_telefon_mobil || musteri.sirket_telefon || musteri.kisi_telefon_dahili || '-';
        const email = musteri.kisi_mail || musteri.sirket_mail || '-';

        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded" value="${index}">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${musteri.sirket_adi}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${musteri.kisi_adi || '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${musteri.kisi_unvan || '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${sehirUlke || '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${telefon}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${email}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                    onclick="musteriIslemleri.editMusteri(${musteri.musteri_kodu})"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                >
                    <i class="fas fa-edit"></i> Düzenle
                </button>
                <button 
                    onclick="musteriIslemleri.deleteMusteri(${musteri.musteri_kodu})"
                    class="text-red-600 hover:text-red-900"
                >
                    <i class="fas fa-trash"></i> Sil
                </button>
            </td>
        `;
        
        return tr;
    }

    updatePaginationInfo() {
        const info = document.getElementById('musteriler-info');
        if (info) {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredMusteriler.length);
            info.textContent = `${startIndex}-${endIndex} arası ${this.filteredMusteriler.length} kayıttan`;
        }
    }

    async editMusteri(musteriId) {
        try {
            const musteriler = await dbService.getAll('musteri_listesi');
            const musteri = musteriler.find(m => m.musteri_kodu === musteriId);
            
            if (!musteri) {
                alert('Müşteri bulunamadı!');
                return;
            }

            this.editingMusteri = musteri;
            
            // Fill form
            document.getElementById('edit-musteri-id').value = musteri.musteri_kodu;
            document.getElementById('edit-sirket-adi').value = musteri.sirket_adi || '';
            document.getElementById('edit-sirket-adres').value = musteri.sirket_adres || '';
            document.getElementById('edit-sirket-sehir').value = musteri.sirket_sehir || '';
            document.getElementById('edit-sirket-ulke').value = musteri.sirket_ulke || '';
            document.getElementById('edit-sirket-telefon').value = musteri.sirket_telefon || '';
            document.getElementById('edit-sirket-mail').value = musteri.sirket_mail || '';
            document.getElementById('edit-kisi-adi').value = musteri.kisi_adi || '';
            document.getElementById('edit-kisi-unvan').value = musteri.kisi_unvan || '';
            document.getElementById('edit-kisi-telefon-dahili').value = musteri.kisi_telefon_dahili || '';
            document.getElementById('edit-kisi-telefon-mobil').value = musteri.kisi_telefon_mobil || '';
            document.getElementById('edit-kisi-mail').value = musteri.kisi_mail || '';
            
            // Show modal
            document.getElementById('musteri-duzenle-modal').classList.remove('hidden');
        } catch (error) {
            console.error('Müşteri düzenlemesi hatası:', error);
            alert('Müşteri bilgileri alınırken hata oluştu!');
        }
    }

    closeEditModal() {
        document.getElementById('musteri-duzenle-modal').classList.add('hidden');
        this.editingMusteri = null;
    }

    validateEditMusteriForm() {
        let isValid = true;

        // Şirket adı kontrolü
        const sirketAdi = document.getElementById('edit-sirket-adi');
        const sirketAdiError = document.getElementById('edit-sirket-adi-error') || this.createErrorElement('edit-sirket-adi-error');
        if (!sirketAdi.value.trim()) {
            this.showFieldError(sirketAdi, sirketAdiError, 'Şirket adı gereklidir');
            isValid = false;
        } else {
            this.hideFieldError(sirketAdi, sirketAdiError);
        }

        // Şirket adresi kontrolü
        const sirketAdres = document.getElementById('edit-sirket-adres');
        const sirketAdresError = document.getElementById('edit-sirket-adres-error') || this.createErrorElement('edit-sirket-adres-error');
        if (!sirketAdres.value.trim()) {
            this.showFieldError(sirketAdres, sirketAdresError, 'Şirket adresi gereklidir');
            isValid = false;
        } else {
            this.hideFieldError(sirketAdres, sirketAdresError);
        }

        // Şirket şehir kontrolü
        const sirketSehir = document.getElementById('edit-sirket-sehir');
        const sirketSehirError = document.getElementById('edit-sirket-sehir-error') || this.createErrorElement('edit-sirket-sehir-error');
        if (!sirketSehir.value.trim()) {
            this.showFieldError(sirketSehir, sirketSehirError, 'Şehir gereklidir');
            isValid = false;
        } else {
            this.hideFieldError(sirketSehir, sirketSehirError);
        }

        // Ülke kontrolü
        const sirketUlke = document.getElementById('edit-sirket-ulke');
        const sirketUlkeError = document.getElementById('edit-sirket-ulke-error') || this.createErrorElement('edit-sirket-ulke-error');
        if (!sirketUlke.value) {
            this.showFieldError(sirketUlke, sirketUlkeError, 'Ülke seçiniz');
            isValid = false;
        } else {
            this.hideFieldError(sirketUlke, sirketUlkeError);
        }

        // E-posta kontrolü (şirket veya kişi)
        const sirketMail = document.getElementById('edit-sirket-mail').value.trim();
        const kisiMail = document.getElementById('edit-kisi-mail').value.trim();
        
        if (sirketMail) {
            const sirketMailField = document.getElementById('edit-sirket-mail');
            const sirketMailError = document.getElementById('edit-sirket-mail-error') || this.createErrorElement('edit-sirket-mail-error');
            if (!this.isValidEmail(sirketMail)) {
                this.showFieldError(sirketMailField, sirketMailError, 'Geçerli bir e-posta adresi giriniz');
                isValid = false;
            } else {
                this.hideFieldError(sirketMailField, sirketMailError);
            }
        }

        if (kisiMail) {
            const kisiMailField = document.getElementById('edit-kisi-mail');
            const kisiMailError = document.getElementById('edit-kisi-mail-error') || this.createErrorElement('edit-kisi-mail-error');
            if (!this.isValidEmail(kisiMail)) {
                this.showFieldError(kisiMailField, kisiMailError, 'Geçerli bir e-posta adresi giriniz');
                isValid = false;
            } else {
                this.hideFieldError(kisiMailField, kisiMailError);
            }
        }

        // Telefon kontrolü (mobil format)
        const kisiTelefonMobil = document.getElementById('edit-kisi-telefon-mobil').value.trim();
        if (kisiTelefonMobil) {
            const kisiTelefonMobilField = document.getElementById('edit-kisi-telefon-mobil');
            const kisiTelefonMobilError = document.getElementById('edit-kisi-telefon-mobil-error') || this.createErrorElement('edit-kisi-telefon-mobil-error');
            if (!this.isValidPhone(kisiTelefonMobil)) {
                this.showFieldError(kisiTelefonMobilField, kisiTelefonMobilError, 'Geçerli bir telefon numarası giriniz');
                isValid = false;
            } else {
                this.hideFieldError(kisiTelefonMobilField, kisiTelefonMobilError);
            }
        }

        return isValid;
    }

    createErrorElement(id) {
        const errorElement = document.createElement('div');
        errorElement.id = id;
        errorElement.className = 'text-red-500 text-sm mt-1';
        return errorElement;
    }

    showFieldError(field, errorElement, message) {
        field.classList.add('border-red-500');
        errorElement.textContent = message;
        if (!errorElement.parentNode) {
            field.parentNode.appendChild(errorElement);
        }
        errorElement.classList.remove('hidden');
    }

    hideFieldError(field, errorElement) {
        field.classList.remove('border-red-500');
        if (errorElement.parentNode) {
            errorElement.classList.add('hidden');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Türk telefon numarası formatı: +90 (5xx) xxx xxxx veya 05xxxxxxxxx
        const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
        const cleanPhone = phone.replace(/[\s\(\)\-]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    async updateMusteri() {
        if (!this.editingMusteri) return;

        // Form validasyonu
        if (!this.validateEditMusteriForm()) return;

        try {
            const musteriId = parseInt(document.getElementById('edit-musteri-id').value);
            
            const updateData = {
                sirket_adi: document.getElementById('edit-sirket-adi').value.trim(),
                sirket_adres: document.getElementById('edit-sirket-adres').value.trim(),
                sirket_sehir: document.getElementById('edit-sirket-sehir').value.trim(),
                sirket_ulke: document.getElementById('edit-sirket-ulke').value,
                sirket_telefon: document.getElementById('edit-sirket-telefon').value.trim(),
                sirket_mail: document.getElementById('edit-sirket-mail').value.trim(),
                kisi_adi: document.getElementById('edit-kisi-adi').value.trim(),
                kisi_unvan: document.getElementById('edit-kisi-unvan').value.trim(),
                kisi_telefon_dahili: document.getElementById('edit-kisi-telefon-dahili').value.trim(),
                kisi_telefon_mobil: document.getElementById('edit-kisi-telefon-mobil').value.trim(),
                kisi_mail: document.getElementById('edit-kisi-mail').value.trim()
            };

            await dbService.update('musteri_listesi', musteriId, updateData);
            
            // Close modal and refresh list
            this.closeEditModal();
            await this.loadMusteriListesi();
            
            alert('Müşteri başarıyla güncellendi!');
        } catch (error) {
            console.error('Müşteri güncelleme hatası:', error);
            alert('Müşteri güncellenirken hata oluştu!');
        }
    }

    async deleteMusteri(musteriId) {
        if (!confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) return;

        try {
            await dbService.delete('musteri_listesi', musteriId);
            await this.loadMusteriListesi();
            alert('Müşteri başarıyla silindi!');
        } catch (error) {
            console.error('Müşteri silme hatası:', error);
            alert('Müşteri silinirken hata oluştu!');
        }
    }

    showSuccess(message) {
        // Simple success notification (you can replace with a proper toast library)
        alert(`✅ ${message}`);
    }

    showError(message) {
        // Simple error notification (you can replace with a proper toast library)
        alert(`❌ ${message}`);
    }

    loadMockData() {
        // Mock customers data
        this.musteriler = [
            {
                id: 1,
                sirketAdi: 'ABC Teknoloji A.Ş.',
                sirketAdres: 'Maslak Mahallesi, Büyükdere Caddesi No:123 Kat:15',
                sirketSehir: 'İstanbul',
                sirketUlke: 'Türkiye',
                sirketTelefon: '+90 (212) 555 0100',
                sirketMail: 'info@abcteknoloji.com',
                kisiAdi: 'Mehmet Yılmaz',
                kisiUnvan: 'Satış Müdürü',
                kisiTelefonDahili: '+90 (212) 555 0100 / 123',
                kisiTelefonMobil: '+90 (532) 123 4567',
                kisiMail: 'mehmet.yilmaz@abcteknoloji.com',
                createdAt: '2025-09-01T10:00:00Z'
            },
            {
                id: 2,
                sirketAdi: 'XYZ İnşaat Ltd.',
                sirketAdres: 'Çankaya Mahallesi, Atatürk Bulvarı No:456',
                sirketSehir: 'Ankara',
                sirketUlke: 'Türkiye',
                sirketTelefon: '+90 (312) 555 0200',
                sirketMail: 'iletisim@xyzinsaat.com',
                kisiAdi: 'Ayşe Kaya',
                kisiUnvan: 'Proje Müdürü',
                kisiTelefonDahili: '',
                kisiTelefonMobil: '+90 (533) 987 6543',
                kisiMail: 'ayse.kaya@xyzinsaat.com',
                createdAt: '2025-09-02T11:30:00Z'
            },
            {
                id: 3,
                sirketAdi: 'Global Trading GmbH',
                sirketAdres: 'Friedrichstraße 123, 10117',
                sirketSehir: 'Berlin',
                sirketUlke: 'Almanya',
                sirketTelefon: '+49 (30) 555 0300',
                sirketMail: 'contact@globaltrading.de',
                kisiAdi: 'Can Demir',
                kisiUnvan: 'CEO',
                kisiTelefonDahili: '+49 (30) 555 0300 / 101',
                kisiTelefonMobil: '+49 (172) 555 7890',
                kisiMail: 'can.demir@globaltrading.de',
                createdAt: '2025-09-03T14:15:00Z'
            },
            {
                id: 4,
                sirketAdi: 'Elit Yazılım A.Ş.',
                sirketAdres: 'Kozyatağı Mahallesi, Değirmen Sokak No:789',
                sirketSehir: 'İstanbul',
                sirketUlke: 'Türkiye',
                sirketTelefon: '+90 (216) 555 0400',
                sirketMail: 'info@elityazilim.com',
                kisiAdi: 'Elif Çelik',
                kisiUnvan: 'CTO',
                kisiTelefonDahili: '+90 (216) 555 0400 / 200',
                kisiTelefonMobil: '+90 (534) 111 2233',
                kisiMail: 'elif.celik@elityazilim.com',
                createdAt: '2025-09-04T09:20:00Z'
            },
            {
                id: 5,
                sirketAdi: 'İnovasyon Merkezi Ltd.',
                sirketAdres: 'Üniversite Mahallesi, Bilim Sokak No:321',
                sirketSehir: 'Ankara',
                sirketUlke: 'Türkiye',
                sirketTelefon: '+90 (312) 555 0500',
                sirketMail: 'merkez@inovasyon.com',
                kisiAdi: 'Murat Özkan',
                kisiUnvan: 'Ar-Ge Müdürü',
                kisiTelefonDahili: '',
                kisiTelefonMobil: '+90 (535) 444 5566',
                kisiMail: 'murat.ozkan@inovasyon.com',
                createdAt: '2025-09-05T16:45:00Z'
            }
        ];

        this.filteredMusteriler = [...this.musteriler];
    }

    loadTabContent() {
        // Initialize with first tab active
        this.switchTab('yeni-musteri');
    }
}

// Initialize when musteri module is loaded
let musteriIslemleri;

// Initialize mobile navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initDarkMode();
});
