<div align="center">

<br />

```
 ░█████╗░██╗███╗░░░███╗██████╗░██████╗░░█████╗░
 ██╔══██╗██║████╗░████║██╔══██╗██╔══██╗██╔══██╗
 ███████║██║██╔████╔██║██████╔╝██████╔╝██║░░██║
 ██╔══██║██║██║╚██╔╝██║██╔═══╝░██╔══██╗██║░░██║
 ██║░░██║██║██║░╚═╝░██║██║░░░░░██║░░██║╚█████╔╝
 ╚═╝░░╚═╝╚═╝╚═╝░░░░╚═╝╚═╝░░░░░╚═╝░░╚═╝░╚════╝░
```

### **AI destekli günlük planlayıcı. Hedefle. Önceliklendir. Tamamla.**

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude-AI-cc785c?style=for-the-badge&logo=anthropic&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)

<br/>

</div>

---

## ✦ Ne Yapar?

> Sabah uyandığında ne yapacağını bilmemek verimliliğin en büyük düşmanıdır.  
> **AimPro** bunu çözer.

Günlük görevlerini ekle, önceliklendir — sonra AI koçun devreye girsin. Planını analiz eder, sıralamani önerir, motive eder.

---

## ⚡ Özellikler

```
┌─────────────────────────────────────────────┐
│  📋  Günlük görev yönetimi                  │
│  🔴  Öncelik sistemi  →  Yüksek / Orta / Düşük │
│  🕐  Deadline takibi                        │
│  💼  Kategori desteği  →  İş / Okul / Kişisel  │
│  🤖  AI Plan Analisti  →  Claude Sonnet     │
│  ⚡  Otomatik önceliklendirme önerisi       │
│  💬  Sohbet tabanlı koçluk                  │
│  ✦   Dark mode tasarım + animasyonlar       │
└─────────────────────────────────────────────┘
```

---

## 🚀 Kurulum

```bash
# Repoyu klonla
git clone https://github.com/kalkisim-taha/AimPro.git
cd AimPro

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcında aç → `http://localhost:5173`

---

## 🤖 AI Özelliğini Aktifleştir

AI Plan Analisti için Anthropic API key'i gereklidir.

**1.** [console.anthropic.com](https://console.anthropic.com) → kayıt ol → API key oluştur

**2.** `src/App.jsx` içinde şu satırı bul:
```js
headers: { "Content-Type": "application/json" },
```

**3.** Altına ekle:
```js
"x-api-key": "sk-ant-SENIN-KEY-BURAYA",
"anthropic-version": "2023-06-01",
```

> 💡 Yeni hesaplara $5 ücretsiz kredi tanınır.

---

## 🗂 Proje Yapısı

```
AimPro/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx        # Uygulama giriş noktası
    └── App.jsx         # Tüm bileşenler + stiller
```

---

## 🛠 Teknolojiler

| Teknoloji | Kullanım |
|-----------|----------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Claude Sonnet | AI analiz motoru |
| CSS-in-JS | Animasyonlar & tema |

---

## 🗺 Yol Haritası

- [ ] LocalStorage ile veri kalıcılığı
- [ ] Haftalık istatistik görünümü
- [ ] Görev tekrarlama (günlük/haftalık)
- [ ] Bildirim desteği
- [ ] Çoklu dil

---

<div align="center">

<br/>

**✦ AimPro ile her günü planlı başlat ✦**

<br/>

*Built with React + Claude AI*

</div>
