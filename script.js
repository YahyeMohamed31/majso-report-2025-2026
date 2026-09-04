const cfg = window.MAJSO_CONFIG || {};
const $ = s => document.querySelector(s);

// Video/PDF links are controlled from config.js.
const videoBtn = $('#videoBtn');
if(cfg.video && !cfg.video.includes('HALAAN')) videoBtn.href = cfg.video;

// PDF-ga wuxuu hadda ku jiraa gudaha folder-ka website-ka, mana aha Google Drive.
const pdf = cfg.pdf || 'MAJSO-Warbixinta-2025-2026.pdf';
const readBtn = $('#readBtn');
const pdfBtn = $('#pdfBtn');
if(readBtn) readBtn.href = pdf;
if(pdfBtn){
  pdfBtn.href = pdf;
  // Marka la gujiyo, browser-ku wuxuu soo dejinayaa buugga halkii uu Drive/online tab uga furi lahaa.
  pdfBtn.setAttribute('download', 'MAJSO-Warbixinta-2025-2026.pdf');
}

// QR code wuxuu si toos ah u tilmaamayaa URL-ka website-ka online-ka ah.
function getSiteUrl(){
  const configured = (cfg.siteUrl || '').trim();
  if(configured) return configured.replace(/\/$/, '') + '/';

  if(location.protocol === 'http:' || location.protocol === 'https:') {
    // Ka saar #section iyo query si QR-ku u furo bogga website-ka si toos ah.
    return location.origin + location.pathname;
  }
  return '';
}

function makeQR(){
  const box = $('#qr');
  if(!box || !window.QRCode) return;
  const siteUrl = getSiteUrl();
  box.innerHTML='';

  if(!siteUrl){
    box.innerHTML = '<div class="qr-message">🌐<br><b>QR Code-ka wuxuu shaqaynayaa marka website-ka online la geliyo.</b><br><small>GitHub Pages / Hosting kadib si toos ah ayuu website-kan u furayaa.</small></div>';
    return;
  }

  new QRCode(box,{
    text: siteUrl,
    width: 190,
    height: 190,
    colorDark: '#202d70',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  const urlText = $('#qrUrl');
  if(urlText) urlText.textContent = siteUrl.replace(/^https?:\/\//,'').replace(/\/$/,'');
}
window.addEventListener('load', makeQR);

// Small footer QR: editable from config.js via footerQrUrl.
function makeFooterQR(){
  const box = $('#footerQr');
  if(!box || !window.QRCode) return;
  const configured = (cfg.footerQrUrl || '').trim();
  const target = configured || getSiteUrl();
  box.innerHTML = '';
  if(!target){
    box.innerHTML = '<span class="footer-qr-empty">QR</span>';
    return;
  }
  new QRCode(box,{
    text: target,
    width: 112,
    height: 112,
    colorDark: '#202d70',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}
window.addEventListener('load', makeFooterQR);


// Animated counters for the numeric statistics.
function animateCounters(){
  document.querySelectorAll('.counter').forEach(el=>{
    const target=Number(el.dataset.target||0);
    const duration=1100;
    const start=performance.now();
    const step=now=>{
      const progress=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      el.textContent=Math.round(target*eased);
      if(progress<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
const statsSection=document.querySelector('.stats');
if(statsSection){
  const counterObserver=new IntersectionObserver(entries=>{
    if(entries.some(e=>e.isIntersecting)){
      animateCounters();
      counterObserver.disconnect();
    }
  },{threshold:.35});
  counterObserver.observe(statsSection);
}

// Scroll reveal.
const io = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Progress bar.
addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  $('#progress').style.width=(h>0?(scrollY/h)*100:0)+'%';
});

// Mobile menu.
$('#menu')?.addEventListener('click',()=>$('#nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
