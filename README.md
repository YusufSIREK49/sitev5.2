# BTÜ Geçerken Topluluğu — Dijital Web Ekosistemi (v5.2)

> **"Geçerken Güzel Bir İz Bırak"**

Bursa Teknik Üniversitesi bünyesinde faaliyet gösteren **BTÜ Geçerken Topluluğu**'nun kararlı ve oturmuş web ekosisteminin mimari dokümantasyonudur. Bu depo; **Ana Portal (`btugecerken.com`)**, **Farabi AI (`farabiai.btugecerken.com`)**, **BTÜ Geçerken Docs (`docs.btugecerken.com`)** ve **BTÜ Geçerken Labs (`labs.btugecerken.com`)** alt alan adlarından oluşan bütüncül dijital yapının merkezi GitHub kaynak kodlarını ve sistem mimarisini barındırır.

---

## 1. Ekosistem Mimarisi ve Alt Alan Adları (Subdomains)

**BTÜ Geçerken v5.2**, harici içerik yönetim sistemlerine (CMS) ve ağır derleme araçlarına bağımlılığı ortadan kaldıran **Zero-Build / Zero-Dependency** prensibiyle inşa edilmiştir. Ekosistem, her biri belirli bir sorumluluğu üstlenen 4 temel katman ve alt alan adından oluşur:

```text
                                 ┌───────────────────────────────────────┐
                                 │           Cloudflare DNS / CDN        │
                                 └───────────────────┬───────────────────┘
                                                     │
                                 ┌───────────────────▼───────────────────┐
                                 │          Nginx Reverse Proxy          │
                                 └───┬───────────┬───────────┬───────┬───┘
                                     │           │           │       │
         ┌───────────────────────────▼──┐  ┌─────▼─────┐  ┌──▼────┐  ┌▼──────────────────────┐
         │       btugecerken.com        │  │farabiai...│  │docs...│  │ labs.btugecerken.com  │
         │     (Ana Portal - v5.2)      │  │(Derin AI) │  │(Docs) │  │(Araçlar & Mikro Servis│
         │      Static HTML/CSS/JS      │  │Dify + Groq│  │Rehber │  │ FastAPI/Flask - 8001) │
         └──────────────┬───────────────┘  └───────────┘  └───────┘  └───────────────────────┘
                        │
         ┌──────────────▼───────────────┐
         │   İstemci Taraflı Motorlar   │
         │ • Sayfa Asistanları (3 Modül)│
         │ • Genel AI Widget (Groq API) │
         │ • XSS Korumalı DOM Render    │
         └──────────────────────────────┘
```

### Ekosistem Bileşenleri
1. **Ana Portal (`btugecerken.com`):** Topluluğun dijital vitrini, etkinlik takvimi, dijital dergilik rafı, düşünce yazıları arşivi (blog) ve sayfa içi yapay zeka asistanlarını barındıran ana web uygulamasıdır. *(Not: Dijital TV servisi kapatılmış olup tüm video arşivi resmî YouTube kanalına yönlendirilmiştir).*
2. **Farabi AI (`farabiai.btugecerken.com`):** İslam felsefesi, düşünce tarihi ve akademik metin analizleri üzerine özelleştirilmiş, Dify AI ve Groq altyapısı üzerinde çalışan derin analiz odaklı yapay zeka platformudur.
3. **BTÜ Geçerken Docs (`docs.btugecerken.com`):** Topluluk projelerinin, yazılım mimarilerinin, API entegrasyonlarının ve dijital yayın rehberlerinin barındırıldığı merkezi teknik dokümantasyon portalıdır.
4. **BTÜ Geçerken Labs (`labs.btugecerken.com`):** Öğrencilerin ve ekip üyelerinin kullanımına sunulan açık kaynak PDF işleme, medya dönüştürme ve üretkenlik araçlarını barındıran (arka planda Port `8001` üzerinde çalışan) uygulama laboratuvarıdır.

---

## 2. Yapay Zeka Mimarisi (3 Katmanlı AI Yapısı)

Ekosistem içerisinde kullanıcı ihtiyacına ve bağlam derinliğine göre özelleştirilmiş **3 farklı yapay zeka katmanı** görev yapar:

### 2.1. Genel Topluluk Asistanı (`btugecerkenai.html` & `btugecerkenai.md`)
* **Mimari:** Groq Chat Completions API üzerine kurulu, tüm sayfalarda sağ alt köşede erişilebilir olan veya tam sayfa (`btugecerkenai.html`) çalışabilen etkileşimli asistandır.
* **Çalışma Prensibi:** `btugecerkenai.md` dosyasında yer alan yapılandırılmış sistem yönergesini ve güncel topluluk bilgi tabanını bağlam olarak kullanır. Topluluk tüzüğü, yönetim kurulu üyeleri, güncel duyurular, etkinlik takvimi ve WhatsApp topluluk katılım bağlantılarını doğru ve halüsinasyonsuz şekilde yanıtlar.

