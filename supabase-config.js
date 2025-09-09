// Supabase Configuration
class SupabaseConfig {
    constructor() {
        // Supabase credentials - Bu değerleri kendi Supabase projenizden alın
        // Dashboard > Settings > API bölümünden kopyalayın:
        this.supabaseUrl = 'https://btszcskvzpbqytzrxgkq.supabase.co'; // Project URL buraya
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0c3pjc2t2enBicXl0enJ4Z2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzYzMzksImV4cCI6MjA3MjIxMjMzOX0.f0yzDShfbTrmvgAbqqWOr4z3TdZ1jbn4qTOUOIar4c8'; // anon public key buraya
        
        this.supabase = null;
        this.init();
    }

    async init() {
        try {
            // Supabase SDK'sını yükle
            if (typeof supabase === 'undefined') {
                await this.loadSupabaseSDK();
            }
            
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            console.log('Supabase bağlantısı başarılı!');
        } catch (error) {
            console.error('Supabase bağlantı hatası:', error);
        }
    }

    async loadSupabaseSDK() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    getClient() {
        return this.supabase;
    }
}

// Database Service Class
class DatabaseService {
    constructor() {
        this.config = new SupabaseConfig();
        this.supabase = null;
        this.init();
    }

    async init() {
        await this.config.init();
        this.supabase = this.config.getClient();
    }

