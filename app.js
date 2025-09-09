// Labomak Dashboard Application
class LabomakApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.modules = {};
        this.init();
    }

    async init() {
        try {
            // Wait for database service to be ready
            await this.waitForDbService();
            
            // Initialize modules
            this.initializeModules();
            
            // Bind navigation events
            this.bindNavigationEvents();
            
            // Load dashboard by default
            this.showModule('dashboard');
            
            // Load dashboard stats
            await this.loadDashboardStats();
            
            console.log('Labomak Dashboard initialized successfully');
        } catch (error) {
            console.error('App initialization error:', error);
            this.showNotification('Uygulama başlatılırken hata oluştu', 'error');
        }
    }

    async waitForDbService() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.dbService && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.dbService) {
            throw new Error('Database service not available');
        }
    }

    initializeModules() {
        // Initialize all modules
        this.modules = {
            dashboard: new DashboardModule(),
            teklifler: new TekliflerModule(),
            urunler: new UrunlerModule(),
            musteriler: new MusterilerModule()
        };
    }

    bindNavigationEvents() {
        // Desktop menu items
        document.querySelectorAll('.menu-item[data-module]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.currentTarget.dataset.module;
                this.showModule(module);
                this.setActiveMenuItem(e.currentTarget);
            });
        });

        // Mobile bottom navigation is handled in the HTML script section
    }

    showModule(moduleName) {
        try {
            // Hide all modules
            document.querySelectorAll('.content-module').forEach(module => {
                module.classList.add('hidden');
            });

            // Show selected module
            const moduleElement = document.getElementById(`${moduleName}-module`);
            if (moduleElement) {
                moduleElement.classList.remove('hidden');
            }

            // Update current module
            this.currentModule = moduleName;

            // Update page title and subtitle
            this.updatePageTitle(moduleName);

            // Load module content
            if (this.modules[moduleName] && typeof this.modules[moduleName].load === 'function') {
                this.modules[moduleName].load();
            }

            // Update active menu item
            this.updateActiveMenuItem(moduleName);

        } catch (error) {
            console.error('Error showing module:', error);
            this.showNotification('Modül yüklenirken hata oluştu', 'error');
        }
    }

    updatePageTitle(moduleName) {
        const titles = {
            dashboard: { title: 'Dashboard', subtitle: 'Genel sistem durumu ve istatistikler' },
            teklifler: { title: 'Teklif İşlemleri', subtitle: 'Teklif oluşturma ve yönetimi' },
            urunler: { title: 'Ürün İşlemleri', subtitle: 'Ürün kataloğu yönetimi' },
            musteriler: { title: 'Müşteri İşlemleri', subtitle: 'Müşteri bilgileri yönetimi' }
        };

        const titleInfo = titles[moduleName] || { title: 'Dashboard', subtitle: 'Genel Bakış' };
        
        const titleElement = document.getElementById('page-title');
        const subtitleElement = document.getElementById('page-subtitle');
        
        if (titleElement) titleElement.textContent = titleInfo.title;
        if (subtitleElement) subtitleElement.textContent = titleInfo.subtitle;
    }

    updateActiveMenuItem(moduleName) {
        // Update desktop menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`.menu-item[data-module="${moduleName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update mobile bottom navigation
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('text-primary-600', 'dark:text-primary-400');
            item.classList.add('text-gray-600', 'dark:text-gray-400');
        });
        
        const activeMobileItem = document.querySelector(`.mobile-nav-item[data-module="${moduleName}"]`);
        if (activeMobileItem) {
            activeMobileItem.classList.remove('text-gray-600', 'dark:text-gray-400');
            activeMobileItem.classList.add('text-primary-600', 'dark:text-primary-400');
        }
    }

    setActiveMenuItem(clickedItem) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        clickedItem.classList.add('active');
    }

    async loadDashboardStats() {
        try {
            const [customers, products, offers, users] = await Promise.all([
                dbService.getMusteriler(),
                dbService.getUrunler(),
                dbService.getTeklifler(),
                dbService.getKullanicilar()
            ]);

            // Update stats
            this.updateStat('total-customers', customers.length);
            this.updateStat('total-products', products.length);
            this.updateStat('total-offers', offers.length);
            this.updateStat('active-users', users.length);

        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            // Set default values on error
            this.updateStat('total-customers', '0');
            this.updateStat('total-products', '0');
            this.updateStat('total-offers', '0');
            this.updateStat('active-users', '1');
        }
    }

    updateStat(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Animate number change
            const currentValue = parseInt(element.textContent) || 0;
            this.animateNumber(element, currentValue, value, 1000);
        }
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (difference * this.easeOutCubic(progress)));
            element.textContent = current.toLocaleString('tr-TR');

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    showNotification(message, type = 'info', duration = 5000) {
        if (window.notifications) {
            window.notifications.show(message, type, duration);
        } else {
            // Fallback alert
            alert(message);
        }
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}

