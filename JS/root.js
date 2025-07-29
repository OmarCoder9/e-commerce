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

// Set favicon dynamically for all pages
function setFavicon() {
  // Remove any existing favicon links
  const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
  existingFavicons.forEach((link) => link.remove());

  // Create and add the new favicon link
  const faviconLink = document.createElement("link");
  faviconLink.rel = "icon";
  faviconLink.type = "image/png";
  faviconLink.href = "media/favicon.png";

  // Insert at the beginning of head for priority
  document.head.insertBefore(faviconLink, document.head.firstChild);
}

// Run on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setFavicon();
    injectHeaderFooter();
  });
} else {
  setFavicon();
  injectHeaderFooter();
}

function handleNavbarState() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const loginLink = document.getElementById("nav-login");
  const registerLink = document.getElementById("nav-register");
  const logoutLink = document.getElementById("nav-logout");
  const greeting = document.getElementById("nav-greeting");
  const greetingText = document.getElementById("greetingText");

  if (user) {
    // Hide login and register buttons
    loginLink?.classList.add("d-none");
    registerLink?.classList.add("d-none");

    // Show greeting with user's name and logout button
    greetingText.textContent = `👋 Hello, ${user.fullName}`;
    greeting?.classList.remove("d-none");
    logoutLink?.classList.remove("d-none");
  }
}

// Logout function
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Run after the header is loaded
document.addEventListener("DOMContentLoaded", () => {
  setFavicon();
  injectHeaderFooter().then(() => {
    handleNavbarState();
  });
});
