const CONFIG = {
  idEvento: "promo-sanmartin-2026",
  promoTag: "PROMO 2026 · BARRA LIBRE",
  titulo: "Fiesta de Egresados",
  colegio: "Colegio San Martín — Promoción",
  frasePromo: "¡Años de cursada, viajes y risas cierran esta noche!",
  hitosPromo: [
    "🎒 6 años compartiendo aulas, mates y entregas al límite",
    "🚌 Viaje y previa: las anécdotas que quedan para siempre",
    "🥂 Hoy brindamos por lo que viene, todos juntos"
  ],
  fechaTexto: "Sábado 12 de Diciembre · 21:30 hs",
  fechaISO: "2026-12-12T21:30:00-03:00",
  salon: "Salón Imperial",
  direccion: "Av. San Martín 1250",
  mapaUrl: "https://maps.google.com/?q=-32.8895,-68.8458",
  dressCode: "Elegante Sport",
  precioTexto: "$48.000 ARS por persona",
  alias: "Alias aqui",
  whatsapp: "555555555555",
  colorPrincipal: "#d4af37"
};

document.documentElement.style.setProperty("--accent", CONFIG.colorPrincipal);
document.getElementById("gate-badge").textContent = CONFIG.promoTag;
document.getElementById("event-title").textContent = CONFIG.titulo;
document.getElementById("school-name").textContent = CONFIG.colegio;
document.getElementById("promo-quote").textContent = CONFIG.frasePromo;
document.getElementById("promo-milestones").innerHTML = CONFIG.hitosPromo
  .map((hito) => `<li>${hito}</li>`)
  .join("");

const eventTimeEl = document.getElementById("event-time");
eventTimeEl.textContent = CONFIG.fechaTexto;
eventTimeEl.dateTime = CONFIG.fechaISO;

document.getElementById("venue-name").textContent = CONFIG.salon;
document.getElementById("venue-address").textContent = CONFIG.direccion;
document.getElementById("dress-code").textContent = `Dress code: ${CONFIG.dressCode}`;
document.getElementById("map-link").href = CONFIG.mapaUrl;
document.getElementById("ticket-price").textContent = CONFIG.precioTexto;
document.getElementById("alias-code").textContent = CONFIG.alias;
document.getElementById("footer-text").textContent = `${CONFIG.titulo} · ${CONFIG.colegio}`;

const toastEl = document.getElementById("toast");
let toastTimer = null;

function notify(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
}

/* Minijuego del fernet a gusto */
let drink = { ice: 0, fernet: 0, cola: 0 };
let currentJoke = "";
let photoDataUrl = "";

function jokeForMix(ice, fernet, cola) {
  const liquidTotal = fernet + cola;
  if (liquidTotal === 0 && ice === 0) return "Vaso vacío: tirá un hielo o empezá a servir.";
  if (liquidTotal > 100) return "¡Se rebalsó la mesa! Igual vale si te animás a tomarlo así.";
  if (liquidTotal === 0) return `Solo hielo (${ice}): refrescante, pero esto no es una soda.`;

  const pctFernet = Math.round((fernet / liquidTotal) * 100);
  const pctCola = 100 - pctFernet;

  if (pctFernet === 0) return "100% coca: muy suave, ¿seguro que venís a la fiesta de egresados?";
  if (pctFernet < 20) return `${pctFernet}% fernet / ${pctCola}% coca: bien suavecito, ideal para empezar charlando.`;
  if (pctFernet < 35) return `${pctFernet}% fernet / ${pctCola}% coca: clásico equilibrado que no falla.`;
  if (pctFernet <= 50) return `${pctFernet}% fernet / ${pctCola}% coca: con carácter, ¡así se festeja la promo!`;
  return `${pctFernet}% fernet / ${pctCola}% coca: ¡eso no pega nada, te va a mandar directo al baile!`;
}

function renderDrink() {
  document.getElementById("ice-tray").innerHTML = Array.from(
    { length: drink.ice },
    () => '<span class="ice-cube"></span>'
  ).join("");

  document.getElementById("liquid-fernet").style.height = `${Math.min(55, drink.fernet * 0.6)}%`;
  document.getElementById("liquid-cola").style.height = `${Math.min(55, drink.cola * 0.6)}%`;

  document.getElementById("meter-ice").value = drink.ice;
  document.getElementById("meter-fernet").value = drink.fernet;
  document.getElementById("meter-cola").value = drink.cola;

  document.getElementById("text-ice").textContent = `${drink.ice} cubos`;
  document.getElementById("text-fernet").textContent = `${drink.fernet}%`;
  document.getElementById("text-cola").textContent = `${drink.cola}%`;

  currentJoke = jokeForMix(drink.ice, drink.fernet, drink.cola);
  document.getElementById("drink-joke").textContent = currentJoke;
  document.getElementById("btn-enter").disabled = (drink.ice + drink.fernet + drink.cola) === 0;

  const nickname = document.getElementById("drink-nickname").value.trim();
  const label = nickname ? `"${nickname}"` : "Tu vaso";
  document.getElementById("drink-summary-text").textContent = `${label}: ${currentJoke}`;
}

