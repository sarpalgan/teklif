# Labomak Dashboard Uygulaması

## Genel Bakış
Bu uygulama, mobil/tablet uyumlu modern bir web dashboard'udur. TailwindCSS ile tasarlanmış olup 3 ana modül içerir: Teklif İşlemleri, Ürün İşlemleri ve Müşteri İşlemleri.

## Özellikler

### 🎯 Ana Modüller
- **Teklif İşlemleri**: Teklif oluşturma, gönderilen/taslak teklifler
- **Ürün İşlemleri**: Yeni ürün ekleme, ürün listesi yönetimi
- **Müşteri İşlemleri**: Yeni müşteri ekleme, müşteri listesi yönetimi

### 🔧 Teknik Özellikler
- Responsive tasarım (mobil/tablet/desktop uyumlu)
- TailwindCSS framework
- FontAwesome icons
- Vanilla JavaScript (ES6+)
- Supabase veritabanı entegrasyonu
- CRUD işlemleri (Create, Read, Update, Delete)
- Webhook desteği

### 📊 Veritabanı Tabloları

#### musteri_listesi
- `musteri_kodu` (Primary Key)
- `sirket_adi`, `sirket_adres`, `sirket_sehir`, `sirket_ulke`
- `sirket_telefon`, `sirket_mail`
- `kisi_adi`, `kisi_unvan`
- `kisi_telefon_dahili`, `kisi_telefon_mobil`, `kisi_mail`
- `eklenme_tarihi`

#### urun_listesi
- `urun_kodu` (Primary Key)
- `urun_adi`, `urun_aciklama`
- `birim_fiyat`, `doviz_cinsi`
- `gorsel_url`
- `eklenme_tarihi`

#### teklifler
- `teklif_kodu` (Primary Key)
- `teklif_no`, `teklif_tarihi`
- `sirket_adi`, `musteri_adi`
- `toplam_tutar`, `doviz_cinsi`
- `durum` (taslak/gonderildi)
- `kullanici_id`

#### kullanici
- `kullanici_id` (Primary Key)
- `kullanici_adi`, `kullanici_mail`
- `kullanici_telefon`
- `eklenme_tarihi`

## Kurulum

### 1. Supabase Ayarları
`supabase-config.js` dosyasında aşağıdaki bilgileri güncelleyin:

```javascript
const SUPABASE_URL = 'your-project-url'
const SUPABASE_ANON_KEY = 'your-anon-key'
```

### 2. Dosya Yapısı
```
/
├── index.html          # Ana HTML dosyası
├── app.js              # JavaScript modülleri
├── styles.css          # Özel CSS stilleri
├── supabase-config.js  # Supabase konfigürasyonu
└── README.md           # Bu dosya
```

### 3. Kullanım
1. `index.html` dosyasını web tarayıcısında açın
2. Sol menüden istediğiniz modülü seçin
3. Supabase bağlantınızı test edin

## Modül Detayları

### Teklif İşlemleri
- ✅ Yeni teklif oluşturma
- ✅ Gönderilen teklifler listesi
- ✅ Taslak teklifler listesi
- ✅ Supabase entegrasyonu
- ✅ Webhook desteği

### Ürün İşlemleri
- ✅ Yeni ürün ekleme
- ✅ Ürün listesi görüntüleme
- ✅ Ürün düzenleme/silme
- ✅ Görsel yükleme desteği
- ✅ Supabase entegrasyonu

### Müşteri İşlemleri
- ✅ Yeni müşteri ekleme
- ✅ Müşteri listesi görüntüleme
- ✅ Müşteri düzenleme/silme
- ✅ Arama ve filtreleme
- ✅ Supabase entegrasyonu

## API Fonksiyonları

### dbService Metodları
```javascript
// Tüm kayıtları getir
await dbService.getAll('tableName')

// Yeni kayıt oluştur
await dbService.create('tableName', data)

// Kayıt güncelle
await dbService.update('tableName', id, data)

// Kayıt sil
await dbService.delete('tableName', id)

// ID'ye göre kayıt getir
await dbService.getById('tableName', id)

// Arama yap
await dbService.search('tableName', searchTerm, columns)

// Webhook gönder
await dbService.sendWebhook(data)
```

## Önemli Notlar

1. **Supabase Bağlantısı**: Uygulamanın çalışması için geçerli Supabase bağlantı bilgileri gereklidir.

2. **Veritabanı Tabloları**: Yukarıda belirtilen tablo yapılarının Supabase'de oluşturulması gerekir.

3. **Responsive Tasarım**: Uygulama mobil, tablet ve desktop cihazlarda optimize çalışır.

4. **Error Handling**: Tüm CRUD işlemlerinde hata yönetimi mevcuttur.

5. **Webhook**: Teklif oluşturma işlemlerinde otomatik webhook gönderimi yapılır.

## Geliştirme

### Yeni Modül Ekleme
1. HTML'de yeni tab ekleyin
2. JavaScript'te yeni class oluşturun
3. Supabase tablosunu tanımlayın
4. CRUD metodlarını implement edin

### Stil Güncellemeleri
- `styles.css` dosyasını düzenleyin
- TailwindCSS sınıflarını kullanın
- Responsive breakpoint'lere dikkat edin

## Lisans
Bu proje özel kullanım içindir.
