/* Draevyn Studio Link — Tier Config Foundation
   Pass 03:
   - Defines Free/Creator/Pro/Studio/Developer behavior.
   - Static/local enforcement only.
   - Real enforcement later requires signed builds, hosted accounts, license keys, or server-side feature gates.
*/

window.DRAEVYN_TIERS = (() => {
  "use strict";

  const STORAGE_KEY = "draevyn.license.tier";
  const BUILD_KEY = "draevyn.build.flavor";

  const TIERS = {
    free: {
      tier: "free",
      label: "Free",
      publicTier: true,
      attributionRequired: true,
      embeddedPrompter: true,
      hideAttribution: false,
      detachPrompter: false,
      whiteLabel: false,
      multiGuestCueTools: false,
      tierSimulation: false,
      debugTools: false
    },
    creator: {
      tier: "creator",
      label: "Creator",
      publicTier: true,
      attributionRequired: false,
      embeddedPrompter: true,
      hideAttribution: true,
      detachPrompter: true,
      whiteLabel: false,
      multiGuestCueTools: false,
      tierSimulation: false,
      debugTools: false
    },
    pro: {
      tier: "pro",
      label: "Pro",
      publicTier: true,
      attributionRequired: false,
      embeddedPrompter: true,
      hideAttribution: true,
      detachPrompter: true,
      whiteLabel: true,
      multiGuestCueTools: true,
      tierSimulation: false,
      debugTools: false
    },
    studio: {
      tier: "studio",
      label: "Studio",
      publicTier: true,
      attributionRequired: false,
      embeddedPrompter: true,
      hideAttribution: true,
      detachPrompter: true,
      whiteLabel: true,
      multiGuestCueTools: true,
      tierSimulation: false,
      debugTools: false
    },
    developer: {
      tier: "developer",
      label: "Developer Full",
      publicTier: false,
      attributionRequired: false,
      embeddedPrompter: true,
      hideAttribution: true,
      detachPrompter: true,
      whiteLabel: true,
      multiGuestCueTools: true,
      tierSimulation: true,
      debugTools: true
    }
  };

  function cleanTier(value) {
    const tier = String(value || "").toLowerCase();
    return TIERS[tier] ? tier : "free";
  }

  function readUrlTier() {
    const params = new URLSearchParams(location.search);
    if (params.has("tier")) return cleanTier(params.get("tier"));
    if (params.has("dev") || params.has("developer")) return "developer";
    return "";
  }

  function getBuildFlavor() {
    const urlTier = readUrlTier();
    if (urlTier) {
      localStorage.setItem(BUILD_KEY, urlTier === "developer" ? "developer" : urlTier);
      localStorage.setItem(STORAGE_KEY, urlTier);
      return urlTier === "developer" ? "developer" : urlTier;
    }

    return cleanTier(localStorage.getItem(BUILD_KEY) || "free");
  }

  function getActiveTier() {
    const build = getBuildFlavor();
    const saved = cleanTier(localStorage.getItem(STORAGE_KEY) || build);

    // Developer build can simulate all tiers.
    if (build === "developer") return saved;

    // Public builds are locked to their build flavor.
    return build;
  }

  function getRules(tier = getActiveTier()) {
    return TIERS[cleanTier(tier)] || TIERS.free;
  }

  function setTier(tier) {
    const build = getBuildFlavor();
    const next = cleanTier(tier);

    if (build !== "developer") {
      console.warn("[Draevyn Tiers] Tier simulation is only available in Developer Full.");
      return false;
    }

    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent("draevyn-tier-change", { detail: getRules(next) }));
    return true;
  }

  function setDeveloperFull() {
    localStorage.setItem(BUILD_KEY, "developer");
    localStorage.setItem(STORAGE_KEY, "developer");
    window.dispatchEvent(new CustomEvent("draevyn-tier-change", { detail: getRules("developer") }));
  }

  function setPublicBuildFlavor(tier) {
    const next = cleanTier(tier);
    if (next === "developer") return setDeveloperFull();
    localStorage.setItem(BUILD_KEY, next);
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent("draevyn-tier-change", { detail: getRules(next) }));
  }

  function applyTierDataset(target = document.body) {
    const rules = getRules();
    target.dataset.draevynTier = rules.tier;
    target.dataset.draevynTierLabel = rules.label;
    target.dataset.draevynBuildFlavor = getBuildFlavor();
    target.dataset.draevynAttributionRequired = String(rules.attributionRequired);
    return rules;
  }

  return {
    TIERS,
    getBuildFlavor,
    getActiveTier,
    getRules,
    setTier,
    setDeveloperFull,
    setPublicBuildFlavor,
    applyTierDataset
  };
})();
