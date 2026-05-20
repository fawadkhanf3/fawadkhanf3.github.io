(function () {
  const data = window.portfolioData;
  const $ = (selector) => document.querySelector(selector);

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const externalAttrs = 'target="_blank" rel="noreferrer"';
  const listItems = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const pill = (text) => `<span class="pill">${escapeHtml(text)}</span>`;

  function initTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    document.body.dataset.theme = savedTheme;
    updateThemeToggle();
  }

  function updateThemeToggle() {
    const toggle = $(".theme-toggle");
    const light = document.body.dataset.theme === "light";
    toggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    toggle.setAttribute("aria-pressed", String(light));
    toggle.innerHTML = `<i class="${light ? "ri-moon-line" : "ri-sun-line"}" aria-hidden="true"></i>`;
  }

  function renderProfile() {
    $("#profile-summary").textContent = data.profile.summary;
    $("#quick-facts").innerHTML = data.profile.facts
      .map(([term, description]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(description)}</dd></div>`)
      .join("");
    $("#hero-socials").innerHTML = data.profile.socials
      .map(
        (social) =>
          `<a href="${social.url}" ${externalAttrs} aria-label="${escapeHtml(social.label)}"><i class="${social.icon}" aria-hidden="true"></i></a>`
      )
      .join("");
  }

  function renderHighlights() {
    $("#highlight-list").innerHTML = data.highlights
      .map(
        (item) => `
          <article class="highlight">
            <strong>${escapeHtml(item.value)}</strong>
            <span>${escapeHtml(item.label)}</span>
            <p>${escapeHtml(item.note)}</p>
          </article>`
      )
      .join("");
  }

  function renderInterests() {
    $("#interests").innerHTML = data.interests
      .map(([label, icon]) => `<article class="interest"><i class="${icon}" aria-hidden="true"></i><span>${escapeHtml(label)}</span></article>`)
      .join("");
  }

  function renderEducation() {
    $("#education-list").innerHTML = data.education
      .map(
        (entry) => `
          <article class="timeline-item">
            <div class="education-logo" style="--logo-scale:${entry.logoScale || 1}">
              <img src="${entry.image}" alt="${escapeHtml(entry.school)} logo or campus image">
            </div>
            <div class="timeline-content">
              <div class="item-head">
                <div>
                  <h3><a href="${entry.url}" ${externalAttrs}>${escapeHtml(entry.school)}</a></h3>
                  <p>${escapeHtml(entry.degree)}</p>
                </div>
                <span>${escapeHtml(entry.period)}</span>
              </div>
              <p class="metric">${escapeHtml(entry.metric)}</p>
              ${entry.details
                .map(
                  (detail) => `
                    <div class="detail-block">
                      <h4>${escapeHtml(detail.label)}</h4>
                      <ul>${listItems(detail.items)}</ul>
                    </div>`
                )
                .join("")}
            </div>
          </article>`
      )
      .join("");
  }

  function renderSkills() {
    $("#skills-list").innerHTML = data.skills
      .map(
        (group) => `
          <article class="skill-card">
            <h3>${escapeHtml(group.title)}</h3>
            <div class="logo-grid">
              ${group.items
                .map(
                  (item) => `
                    <div class="logo-tile">
                      <img src="${item.image}" alt="${escapeHtml(item.name)}">
                      <span>${escapeHtml(item.name)}</span>
                    </div>`
                )
                .join("")}
            </div>
          </article>`
      )
      .join("");
  }

  function renderExperience() {
    $("#experience-list").innerHTML = data.experience
      .map(
        (entry) => `
          <article class="experience-card">
            <div class="item-head">
              <div>
                <h3><a href="${entry.url}" ${externalAttrs}>${escapeHtml(entry.organization)}</a></h3>
                <p>${escapeHtml(entry.role)}</p>
              </div>
              <span>${escapeHtml(entry.period)}</span>
            </div>
            <ul>${listItems(entry.highlights)}</ul>
          </article>`
      )
      .join("");
  }

  function renderPublications() {
    $("#publication-list").innerHTML = data.publications
      .map(
        (paper, index) => `
          <article class="publication">
            <span class="pub-index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>${escapeHtml(paper.title)}</h3>
              <p>${escapeHtml(paper.venue)}</p>
              <div class="pub-meta">
                <span>${escapeHtml(paper.date)}</span>
                <a href="${paper.url}" ${externalAttrs}>DOI: ${escapeHtml(paper.doi)}</a>
              </div>
            </div>
          </article>`
      )
      .join("");
  }

  function renderProjects(active = "All") {
    const categories = ["All", ...new Set(data.projects.map((project) => project.category))];
    $("#project-filters").innerHTML = categories
      .map((category) => `<button class="${category === active ? "active" : ""}" type="button" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
      .join("");

    const projects = active === "All" ? data.projects : data.projects.filter((project) => project.category === active);
    $("#project-list").innerHTML = projects
      .map(
        (project) => `
          <article class="project-card">
            <img src="${project.image}" alt="${escapeHtml(project.title)} preview">
            <div class="project-body">
              <span class="tag">${escapeHtml(project.category)}</span>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.summary)}</p>
              <p class="muted">${escapeHtml(project.detail)}</p>
              <div class="pill-row">${project.tools.map(pill).join("")}</div>
              <div class="link-row">
                ${project.links.map((link) => `<a href="${link.url}" ${link.url.startsWith("http") ? externalAttrs : ""}>${escapeHtml(link.label)}</a>`).join("")}
              </div>
            </div>
          </article>`
      )
      .join("");
  }

  function renderCertificates(active = "All") {
    const categories = ["All", ...new Set(data.certificates.map(([category]) => category))];
    $("#certificate-filters").innerHTML = categories
      .map((category) => `<button class="${category === active ? "active" : ""}" type="button" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
      .join("");

    const certificates = active === "All" ? data.certificates : data.certificates.filter(([category]) => category === active);
    $("#certificate-list").innerHTML = certificates
      .map(
        ([category, title, image, url]) => `
          <article class="certificate-card">
            <img src="${image}" alt="${escapeHtml(category)} provider logo">
            <div>
              <span>${escapeHtml(category)}</span>
              <h3>${escapeHtml(title)}</h3>
              <a href="${url}" ${externalAttrs}>View certificate</a>
            </div>
          </article>`
      )
      .join("");
  }

  function renderContact() {
    $("#contact-cards").innerHTML = `
      <a class="contact-card" href="mailto:${data.profile.emails[0]}">
        <i class="ri-mail-line" aria-hidden="true"></i>
        <span>Email</span>
        <strong>${escapeHtml(data.profile.emails[0])}</strong>
      </a>
      <a class="contact-card" href="tel:+923129197452">
        <i class="ri-phone-line" aria-hidden="true"></i>
        <span>Phone</span>
        <strong>${escapeHtml(data.profile.facts.find(([key]) => key === "Phone")[1])}</strong>
      </a>
      <div class="contact-card">
        <i class="ri-map-pin-line" aria-hidden="true"></i>
        <span>Location</span>
        <strong>Islamabad, Pakistan</strong>
      </div>
      <div class="contact-card email-list">
        <i class="ri-inbox-line" aria-hidden="true"></i>
        <span>More email</span>
        ${data.profile.emails.slice(1).map((email) => `<a href="mailto:${email}">${escapeHtml(email)}</a>`).join("")}
      </div>
    `;
  }

  function bindInteractions() {
    $(".theme-toggle").addEventListener("click", () => {
      const next = document.body.dataset.theme === "dark" ? "light" : "dark";
      document.body.dataset.theme = next;
      localStorage.setItem("portfolio-theme", next);
      updateThemeToggle();
    });

    $(".nav-toggle").addEventListener("click", () => {
      const nav = $("#site-nav");
      const isOpen = nav.classList.toggle("open");
      $(".nav-toggle").setAttribute("aria-expanded", String(isOpen));
    });

    $("#site-nav").addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        $("#site-nav").classList.remove("open");
        $(".nav-toggle").setAttribute("aria-expanded", "false");
      }
    });

    $("#certificate-filters").addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (button) renderCertificates(button.dataset.filter);
    });

    $("#project-filters").addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (button) renderProjects(button.dataset.filter);
    });
  }

  initTheme();
  renderProfile();
  renderHighlights();
  renderInterests();
  renderEducation();
  renderSkills();
  renderExperience();
  renderPublications();
  renderProjects();
  renderCertificates();
  renderContact();
  bindInteractions();
  $("#year").textContent = new Date().getFullYear();
})();
