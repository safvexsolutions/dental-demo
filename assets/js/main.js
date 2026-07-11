/* ============================================================
   I SMILE DENTAL CLINIC — shared behaviour
   ============================================================ */

// ---------- Config ----------
const CLINIC = {
  phone: "917776900037",           // WhatsApp / call number, international format no +
  phoneDisplay: "+91 77769 00037",
  email: "safvexsolutions@gmail.com",
  address: "1st Floor, Om Palace, near Indrani's Showroom, Suyog Nagar, Nagpur, Maharashtra, India",
  mapsLink: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x3bd4bf2f1efb3a71:0x8082d61fdfe1768c?entry=s&sa=X&ved=1t:8290&hl=en-in&ictx=111",
  hoursShort: "11:00 AM – 7:00 PM",
  emailjs: {
    serviceId: "service_zkqa3cq",
    templateId: "template_glm4qh8",
    publicKey: "jjpjglujpSG0LDXex"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveals();
  initGsapScenes();
  initTestimonialSlider();
  initWhatsApp();
  initAppointmentForm();
  initCounters();
  wireStaticLinks();
});

// ---------- Nav ----------
function initNav(){
  const nav = document.querySelector(".site-nav");
  if(!nav) return;
  const onScroll = () => {
    if(window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });

  const burger = document.querySelector(".nav-burger");
  const menu = document.querySelector(".mobile-menu");
  const closeBtn = document.querySelector(".mobile-menu-close");
  if(burger && menu){
    burger.addEventListener("click", () => menu.classList.add("open"));
    closeBtn && closeBtn.addEventListener("click", () => menu.classList.remove("open"));
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
  }
}

// ---------- Plain scroll reveals (fallback / non-GSAP elements) ----------
function initReveals(){
  const items = document.querySelectorAll(".reveal");
  if(!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible"); // re-plays on re-entry, forward & backward
      }
    });
  }, { threshold:0.18 });
  items.forEach(el => io.observe(el));
}

// ---------- GSAP driven scenes: hero parallax + "assembling" pieces ----------
function initGsapScenes(){
  if(typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero cards gentle parallax on load + scroll
  gsap.utils.toArray(".hero-card").forEach((card, i) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0, rotate: i === 0 ? 3 : -3 },
      { y: 0, opacity: 1, rotate: 0, duration: 1.1, delay: 0.2 + i * 0.15, ease: "power3.out" }
    );
    gsap.to(card, {
      y: i === 0 ? -40 : 30,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
    });
  });

  // Assembling gallery: pieces fly in from off-stage and lock together,
  // and reverse cleanly back apart when the user scrolls back up (scrub = tied to scrollbar).
  const stage = document.querySelector(".assemble-stage");
  if(stage){
    const pieces = stage.querySelectorAll(".piece");
    const from = [
      { x: -220, y: -120, rotate: -14, scale: 0.85 },
      { x: 240, y: 160, rotate: 12, scale: 0.85 },
      { x: 160, y: -180, rotate: 10, scale: 0.85 }
    ];
    pieces.forEach((p, i) => {
      gsap.fromTo(p, from[i % from.length], {
        x: 0, y: 0, rotate: 0, scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top 85%",
          end: "top 20%",
          scrub: 0.8
        }
      });
    });
    gsap.fromTo(".center-ring", { scale: 0.6, opacity: 0 }, {
      scale: 1, opacity: 1, ease: "none",
      scrollTrigger: { trigger: stage, start: "top 85%", end: "top 30%", scrub: 0.8 }
    });
  }

  // Generic section reveals via GSAP for smoother, reversible fade/slide
  gsap.utils.toArray("[data-gsap='up']").forEach((el) => {
    gsap.fromTo(el, { y: 46, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play reverse play reverse" }
    });
  });
  gsap.utils.toArray("[data-gsap='stagger']").forEach((group) => {
    const kids = group.children;
    gsap.fromTo(kids, { y: 36, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: group, start: "top 85%", toggleActions: "play reverse play reverse" }
    });
  });

  // Service / gallery card tilt-in
  gsap.utils.toArray("[data-gsap='scale']").forEach((el, i) => {
    gsap.fromTo(el, { scale: 0.9, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.7, delay: (i % 4) * 0.05, ease: "back.out(1.6)",
      scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play reverse play reverse" }
    });
  });
}

// ---------- Animated counters ----------
function initCounters(){
  const nums = document.querySelectorAll(".counter-num[data-count]");
  if(!nums.length) return;
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const obj = { val: 0 };
    if(typeof gsap !== "undefined"){
      gsap.to(obj, {
        val: target, duration: 1.6, ease: "power2.out",
        onUpdate: () => el.textContent = Math.floor(obj.val) + suffix
      });
    } else {
      el.textContent = target + suffix;
    }
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold:0.5 });
  nums.forEach(el => io.observe(el));
}

