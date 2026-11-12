// Menü ve arama fihristi. Yeni konu/sayfa eklenince buraya da eklenir.
const docsNav = [
  {
    "category": "1. Giriş, Mimari ve Sürümler",
    "file": "giris.html",
    "topics": [
      {
        "id": "surumler-ve-guncellemeler",
        "title": "Sürümler ve Güncellemeler (Changelog)",
        "desc": "BTÜ Geçerken ekosisteminin v1'den btugecerken-v5.2 sürümüne uzanan GitHub arşivi ve mimari değişiklik günlüğü."
      },
      {
        "id": "ekosistem-genel-bakis",
        "title": "Ekosistem Vizyonu ve Mimari Topoloji",
        "desc": "BTÜ Geçerken platformlarının genel topolojisi, görsel mimari harita, ASCII topoloji şeması ve servis matrisi."
      },
      {
        "id": "sunucu-ve-nginx-yapisi",
        "title": "Sunucu Yapılandırması ve Nginx Rotaları",
        "desc": "Dizin ağacı, dosya hiyerarşisi, proxy yönlendirme kuralları ve Nginx güvenlik katmanı."
      },
      {
        "id": "tasarim-kimligi-ve-css",
        "title": "Tasarım Kimliği, Renk ve Tipografi Sistemi",
        "desc": "Renk kodları, 60-30-10 kuralı, yazı tipleri ve yasaklı UI pratikleri."
      }
    ]
  },
  {
    "category": "2. İçerik ve Yayıncılık Motorları",
    "file": "icerik.html",
    "topics": [
      {
        "id": "blog-sistemi-mimarisi",
        "title": "Blog Motoru ve Dinamik Veri Fihristi",
        "desc": "blog.js veri şeması, istemci taraflı sayfalama (pagination), canlı arama ve bağımsız fiziksel HTML mimarisi."
      },
      {
        "id": "etkinlik-takvimi-mimarisi",
        "title": "Etkinlik Arşivi ve Takvim Panosu Mimarisi",
        "desc": "etkinlikler.js veri mimarisi, akademik dönem taksonomisi, etiket arama motoru ve modal takvim bileşeni."
      },
      {
        "id": "merkezi-footer-mimarisi",
        "title": "Merkezi Dinamik Footer Motoru",
        "desc": "script.js içine gömülü dinamik footer enjeksiyonu, alt klasör kök yol çözümlemesi (basePath) ve ekosistem navigasyonu."
      },
      {
        "id": "ekibimiz-ve-yonetim",
        "title": "Topluluk Organizasyonu ve Birimler",
        "desc": "ekibimiz.html hiyerarşik yönetim şeması, kurumsal birimler ve görev dağılımı."
      }
    ]
  },
  {
    "category": "3. Medya ve Lab Ekosistemi",
    "file": "medya-lab.html",
    "topics": [
      {
        "id": "lab-sistemi-ve-medya-motoru",
        "title": "BTÜ Geçerken Lab ve 14'lü Araç Mimarisi",
        "desc": "lab.btugecerken.com çoklu sayfa mimarisi, 14 bağımsız aracın katmanları, FastAPI mikroservisi ve Nginx proxy kuralları."
      },
      {
        "id": "video-ve-medya-yayin-mimarisi",
        "title": "Video ve Medya Yayıncılığı (YouTube Kanalı Entegrasyonu)",
        "desc": "BTÜ Geçerken TV platformunun kapatılma kararı, video içeriklerinin resmi YouTube kanalına taşınması ve harici medya politikası."
      }
    ]
  },
  {
    "category": "4. Dergilik ve PDF Motoru",
    "file": "dergilik.html",
    "topics": [
      {
        "id": "dergilik-katalog-yapisi",
        "title": "Dergilik Kataloğu ve URL Parametre Protokolü",
        "desc": "dergilik.js veritabanı, Culture, Mahya ve Account Originals serileri ve tek sayfadan dinamik okuyucu başlatma."
      },
      {
        "id": "pdf-cizim-ve-not-motoru",
        "title": "İnteraktif Okuyucu, Çift Tuval ve Notlu PDF Derleme",
        "desc": "PDF.js, Dual Canvas mimarisi, fosforlu kalem/silgi modları, drawingCache ve PDF-Lib ile tarayıcıda birleştirme."
      }
    ]
  },
  {
    "category": "5. Yapay Zekâ ve Dify Ekosistemi",
    "file": "yapay-zeka.html",
    "topics": [
      {
        "id": "dify-studyo-ve-modeller",
        "title": "Dify Stüdyo Mimarisi ve 3'lü Model Görev Dağılımı",
        "desc": "Dify Studio üzerinde çalışan üç bağımsız Chatflow mimarisi, model rolleri, token sınırları ve kota optimizasyonları."
      },
      {
        "id": "sayfa-ici-asistan-popup",
        "title": "Sayfa İçi Asistan ve Dinamik Bağlam Yakalama",
        "desc": "script.js ile blog ve etkinlik sayfalarına otomatik enjekte edilen DOM bağlamlı asistanın çalışma mantığı."
      },
      {
        "id": "farabi-ai-beta-platformu",
        "title": "Farabi AI Portalı, Streaming ve Dosya Analiz Motoru",
        "desc": "farabiai.btugecerken.com altyapısı, Server-Sent Events (SSE) streaming, uploadFileToDify hattı ve çoklu oturum yönetimi."
      }
    ]
  },
  {
    "category": "6. Geliştirici Kılavuzu (How-To)",
    "file": "gelistirici.html",
    "topics": [
      {
        "id": "yeni-blog-yazisi-ekleme",
        "title": "Yeni Blog Yazısı Ekleme Prosedürü",
        "desc": "Fiziksel HTML dosyasının şablonlanması, SEO meta etiketleri, script bağımlılıkları ve blog.js kaydı."
      },
      {
        "id": "yeni-etkinlik-ekleme",
        "title": "Yeni Etkinlik ve Takvim Kaydı Ekleme",
        "desc": "etkinlikler.js veri tabanına kayıt, akademik dönem filtreleme kuralları ve yaklaşan etkinlik bayrağı."
      },
      {
        "id": "yeni-dergi-sayisi-ekleme",
        "title": "Yeni Dergi Sayısı Yükleme Prosedürü",
        "desc": "PDF dosyasının ve kapak görselinin sunucuya yüklenmesi, dergilik.js kaydı ve PDF okuyucu parametre testi."
      },
      {
        "id": "yasal-uyari-guncelleme-rehberi",
        "title": "Yasal Uyarı & KVKK Nasıl Güncellenir?",
        "desc": "Açık kaynaklı legal-templates reposunu rehber alarak sitenin yasal metinlerini, dergilik teliflerini ve KVKK şartlarını güncelleme adımları."
      }
    ]
  }
];