// Dashboard Module
class DashboardModule {
    constructor() {
        this.element = document.getElementById('dashboard-module');
    }

    load() {
        // Dashboard is already loaded in HTML
        // Additional dashboard-specific logic can go here
        this.loadRecentActivities();
    }

    async loadRecentActivities() {
        try {
            // This would typically fetch real activity data
            const activities = [
                { icon: 'fas fa-plus', color: 'blue', text: 'Yeni müşteri eklendi', time: '2 dakika önce' },
                { icon: 'fas fa-file-invoice', color: 'green', text: 'Teklif gönderildi', time: '5 dakika önce' },
                { icon: 'fas fa-box', color: 'purple', text: 'Yeni ürün eklendi', time: '10 dakika önce' },
                { icon: 'fas fa-edit', color: 'orange', text: 'Müşteri bilgisi güncellendi', time: '15 dakika önce' },
                { icon: 'fas fa-check', color: 'green', text: 'Teklif onaylandı', time: '20 dakika önce' }
            ];

            const container = document.getElementById('recent-activities');
            if (container) {
                container.innerHTML = activities.map(activity => `
                    <div class="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div class="w-8 h-8 bg-${activity.color}-100 dark:bg-${activity.color}-900 rounded-full flex items-center justify-center">
                            <i class="${activity.icon} text-${activity.color}-600 dark:text-${activity.color}-400 text-xs"></i>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-800 dark:text-white">${activity.text}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">${activity.time}</p>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading recent activities:', error);
        }
    }
}

// Teklifler Module
class TekliflerModule {
    constructor() {
        this.element = document.getElementById('teklifler-module');
        this.currentTab = 'yeni-teklif';
    }

    load() {
        if (!this.element.innerHTML.trim()) {
            this.render();
        }
        this.bindEvents();
    }

    render() {
        this.element.innerHTML = `
            <div class="space-y-6">
                <!-- Tab Navigation -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex border-b border-gray-200 dark:border-gray-700">
                        <button class="teklif-tab px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent transition-all" data-tab="yeni-teklif">
                            <i class="fas fa-plus mr-2"></i>Yeni Teklif
                        </button>
                        <button class="teklif-tab px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent transition-all" data-tab="gonderilen">
                            <i class="fas fa-paper-plane mr-2"></i>Gönderilen Teklifler
                        </button>
                        <button class="teklif-tab px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent transition-all" data-tab="taslak">
                            <i class="fas fa-save mr-2"></i>Taslak Teklifler
                        </button>
                    </div>
                    
                    <!-- Tab Contents -->
                    <div class="p-6">
                        <div id="yeni-teklif-content" class="teklif-tab-content">
                            <div class="text-center py-12">
                                <i class="fas fa-file-invoice text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                                <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Yeni Teklif Oluştur</h3>
                                <p class="text-gray-600 dark:text-gray-400 mb-6">Müşterileriniz için profesyonel teklifler hazırlayın</p>
                                <button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                    <i class="fas fa-plus mr-2"></i>Teklif Oluştur
                                </button>
                            </div>
                        </div>
                        
                        <div id="gonderilen-content" class="teklif-tab-content hidden">
                            <div class="space-y-4" id="gonderilen-teklifler">
                                <div class="text-center py-12">
                                    <i class="fas fa-paper-plane text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                                    <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Gönderilen Teklifler</h3>
                                    <p class="text-gray-600 dark:text-gray-400">Henüz gönderilen teklif bulunmuyor</p>
                                </div>
                            </div>
                        </div>
                        
                        <div id="taslak-content" class="teklif-tab-content hidden">
                            <div class="space-y-4" id="taslak-teklifler">
                                <div class="text-center py-12">
                                    <i class="fas fa-save text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                                    <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Taslak Teklifler</h3>
                                    <p class="text-gray-600 dark:text-gray-400">Henüz taslak teklif bulunmuyor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Tab switching
        this.element.querySelectorAll('.teklif-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Set initial active tab
        this.switchTab('yeni-teklif');
    }

    switchTab(tabName) {
        // Update tab buttons
        this.element.querySelectorAll('.teklif-tab').forEach(tab => {
            tab.classList.remove('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600');
            tab.classList.add('text-gray-600', 'dark:text-gray-400', 'border-transparent');
        });

        const activeTab = this.element.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600');
            activeTab.classList.remove('text-gray-600', 'dark:text-gray-400', 'border-transparent');
        }

        // Update tab contents
        this.element.querySelectorAll('.teklif-tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        const activeContent = this.element.querySelector(`#${tabName}-content`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        this.currentTab = tabName;

        // Load tab-specific data
        this.loadTabData(tabName);
    }

    async loadTabData(tabName) {
        try {
            if (tabName === 'gonderilen' || tabName === 'taslak') {
                const teklifler = await dbService.getTeklifler();
                const filteredTeklifler = teklifler.filter(teklif => {
                    return tabName === 'gonderilen' ? 
                        teklif.durum === 'Gönderildi' : 
                        teklif.durum === 'Taslak';
                });

                this.renderTeklifList(filteredTeklifler, tabName);
            }
        } catch (error) {
            console.error('Error loading tab data:', error);
        }
    }

    renderTeklifList(teklifler, tabName) {
        const container = this.element.querySelector(`#${tabName}-teklifler`);
        if (!container) return;

        if (teklifler.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-${tabName === 'gonderilen' ? 'paper-plane' : 'save'} text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">${tabName === 'gonderilen' ? 'Gönderilen' : 'Taslak'} Teklifler</h3>
                    <p class="text-gray-600 dark:text-gray-400">Henüz ${tabName === 'gonderilen' ? 'gönderilen' : 'taslak'} teklif bulunmuyor</p>
                </div>
            `;
            return;
        }

        container.innerHTML = teklifler.map(teklif => `
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-800 dark:text-white">Teklif #${teklif.teklif_id}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${teklif.tarih}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="status-badge ${teklif.durum === 'Gönderildi' ? 'success' : 'warning'}">
                            ${teklif.durum}
                        </span>
                        <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Urunler Module
class UrunlerModule {
    constructor() {
        this.element = document.getElementById('urunler-module');
        this.currentTab = 'urun-listesi';
    }

    load() {
        if (!this.element.innerHTML.trim()) {
            this.render();
        }
        this.bindEvents();
    }

    render() {
        this.element.innerHTML = `
            <div class="space-y-6">
                <!-- Tab Navigation -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex border-b border-gray-200 dark:border-gray-700">
                        <button class="urun-tab px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent transition-all" data-tab="urun-listesi">
                            <i class="fas fa-list mr-2"></i>Ürün Listesi
                        </button>
                        <button class="urun-tab px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent transition-all" data-tab="yeni-urun">
                            <i class="fas fa-plus mr-2"></i>Yeni Ürün
                        </button>
                    </div>
                    
                    <!-- Tab Contents -->
                    <div class="p-6">
                        <div id="urun-listesi-content" class="urun-tab-content">
                            <div class="space-y-4">
                                <!-- Search and Filter -->
                                <div class="flex flex-col sm:flex-row gap-4">
                                    <div class="flex-1">
                                        <input type="text" id="urun-search" placeholder="Ürün ara..." class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white search-input">
                                    </div>
                                    <button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        <i class="fas fa-search mr-2"></i>Ara
                                    </button>
                                </div>
                                
                                <!-- Product List -->
                                <div id="urun-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div class="text-center py-12 col-span-full">
                                        <div class="spinner mx-auto mb-4"></div>
                                        <p class="text-gray-600 dark:text-gray-400">Ürünler yükleniyor...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="yeni-urun-content" class="urun-tab-content hidden">
                            <form id="yeni-urun-form" class="space-y-6">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürün Adı *</label>
                                        <input type="text" name="urunAdi" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fiyat *</label>
                                        <div class="flex">
                                            <input type="number" name="fiyat" step="0.01" required class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                            <select name="doviz" class="px-4 py-2 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                                <option value="TRY">TRY</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürün Açıklaması</label>
                                    <textarea name="aciklama" rows="4" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"></textarea>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürün Görseli URL</label>
                                    <input type="url" name="gorselUrl" placeholder="https://example.com/image.jpg" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                </div>
                                
                                <div class="flex justify-end space-x-4">
                                    <button type="button" class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        İptal
                                    </button>
                                    <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        <i class="fas fa-save mr-2"></i>Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Tab switching
        this.element.querySelectorAll('.urun-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Form submission
        const form = this.element.querySelector('#yeni-urun-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Search
        const searchInput = this.element.querySelector('#urun-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Set initial active tab
        this.switchTab('urun-listesi');
    }

    switchTab(tabName) {
        // Update tab buttons
        this.element.querySelectorAll('.urun-tab').forEach(tab => {
            tab.classList.remove('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600');
            tab.classList.add('text-gray-600', 'dark:text-gray-400', 'border-transparent');
        });

        const activeTab = this.element.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600');
            activeTab.classList.remove('text-gray-600', 'dark:text-gray-400', 'border-transparent');
        }

        // Update tab contents
        this.element.querySelectorAll('.urun-tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        const activeContent = this.element.querySelector(`#${tabName}-content`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        this.currentTab = tabName;

        // Load tab-specific data
        if (tabName === 'urun-listesi') {
            this.loadUrunler();
        }
    }

    async loadUrunler() {
        try {
            const urunler = await dbService.getUrunler();
            this.renderUrunList(urunler);
        } catch (error) {
            console.error('Error loading products:', error);
            this.renderUrunList([]);
        }
    }

    renderUrunList(urunler) {
        const container = this.element.querySelector('#urun-list');
        if (!container) return;

        if (urunler.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 col-span-full">
                    <i class="fas fa-box text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Henüz ürün bulunmuyor</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">İlk ürününüzü ekleyerek başlayın</p>
                    <button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors" onclick="window.app.modules.urunler.switchTab('yeni-urun')">
                        <i class="fas fa-plus mr-2"></i>Ürün Ekle
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = urunler.map(urun => `
            <div class="product-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
                    ${urun.urun_gorseli_url ? 
                        `<img src="${urun.urun_gorseli_url}" alt="${urun.urun_adi}" class="w-full h-48 object-cover">` :
                        `<div class="w-full h-48 flex items-center justify-center">
                            <i class="fas fa-image text-4xl text-gray-400 dark:text-gray-600"></i>
                        </div>`
                    }
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">${urun.urun_adi}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${urun.urun_aciklama || 'Açıklama bulunmuyor'}</p>
                    <div class="flex items-center justify-between">
                        <div class="text-lg font-bold text-primary-600 dark:text-primary-400">
                            ${parseFloat(urun.fiyat).toLocaleString('tr-TR')} ${urun.doviz_cinsi}
                        </div>
                        <div class="flex space-x-2">
                            <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Düzenle">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Sil" onclick="window.app.modules.urunler.deleteUrun(${urun.urun_kodu})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const urunData = {
                name: formData.get('urunAdi'),
                description: formData.get('aciklama'),
                price: parseFloat(formData.get('fiyat')),
                currency: formData.get('doviz'),
                imageUrl: formData.get('gorselUrl')
            };

            await dbService.createUrun(urunData);
            
            // Show success message
            window.app.showNotification('Ürün başarıyla eklendi', 'success');
            
            // Reset form
            e.target.reset();
            
            // Switch to product list and reload
            this.switchTab('urun-listesi');
            
        } catch (error) {
            console.error('Error creating product:', error);
            window.app.showNotification('Ürün eklenirken hata oluştu', 'error');
        }
    }

    async deleteUrun(urunKodu) {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await dbService.deleteUrun(urunKodu);
            window.app.showNotification('Ürün başarıyla silindi', 'success');
            this.loadUrunler();
        } catch (error) {
            console.error('Error deleting product:', error);
            window.app.showNotification('Ürün silinirken hata oluştu', 'error');
        }
    }

    handleSearch(searchTerm) {
        // Implement search functionality
        console.log('Searching for:', searchTerm);
    }
}

// Musteriler Module
class MusterilerModule {
    constructor() {
        this.element = document.getElementById('musteriler-module');
        this.currentTab = 'musteri-listesi';
    }

    load() {
        if (!this.element.innerHTML.trim()) {
            this.render();
        }
        this.bindEvents();
    }

    render() {
        this.element.innerHTML = `
            <div class="space-y-6">
                <!-- Tab Navigation -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex border-b border-gray-200 dark:border-gray-700">
                        <button class="musteri-tab px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent transition-all" data-tab="musteri-listesi">
                            <i class="fas fa-list mr-2"></i>Müşteri Listesi
                        </button>
                        <button class="musteri-tab px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent transition-all" data-tab="yeni-musteri">
                            <i class="fas fa-plus mr-2"></i>Yeni Müşteri
                        </button>
                    </div>
                    
                    <!-- Tab Contents -->
                    <div class="p-6">
                        <div id="musteri-listesi-content" class="musteri-tab-content">
                            <div class="space-y-4">
                                <!-- Search and Filter -->
                                <div class="flex flex-col sm:flex-row gap-4">
                                    <div class="flex-1">
                                        <input type="text" id="musteri-search" placeholder="Müşteri ara..." class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white search-input">
                                    </div>
                                    <button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        <i class="fas fa-search mr-2"></i>Ara
                                    </button>
                                </div>
                                
                                <!-- Customer List -->
                                <div class="table-responsive">
                                    <div id="musteri-list">
                                        <div class="text-center py-12">
                                            <div class="spinner mx-auto mb-4"></div>
                                            <p class="text-gray-600 dark:text-gray-400">Müşteriler yükleniyor...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="yeni-musteri-content" class="musteri-tab-content hidden">
                            <form id="yeni-musteri-form" class="space-y-8">
                                <!-- Şirket Bilgileri -->
                                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        <i class="fas fa-building mr-2 text-blue-600 dark:text-blue-400"></i>Şirket Bilgileri
                                    </h3>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Şirket Adı *</label>
                                            <input type="text" name="sirketAdi" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Şehir</label>
                                            <input type="text" name="sirketSehir" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                        
                                        <div class="lg:col-span-2">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adres</label>
                                            <textarea name="sirketAdres" rows="3" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"></textarea>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ülke</label>
                                            <select name="sirketUlke" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                                <option value="Türkiye">Türkiye</option>
                                                <option value="Almanya">Almanya</option>
                                                <option value="Fransa">Fransa</option>
                                                <option value="İngiltere">İngiltere</option>
                                                <option value="ABD">ABD</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefon</label>
                                            <input type="tel" name="sirketTelefon" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                        
                                        <div class="lg:col-span-2">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-posta</label>
                                            <input type="email" name="sirketMail" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- İletişim Kişisi Bilgileri -->
                                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        <i class="fas fa-user mr-2 text-green-600 dark:text-green-400"></i>İletişim Kişisi
                                    </h3>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ad Soyad *</label>
                                            <input type="text" name="kisiAdi" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ünvan</label>
                                            <input type="text" name="kisiUnvan" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefon (Dahili)</label>
                                            <input type="tel" name="kisiTelefonDahili" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobil Telefon</label>
                                            <input type="tel" name="kisiTelefonMobil" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                        
                                        <div class="lg:col-span-2">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-posta</label>
                                            <input type="email" name="kisiMail" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex justify-end space-x-4">
                                    <button type="button" class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        İptal
                                    </button>
                                    <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        <i class="fas fa-save mr-2"></i>Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Tab switching
        this.element.querySelectorAll('.musteri-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Form submission
        const form = this.element.querySelector('#yeni-musteri-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Search
        const searchInput = this.element.querySelector('#musteri-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Set initial active tab
        this.switchTab('musteri-listesi');
    }

    switchTab(tabName) {
        // Update tab buttons
        this.element.querySelectorAll('.musteri-tab').forEach(tab => {
            tab.classList.remove('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600');
            tab.classList.add('text-gray-600', 'dark:text-gray-400', 'border-transparent');
        });

        const activeTab = this.element.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600');
            activeTab.classList.remove('text-gray-600', 'dark:text-gray-400', 'border-transparent');
        }

        // Update tab contents
        this.element.querySelectorAll('.musteri-tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        const activeContent = this.element.querySelector(`#${tabName}-content`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        this.currentTab = tabName;

        // Load tab-specific data
        if (tabName === 'musteri-listesi') {
            this.loadMusteriler();
        }
    }

    async loadMusteriler() {
        try {
            const musteriler = await dbService.getMusteriler();
            this.renderMusteriList(musteriler);
        } catch (error) {
            console.error('Error loading customers:', error);
            this.renderMusteriList([]);
        }
    }

    renderMusteriList(musteriler) {
        const container = this.element.querySelector('#musteri-list');
        if (!container) return;

        if (musteriler.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-users text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Henüz müşteri bulunmuyor</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">İlk müşterinizi ekleyerek başlayın</p>
                    <button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors" onclick="window.app.modules.musteriler.switchTab('yeni-musteri')">
                        <i class="fas fa-plus mr-2"></i>Müşteri Ekle
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Şirket</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">İletişim Kişisi</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telefon</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">E-posta</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        ${musteriler.map(musteri => `
                            <tr class="customer-row hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">${musteri.sirket_adi}</div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">${musteri.sirket_sehir || ''}, ${musteri.sirket_ulke || ''}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">${musteri.kisi_adi}</div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">${musteri.kisi_unvan || ''}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white phone-formatted">${musteri.kisi_telefon_mobil || musteri.sirket_telefon || '-'}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <a href="mailto:${musteri.kisi_mail || musteri.sirket_mail}" class="text-sm email-address">${musteri.kisi_mail || musteri.sirket_mail || '-'}</a>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <button class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors" title="Düzenle">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors" title="Sil" onclick="window.app.modules.musteriler.deleteMusteri(${musteri.musteri_kodu})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const musteriData = {
                sirketAdi: formData.get('sirketAdi'),
                sirketAdres: formData.get('sirketAdres'),
                sirketSehir: formData.get('sirketSehir'),
                sirketUlke: formData.get('sirketUlke'),
                sirketTelefon: formData.get('sirketTelefon'),
                sirketMail: formData.get('sirketMail'),
                kisiAdi: formData.get('kisiAdi'),
                kisiUnvan: formData.get('kisiUnvan'),
                kisiTelefonDahili: formData.get('kisiTelefonDahili'),
                kisiTelefonMobil: formData.get('kisiTelefonMobil'),
                kisiMail: formData.get('kisiMail')
            };

            await dbService.createMusteri(musteriData);
            
            // Show success message
            window.app.showNotification('Müşteri başarıyla eklendi', 'success');
            
            // Reset form
            e.target.reset();
            
            // Switch to customer list and reload
            this.switchTab('musteri-listesi');
            
        } catch (error) {
            console.error('Error creating customer:', error);
            window.app.showNotification('Müşteri eklenirken hata oluştu', 'error');
        }
    }

    async deleteMusteri(musteriKodu) {
        if (!confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await dbService.deleteMusteri(musteriKodu);
            window.app.showNotification('Müşteri başarıyla silindi', 'success');
            this.loadMusteriler();
        } catch (error) {
            console.error('Error deleting customer:', error);
            window.app.showNotification('Müşteri silinirken hata oluştu', 'error');
        }
    }

    handleSearch(searchTerm) {
        // Implement search functionality
        console.log('Searching for:', searchTerm);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LabomakApp();
});