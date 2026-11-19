// Single source of truth for company facts. Everything here comes from the audited
// networkresource.com pages (Nov 2026). Do not add claims that are not on the original site.

export const company = {
  name: "Network Resource",
  founded: 1998,
  retention: "97%",
  tagline: "Your IT department, running quietly in the background.",
  description:
    "Network Resource is a San Francisco Bay Area IT services company. Since 1998 we have worked as the outsourced IT department for small and medium-sized businesses: flat-fee managed support, network engineering, office relocations and advisory consulting.",
  url: "https://networkresource.com",
  phones: {
    tollFree: { label: "Toll free", display: "800.553.7800", tel: "+18005537800" },
    peninsula: { label: "Peninsula", display: "650.325.3335", tel: "+16503253335" },
    northBay: { label: "North Bay", display: "415.513.5803", tel: "+14155135803" },
    southBay: { label: "South Bay", display: "408.748.7580", tel: "+14087487580" },
    eastBay: { label: "East Bay", display: "510.868.0286", tel: "+15108680286" },
    fax: { label: "Fax", display: "650.887.0413", tel: "+16508870413" },
  },
  emails: [
    { label: "Sales", address: "sales@networkresource.com" },
    { label: "Customer service and support", address: "support@networkresource.com" },
    { label: "Requests for further information", address: "questions@networkresource.com" },
    { label: "Employment", address: "resumes@networkresource.com" },
    { label: "Website problems and questions", address: "webmaster@networkresource.com" },
  ],
  offices: [
    {
      region: "Peninsula",
      street: "650 Circle Drive",
      city: "Palo Alto",
      state: "CA",
      zip: "94303",
      phone: "650.325.3335",
    },
    {
      region: "North Bay",
      street: "100 Delores Street, Ste. 5",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      phone: "415.513.5803",
    },
    {
      region: "South Bay",
      street: "1562 Mission Springs Circle",
      city: "San Jose",
      state: "CA",
      zip: "95131",
      phone: "408.748.7580",
    },
    {
      region: "East Bay",
      street: "2103 Woolsey Street",
      city: "Berkeley",
      state: "CA",
      zip: "94705",
      phone: "510.868.0286",
    },
  ],
  mailing: "P.O. Box 1533, Palo Alto, CA 94302-1533",
} as const;

export type NavItem = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; children?: NavItem[] };

export const navigation: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Network Services",
        href: "/services/network-services",
        description: "Microsoft, Apple, Cisco and Linux engineering",
      },
      {
        label: "Network Relocation",
        href: "/services/network-relocation",
        description: "Office moves with zero surprises",
      },
      {
        label: "Advisory Consulting",
        href: "/services/advisory-consulting",
        description: "Make your network efficient and cost-effective",
      },
      {
        label: "IT Distribution",
        href: "/it-distribution",
        description: "Hardware, software and supplies",
      },
    ],
  },
  {
    label: "Service Plans",
    href: "/service-plans",
    children: [
      { label: "Compare plans", href: "/service-plans", description: "Flat-fee managed IT" },
      { label: "NR Remote", href: "/service-plans/nr-remote", description: "Remote monitoring and management" },
      { label: "NR Complete", href: "/service-plans/nr-complete", description: "Remote plus on-site engineers" },
    ],
  },
  { label: "Partners", href: "/partners" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About us", href: "/about", description: "Since 1998, 97% retention" },
      { label: "Our values", href: "/about/values", description: "Twelve principles we work by" },
      { label: "Our clients", href: "/about/clients", description: "Private, public and education" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const services = [
  {
    slug: "network-services",
    href: "/services/network-services",
    index: "01",
    title: "Network Services",
    short: "A complete portfolio of IT expertise, from big-picture planning to hands-on systems administration.",
    points: ["Microsoft, Apple, Cisco and Linux", "Servers, email, databases, security", "Vendor-neutral recommendations"],
  },
  {
    slug: "network-relocation",
    href: "/services/network-relocation",
    index: "02",
    title: "Network Relocation",
    short: "We manage every facet of moving your computer equipment and telecom circuits to your new office.",
    points: ["Dedicated lead engineer", "Full backup before anything moves", "On site when you go live"],
  },
  {
    slug: "advisory-consulting",
    href: "/services/advisory-consulting",
    index: "03",
    title: "Advisory Consulting",
    short: "We help you find what makes your organization more efficient and what is superfluous to your needs.",
    points: ["Information-flow assessment", "Standards and policy", "Specific, costed recommendations"],
  },
  {
    slug: "it-distribution",
    href: "/it-distribution",
    index: "04",
    title: "IT Distribution",
    short: "Wholesale supply of hardware, software, digital supplies and imaging products.",
    points: ["Hardware and software", "Digital supplies", "Imaging products"],
  },
] as const;

export const capabilities = [
  "Apple and Windows Server support",
  "Workstation maintenance, installs and troubleshooting",
  "Exchange and Google Apps installs",
  "SQL consulting and support",
  "Cisco and SonicWALL certified",
  "Site assessment and security analysis",
  "Advisory consulting and IT analysis",
];

export const outcomes = [
  { title: "Greater productivity", body: "More uptime means more effective work time." },
  { title: "Focus on your goals", body: "Our team oversees every aspect of your business IT." },
  { title: "Protected assets", body: "Your business data and network stay safe and secure." },
  { title: "Peace of mind", body: "24/7 live on-call IT support." },
];

export const partnerLogos = ["Dell", "Apple", "Microsoft", "Cisco", "SonicWALL", "Aladdin"];