### 2.2. Sayfa İçi Bağlamsal Asistanlar (Contextual Page Assistants)
Kullanıcıların bulundukları sayfanın içeriğine özel anlık analiz, özetleme ve yönlendirme alabilmeleri için geliştirilmiş **3 özelleştirilmiş sayfa asistanıdır**:
* **Blog Asistanı (`btugecerkenblog.html` & `blog.js`):** İslam Felsefesi, Sanat Tarihi, Maneviyat, Sosyal Adalet ve Bursa Gastronomisi kategorilerindeki makaleler üzerinde çalışır. Okuyucuya makale özetleri sunar, kavram açıklamaları yapar ve okunan yazıyla ilişkili diğer düşünce yazılarını önerir.
* **Etkinlik Asistanı (`etkinlikler.html` & `etkinlikler.js`):** Akademik dönemler (`2024/2025`, `2025/2026`, `2026/2027`) ve etkinlik kategorileri arasında kullanıcıların ilgi alanına uygun seminer, atölye ve şehir gezilerini bulmalarına yardımcı olur; etkinlik içerikleri ve katılım detayları hakkında anlık rehberlik sağlar.
* **Dergilik Asistanı (`dergilik.html` & `dergilik.js`):** *BTÜ Geçerken Culture*, *Mahya Dergisi* ve *BTÜ Geçerken Account Original* koleksiyonları içinde içerik rehberliği yapar. Kullanıcının aradığı temaya uygun dergi sayısını bulur, sayı içeriklerini özetler ve doğrudan okuma/indirme bağlantılarına yönlendirir.

### 2.3. Farabi AI (`farabiai.btugecerken.com`)
* **Mimari:** Ana portaldan bağımsız bir alt alan adı üzerinde Dify AI orkestrasyonu ve yüksek hızlı Groq çıkarım (inference) motoruyla çalışan özelleşmiş yapay zeka sistemidir.
* **Odak Alanı:** Klasik İslam düşüncesi, Farabi felsefesi, medeniyet tarihi ve analitik metin çözümlemeleri konusunda derinlemesine akademik ve felsefi diyalog yürütmek üzere tasarlanmıştır.

---

## 3. Kurumsal CSS Tasarım Kimliği ve Görsel Tokenlar

Arayüzün tamamında Bursa'nın tarihi dokusunu, akademik ciddiyeti ve kültürel zarafeti yansıtan standartlaştırılmış kurumsal tasarım sistemi (`style.css` ve `navbar.css`) uygulanır:

| Tasarım Tokenı / Bileşen | Değer / Tanım | Kullanım Alanı ve Tasarım Amacı |
| :--- | :--- | :--- |
| **Türk Yeşili (`--primary-color`)** | `#009B77` | Birincil aksiyon butonları, aktif sekme göstergeleri, birim etiketleri ve vurgu çizgileri. |
| **Gece Mavisi (`--secondary-color`)** | `#002366` | Ana başlıklar, kurumsal rozetler, gezinme çubuğu (navbar) ve yüksek kontrastlı metin alanları. |
| **Krem Zemin (`--bg-cream`)** | `#faf8f5` | Göz yorgunluğunu önleyen, kitap/dergi sayfası hissiyatı veren ana arka plan zemini. |
| **Kart ve Yüzey Tasarımı** | `#ffffff` + İnce Yeşil Çerçeve | `border-radius: 16px`, yumuşak gölgelendirme ve alt kısımda `#009B77` vurgu çizgili modüler kart yapısı. |
| **Arka Plan Deseni** | Geometrik Motifli Filigran | Krem zemin üzerine düşük opaklıkla işlenen geleneksel geometrik dokulu arka plan katmanı. |
| **Başlık Tipografisi** | `Amiri`, `Syne` | Kültürel, edebi ve modern vurgu taşıyan sayfa ve bölüm başlıkları. |
| **Gövde Tipografisi** | `Noto Serif TR` | Uzun soluklu makale ve dokümanlarda yüksek okunabilirlik sağlayan serif yazı tipi. |
| **İkon Kütüphanesi** | `FontAwesome 6` | Arayüz eylem ikonları, asistan tetikleyicileri ve sosyal medya yönlendirmeleri. |

---

## 4. Çekirdek Modüller ve Uzantılar (Dizin Yapısı)

Depo içerisindeki tüm HTML, CSS, JavaScript ve Markdown dosyaları ile görevleri aşağıda listelenmiştir:

```text
sitev5.2/
├── index.html                   # Ana giriş sayfası, ekosistem vitrini ve YouTube yönlendirmesi
├── btugecerkenblog.html         # Blog, düşünce yazıları arşivi ve Blog Asistanı arayüzü
├── dergilik.html                # Dijital dergi koleksiyonu, periyodik raf ve Dergilik Asistanı
├── etkinlikler.html             # Dönemlik etkinlik listesi, filtreleme ve Etkinlik Asistanı
├── ekibimiz.html                # Yönetim kurulu ve ekip birimleri tanıtım sayfası
├── btugecerkenai.html           # Tam sayfa Genel Yapay Zeka Asistanı arayüzü
├── style.css                    # Kurumsal renk tokenları, tipografi kuralları, kart ve grid mimarisi
├── navbar.css                   # Mobil uyumlu (Responsive) üst gezinme çubuğu stilleri
├── blog.js                      # Blog veri yönetimi, XSS sanitizasyonu, sayfalama (12/sayfa) ve Blog Asistanı mantığı
├── dergilik.js                  # Dergilik kütüphanesi, raf kaydırma (aylık 15. gün döngüsü) ve Dergilik Asistanı
├── etkinlikler.js               # Etkinlik arama, akademik yıl filtreleme, DOM motoru ve Etkinlik Asistanı
├── btugecerkenai.md             # Genel AI asistanı sistem promptu ve topluluk bilgi tabanı
└── README.md                    # Ekosistem ve mimari dokümantasyonu
```

---

## 5. Yerel Geliştirme ve Dağıtım (Deployment)

### 5.1. Yerel Ortamda Çalıştırma
Sistem harici bir paket yöneticisi veya derleme aracı gerektirmez. Ekosistem standartlarıyla uyumlu olması için yerel geliştirme sunucusunun **8001** portunda çalıştırılması önerilir:

1. **Depoyu klonlayın:**
   ```bash
   git clone [https://github.com/YusufSIREK49/sitev5.2.git](https://github.com/YusufSIREK49/sitev5.2.git)
   cd sitev5.2
   ```

2. **Yerel HTTP sunucusunu başlatın (Port 8001):**
   ```bash
   python -m http.server 8001
   ```

3. **Tarayıcı üzerinden erişin:**
   ```text
   http://localhost:8001
   ```

### 5.2. Canlı Sunucu (Production) Dağıtımı
* **Kaynak Depo:** [github.com/YusufSIREK49/sitev5.2](https://github.com/YusufSIREK49/sitev5.2)
* **Dağıtım Akışı:** Lokal ortamda test edilen dosyalar FileZilla (SFTP) aracılığıyla sunucu üzerindeki ilgili web kök dizinine aktarılır.
* **Ters Vekil (Reverse Proxy):** Gelen istekler Cloudflare üzerinden geçerek Nginx sunucusuna ulaşır ve ilgili alt alan adına (`btugecerken.com`, `farabiai.btugecerken.com`, `docs.btugecerken.com`, `labs.btugecerken.com`) yönlendirilir.

---

## 6. Yönetim Kurulu ve Ekip Birimleri

* **Topluluk Başkanı:** Muhammed ERİM — *Topluluğun vizyonunu belirleyen, genel işleyişi koordine eden ve projeler arası köprü kuran lider.*
* **Topluluk Başkan Yardımcıları:** Melike ALKAN, Tarık ÇELİK — *Stratejik planlama, birimler arası uyum ve operasyonel süreçlerin aksamadan yürütülmesini sağlayan yönetim ekibi.*
* **Sosyal Medya Ekibi:** Zeliha MUTLU, Dylan PETER, Muhammed Efe ÖZDEMİR — *Topluluğun dijital sesini duyuran, içerik akışını yöneten ve kitlesel etkileşimi canlı tutan yaratıcı güç.*
* **Proje ve Ar-Ge Ekibi:** Aydın ÇİFTÇİ, Yusuf TEMURÇİN, Eyüp EREN — *Yenilikçi fikirleri kuluçkaya yatıran, teknik altyapıyı geliştiren ve topluluğa değer katan araştırma, geliştirme ve üretim merkezi.*
* **Organizasyon Ekibi:** Miray ÇUBUK, İbrahim KAYA, Yusuf SİREK — *Etkinliklerin planlanmasından sahada kusursuz bir şekilde hayata geçirilmesine kadar tüm operasyonu sırtlayan ekip.*

Katkıda bulunmak isterseniz lütfen önce bir konu (*issue*) açarak yapmak istediğiniz geliştirmeyi belirtiniz.

---

## 7. İletişim ve Bağlantılar

* **Ana Portal:** [btugecerken.com](https://btugecerken.com)
* **Farabi AI:** [farabiai.btugecerken.com](https://farabiai.btugecerken.com)
* **Dokümantasyon:** [docs.btugecerken.com](https://docs.btugecerken.com)
* **Labs:** [labs.btugecerken.com](https://labs.btugecerken.com)
* **GitHub Deposu:** [github.com/YusufSIREK49/sitev5.2](https://github.com/YusufSIREK49/sitev5.2)
* **E-posta:** info@btugecerken.com
* **Yerleşke:** Bursa Teknik Üniversitesi, Mimar Sinan Yerleşkesi, Yıldırım / BURSA