// ---------- Testimonial drag slider ----------
function initTestimonialSlider(){
  const track = document.querySelector(".testi-track");
  if(!track) return;
  let isDown = false, startX, scrollLeft;

  track.addEventListener("mousedown", (e) => {
    isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
  });
  ["mouseleave","mouseup"].forEach(evt => track.addEventListener(evt, () => isDown = false));
  track.addEventListener("mousemove", (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });

  const prev = document.querySelector(".testi-prev");
  const next = document.querySelector(".testi-next");
  const step = () => track.querySelector(".testi-card")?.offsetWidth + 24 || 380;
  prev && prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior:"smooth" }));
  next && next.addEventListener("click", () => track.scrollBy({ left: step(), behavior:"smooth" }));
}

// ---------- WhatsApp click-to-chat ----------
function buildWaMessage({ name, phone, problem, timing } = {}){
  const lines = [
    "Hi, welcome to I Smile Clinic! I'd like to book an appointment.",
    "",
    `Name: ${name || "(enter your name)"}`,
    `Phone: ${phone || "(enter your phone)"}`,
    `Problem: ${problem || "(describe your dental concern)"}`,
    `Preferred timing (11:00 AM – 7:00 PM): ${timing || "(enter preferred time)"}`
  ];
  return encodeURIComponent(lines.join("\n"));
}

function initWhatsApp(){
  const floatBtn = document.querySelector(".wa-float");
  if(floatBtn){
    floatBtn.href = `https://wa.me/${CLINIC.phone}?text=${buildWaMessage()}`;
    floatBtn.target = "_blank";
    floatBtn.rel = "noopener";
  }
}

// ---------- Appointment form: EmailJS + WhatsApp handoff ----------
function initAppointmentForm(){
  const form = document.querySelector("#appointment-form");
  if(!form) return;

  if(typeof emailjs !== "undefined"){
    emailjs.init({ publicKey: CLINIC.emailjs.publicKey });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const statusEl = form.querySelector(".form-status");
    const submitBtn = form.querySelector("button[type='submit']");
    const data = {
      name: form.name.value.trim(),
      age: form.age.value.trim(),
      phone: form.phone.value.trim(),
      problem: form.problem.value.trim(),
      timing: form.timing.value
    };

    if(!data.name || !data.phone || !data.problem || !data.timing){
      statusEl.textContent = "Please fill in every field so we can prepare for your visit.";
      statusEl.className = "form-status err";
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Booking...";
    submitBtn.disabled = true;
    statusEl.textContent = "";
    statusEl.className = "form-status";

    const templateParams = {
      from_name: data.name,
      age: data.age,
      phone: data.phone,
      problem: data.problem,
      timing: data.timing,
      to_email: CLINIC.email
    };

    const finishUp = (whatsappOk) => {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
      statusEl.textContent = whatsappOk
        ? "Request received! Opening WhatsApp so you can confirm instantly."
        : "Request received! Our team will call you to confirm shortly.";
      statusEl.className = "form-status ok";
      form.reset();
    };

    const sendWhatsApp = () => {
      const msg = buildWaMessage(data);
      window.open(`https://wa.me/${CLINIC.phone}?text=${msg}`, "_blank");
    };

    if(typeof emailjs !== "undefined"){
      emailjs.send(CLINIC.emailjs.serviceId, CLINIC.emailjs.templateId, templateParams)
        .then(() => { sendWhatsApp(); finishUp(true); })
        .catch(() => { sendWhatsApp(); finishUp(true); }); // still hand off to WhatsApp even if email fails
    } else {
      sendWhatsApp();
      finishUp(true);
    }
  });
}

// ---------- Misc static links (phone / mail / map, shared across pages) ----------
function wireStaticLinks(){
  document.querySelectorAll("[data-phone]").forEach(el => {
    el.href = `tel:+${CLINIC.phone}`;
    if(el.dataset.phone === "text") el.textContent = CLINIC.phoneDisplay;
  });
  document.querySelectorAll("[data-email]").forEach(el => {
    el.href = `mailto:${CLINIC.email}`;
    if(el.dataset.email === "text") el.textContent = CLINIC.email;
  });
  document.querySelectorAll("[data-maps]").forEach(el => { el.href = CLINIC.mapsLink; });
  document.querySelectorAll("[data-address]").forEach(el => { el.textContent = CLINIC.address; });
}
