window.AEROS_BRANDING = (() => {
  const STORAGE_KEY = "aeros.license.tier";
  const BUILD_KEY = "aeros.build.flavor";

  const LICENSE_TIERS = {
    FREE: "free",
    CREATOR: "creator",
    PRO: "pro",
    STUDIO: "studio",
    DEVELOPER: "developer"
  };

  const TIER_RULES = {
    free: {
      tier: "free",
      licenseLabel: "AEROS Free",
      attributionRequired: true,
      allowRemoveBranding: false,
      allowWhiteLabelExport: false,
      allowCommercialClientDelivery: false,
      allowTemplateResale: false,
      allowTierSimulation: false,
      allowDebugTools: false,
      allowReleaseBuilder: false,
      publicTier: true
    },
    creator: {
      tier: "creator",
      licenseLabel: "AEROS Creator",
      attributionRequired: false,
      allowRemoveBranding: true,
      allowWhiteLabelExport: false,
      allowCommercialClientDelivery: false,
      allowTemplateResale: false,
      allowTierSimulation: false,
      allowDebugTools: false,
      allowReleaseBuilder: false,
      publicTier: true
    },
    pro: {
      tier: "pro",
      licenseLabel: "AEROS Pro",
      attributionRequired: false,
      allowRemoveBranding: true,
      allowWhiteLabelExport: true,
      allowCommercialClientDelivery: true,
      allowTemplateResale: false,
      allowTierSimulation: false,
      allowDebugTools: false,
      allowReleaseBuilder: false,
      publicTier: true
    },
    studio: {
      tier: "studio",
      licenseLabel: "AEROS Studio",
      attributionRequired: false,
      allowRemoveBranding: true,
      allowWhiteLabelExport: true,
      allowCommercialClientDelivery: true,
      allowTemplateResale: true,
      allowTierSimulation: false,
      allowDebugTools: false,
      allowReleaseBuilder: false,
      publicTier: true
    },
    developer: {
      tier: "developer",
      licenseLabel: "AEROS Developer Full",
      attributionRequired: false,
      allowRemoveBranding: true,
      allowWhiteLabelExport: true,
      allowCommercialClientDelivery: true,
      allowTemplateResale: true,
      allowTierSimulation: true,
      allowDebugTools: true,
      allowReleaseBuilder: true,
      publicTier: false
    }
  };

  function getBuildFlavor() {
    return localStorage.getItem(BUILD_KEY) || "free";
  }

  function getTier() {
    const buildFlavor = getBuildFlavor();
    const savedTier = localStorage.getItem(STORAGE_KEY);

    // Developer builds may simulate any tier.
    if (buildFlavor === "developer") {
      return savedTier || "developer";
    }

    // Public builds are locked to their build flavor.
    return buildFlavor;
  }

  function getRules(tier = getTier()) {
    return TIER_RULES[tier] || TIER_RULES.free;
  }

  function setDeveloperBuild() {
    localStorage.setItem(BUILD_KEY, "developer");
    localStorage.setItem(STORAGE_KEY, "developer");
    location.reload();
  }

  function setSimulatedTier(tier) {
    const buildFlavor = getBuildFlavor();
    if (buildFlavor !== "developer") {
      console.warn("Tier simulation is only available in Developer Full builds.");
      return false;
    }
    if (!TIER_RULES[tier]) return false;
    localStorage.setItem(STORAGE_KEY, tier);
    location.reload();
    return true;
  }

  function lockBuildFlavor(tier) {
    if (!TIER_RULES[tier]) return false;
    localStorage.setItem(BUILD_KEY, tier);
    localStorage.setItem(STORAGE_KEY, tier);
    location.reload();
    return true;
  }

  function attributionText(appName = "AEROS") {
    const rules = getRules();
    return rules.attributionRequired ? `Powered by ${appName} Free` : "";
  }

  function exportMetadata(appName = "AEROS", appVersion = "unknown") {
    const rules = getRules();
    return {
      appName,
      appVersion,
      licenseTier: rules.tier,
      licenseLabel: rules.licenseLabel,
      publicTier: rules.publicTier,
      attributionRequired: rules.attributionRequired,
      removeBrandingAllowed: rules.allowRemoveBranding,
      whiteLabelExportAllowed: rules.allowWhiteLabelExport,
      commercialClientDeliveryAllowed: rules.allowCommercialClientDelivery,
      templateResaleAllowed: rules.allowTemplateResale,
      tierSimulationAllowed: rules.allowTierSimulation,
      debugToolsAllowed: rules.allowDebugTools,
      releaseBuilderAllowed: rules.allowReleaseBuilder,
      attributionText: attributionText(appName)
    };
  }

  function applyAttributionUI(appName = "AEROS") {
    const badge = document.getElementById("aerosFreeAttribution");
    const rules = getRules();

    document.body.dataset.aerosTier = rules.tier;
    document.body.dataset.aerosBuildFlavor = getBuildFlavor();

    if (!badge) return;

    if (rules.attributionRequired) {
      badge.style.display = "inline-flex";
      const strong = badge.querySelector("strong");
      if (strong) strong.textContent = attributionText(appName);
      return;
    }

    if (rules.tier === "developer") {
      badge.style.display = "inline-flex";
      const label = badge.querySelector("span");
      const strong = badge.querySelector("strong");
      if (label) label.textContent = "Internal Build";
      if (strong) strong.textContent = "AEROS Developer Full";
      badge.classList.add("developer-badge");
      return;
    }

    badge.style.display = "none";
  }

  window.addEventListener("DOMContentLoaded", () => applyAttributionUI("AEROS"));

  return {
    version: "1.1.0",
    LICENSE_TIERS,
    TIER_RULES,
    getTier,
    getRules,
    getBuildFlavor,
    setDeveloperBuild,
    setSimulatedTier,
    lockBuildFlavor,
    attributionText,
    exportMetadata,
    applyAttributionUI
  };
})();