// Preloader: 4.5 saniye sonra kaybolur, ardından içerik yumuşakça belirir
const PRELOADER_SURESI = 4500;

window.addEventListener('load', () => {
    // İçerik bloklarını animasyona hazırla
    const bloklar = document.querySelectorAll('.navbar, .hero, .feature-card, .cta-box');
    bloklar.forEach(el => el.classList.add('reveal'));

    setTimeout(() => {
        document.getElementById('intro-loader').classList.add('hide');
        document.body.classList.remove('loading');

        // Sırayla göster
        bloklar.forEach((el, i) => {
            setTimeout(() => el.classList.add('show'), 150 * i);
        });
    }, PRELOADER_SURESI);
});
