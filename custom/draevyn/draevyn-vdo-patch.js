/* Draevyn Studio Link — VDO UI Patch Layer
   Pass 03:
   - Identifies page mode.
   - Brands VDO UI/control pages.
   - Avoids output pages.
   - Embeds AEROS Prompter inside VDO pages.
   - Applies Free/Creator/Pro/Studio/Developer tier behavior.
*/

(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);

  function hasParam(name) {
    return params.has(name);
  }

  function getParam(name) {
    return params.get(name);
  }

  function sanitizeRoomName(value) {
    return String(value || "")
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "") || "draevynstudio";
  }

  function currentDir() {
    return location.origin + location.pathname.replace(/\/[^\/]*$/, "");
  }

  function customUrl(path) {
    return `${currentDir()}/custom/draevyn/${path.replace(/^\/+/, "")}`;
  }

  function loadScriptOnce(id, src, cb) {
    if (document.getElementById(id)) {
      cb?.();
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.onload = () => cb?.();
    document.head.appendChild(s);
  }

  function loadStyleOnce(id, href) {
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  function getRoomName() {
    return sanitizeRoomName(
      getParam("room") ||
      getParam("director") ||
      getParam("push") ||
      getParam("scene") ||
      getParam("view") ||
      getParam("solo") ||
      localStorage.getItem("draevynStudioLink.room") ||
      "draevynstudio"
    );
  }

  function detectMode() {
    const path = window.location.pathname.toLowerCase();

    if (path.endsWith("/devices.html")) return "devices";
    if (path.endsWith("/dock.html")) return "dock";
    if (path.endsWith("/teleprompter.html") || path.endsWith("/teleprompt.html")) return "teleprompter";

    if (hasParam("scene") || hasParam("view") || hasParam("solo")) return "output";
    if (hasParam("director")) return "director";
    if (hasParam("room")) return "guest";

    return "home";
  }

  function modeLabel(mode) {
    return {
      home: "Home / Guest Entry",
      guest: "Guest Entry",
      director: "Director / Control Room",
      devices: "Device Check",
      dock: "Dock / Utility",
      output: "OBS / Output",
      teleprompter: "Teleprompter"
    }[mode] || "Studio Link";
  }

  function roleForMode(mode) {
    return mode === "director" || mode === "devices" || mode === "dock" || mode === "home" ? "host" : "guest";
  }

  function classifyPage(mode) {
    document.documentElement.classList.add(`dsl-${mode}`);

    if (mode === "output") {
      document.documentElement.classList.add("dsl-output-page");
      document.documentElement.classList.remove("dsl-ui-page");
    } else {
      document.documentElement.classList.add("dsl-ui-page");
      document.documentElement.classList.remove("dsl-output-page");
    }

    document.body.dataset.dslMode = mode;
    document.body.dataset.dslRoom = getRoomName();
  }

  function tierRules() {
    if (window.DRAEVYN_TIERS) {
      return window.DRAEVYN_TIERS.applyTierDataset(document.body);
    }

    document.body.dataset.draevynTier = "free";
    document.body.dataset.draevynBuildFlavor = "free";
    document.body.dataset.draevynAttributionRequired = "true";

    return {
      tier: "free",
      label: "Free",
      attributionRequired: true,
      embeddedPrompter: true,
      detachPrompter: false,
      tierSimulation: false
    };
  }

  function promptBoardUrl(role = "guest") {
    const room = encodeURIComponent(getRoomName());
    return customUrl(`draevyn-prompt-board.html?room=${room}&role=${encodeURIComponent(role)}`);
  }

  function aerosPrompterUrl(role = "host", embed = false) {
    const room = encodeURIComponent(getRoomName());
    const tier = encodeURIComponent(window.DRAEVYN_TIERS?.getActiveTier?.() || "free");
    return customUrl(`aeros-prompter/index.html?room=${room}&role=${encodeURIComponent(role)}&tier=${tier}${embed ? "&embed=1" : ""}`);
  }

  function launcherUrl() {
    return customUrl("draevyn-launch.html");
  }

  function injectRibbon(mode) {
    if (mode === "output") return;
    if (document.querySelector(".dsl-top-ribbon")) return;

    const ribbon = document.createElement("div");
    ribbon.className = "dsl-top-ribbon";
    ribbon.innerHTML = `
      <div class="dsl-brand">
        <strong>Draevyn Studio Link</strong>
        <span>${escapeHtml(modeLabel(mode))}</span>
      </div>
      <div class="dsl-ribbon-actions">
        <span class="dsl-room-chip">Room: <b>${escapeHtml(getRoomName())}</b></span>
        <button class="dsl-link-button" type="button" data-dsl-open-launcher>Launcher</button>
        <button class="dsl-link-button" type="button" data-dsl-toggle-prompter>Prompter</button>
        <button class="dsl-link-button" type="button" data-dsl-open-prompts>Cue Board</button>
      </div>
    `;

    document.body.prepend(ribbon);

    ribbon.querySelector("[data-dsl-open-launcher]")?.addEventListener("click", () => {
      window.open(launcherUrl(), "_blank");
    });

    ribbon.querySelector("[data-dsl-toggle-prompter]")?.addEventListener("click", () => {
      toggleEmbeddedPrompter(mode);
    });

    ribbon.querySelector("[data-dsl-open-prompts]")?.addEventListener("click", () => {
      window.open(promptBoardUrl(roleForMode(mode)), "_blank");
    });
  }

  function injectPageHelper(mode) {
    if (mode === "output") return;
    if (document.querySelector(".dsl-page-helper")) return;
    if (mode === "home") return;

    const role = roleForMode(mode);
    const helper = document.createElement("div");
    helper.className = "dsl-page-helper";
    helper.innerHTML = `
      <div>
        <strong>${escapeHtml(modeLabel(mode))}</strong>
        <span>Use embedded AEROS Prompter for scripts while staying inside this VDO page; use Cue Board for quick turn/cue visibility.</span>
      </div>
      <div class="dsl-helper-actions">
        <button class="dsl-link-button" type="button" data-dsl-copy-room>Copy Room</button>
        <button class="dsl-link-button" type="button" data-dsl-embed-prompter>Toggle Prompter</button>
        <button class="dsl-link-button" type="button" data-dsl-open-prompt-board>Open Cue Board</button>
      </div>
    `;

    const afterRibbon = document.querySelector(".dsl-top-ribbon");
    if (afterRibbon?.nextSibling) {
      document.body.insertBefore(helper, afterRibbon.nextSibling);
    } else {
      document.body.prepend(helper);
    }

    helper.querySelector("[data-dsl-copy-room]")?.addEventListener("click", async () => {
      await navigator.clipboard.writeText(getRoomName());
      alert("Room ID copied.");
    });

    helper.querySelector("[data-dsl-embed-prompter]")?.addEventListener("click", () => {
      toggleEmbeddedPrompter(mode);
    });

    helper.querySelector("[data-dsl-open-prompt-board]")?.addEventListener("click", () => {
      window.open(promptBoardUrl(role), "_blank");
    });
  }

  function createEmbeddedPrompter(mode) {
    if (document.querySelector(".dsl-prompter-panel")) return;

    const role = roleForMode(mode);
    const rules = tierRules();
    const panel = document.createElement("aside");
    panel.className = "dsl-prompter-panel";
    panel.setAttribute("aria-label", "Embedded AEROS Prompter");

    panel.innerHTML = `
      <div class="dsl-prompter-panel-header">
        <div class="dsl-prompter-title">
          <strong>AEROS Prompter</strong>
          <span>${escapeHtml(rules.label)} · ${escapeHtml(role.toUpperCase())} · Room ${escapeHtml(getRoomName())}</span>
        </div>
        <div class="dsl-prompter-actions">
          <select class="dsl-prompter-tier-select" title="Developer tier simulation">
            <option value="free">Free</option>
            <option value="creator">Creator</option>
            <option value="pro">Pro</option>
            <option value="studio">Studio</option>
            <option value="developer">Developer</option>
          </select>
          <button type="button" data-dsl-prompter-size>Size</button>
          <a data-dsl-prompter-open-new href="${aerosPrompterUrl(role, false)}" target="_blank" rel="noopener">New</a>
          <button type="button" data-dsl-prompter-close>Close</button>
        </div>
      </div>
      <iframe class="dsl-prompter-frame" src="${aerosPrompterUrl(role, true)}" title="Embedded AEROS Prompter"></iframe>
      <div class="dsl-prompter-footer">
        <span>Embedded inside Draevyn Studio Link</span>
        <span class="dsl-prompter-attribution">${rules.tier === "developer" ? "AEROS Developer Full" : "Powered by AEROS Free"}</span>
      </div>
    `;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "dsl-prompter-toggle";
    toggle.textContent = "AEROS Prompter";
    toggle.addEventListener("click", () => toggleEmbeddedPrompter(mode));

    document.body.appendChild(panel);
    document.body.appendChild(toggle);

    panel.querySelector("[data-dsl-prompter-close]")?.addEventListener("click", () => {
      document.body.classList.remove("dsl-prompter-open");
    });

    panel.querySelector("[data-dsl-prompter-size]")?.addEventListener("click", () => {
      const sizes = ["", "dsl-prompter-size-medium", "dsl-prompter-size-large", "dsl-prompter-size-full"];
      const current = sizes.findIndex(s => s && document.body.classList.contains(s));
      sizes.filter(Boolean).forEach(s => document.body.classList.remove(s));
      const next = sizes[(current + 1 + sizes.length) % sizes.length];
      if (next) document.body.classList.add(next);
    });

    const tierSelect = panel.querySelector(".dsl-prompter-tier-select");
    if (tierSelect && window.DRAEVYN_TIERS) {
      tierSelect.value = window.DRAEVYN_TIERS.getActiveTier();
      tierSelect.addEventListener("change", () => {
        if (window.DRAEVYN_TIERS.setTier(tierSelect.value)) {
          refreshEmbeddedPrompter(mode);
        } else {
          alert("Tier simulation is only available in Developer Full builds.");
          tierSelect.value = window.DRAEVYN_TIERS.getActiveTier();
        }
      });
    }
  }

  function refreshEmbeddedPrompter(mode) {
    tierRules();

    const role = roleForMode(mode);
    const rules = tierRules();
    const panel = document.querySelector(".dsl-prompter-panel");
    if (!panel) return;

    const title = panel.querySelector(".dsl-prompter-title span");
    if (title) title.textContent = `${rules.label} · ${role.toUpperCase()} · Room ${getRoomName()}`;

    const frame = panel.querySelector(".dsl-prompter-frame");
    if (frame) frame.src = aerosPrompterUrl(role, true);

    const newLink = panel.querySelector("[data-dsl-prompter-open-new]");
    if (newLink) newLink.href = aerosPrompterUrl(role, false);

    const attr = panel.querySelector(".dsl-prompter-attribution");
    if (attr) attr.textContent = rules.tier === "developer" ? "AEROS Developer Full" : "Powered by AEROS Free";
  }

  function toggleEmbeddedPrompter(mode) {
    const rules = tierRules();

    if (!rules.embeddedPrompter) {
      window.open(aerosPrompterUrl(roleForMode(mode), false), "_blank");
      return;
    }

    createEmbeddedPrompter(mode);
    document.body.classList.toggle("dsl-prompter-open");
  }

  function patchLogo() {
    const logo = document.getElementById("logoname");
    if (!logo) return;

    logo.setAttribute("title", "Draevyn Studio Link");
    const translateSpan = logo.querySelector("[data-translate='logo-header']");
    if (translateSpan) {
      translateSpan.innerHTML = `<span id="qos">D</span>raevyn Studio Link`;
    } else {
      logo.textContent = "Draevyn Studio Link";
    }
  }

  function patchJoinText() {
    const joinButton = document.getElementById("jumptoroomButton");
    if (joinButton) joinButton.textContent = "Enter Studio";

    const joinInput = document.getElementById("joinroomID");
    if (joinInput) {
      joinInput.placeholder = "Enter studio room ID";
      joinInput.title = "Enter a Draevyn Studio Link room ID";
    }
  }

  function patchTitle(mode) {
    document.title = `Draevyn Studio Link — ${modeLabel(mode)}`;
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  function bootAfterTierLoad() {
    const mode = detectMode();
    classifyPage(mode);
    tierRules();
    patchTitle(mode);

    if (mode !== "output") {
      patchLogo();
      patchJoinText();
      injectRibbon(mode);
      injectPageHelper(mode);
      createEmbeddedPrompter(mode);

      if (hasParam("prompter") || hasParam("openprompter")) {
        document.body.classList.add("dsl-prompter-open");
      }
    }

    window.addEventListener("draevyn-tier-change", () => {
      refreshEmbeddedPrompter(mode);
    });

    console.info("[Draevyn Studio Link] mode:", mode, "room:", getRoomName(), "tier:", window.DRAEVYN_TIERS?.getActiveTier?.() || "free");
  }

  function boot() {
    loadStyleOnce("draevyn-prompter-embed-css", customUrl("draevyn-prompter-embed.css"));
    loadScriptOnce("draevyn-tier-config-js", customUrl("draevyn-tier-config.js"), bootAfterTierLoad);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