    // Müşteri İşlemleri
    async getMusteriler() {
        try {
            const { data, error } = await this.supabase
                .from('musteri_listesi')
                .select('*')
                .order('musteri_kodu', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Müşteri listesi getirme hatası:', error);
            return [];
        }
    }

    async createMusteri(musteriData) {
        try {
            const { data, error } = await this.supabase
                .from('musteri_listesi')
                .insert([{
                    sirket_adi: musteriData.sirketAdi,
                    sirket_adres: musteriData.sirketAdres,
                    sirket_sehir: musteriData.sirketSehir,
                    sirket_ulke: musteriData.sirketUlke,
                    sirket_telefon: musteriData.sirketTelefon,
                    sirket_mail: musteriData.sirketMail,
                    kisi_adi: musteriData.kisiAdi,
                    kisi_unvan: musteriData.kisiUnvan,
                    kisi_telefon_dahili: musteriData.kisiTelefonDahili,
                    kisi_telefon_mobil: musteriData.kisiTelefonMobil,
                    kisi_mail: musteriData.kisiMail,
                    referans_pdf: ''
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Müşteri ekleme hatası:', error);
            throw error;
        }
    }

    async updateMusteri(musteriKodu, musteriData) {
        try {
            const { data, error } = await this.supabase
                .from('musteri_listesi')
                .update({
                    sirket_adi: musteriData.sirketAdi,
                    sirket_adres: musteriData.sirketAdres,
                    sirket_sehir: musteriData.sirketSehir,
                    sirket_ulke: musteriData.sirketUlke,
                    sirket_telefon: musteriData.sirketTelefon,
                    sirket_mail: musteriData.sirketMail,
                    kisi_adi: musteriData.kisiAdi,
                    kisi_unvan: musteriData.kisiUnvan,
                    kisi_telefon_dahili: musteriData.kisiTelefonDahili,
                    kisi_telefon_mobil: musteriData.kisiTelefonMobil,
                    kisi_mail: musteriData.kisiMail
                })
                .eq('musteri_kodu', musteriKodu)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Müşteri güncelleme hatası:', error);
            throw error;
        }
    }

    async deleteMusteri(musteriKodu) {
        try {
            const { error } = await this.supabase
                .from('musteri_listesi')
                .delete()
                .eq('musteri_kodu', musteriKodu);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Müşteri silme hatası:', error);
            throw error;
        }
    }

    // Ürün İşlemleri
    async getUrunler() {
        try {
            const { data, error } = await this.supabase
                .from('urun_listesi')
                .select('*')
                .order('urun_kodu', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Ürün listesi getirme hatası:', error);
            return [];
        }
    }

    async createUrun(urunData) {
        try {
            const { data, error } = await this.supabase
                .from('urun_listesi')
                .insert([{
                    urun_adi: urunData.name,
                    urun_aciklama: urunData.description,
                    fiyat: urunData.price,
                    doviz_cinsi: urunData.currency,
                    urun_gorseli_url: urunData.imageUrl || ''
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Ürün ekleme hatası:', error);
            throw error;
        }
    }

    async updateUrun(urunKodu, urunData) {
        try {
            const { data, error } = await this.supabase
                .from('urun_listesi')
                .update({
                    urun_adi: urunData.name,
                    urun_aciklama: urunData.description,
                    fiyat: urunData.price,
                    doviz_cinsi: urunData.currency,
                    urun_gorseli_url: urunData.imageUrl || ''
                })
                .eq('urun_kodu', urunKodu)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Ürün güncelleme hatası:', error);
            throw error;
        }
    }

    async deleteUrun(urunKodu) {
        try {
            const { error } = await this.supabase
                .from('urun_listesi')
                .delete()
                .eq('urun_kodu', urunKodu);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Ürün silme hatası:', error);
            throw error;
        }
    }

    // Teklif İşlemleri
    async getTeklifler() {
        try {
            const { data, error } = await this.supabase
                .from('teklifler')
                .select(`
                    *,
                    musteri_listesi (
                        sirket_adi,
                        kisi_adi
                    )
                `)
                .order('teklif_id', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Teklif listesi getirme hatası:', error);
            return [];
        }
    }

    async createTeklif(teklifData) {
        try {
            const { data, error } = await this.supabase
                .from('teklifler')
                .insert([{
                    musteri_kodu: teklifData.musteriKodu,
                    urun_kodlari: JSON.stringify(teklifData.urunKodlari),
                    urun_fiyatlari: JSON.stringify(teklifData.urunFiyatlari),
                    doviz_cinsleri: JSON.stringify(teklifData.dovizCinsleri),
                    durum: teklifData.durum || 'Gönderildi',
                    tarih: new Date().toLocaleString('tr-TR'),
                    teklifi_hazirlayan: teklifData.teklifHazirlayan || 'Sistem'
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Teklif ekleme hatası:', error);
            throw error;
        }
    }

    async updateTeklif(teklifId, teklifData) {
        try {
            const { data, error } = await this.supabase
                .from('teklifler')
                .update({
                    musteri_kodu: teklifData.musteriKodu,
                    urun_kodlari: JSON.stringify(teklifData.urunKodlari),
                    urun_fiyatlari: JSON.stringify(teklifData.urunFiyatlari),
                    doviz_cinsleri: JSON.stringify(teklifData.dovizCinsleri),
                    durum: teklifData.durum,
                    teklifi_hazirlayan: teklifData.teklifHazirlayan
                })
                .eq('teklif_id', teklifId)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Teklif güncelleme hatası:', error);
            throw error;
        }
    }

    async deleteTeklif(teklifId) {
        try {
            const { error } = await this.supabase
                .from('teklifler')
                .delete()
                .eq('teklif_id', teklifId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Teklif silme hatası:', error);
            throw error;
        }
    }

    // Kullanıcı İşlemleri
    async getKullanicilar() {
        try {
            const { data, error } = await this.supabase
                .from('kullanici')
                .select('*');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Kullanıcı listesi getirme hatası:', error);
            return [];
        }
    }

    // Genel CRUD Fonksiyonları
    async getAll(tableName) {
        try {
            const orderColumn = this.getOrderColumn(tableName);
            const { data, error } = await this.supabase
                .from(tableName)
                .select('*')
                .order(orderColumn, { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error(`${tableName} listesi getirme hatası:`, error);
            return [];
        }
    }

    async create(tableName, data) {
        try {
            const { data: result, error } = await this.supabase
                .from(tableName)
                .insert([data])
                .select();

            if (error) throw error;
            return result[0];
        } catch (error) {
            console.error(`${tableName} ekleme hatası:`, error);
            throw error;
        }
    }

    async update(tableName, id, data) {
        try {
            const idColumn = this.getIdColumn(tableName);
            const { data: result, error } = await this.supabase
                .from(tableName)
                .update(data)
                .eq(idColumn, id)
                .select();

            if (error) throw error;
            return result[0];
        } catch (error) {
            console.error(`${tableName} güncelleme hatası:`, error);
            throw error;
        }
    }

    async delete(tableName, id) {
        try {
            const idColumn = this.getIdColumn(tableName);
            const { error } = await this.supabase
                .from(tableName)
                .delete()
                .eq(idColumn, id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error(`${tableName} silme hatası:`, error);
            throw error;
        }
    }

    async getById(tableName, id) {
        try {
            const idColumn = this.getIdColumn(tableName);
            const { data, error } = await this.supabase
                .from(tableName)
                .select('*')
                .eq(idColumn, id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`${tableName} kayıt getirme hatası:`, error);
            return null;
        }
    }

    async search(tableName, searchTerm, columns = []) {
        try {
            let query = this.supabase.from(tableName).select('*');
            
            if (columns.length > 0) {
                const searchConditions = columns.map(col => `${col}.ilike.%${searchTerm}%`).join(',');
                query = query.or(searchConditions);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error(`${tableName} arama hatası:`, error);
            return [];
        }
    }

    // Tablo ID sütun adlarını belirle
    getIdColumn(tableName) {
        const idColumns = {
            'musteri_listesi': 'musteri_kodu',
            'urun_listesi': 'urun_kodu',
            'teklifler': 'teklif_kodu',
            'kullanici': 'kullanici_id'
        };
        return idColumns[tableName] || 'id';
    }

    // Tablo sıralama sütunlarını belirle
    getOrderColumn(tableName) {
        const orderColumns = {
            'musteri_listesi': 'musteri_kodu',
            'urun_listesi': 'urun_kodu',
            'teklifler': 'teklif_kodu',
            'kullanici': 'kullanici_id'
        };
        return orderColumns[tableName] || 'id';
    }

    // Webhook gönderme
    async sendWebhook(data) {
        try {
            const webhookUrl = 'https://square-smooth-werewolf.ngrok-free.app/webhook-test/d3a8c322-7ba7-4377-823b-cf3831fc942e';
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Webhook gönderme hatası:', error);
            throw error;
        }
    }

    // Arama ve Filtreleme (Eski fonksiyonlar - geriye dönük uyumluluk için)
    async searchMusteriler(searchTerm) {
        try {
            const { data, error } = await this.supabase
                .from('musteri_listesi')
                .select('*')
                .or(`sirket_adi.ilike.%${searchTerm}%,kisi_adi.ilike.%${searchTerm}%`)
                .order('sirket_adi');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Müşteri arama hatası:', error);
            return [];
        }
    }

    async searchUrunler(searchTerm) {
        try {
            const { data, error } = await this.supabase
                .from('urun_listesi')
                .select('*')
                .or(`urun_adi.ilike.%${searchTerm}%,urun_aciklama.ilike.%${searchTerm}%`)
                .order('urun_adi');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Ürün arama hatası:', error);
            return [];
        }
    }

    // Webhook işlemleri
    async sendWebhook(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Webhook gönderme hatası:', error);
            throw error;
        }
    }
}

// Global database service instance
let dbService;

// Initialize database service when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    dbService = new DatabaseService();
    await dbService.init();
    console.log('Database service initialized');
});
