function runFullDetection() {
  let results = {
    frontend: [],
    backend: [],
    security: [],
    analytics: [],
    cms: [],
    hosting: [],
    libraries: []
  };

  let html = document.documentElement.innerHTML.toLowerCase();
  let scripts = Array.from(document.scripts).map(s => s.src.toLowerCase()).join(" ");
  let url = window.location.href.toLowerCase();
  let cookies = document.cookie.toLowerCase();

  // ---------------- FRONTEND FRAMEWORKS ----------------
  if (window.React || html.includes("react")) results.frontend.push("React");
  if (window.Vue || html.includes("vue")) results.frontend.push("Vue.js");
  if (window.angular || html.includes("angular")) results.frontend.push("Angular");
  if (html.includes("_next") || html.includes("next.js")) results.frontend.push("Next.js");
  if (html.includes("nuxt")) results.frontend.push("Nuxt.js");
  if (html.includes("svelte")) results.frontend.push("Svelte");
  if (html.includes("ember")) results.frontend.push("Ember.js");
  if (html.includes("gatsby")) results.frontend.push("Gatsby");

  // ---------------- LIBRARIES ----------------
  if (window.jQuery || html.includes("jquery")) results.libraries.push("jQuery");
  if (html.includes("bootstrap")) results.libraries.push("Bootstrap");
  if (html.includes("tailwind")) results.libraries.push("Tailwind CSS");
  if (html.includes("fontawesome")) results.libraries.push("Font Awesome");
  if (html.includes("swiper")) results.libraries.push("Swiper.js");

  // ---------------- SECURITY ----------------
  if (html.includes("cloudflare")) results.security.push("Cloudflare");
  if (html.includes("recaptcha")) results.security.push("reCAPTCHA");
  if (html.includes("hcaptcha")) results.security.push("hCaptcha");
  if (html.includes("akamai")) results.security.push("Akamai");
  if (html.includes("sucuri")) results.security.push("Sucuri");
  if (html.includes("imperva")) results.security.push("Imperva");

  // ---------------- CMS ----------------
  if (html.includes("wp-content") || html.includes("wordpress")) results.cms.push("WordPress");
  if (html.includes("shopify")) results.cms.push("Shopify");
  if (html.includes("wix")) results.cms.push("Wix");
  if (html.includes("joomla")) results.cms.push("Joomla");
  if (html.includes("drupal")) results.cms.push("Drupal");
  if (html.includes("magento")) results.cms.push("Magento");
  if (html.includes("blogger")) results.cms.push("Blogger");
  if (html.includes("squarespace")) results.cms.push("Squarespace");

  // ---------------- ANALYTICS ----------------
  if (html.includes("googletagmanager") || html.includes("google-analytics")) {
    results.analytics.push("Google Analytics");
  }
  if (html.includes("facebook.net")) results.analytics.push("Facebook Pixel");
  if (html.includes("hotjar")) results.analytics.push("Hotjar");
  if (html.includes("mixpanel")) results.analytics.push("Mixpanel");
  if (html.includes("segment.com")) results.analytics.push("Segment");
  if (html.includes("clarity.ms")) results.analytics.push("Microsoft Clarity");

  // ---------------- BACKEND (COOKIES + URL) ----------------
  if (cookies.includes("phpsessid")) results.backend.push("PHP");
  if (cookies.includes("laravel_session")) results.backend.push("Laravel");
  if (cookies.includes("csrftoken")) results.backend.push("Django");
  if (cookies.includes("jsessionid")) results.backend.push("Java (JSP)");
  if (cookies.includes("asp.net")) results.backend.push("ASP.NET");

  if (url.includes(".php")) results.backend.push("PHP");
  if (url.includes(".aspx")) results.backend.push("ASP.NET");

  if (html.includes("express")) results.backend.push("Node.js (Express)");
  if (html.includes("next")) results.backend.push("Node.js");

  // ---------------- HOSTING / CDN ----------------
  if (html.includes("cloudfront")) results.hosting.push("AWS CloudFront");
  if (html.includes("vercel")) results.hosting.push("Vercel");
  if (html.includes("netlify")) results.hosting.push("Netlify");
  if (html.includes("firebase")) results.hosting.push("Firebase");
  if (html.includes("heroku")) results.hosting.push("Heroku");

  // ---------------- SCRIPT SOURCE DETECTION ----------------
  if (scripts.includes("react")) results.frontend.push("React (script)");
  if (scripts.includes("vue")) results.frontend.push("Vue (script)");
  if (scripts.includes("analytics")) results.analytics.push("Analytics Script");

  // ---------------- META TAG DETECTION ----------------
  let metaGenerator = document.querySelector('meta[name="generator"]');
  if (metaGenerator) {
    let content = metaGenerator.content.toLowerCase();
    if (content.includes("wordpress")) results.cms.push("WordPress");
    if (content.includes("shopify")) results.cms.push("Shopify");
  }

  // ---------------- CLEAN DUPLICATES ----------------
  for (let key in results) {
    results[key] = [...new Set(results[key])];
  }

  return results;
}


// MESSAGE LISTENER
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detect") {
    try {
      sendResponse(runFullDetection());
    } catch (error) {
      console.error("Detection error:", error);
      sendResponse({
        frontend: [],
        backend: [],
        security: [],
        analytics: [],
        cms: [],
        hosting: [],
        libraries: []
      });
    }
    return true;
  }
});