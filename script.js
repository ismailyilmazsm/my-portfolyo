// Sayfa Geçişleri
function showForm() {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('form-page').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('form-page').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// İletişim Tercihine Göre Gizli Kutucuğu Aç/Kapa
function handleIletisimChange() {
    const select = document.getElementById('iletisimTercihi');
    const gizliKutu = document.getElementById('gizliIletisimKutusu');
    const label = document.getElementById('gizliIletisimLabel');
    const input = document.getElementById('iletisimBilgisi');
    
    const secim = select.value;
    
    if (secim === "") {
        gizliKutu.style.display = 'none';
        input.removeAttribute('required');
        input.value = '';
    } else {
        gizliKutu.style.display = 'block';
        input.setAttribute('required', 'required');
        
        if (secim === "WhatsApp") {
            label.innerText = "WhatsApp Numaranız";
            input.placeholder = "Örn: 05xx xxx xx xx";
        } else if (secim === "Instagram") {
            label.innerText = "Instagram Kullanıcı Adınız";
            input.placeholder = "Kullanıcı Adı";
        } else if (secim === "Telefon") {
            label.innerText = "Telefon Numaranız";
            input.placeholder = "Örn: 05xx xxx xx xx";
        } else if (secim === "TikTok") {
            label.innerText = "TikTok Kullanıcı Adınız (İletişim için)";
            input.placeholder = "Kullanıcı Adı";
        } else if (secim === "Telegram") {
            label.innerText = "Telegram Kullanıcı Adınız / Numaranız";
            input.placeholder = "Kullanıcı Adı veya Numara";
        }
    }
}

// Bir adımdaki alanları kontrol eder, hata mesajını döner (sorun yoksa boş string)
function validateStep(currentStep) {
    const currentTab = document.getElementById(`step${currentStep}`);
    const inputs = currentTab.querySelectorAll('input[required], select[required], textarea[required]');
    let hata = '';

    const isaretle = (el, hatali) => {
        el.style.border = hatali ? '2px solid var(--primary-pink)' : '1px solid var(--primary-pink)';
    };

    // Standart Doğrulama (validation)
    inputs.forEach(input => {
        if (!input.value.trim()) {
            hata = hata || "Lütfen bir sonraki adıma geçmeden önce zorunlu alanları doldurun.";
            isaretle(input, true);
        } else {
            isaretle(input, false);
        }
    });

    // Adım 1: Yaş kontrolü (18 ve üzeri)
    if (currentStep === 1) {
        const yasInput = document.querySelector('input[name="Yas"]');
        const yas = Number(yasInput.value);
        if (yasInput.value.trim() && (!Number.isInteger(yas) || yas < 18 || yas > 99)) {
            hata = hata || "Başvuru yapabilmek için 18 yaşından büyük olmanız gerekmektedir.";
            isaretle(yasInput, true);
        }
    }

    // Adım 2 Özel Doğrulaması: "İçerik Üreticisi" seçiliyse "Deneyimler" zorunlu olsun
    if (currentStep === 2) {
        const kullaniciTuru = document.querySelector('select[name="Kullanici_Turu"]').value;
        const deneyimInput = document.querySelector('input[name="Deneyimler"]');
        
        if (kullaniciTuru === 'İçerik Üreticisi' && !deneyimInput.value.trim()) {
            hata = hata || "Lütfen bir sonraki adıma geçmeden önce zorunlu alanları doldurun.";
            isaretle(deneyimInput, true);
        } else {
            // "Yeni Başladım" veya "Diğer Kullanıcı" seçiliyse hata verme
            isaretle(deneyimInput, false);
        }
    }

    return hata;
}

// Form Adım Geçişleri
function nextStep(currentStep) {
    const hata = validateStep(currentStep);
    if (hata) {
        alert(hata);
        return;
    }

    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep + 1}`).classList.add('active');
}

function prevStep(currentStep) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep - 1}`).classList.add('active');
}

// Form Gönderme Simülasyonu
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    // Gönderimden önce tüm adımları tekrar kontrol et; hata varsa o adıma dön
    for (const adim of [1, 2, 3]) {
        const hata = validateStep(adim);
        if (hata) {
            document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
            document.getElementById(`step${adim}`).classList.add('active');
            alert(hata);
            return;
        }
    }
    
    const preloader = document.getElementById('preloader');
    const spinner = document.getElementById('preloaderSpinner');
    const check = document.getElementById('successCheck');
    const msg = document.getElementById('preloaderMsg');

    // Sırayla gösterilecek mesajlar ve ekranda kalma süreleri (ms)
    const mesajlar = [
        { text: "Lütfen bekleyiniz, cevaplarınız kontrol ediliyor.", sure: 3000 },
        { text: "Sorduğumuz sorular kesinlikle kişisel veri toplama amacıyla değil, tamamen sosyal medya maceranızı öğrenip sizin için doğru hedefi analiz etmek içindir.", sure: 5500 },
        { text: "Bizi tercih ettiğiniz için teşekkür ederiz. Sizinle en kısa zamanda iletişime geçeceğiz.", sure: 3500, son: true }
    ];

    preloader.classList.add('active');
    spinner.style.display = 'block';
    check.style.display = 'none';

    let i = 0;
    function siradakiMesaj() {
        const m = mesajlar[i];

        // Son mesajda dönen halka yerine onay işareti
        if (m.son) {
            spinner.style.display = 'none';
            check.style.display = 'flex';
        }

        msg.textContent = m.text;
        msg.classList.add('show');

        setTimeout(() => {
            if (m.son) {
                window.location.href = 'index.html';
                return;
            }
            msg.classList.remove('show');
            i++;
            setTimeout(siradakiMesaj, 600); // yumuşak geçiş için kısa ara
        }, m.sure);
    }

    setTimeout(siradakiMesaj, 400);
});

