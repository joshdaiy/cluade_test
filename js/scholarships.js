/* Curated STEM scholarships — portable, apply-anywhere awards for the
 * class-of-2027 senior application cycle (deadlines fall 2026 → spring 2027).
 *
 * INCLUSION RULE (parallels flyins.js):
 *   1. PORTABLE — usable at ANY accredited college. Awards that only pay out if
 *      you enroll at one specific school (e.g. most college-hosted FIRST awards
 *      like Harvey Mudd, WPI, RPI) are intentionally EXCLUDED.
 *   2. STEM-FOCUSED — engineering, computing, math, or science.
 *   3. NOT income-gated — merit / field / identity based. Programs that
 *      HARD-REQUIRE low income are excluded; where need is one optional factor
 *      among several, that's fine.
 *   4. FRC/robotics students prioritized — entries a FIRST Robotics competitor
 *      is well-positioned for are flagged "🤖 FRC/robotics".
 *
 * Dates move year to year. Each entry's `amount` field carries award +
 * eligibility + a "⚠ verify date" flag — ALWAYS confirm on the official page
 * (`url`) before applying. Sourced summer 2026 from official program pages,
 * Society for Science, SAE, Davidson Institute, SWE, NCWIT, RECF, and
 * FIRST/Pearson listings.
 */
window.STEM_SCHOLARSHIPS = [
  {
    name: 'Regeneron Science Talent Search',
    org: 'Society for Science',
    deadline: '2026-11-05',
    url: 'https://www.societyforscience.org/regeneron-sts/',
    amount: '$2,000 (top 300) up to $250,000 (winner); 40 finalists get ≥$25,000 · Eligibility: any U.S. HS senior with an original independent STEM/engineering research project — a strong fit if your FRC/robotics work became a research project · 🤖 FRC/robotics · ⚠ verify date',
  },
  {
    name: 'National Space Club & Foundation — Keynote Scholar',
    org: 'National Space Club',
    deadline: '2026-11-16',
    url: 'https://www.spaceclub.org/scholarship/index.html',
    amount: '$20,000 + speaking slot at the Goddard Memorial Dinner · Eligibility: U.S. citizen, HS senior through grad student, planning a STEM/aerospace career · 🤖 FRC/robotics · ⚠ verify date (last cycle Nov 17)',
  },
  {
    name: 'NCWIT Aspirations in Computing — High School Award',
    org: 'NCWIT',
    deadline: '2026-11-02',
    url: 'https://www.aspirations.org/award-programs/aic-high-school-award',
    amount: 'Recognition + cash/scholarship & internship opportunities for national/affiliate winners · Eligibility: 9–12th-grade women, genderqueer, or nonbinary students active in computing · Apps open Sep 1, 2026 · ⚠ verify date',
  },
  {
    name: 'SWE Scholarship (entering first-year students)',
    org: 'Society of Women Engineers',
    deadline: '2026-12-15',
    url: 'https://swe.org/scholarships/',
    amount: 'Varies, avg ~$4,500 (range ~$1,000–$15,000) · Eligibility: women/gender-marginalized students entering their first year of an ABET engineering, engineering-tech, or computer-science program · portable to any ABET school · 🤖 FRC/robotics · ⚠ verify date',
  },
  {
    name: 'Davidson Fellows Scholarship',
    org: 'Davidson Institute',
    deadline: '2027-02-11',
    url: 'https://www.davidsongifted.org/gifted-programs/fellows-scholarship/',
    amount: '$25,000 / $50,000 / $100,000 tiers · Eligibility: students 18 or under with a "significant piece of work" in Science, Technology, Engineering, Mathematics (or music/lit/philosophy) · usable at any accredited college · 🤖 FRC/robotics · ⚠ verify amounts & date',
  },
  {
    name: 'SAE Engineering Scholarships',
    org: 'SAE International',
    deadline: '2027-02-28',
    url: 'https://www.sae.org/participate/scholarships',
    amount: 'Multiple named awards, up to ~$15,000 · Eligibility: HS seniors+ entering an ABET engineering program who can show hands-on experience — robotics (FIRST, VEX), rebuilding engines, drones/UAV, etc. · portable · 🤖 FRC/robotics · ⚠ verify date',
  },
  {
    name: 'BMW / SAE Engineering Scholarship',
    org: 'SAE International & BMW',
    deadline: '2027-03-20',
    url: 'https://www.sae.org/participate/scholarships/bmw-sae-engineering-scholarship',
    amount: '$1,500/yr, renewable up to 4 yrs ($6,000 total) · Eligibility: HS seniors, GPA ≥3.75 and ~90th-percentile math+reading SAT (or ACT composite), pursuing engineering · portable · ⚠ closes late-Feb–Mar, verify date',
  },
  {
    name: 'SME Education Foundation — "Family of Scholarships"',
    org: 'SME Education Foundation',
    deadline: '2027-02-01',
    url: 'https://www.smeef.org/scholarships/',
    amount: '60+ merit & merit-plus-need awards, amounts vary · Eligibility: students pursuing manufacturing, engineering, or applied-STEM degrees; several explicitly credit FIRST/robotics participation · portable · 🤖 FRC/robotics · ⚠ verify date',
  },
  {
    name: 'Rainbow STEM Alliance FIRST® Scholarship',
    org: 'The Rainbow STEM Alliance',
    deadline: '2027-05-31',
    url: 'https://www.therainbowstemalliance.org/first-scholarship.html',
    amount: '$500 × 4 awards · Eligibility: FIRST participants (graduating HS seniors OR current college students), U.S. citizen/permanent resident; 500–1000-word essay on advancing LGBTQ+ inclusion in STEM · portable · 🤖 FRC/robotics · ⚠ verify date',
  },
  {
    name: 'AFCEA STEM Majors Scholarship',
    org: 'AFCEA Educational Foundation',
    deadline: '2027-05-01',
    url: 'https://www.afcea.org/stem-majors-scholarships',
    amount: '$2,500–$5,000 · Eligibility: undergraduates majoring in STEM (apply once enrolled — bookmark for freshman year; some awards require sophomore standing) · portable · ⚠ verify date',
  },
  {
    name: 'FIRST Scholarship Program (Pearson Futures portal)',
    org: 'FIRST',
    deadline: '',
    url: 'https://www.firstinspires.org/resources/library/scholarships',
    amount: 'Master list of 150+ providers for FRC/FTC/FLL alumni · MANY awards are tied to enrolling at a specific college — filter for the portable/cash ones · most apply during senior year (Dec–Apr) · Browse & filter at futures.pearson.com/scholarships · 🤖 FRC/robotics · ⚠ rolling — check each entry',
  },
];