document.getElementById("drink-nickname").addEventListener("input", renderDrink);

function bindHoldPour(buttonId, key, step) {
  const btn = document.getElementById(buttonId);
  let timer = null;
  let held = false;

  const pourOnce = () => {
    drink[key] = Math.min(100, drink[key] + step);
    renderDrink();
  };

  btn.addEventListener("pointerdown", () => {
    held = false;
    timer = setTimeout(() => {
      held = true;
      timer = setInterval(pourOnce, 120);
    }, 200);
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => {
    btn.addEventListener(ev, () => {
      clearTimeout(timer);
      clearInterval(timer);
    });
  });

  btn.addEventListener("click", () => {
    if (!held) pourOnce();
    held = false;
  });
}

document.getElementById("btn-ice").addEventListener("click", () => {
  if (drink.ice < 4) {
    drink.ice += 1;
    renderDrink();
  } else {
    notify("Máximo 4 cubos de hielo");
  }
});

bindHoldPour("btn-fernet", "fernet", 6);
bindHoldPour("btn-cola", "cola", 8);

document.getElementById("btn-clear").addEventListener("click", () => {
  drink = { ice: 0, fernet: 0, cola: 0 };
  renderDrink();
  notify("Vaso vacío");
});

function openInvitation() {
  renderDrink();
  document.getElementById("gate").style.display = "none";
  document.getElementById("invitation").classList.add("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("btn-enter").addEventListener("click", openInvitation);
document.getElementById("btn-skip").addEventListener("click", openInvitation);

document.getElementById("btn-replay").addEventListener("click", () => {
  document.getElementById("invitation").classList.remove("open");
  document.getElementById("gate").style.display = "block";
});

renderDrink();

/* Cuenta regresiva */
const targetMs = new Date(CONFIG.fechaISO).getTime();

function updateCountdown() {
  const diff = Math.max(0, targetMs - Date.now());
  const pad = (n) => String(Math.floor(n)).padStart(2, "0");
  document.getElementById("cd-days").textContent = pad(diff / 86400000);
  document.getElementById("cd-hours").textContent = pad((diff / 3600000) % 24);
  document.getElementById("cd-minutes").textContent = pad((diff / 60000) % 60);
  document.getElementById("cd-seconds").textContent = pad((diff / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* Compartir y copiar alias */
document.getElementById("btn-share").addEventListener("click", async () => {
  const shareText = `${CONFIG.titulo} (${CONFIG.colegio}) — Armé mi fernet: "${currentJoke}"`;
  if (navigator.share) {
    await navigator.share({ title: CONFIG.titulo, text: shareText, url: location.href }).catch(() => {});
  } else {
    await navigator.clipboard.writeText(`${shareText} ${location.href}`);
    notify("Link copiado para WhatsApp");
  }
});

document.getElementById("btn-copy-alias").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONFIG.alias);
    notify("Alias copiado");
  } catch {
    notify("No se pudo copiar");
  }
});

/* RSVP por WhatsApp */
document.getElementById("rsvp-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("rsvp-name").value.trim();
  const passes = document.getElementById("rsvp-passes").value;
  const diet = document.getElementById("rsvp-diet").value.trim() || "Ninguna";

  const message = [
    `¡Hola! Confirmo asistencia a *${CONFIG.titulo}*:`,
    `• *Nombre:* ${name}`,
    `• *Pases:* ${passes}`,
    `• *Restricción alimentaria:* ${diet}`,
    `• *Mi trago:* ${currentJoke}`
  ].join("\n");

  window.open(
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

/* Muro de fotos (listo para Firebase Storage y Firestore) */
const photoFileInput = document.getElementById("photo-file");
const previewFigure = document.getElementById("preview-figure");
const previewImg = document.getElementById("preview-img");
const photoWall = document.getElementById("photo-wall");

photoFileInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    photoDataUrl = "";
    previewFigure.classList.remove("open");
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    photoDataUrl = ev.target.result;
    previewImg.src = photoDataUrl;
    previewFigure.classList.add("open");
  };
  reader.readAsDataURL(file);
});

document.getElementById("photo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!photoDataUrl) {
    notify("Elegí una foto primero");
    return;
  }

  const author = document.getElementById("photo-author").value.trim() || "Invitado";
  const caption = document.getElementById("photo-caption").value.trim() || "¡Presente en la promo!";

  const li = document.createElement("li");
  li.innerHTML = `
    <article class="photo-card">
      <figure>
        <img src="${photoDataUrl}" alt="Foto de ${author}" />
        <figcaption>
          <strong>${author}</strong>
          <span>${caption}</span>
        </figcaption>
      </figure>
    </article>
  `;
  photoWall.prepend(li);

  // TODO: Conectar con Firebase Storage y Firestore para persistir la foto y sincronizarla con todos los invitados.

  e.target.reset();
  photoDataUrl = "";
  previewFigure.classList.remove("open");
  notify("Foto publicada en el muro");
});