// Inject header and footer into every page
async function injectHeaderFooter() {
  // Helper to fetch and insert HTML
  async function insertComponent(url, targetId, position) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      const html = await res.text();
      let target = document.getElementById(targetId);
      if (target) {
        target.innerHTML = html;
      } else {
        // Fallback: insert at top or bottom of body
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        if (position === "top") {
          document.body.insertBefore(wrapper, document.body.firstChild);
        } else {
          document.body.appendChild(wrapper);
        }
      }
    } catch (e) {
      console.error(`Error loading ${url}:`, e);
    }
  }
  await insertComponent("components/header.html", "header", "top");
  await insertComponent("components/footer.html", "footer", "bottom");
}

// Run on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectHeaderFooter);
} else {
  injectHeaderFooter();
}
