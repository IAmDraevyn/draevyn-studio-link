/* Draevyn Studio Link — AEROS Prompter Add-On bridge
   Pass 03:
   - Room-aware.
   - Role-aware.
   - Embed-aware.
   - Tier-aware.
*/

(function () {
  "use strict";

  const params = new URLSearchParams(location.search);

  function sanitizeRoom(value) {
    return String(value || "")
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "") || "draevynstudio";
  }

  const room = sanitizeRoom(params.get("room") || localStorage.getItem("draevynStudioLink.room") || "draevynstudio");
  const role = (params.get("role") || "host").toLowerCase();
  const embed = params.has("embed");
  const tierFromUrl = params.get("tier");

  localStorage.setItem("draevynStudioLink.room", room);

  if (tierFromUrl && window.DRAEVYN_TIERS) {
    // Public builds remain locked by build flavor; Developer can simulate.
    const build = window.DRAEVYN_TIERS.getBuildFlavor();
    if (build === "developer") {
      window.DRAEVYN_TIERS.setTier(tierFromUrl);
    }
  }

  const rules = window.DRAEVYN_TIERS?.applyTierDataset?.(document.body) || {
    tier: "free",
    label: "Free",
    attributionRequired: true
  };

  document.body.classList.add("dsl-aeros-prompter-addon");
  document.body.classList.toggle("dsl-embedded-prompter", embed);
  document.body.classList.toggle("dsl-guest-prompter", role !== "host");

  const roomEl = document.getElementById("dslAddonRoom");
  const roleEl = document.getElementById("dslAddonRole");
  const cueLink = document.getElementById("dslCueBoardLink");
  const launcherLink = document.getElementById("dslLauncherLink");

  if (roomEl) roomEl.textContent = `Room: ${room}`;
  if (roleEl) roleEl.textContent = `${rules.label} · Role: ${role}`;

  if (cueLink) {
    cueLink.href = `../draevyn-prompt-board.html?room=${encodeURIComponent(room)}&role=${encodeURIComponent(role)}`;
  }

  if (launcherLink) {
    launcherLink.href = `../draevyn-launch.html`;
  }

  function applyAttribution() {
    const badge = document.getElementById("aerosFreeAttribution");
    const activeRules = window.DRAEVYN_TIERS?.getRules?.() || rules;

    if (!badge) return;

    if (activeRules.attributionRequired) {
      badge.style.display = "inline-flex";
      badge.classList.remove("developer-badge");
      const strong = badge.querySelector("strong");
      if (strong) strong.textContent = "Powered by AEROS Free";
      return;
    }

    if (activeRules.tier === "developer") {
      badge.style.display = "inline-flex";
      badge.classList.add("developer-badge");
      const label = badge.querySelector("span");
      const strong = badge.querySelector("strong");
      if (label) label.textContent = "Internal Build";
      if (strong) strong.textContent = "AEROS Developer Full";
      return;
    }

    badge.style.display = "none";
  }

  window.addEventListener("DOMContentLoaded", applyAttribution);
  setTimeout(applyAttribution, 100);

  document.title = `Draevyn AEROS Prompter — ${role.toUpperCase()} ${room}`;

  window.DRAEVYN_PROMPTER_ADDON = {
    version: "0.3.0",
    room,
    role,
    embed,
    tier: rules.tier,
    syncMode: "embedded-local",
    futureSync: "vdo-data-channel-or-websocket"
  };
})();
