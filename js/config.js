/* ============================================================
   ExtraLogic.com — SITE CONFIG (edit this one file to go live)
   ============================================================ */
window.XL_CONFIG = {
  siteName: "ExtraLogic",
  siteUrl: "https://extralogic.com",

  /* Contact route. Encoded on purpose: the address is never printed on the site.
     Every form + every "email us" link resolves to it at runtime only.
     Optional: after FormSubmit activation, paste your random FormSubmit alias here
     (e.g. "a1b2c3d4e5...") to stop the address appearing even in network requests. */
  contactToken: "bW9jLmxpYW1nQDFhc2tyb3diZXc=",
  formsubmitAlias: "",

  /* Domain/website sale inquiry banner shown on top of every page */
  domainInquiryUrl: "https://web.works/contact",

  /* Google AdSense — set your publisher ID (ca-pub-...) and slot IDs to switch on live ads.
     Until then, ad slots show "Advertise here" house ads that sell direct placements. */
  adsenseClient: "",            // e.g. "ca-pub-1234567890123456"
  adSlots: { leaderboard: "", inContent: "", sidebar: "" },

  /* Analytics (optional) */
  gaMeasurementId: "",          // e.g. "G-XXXXXXXXXX"

  /* YouTube */
  youtubeChannelUrl: "https://www.youtube.com/@ExtraLogic",
  youtubeSubscribeUrl: "https://www.youtube.com/@ExtraLogic?sub_confirmation=1",

  /* Donations / support — paste your live links; empty links fall back to the pledge form */
  donate: {
    paypal: "",        // e.g. "https://www.paypal.com/donate/?hosted_button_id=XXXX"
    buyMeACoffee: "",  // e.g. "https://www.buymeacoffee.com/extralogic"
    stripe: "",        // e.g. "https://donate.stripe.com/XXXX"
    patreon: "",       // e.g. "https://www.patreon.com/extralogic"
    githubSponsors: "" // e.g. "https://github.com/sponsors/WEBWORKSA1"
  },
  fundGoal: { label: "Season 1 Prize Pool + Operations", goal: 5000, raised: 0 },

  /* Affiliate links (optional) */
  affiliates: {
    puzzleBooks: "https://www.amazon.com/s?k=logic+puzzle+books",
    amazonTag: ""      // e.g. "extralogic-20"
  },

  social: { x: "https://x.com/extralogic", youtube: "https://www.youtube.com/@ExtraLogic", instagram: "https://www.instagram.com/extralogic", linkedin: "https://www.linkedin.com/company/extralogic", discord: "#" }
};
