// ============================================================
//  Cravings Café — index3.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------------------------------------
  // 1. NAVBAR — shrink on scroll + body padding
  // ----------------------------------------------------------
  const navbar = document.querySelector(".navbar");

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.style.padding = "10px 30px";
      navbar.style.boxShadow = "0 2px 16px rgba(59,31,14,0.13)";
    } else {
      navbar.style.padding = "18px 30px";
      navbar.style.boxShadow = "none";
    }
  }

  // Set initial body padding so hero isn't hidden under fixed navbar
  function setBodyPadding() {
    document.body.style.paddingTop = navbar.offsetHeight + "px";
  }

  window.addEventListener("scroll", updateNavbar);
  window.addEventListener("resize", setBodyPadding);
  setBodyPadding();
  updateNavbar();


  // ----------------------------------------------------------
  // 2. SMOOTH SCROLL — "Reserve a Table" → #contact
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"], button').forEach(el => {
    el.addEventListener("click", e => {
      const text = el.textContent.trim().toLowerCase();
      let targetId = null;

      if (el.tagName === "A" && el.getAttribute("href").startsWith("#")) {
        targetId = el.getAttribute("href").slice(1);
      } else if (text.includes("reserve")) {
        targetId = "contact";
      } else if (text.includes("explore our menu")) {
        targetId = "featured-3";
      } else if (text.includes("our story")) {
        targetId = "featured-3";
      }

      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });


  // ----------------------------------------------------------
  // 3. MENU TAB SYSTEM
  //    Clicking a dropdown item shows the matching .menu-category
  // ----------------------------------------------------------

  // Map dropdown link text → menu category element id
  const categoryMap = {
    "pizzas":        "cat-pizzas",
    "pastas":        "cat-pastas",
    "noodles":       "cat-noodles",
    "wrap":          "cat-wraps",
    "donuts":        "cat-donuts",
    "ice creams":    "cat-icecreams",
    "sundaes":       "cat-sundaes",
    "others":        "cat-otherdesserts",
    "tea":           "cat-tea",
    "coffee":        "cat-coffee",
    "thickshakes":   "cat-thickshakes",
    "mocktails":     "cat-mocktails",
    "hot chocolate": "cat-hotchocolate",
  };

  // Also map the main btn-group label buttons (Main / Desserts / Drinks)
  const groupDefaults = {
    "main":     "cat-pizzas",
    "desserts": "cat-donuts",
    "drinks":   "cat-tea",
  };

  function showCategory(id) {
    document.querySelectorAll(".menu-category").forEach(cat => {
      cat.classList.remove("visible");
    });
    const target = document.getElementById(id);
    if (target) target.classList.add("visible");
  }

  // Wire up dropdown items
  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const key = item.textContent.trim().toLowerCase();
      const catId = categoryMap[key];
      if (catId) showCategory(catId);

      // Close the dropdown
      const dropdownMenu = item.closest(".dropdown-menu");
      if (dropdownMenu) dropdownMenu.classList.remove("show");
      const toggle = dropdownMenu && dropdownMenu.previousElementSibling;
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Wire up main group buttons (Main / Desserts / Drinks)
  document.querySelectorAll(".btn-group .btn-lg:not(.dropdown-toggle-split)").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.textContent.trim().toLowerCase();
      const catId = groupDefaults[key];
      if (catId) showCategory(catId);
    });
  });

  // Show Pizzas by default on load
  showCategory("cat-pizzas");


  // ----------------------------------------------------------
  // 4. CONTACT FORM — basic validation + success feedback
  // ----------------------------------------------------------
  const formSubmitBtn = document.querySelector(".form-submit");
  if (formSubmitBtn) {
    formSubmitBtn.addEventListener("click", e => {
      e.preventDefault();

      const nameInput    = document.querySelector('input[placeholder*="Arjun"]');
      const emailInput   = document.querySelector('input[type="email"]');
      const phoneInput   = document.querySelector('input[type="tel"]');
      const messageArea  = document.querySelector("textarea");

      let valid = true;
      [nameInput, emailInput, phoneInput, messageArea].forEach(field => {
        if (field) {
          field.style.borderColor = "";
          if (!field.value.trim()) {
            field.style.borderColor = "#c0392b";
            valid = false;
          }
        }
      });

      if (emailInput && emailInput.value && !emailInput.value.includes("@")) {
        emailInput.style.borderColor = "#c0392b";
        valid = false;
      }

      if (!valid) {
        showToast("Please fill in all fields correctly.", "error");
        return;
      }

      // Success
      showToast("Message sent! We'll get back to you soon. ☕", "success");
      [nameInput, emailInput, phoneInput, messageArea].forEach(f => {
        if (f) f.value = "";
      });
    });
  }


  // ----------------------------------------------------------
  // 5. TOAST NOTIFICATION helper
  // ----------------------------------------------------------
  function showToast(message, type = "success") {
    const existing = document.getElementById("cafe-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "cafe-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position:        "fixed",
      bottom:          "30px",
      right:           "30px",
      background:      type === "success" ? "var(--brown, #3b1f0e)" : "#c0392b",
      color:           "#fff",
      padding:         "14px 24px",
      borderRadius:    "10px",
      fontSize:        "0.95rem",
      boxShadow:       "0 4px 20px rgba(0,0,0,0.25)",
      zIndex:          "9999",
      opacity:         "0",
      transform:       "translateY(10px)",
      transition:      "opacity 0.3s, transform 0.3s",
      maxWidth:        "320px",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }


  // ----------------------------------------------------------
  // 6. SCROLL REVEAL — fade-in sections as user scrolls
  // ----------------------------------------------------------
  const revealTargets = document.querySelectorAll(
    ".hero-section, #featured-3, .menu, #location, #contact, footer"
  );

  const revealStyles = `
    .reveal-hidden {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  const styleTag = document.createElement("style");
  styleTag.textContent = revealStyles;
  document.head.appendChild(styleTag);

  revealTargets.forEach(el => {
    // Don't hide the hero — it's the first thing seen
    if (!el.classList.contains("hero-section")) {
      el.classList.add("reveal-hidden");
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach(el => observer.observe(el));


  // ----------------------------------------------------------
  // 7. FOOTER — highlight active nav link on scroll
  // ----------------------------------------------------------
  const sections = ["featured-3", "location", "contact"];
  const footerLinks = document.querySelectorAll(".footer-col ul a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec && window.scrollY >= sec.offsetTop - 120) current = id;
    });

    footerLinks.forEach(link => {
      link.style.color = "";
      const href = link.getAttribute("href") || "";
      if (href.includes(current) && current) {
        link.style.color = "var(--gold, #c8973a)";
      }
    });
  });

}); // end DOMContentLoaded

// Fix body padding based on actual navbar height
function fixNavbarGap() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    document.body.style.paddingTop = navbar.offsetHeight + 'px';
  }
}

fixNavbarGap();
window.addEventListener('resize', fixNavbarGap);

// ── Connect Contact Form to Backend ──────────────────────────
const submitBtn = document.querySelector('.form-submit');

if (submitBtn) {
  submitBtn.addEventListener('click', async function(e) {
    e.preventDefault();

    const name    = document.querySelector('input[type="text"]').value;
    const email   = document.querySelector('input[type="email"]').value;
    const phone   = document.querySelector('input[type="tel"]').value;
    const message = document.querySelector('textarea').value;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://cravings-backend-cvte.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });

      const data = await response.json();

      if (data.success) {
        submitBtn.textContent = '✅ Message Sent!';
        document.querySelector('.contact-form').querySelectorAll('input, textarea')
          .forEach(el => el.value = '');
      } else {
        submitBtn.textContent = '❌ Failed. Try again.';
        submitBtn.disabled = false;
      }

    } catch (err) {
      console.log('Error:', err);
      submitBtn.textContent = '❌ Error. Try again.';
      submitBtn.disabled = false;
    }
  });
}