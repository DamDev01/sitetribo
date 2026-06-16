const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const form = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

const contactEmail = "info@triboneurodiversa.com.br";
const contactEndpoint = `https://formsubmit.co/ajax/${contactEmail}`;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const nome = data.get("nome").trim();
    const email = data.get("email").trim();
    const assunto = data.get("assunto");
    const mensagem = data.get("mensagem").trim();
    const submitButton = form.querySelector('button[type="submit"]');

    const payload = {
      nome,
      email,
      assunto,
      mensagem,
      _subject: `[Site TRIBO] ${assunto} - ${nome}`,
      _template: "table",
      _captcha: "false",
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }

    if (formNote) {
      formNote.textContent = "Enviando sua mensagem...";
    }

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem.");
      }

      form.reset();

      if (formNote) {
        formNote.textContent = "Mensagem enviada. Obrigado pelo contato.";
      }
    } catch (error) {
      if (formNote) {
        formNote.textContent =
          `Nao foi possivel enviar agora. Tente novamente ou escreva para ${contactEmail}.`;
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar mensagem";
      }
    }
  });
}
