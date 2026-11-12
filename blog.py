import requests
from bs4 import BeautifulSoup
import json

# blog.js dosyanızdaki veri yapısı
blog_posts = [
    {"id": 14, "title": "Hz. Muhammed'in Hayatı", "cat": "Din", "date": "28 Temmuz 2026", "excerpt": "Mekke'den Medine'ye...", "link": "hz-muhammed.html"},
    {"id": 13, "title": "Kur'an'ın İndirilişi ve Kısa Özeti", "cat": "Din", "date": "28 Temmuz 2026", "excerpt": "Kur'an, İslam'ın kutsal kitabı...", "link": "kuran-indirilisi.html"},
    {"id": 12, "title": "İslamın Beş Şartı", "cat": "Din", "date": "28 Temmuz 2026", "excerpt": "İman esasları...", "link": "bes-sart.html"},
    {"id": 11, "title": "Kutsal Geometri", "cat": "Geometri", "date": "28 Temmuz 2026", "excerpt": "Kutsal geometri...", "link": "kutsal-geometri.html"},
    {"id": 10, "title": "Fibonacci Dizisi", "cat": "Matematik", "date": "28 Temmuz 2026", "excerpt": "Basit bir toplama kuralı...", "link": "fibonacci-dizisi.html"},
    {"id": 9, "title": "Fovizm Akımı", "cat": "Account Originals", "date": "27 Temmuz 2026", "excerpt": "Account Original Content...", "link": "fovizm.html"},
    {"id": 8, "title": "Tahvilin Anatomisi", "cat": "Account Original", "date": "27 Temmuz 2026", "excerpt": "Tahvilin Anatomisi...", "link": "tahvil.html"},
    {"id": 7, "title": "Pandora'nın Kutusu", "cat": "Account Original", "date": "27 Temmuz 2026", "excerpt": "Pandora'nın Kutusu...", "link": "pandoranın-kutusu.html"},
    {"id": 6, "title": "Evler: Zodyak Yolu", "cat": "Account Original", "date": "27 Temmuz 2026", "excerpt": "Evler:Zpdyak Yolu...", "link": "evler-zodyak-yolu.html"},
    {"id": 5, "title": "Hz. Adem", "cat": "Account Original", "date": "27 Temmuz 2026", "excerpt": "Hz. Adem...", "link": "hz-adem.html"},
    {"id": 4, "title": "Altın Oran", "cat": "Account Original", "date": "26 Temmuz 2026", "excerpt": "Altın Oran...", "link": "altin-oran.html"},
    {"id": 3, "title": "Romanesk Mimari", "cat": "Account Original", "date": "26 Temmuz 2026", "excerpt": "Romanesk Mimari...", "link": "romanesk.html"},
    {"id": 2, "title": "Art Nouveau", "cat": "Account Original", "date": "22 Temmuz 2026", "excerpt": "Art Nouveau...", "link": "art-nouveau.html"},
    {"id": 1, "title": "BTU Geçerken Tanıtım", "cat": "Gündem", "date": "08 Temmuz 2026", "excerpt": "BTU Geçerken Topluluğu...", "link": "btu-gecerken-nedir-bir-topluluktan-daha-fazlasi.html"}
]

base_url = "https://btugecerken.com/"
dify_data = []

headers = {"User-Agent": "Mozilla/5.0"}

for post in blog_posts:
    full_url = base_url + post["link"]
    full_content = post["excerpt"] # Varsayılan olarak özeti koyuyoruz
    
    # Sayfadaki detaylı metni çekmeye çalış
    try:
        res = requests.get(full_url, headers=headers, timeout=5)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, "html.parser")
            # Sayfadaki paragrafları veya ana içeriği al
            paragraphs = soup.find_all("p")
            page_text = "\n".join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
            if page_text:
                full_content = page_text
    except Exception as e:
        print(f"Hata ({post['link']}): {e}")

    # Dify'ın en iyi anlayacağı format
    dify_data.append({
        "title": post["title"],
        "category": post["cat"],
        "date": post["date"],
        "url": full_url,
        "content": full_content
    })

# JSON olarak kaydet
with open("dify_blogs.json", "w", encoding="utf-8") as f:
    json.dump(dify_data, f, ensure_ascii=False, indent=2)

print("İşlem tamam! 'dify_blogs.json' dosyası oluşturuldu.")