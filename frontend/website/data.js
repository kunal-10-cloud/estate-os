// Estate OS demo data: one Austin brokerage with a sales team, a rentals book and a new-build partner project.
// Everything hangs off the same people and properties, so one person can be a lead, a buyer, a landlord and an investor.
window.EOS_SEED = function () {
  const today = "Thu, Oct 8";
  const agents = {
    maya: { id: "maya", name: "Maya Ortiz", role: "Broker-owner", ini: "MO", color: "#1F4D3A" },
    jordan: { id: "jordan", name: "Jordan Lee", role: "Buyer's agent", ini: "JL", color: "#B8873B" },
    priya: { id: "priya", name: "Priya Shah", role: "Listing agent", ini: "PS", color: "#7A4E9C" },
    sam: { id: "sam", name: "Sam Carter", role: "Team agent", ini: "SC", color: "#2F6F9F" },
    leo: { id: "leo", name: "Leo Grant", role: "Property manager", ini: "LG", color: "#B5533C" },
  };

  // homes for sale; x/y place the pin on the drawn map (percent)
  const listings = [
    { id: "L1", addr: "4 Willow Bend", area: "Tarrytown", price: 1149000, beds: 4, baths: 3, sqft: 2380, lot: "0.31 ac", year: 2019, type: "House", img: "h-lakeway", gallery: ["i-living", "i-bright", "i-bed", "i-family"], x: 31, y: 34, status: "Active", dom: 3, views: 639, agent: "priya", hoa: 0, tax: 1.8, tag: "Popular · 639 views" },
    { id: "L2", addr: "2210 Barton Hills Dr", area: "Barton Hills", price: 895000, beds: 3, baths: 2, sqft: 1910, lot: "0.22 ac", year: 1998, type: "House", img: "h-classic", gallery: ["i-sofa", "i-loft", "i-bed", "i-chair"], x: 44, y: 62, status: "Active", dom: 11, views: 412, agent: "priya", hoa: 0, tax: 1.9, tag: "Price cut $25k" },
    { id: "L3", addr: "77 Rainey St #1402", area: "Downtown", price: 689000, beds: 2, baths: 2, sqft: 1240, lot: "—", year: 2021, type: "Condo", img: "b-tower", gallery: ["i-lounge", "i-bed", "i-chair", "i-bright"], x: 57, y: 47, status: "Active", dom: 6, views: 288, agent: "sam", hoa: 610, tax: 2.0, tag: "Lake views" },
    { id: "L4", addr: "1806 Kinney Ave", area: "Zilker", price: 1325000, beds: 4, baths: 3.5, sqft: 2760, lot: "0.18 ac", year: 2022, type: "House", img: "h-glass", gallery: ["i-living", "i-sofa", "i-bed", "i-loft"], x: 40, y: 52, status: "Coming soon", dom: 0, views: 154, agent: "priya", hoa: 0, tax: 1.8, tag: "Coming soon" },
    { id: "L5", addr: "9 Laurel Ridge Ct", area: "Westlake", price: 2450000, beds: 5, baths: 4.5, sqft: 4210, lot: "0.62 ac", year: 2020, type: "House", img: "h-pool", gallery: ["i-family", "i-living", "i-bright", "i-bed"], x: 15, y: 46, status: "Active", dom: 18, views: 920, agent: "maya", hoa: 85, tax: 1.7, tag: "Pool · 0.62 ac" },
    { id: "L6", addr: "3402 Govalle Ave", area: "East Austin", price: 615000, beds: 3, baths: 2.5, sqft: 1680, lot: "0.12 ac", year: 2017, type: "Townhouse", img: "b-row", gallery: ["i-chair", "i-sofa", "i-bed", "i-loft"], x: 72, y: 40, status: "Active", dom: 24, views: 301, agent: "sam", hoa: 140, tax: 2.0, tag: "New this week" },
    { id: "L7", addr: "515 Ridgeview Ln", area: "Rollingwood", price: 1795000, beds: 4, baths: 4, sqft: 3320, lot: "0.40 ac", year: 2023, type: "House", img: "h-dusk", gallery: ["i-lounge", "i-living", "i-bed", "i-bright"], x: 24, y: 58, status: "Under contract", dom: 9, views: 707, agent: "maya", hoa: 0, tax: 1.8, tag: "Under contract" },
    { id: "L8", addr: "120 Ranch Gate Rd", area: "Bee Cave", price: 1080000, beds: 4, baths: 3, sqft: 2900, lot: "1.10 ac", year: 2016, type: "House", img: "h-ranch", gallery: ["i-family", "i-sofa", "i-bed", "i-chair"], x: 8, y: 30, status: "Active", dom: 32, views: 233, agent: "jordan", hoa: 45, tax: 1.9, tag: "1.1 acres" },
  ];

  // one record per person, grouped into households; roles show where they appear across the bundle
  const people = [
    { id: "P1", name: "Daniel & Aisha Brooks", short: "Brooks", ini: "DB", phone: "(512) 555-0142", email: "aisha.brooks@example.com", owner: "jordan", source: "Website · tour request", stage: "Under contract", tags: ["Buyer", "Pre-approved $1.2M"], roles: ["Buyer", "Landlord", "Investor"], score: 92, last: "2m" },
    { id: "P2", name: "Rachel & Tom Grant", short: "Grant", ini: "RG", phone: "(512) 555-0188", email: "rgrant@example.com", owner: "priya", source: "Past client · 2019", stage: "Listing", tags: ["Seller", "Homeowner"], roles: ["Seller", "Homeowner"], score: 81, last: "1h" },
    { id: "P3", name: "Marcus Webb", short: "Webb", ini: "MW", phone: "(512) 555-0117", email: "marcus.w@example.com", owner: "jordan", source: "Zillow", stage: "Touring", tags: ["Buyer", "Relocating"], roles: ["Buyer"], score: 74, last: "3h" },
    { id: "P4", name: "Elena Ruiz", short: "Ruiz", ini: "ER", phone: "(512) 555-0103", email: "elena.ruiz@example.com", owner: "sam", source: "Instagram ad", stage: "New lead", tags: ["Buyer", "First-time"], roles: ["Buyer"], score: 58, last: "9:41 pm" },
    { id: "P5", name: "Kenji Watanabe", short: "Watanabe", ini: "KW", phone: "(512) 555-0161", email: "kenji@example.com", owner: "sam", source: "Open house · Govalle", stage: "Offer", tags: ["Buyer"], roles: ["Buyer"], score: 77, last: "Yesterday" },
    { id: "P6", name: "Hannah Cole", short: "Cole", ini: "HC", phone: "(512) 555-0190", email: "hannah.cole@example.com", owner: "leo", source: "Rentals site", stage: "Tenant", tags: ["Tenant", "Unit 3B"], roles: ["Tenant"], score: 0, last: "Today" },
    { id: "P7", name: "Arjun & Meera Nair", short: "Nair", ini: "AN", phone: "+91 98200 55012", email: "meera.nair@example.com", owner: "maya", source: "Channel partner · NRI desk", stage: "Booked", tags: ["Investor", "NRI"], roles: ["Investor"], score: 88, last: "Today" },
    { id: "P8", name: "Olivia Park", short: "Park", ini: "OP", phone: "(512) 555-0175", email: "olivia.park@example.com", owner: "jordan", source: "Referral · Grant", stage: "Nurture", tags: ["Homeowner", "Referral"], roles: ["Homeowner"], score: 40, last: "2w" },
  ];

  const threads = [
    { id: "T1", person: "P4", channel: "SMS", unread: 2, when: "9:41 pm", subject: "4 Willow Bend",
      msgs: [
        { from: "them", text: "Hi! Is 4 Willow Bend still available? Could we see it this weekend?", at: "9:41 pm", ch: "SMS" },
        { from: "ai", text: "Hi Elena, it is! Saturday has 10:30 or 1:00 open with Jordan. To tour, Texas now asks buyers to sign a short buyer agreement first; I can text you the link. Which time works?", at: "9:41 pm", ch: "SMS", note: "Sent by the after-hours assistant · checked live availability and Jordan's calendar" },
        { from: "them", text: "1:00 works. Send the agreement please 🙏", at: "9:44 pm", ch: "SMS" },
      ] },
    { id: "T2", person: "P1", channel: "WhatsApp", unread: 1, when: "2m", subject: "Inspection on 515 Ridgeview",
      msgs: [
        { from: "them", text: "Inspector found the AC condenser is 14 years old. Can we ask for a credit?", at: "10:02 am", ch: "WhatsApp" },
      ] },
    { id: "T3", person: "P2", channel: "Email", unread: 0, when: "1h", subject: "What will we walk away with?",
      msgs: [
        { from: "them", text: "If we list at $1.149M, roughly what do we net after everything? Trying to plan the next purchase.", at: "9:10 am", ch: "Email" },
        { from: "me", text: "Great question. I've put together a net sheet, have a look and play with the price: it updates live.", at: "9:24 am", ch: "Email" },
      ] },
    { id: "T4", person: "P3", channel: "Zillow", unread: 0, when: "3h", subject: "Relocating from Denver",
      msgs: [
        { from: "them", text: "Relocating from Denver in December. 3–4 bed, under $1M, good schools.", at: "7:55 am", ch: "Zillow" },
        { from: "me", text: "Welcome! I set up a saved search for you: 6 matches today. Want to video-tour two of them on Friday?", at: "8:20 am", ch: "SMS" },
      ] },
    { id: "T5", person: "P6", channel: "Tenant app", unread: 1, when: "Today", subject: "Kitchen sink leaking",
      msgs: [
        { from: "them", text: "The kitchen sink is leaking under the cabinet, there's water on the floor. Photo attached.", at: "8:12 am", ch: "Tenant app", photo: true },
      ] },
  ];

  const stages = ["New lead", "Touring", "Offer", "Under contract", "Closed"];
  const deals = [
    { id: "D1", kind: "Buyer", person: "P1", listing: "L7", stage: "Under contract", price: 1765000, agent: "jordan", comp: 2.5, close: "Nov 6", progress: 0.62,
      agreement: { signed: true, on: "Sep 12", comp: "2.5% of price, paid by buyer unless the seller offers", term: "90 days" },
      dates: [["Offer accepted", "Sep 28", true], ["Option period ends", "Oct 5", true], ["Inspection response", "Oct 9", false], ["Appraisal", "Oct 16", false], ["Financing deadline", "Oct 27", false], ["Closing", "Nov 6", false]],
      checklist: [["Buyer agreement signed", true], ["Pre-approval letter", true], ["Executed contract", true], ["Earnest money receipt", true], ["Inspection report", true], ["Repair amendment", false], ["Appraisal", false], ["Title commitment", false], ["Closing disclosure", false]],
      docs: [["Buyer representation agreement", "Signed"], ["One to Four Family Residential Contract", "Signed"], ["Seller's disclosure notice", "Received"], ["Amendment: repairs / credit", "Draft"]] },
    { id: "D2", kind: "Listing", person: "P2", listing: "L1", stage: "Offer", price: 1149000, agent: "priya", comp: 2.75, close: "—", progress: 0.35,
      agreement: { signed: true, on: "Sep 30", comp: "5% total; 2.5% offered to buyer's agent", term: "6 months" },
      dates: [["Listed", "Oct 5", true], ["Offers due", "Oct 10", false]], checklist: [["Listing agreement", true], ["Seller disclosure", true], ["Photos & 3D tour", true], ["Net sheet shared", true], ["Offer review", false]], docs: [["Listing agreement", "Signed"], ["Seller's disclosure", "Signed"]] },
    { id: "D3", kind: "Buyer", person: "P5", listing: "L6", stage: "Offer", price: 605000, agent: "sam", comp: 2.5, close: "—", progress: 0.3, agreement: { signed: true, on: "Oct 1", comp: "2.5%", term: "60 days" }, dates: [], checklist: [], docs: [] },
    { id: "D4", kind: "Buyer", person: "P3", listing: "L2", stage: "Touring", price: 895000, agent: "jordan", comp: 2.5, close: "—", progress: 0.15, agreement: { signed: true, on: "Oct 6", comp: "2.25%", term: "90 days" }, dates: [], checklist: [], docs: [] },
    { id: "D5", kind: "Buyer", person: "P4", listing: "L1", stage: "New lead", price: 1149000, agent: "sam", comp: 0, close: "—", progress: 0.05, agreement: { signed: false }, dates: [], checklist: [], docs: [] },
    { id: "D6", kind: "Listing", person: "P8", listing: "L4", stage: "Touring", price: 1325000, agent: "priya", comp: 2.75, close: "—", progress: 0.2, agreement: { signed: true, on: "Oct 2", comp: "5%", term: "6 months" }, dates: [], checklist: [], docs: [] },
    { id: "D7", kind: "Listing", person: "P2", listing: "L5", stage: "Closed", price: 2390000, agent: "maya", comp: 3, close: "Sep 19", progress: 1, agreement: { signed: true, on: "Jun 2", comp: "5%", term: "6 months" }, dates: [], checklist: [], docs: [] },
    { id: "D8", kind: "Buyer", person: "P8", listing: "L8", stage: "Closed", price: 1040000, agent: "jordan", comp: 2.5, close: "Aug 28", progress: 1, agreement: { signed: true, on: "Jun 20", comp: "2.5%", term: "90 days" }, dates: [], checklist: [], docs: [] },
  ];

  // rentals book
  const buildings = [
    { id: "B1", name: "Eastside Lofts", addr: "1100 E 6th St", img: "b-eastside", owner: "Brooks Holdings LLC", ownerPerson: "P1", units: 12 },
    { id: "B2", name: "Govalle Row", addr: "3400 Govalle Ave", img: "b-row", owner: "Olivia Park", ownerPerson: "P8", units: 6 },
  ];
  const unitNames = ["1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C", "4A", "4B", "4C"];
  const tenants = ["Ava Mitchell", "Noah Kim", "", "Liam Patel", "Zoe Chen", "Ethan Brown", "Mia Lopez", "Hannah Cole", "Lucas Reed", "", "Grace Hall", "Owen Diaz"];
  const units = unitNames.map((n, i) => ({ id: "U" + (i + 1), b: "B1", name: n, beds: i % 3 === 0 ? 2 : 1, rent: [2150, 1650, 1690, 2200, 1700, 1720, 2250, 1750, 1760, 2300, 1780, 1790][i], tenant: tenants[i], status: !tenants[i] ? "Vacant" : i === 4 ? "Late" : i === 8 ? "Renewal" : "Paid", end: ["Mar 27", "Jan 27", "", "Jun 27", "Dec 26", "Feb 27", "May 27", "Apr 27", "Nov 26", "", "Jul 27", "Aug 27"][i] }))
    .concat(["A", "B", "C", "D", "E", "F"].map((n, i) => ({ id: "V" + (i + 1), b: "B2", name: "Row " + n, beds: 3, rent: 2950 + i * 40, tenant: ["Iris Moore", "Ben Ward", "Chloe Fox", "", "Ryan Shaw", "Ella Gray"][i], status: i === 3 ? "Vacant" : i === 1 ? "Late" : "Paid", end: ["Feb 27", "Oct 26", "Jun 27", "", "Sep 27", "Jan 27"][i] })));
  const tickets = [
    { id: "M1", unit: "U8", title: "Kitchen sink leaking under cabinet", by: "P6", when: "Today 8:12 am", status: "New", priority: "Urgent", ai: "Likely a loose P-trap or supply line. Urgent: water on floor. Suggest Ace Plumbing (on-call today, 4.9★, $95 call-out).", vendor: null, photo: true },
    { id: "M2", unit: "U2", title: "Bedroom AC not cooling", by: null, when: "Yesterday", status: "Scheduled", priority: "High", ai: "", vendor: "Polar Air · Fri 9–11 am" },
    { id: "M3", unit: "V3", title: "Dishwasher won't drain", by: null, when: "Mon", status: "In progress", priority: "Normal", ai: "", vendor: "HomeFix · parts ordered" },
  ];

  // developer project: a 6-floor tower, 8 units per floor
  const plan = [["Booking", 10], ["Foundation", 10], ["5th slab", 15], ["Topping out", 15], ["Finishes", 20], ["Possession", 30]];
  const projUnits = [];
  for (let f = 6; f >= 1; f--) for (let u = 1; u <= 8; u++) {
    const code = f + "0" + u, type = u === 1 || u === 8 ? "3 BR" : u === 4 || u === 5 ? "1 BR" : "2 BR";
    const base = type === "3 BR" ? 1180000 : type === "2 BR" ? 845000 : 565000;
    const seed = (f * 13 + u * 7) % 10;
    projUnits.push({ code, floor: f, type, sqft: type === "3 BR" ? 1820 : type === "2 BR" ? 1290 : 760, price: base + f * 18000 + (u === 1 || u === 8 ? 25000 : 0), facing: u <= 4 ? "Lake" : "City", status: seed < 4 ? "Sold" : seed < 6 ? "Booked" : seed < 7 ? "Held" : "Available", cp: seed < 6 ? ["Direct", "Keller CP", "NRI desk", "Direct"][seed % 4] : "" });
  }
  const project = { id: "PR1", name: "The Linden at Mueller", dev: "Cedar Ridge Homes", img: "b-tower", launch: "Launched Sep 20", possession: "Q4 2027", plan,
    cps: [["Keller CP", 9, 2.0], ["NRI desk", 6, 2.5], ["Austin Home Finders", 3, 2.0]] };

  const activity = [
    ["P1", "Website", "Requested a tour of 515 Ridgeview Ln", "Aug 30"],
    ["P1", "CRM", "Signed buyer agreement · 2.5%", "Sep 12"],
    ["P1", "Deals", "Offer accepted on 515 Ridgeview Ln · $1,765,000", "Sep 28"],
    ["P1", "Rentals", "Owner of Eastside Lofts (Brooks Holdings LLC) · 12 units", "since 2023"],
    ["P1", "Projects", "Enquired about 2 BR units at The Linden", "Oct 4"],
  ];

  return { today, agents, listings, people, threads, stages, deals, buildings, units, tickets, project, projUnits, activity };
};
