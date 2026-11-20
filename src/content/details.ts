// Detailed page content, restructured from the original pages without changing facts.

export type SpecGroup = { title: string; items: string[] };
export type Practice = { id: string; title: string; intro?: string; groups: SpecGroup[] };

export const networkPractices: Practice[] = [
  {
    id: "microsoft",
    title: "Microsoft Support Services",
    groups: [
      {
        title: "Exchange",
        items: [
          "Existing server analysis and capacity planning",
          "Data migrations from legacy Exchange systems and third-party mail servers",
          "New deployments and installations",
          "Email redundancy and high-availability solution design",
          "Administration and optimization",
          "Secure remote email access",
        ],
      },
      {
        title: "SQL",
        items: [
          "Server analysis and capacity planning",
          "Data migrations from legacy SQL systems and third-party database servers",
          "New deployments and installations",
          "Database redundancy and clustered solutions",
          "Administration, data security and recovery, and SQL optimization",
        ],
      },
      {
        title: "SharePoint",
        items: ["Needs analysis and solution design", "New deployments and installations", "Administration and optimization"],
      },
      {
        title: "IIS",
        items: [
          "Existing server analysis",
          "Server migrations from legacy IIS systems and third-party web servers",
          "New deployments and installations",
          "Web services redundancy, web clustering and load balancing",
          "Administration and optimization",
          "Site security and server hardening",
        ],
      },
      {
        title: "Terminal Services",
        items: [
          "Existing server analysis and capacity planning",
          "Secure remote access",
          "New deployments and installations",
          "Redundancy and high-availability solution design",
          "Administration and optimization",
          "Migrations from legacy terminal services and other remote access methods",
        ],
      },
    ],
  },
  {
    id: "apple",
    title: "Apple Support Services",
    groups: [
      {
        title: "macOS Server",
        items: [
          "Existing server analysis",
          "New server deployment and installation",
          "Cross-platform (Mac / Windows / Linux) scenarios",
          "Open Directory deployment and management",
          "Support for the full suite of macOS Server services",
          "Deployment of open-source tools",
          "System imaging server deployment",
          "Web services deployment and support",
          "Centralized Mac workstation management via Apple Remote Desktop, Software Update Server and more",
        ],
      },
      {
        title: "macOS on the workstation",
        items: [
          "Anti-virus solutions",
          "Smooth cross-platform solutions for Mac users on Windows and Linux networks",
          "Support for software developers using Xcode and standard Unix tools",
          "Application performance profiling",
          "Centralized management through Apple Remote Desktop and Software Update Server",
        ],
      },
      {
        title: "Storage & backup",
        items: [
          "RAID stand-alone and SAN deployment and installation",
          "Storage performance tuning and profiling",
          "Data storage planning and migrations",
          "Cross-platform and native backup solutions",
        ],
      },
    ],
  },
  {
    id: "cisco",
    title: "Cisco Certified Services",
    groups: [
      { title: "Routers", items: ["Site assessment", "Configuration and installation", "Remote management and administration", "Security"] },
      {
        title: "VPN concentrator",
        items: ["Needs analysis and capacity planning", "Installation and configuration", "Remote management and administration"],
      },
      {
        title: "VPN security & firewall",
        items: [
          "Site assessment and capacity planning",
          "Configuration and installation of new equipment",
          "Migrations from third-party appliances and software",
          "Remote management and administration",
          "Site security assessments",
        ],
      },
    ],
  },
  {
    id: "infrastructure",
    title: "Network Infrastructure",
    groups: [
      {
        title: "Switches",
        items: ["Bandwidth analysis and traffic optimization", "Support for existing infrastructure", "New deployments", "SNMP management and PoE configurations"],
      },
      { title: "Routers", items: ["Site assessment", "Configuration and installation", "Remote management and administration", "Security"] },
      {
        title: "UPS & power",
        items: ["Site assessment and runtime analysis", "Configuration and installation", "Remote management and administration", "High-availability solutions"],
      },
      {
        title: "Firewall",
        items: [
          "Site assessment and security analysis",
          "Configuration and installation",
          "Support for existing equipment and new installations",
          "Remote management and administration",
        ],
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Business Solutions",
    intro: "Server-side and handheld support for enterprise mobile platforms.",
    groups: [
      {
        title: "BlackBerry",
        items: [
          "Needs analysis and capacity planning",
          "Support and deployment of BlackBerry Enterprise Server 3.x and 4.x",
          "New installations or support for existing systems",
          "Handheld support",
        ],
      },
      {
        title: "GoodLink",
        items: [
          "Needs analysis and capacity planning",
          "Support and deployment of GoodLink 3.x and 4.x",
          "New installations and support for existing systems",
          "Handheld device support",
        ],
      },
      {
        title: "Microsoft Mobile",
        items: [
          "Needs analysis and capacity planning",
          "Server support and configuration",
          "New installations and support for existing installs",
          "Mobile device support",
        ],
      },
    ],
  },
  {
    id: "linux",
    title: "Linux and Unix",
    intro:
      "We bring the same proven approach to open-source solutions as we do to proprietary systems such as Windows. By understanding your objectives, we align our technical solutions with your business goals.",
    groups: [
      {
        title: "Assessments",
        items: ["Security audits", "Configuration and installation", "Backup and disaster recovery assessments", "Security response and forensic analysis"],
      },
      {
        title: "Consulting services",
        items: ["Business needs analysis", "Solution design", "Project management and implementation", "Capacity and change management", "Documentation and maintenance"],
      },
      {
        title: "Infrastructure deployment",
        items: [
          "Web and database clusters",
          "Storage solutions",
          "Network security and server hardening",
          "LDAP and directory services integration",
          "Cross-platform integration with Windows and macOS",
          "Turnkey network deployment",
          "High availability and fault tolerance",
        ],
      },
      {
        title: "Support scenarios",
        items: [
          "Remote support and administration",
          "Server and network monitoring",
          "Co-located equipment and customer datacenters",
          "Managed hosting administration",
          "Satellite offices",
          "User support for Linux desktop",
          "Platform expertise for internal IT departments and developers",
          "Academic, engineering, software, biotech and medical environments",
        ],
      },
    ],
  },
];

export const linuxStack: SpecGroup[] = [
  { title: "Unix", items: ["FreeBSD", "OpenBSD", "NetBSD", "Solaris", "macOS"] },
  { title: "Linux", items: ["Red Hat Enterprise", "Novell / SuSE", "Debian", "Slackware", "Mandriva", "Gentoo"] },
  { title: "Web", items: ["Apache", "Tomcat", "JBoss", "PHP", "VSFTP", "Perl", "Ruby on Rails"] },
  { title: "Databases", items: ["Postgres", "MySQL", "Oracle", "Sybase"] },
  { title: "Messaging", items: ["Sendmail", "QMail", "Exim", "IMAP / POP", "Postfix", "SpamAssassin", "Clam AntiVirus"] },
  { title: "File, directory & print", items: ["Samba", "NFS", "LDAP", "NIS", "iSCSI", "CUPS", "LPR"] },
];

export const relocationSteps = [
  {
    title: "Analysis",
    body: "Your lead engineer meets with your organization to analyze the current system, determine your needs and visit the new site.",
  },
  {
    title: "Planning",
    body: "A detailed plan and timeline of what needs to be done, when and by whom. We can coordinate your telephone system, voice and data wiring, and the selection and ordering of telephone and Internet services, with a detailed time and cost budget. If included, we supervise the telephone companies, phone system installers and cabling contractors.",
  },
  {
    title: "Moving",
    body: "Our technicians make sure every piece of equipment is properly staged, packed, labeled, moved and reinstalled.",
  },
  {
    title: "Testing",
    body: "Certified Network Resource technicians set up and test all network equipment before your first day of operation. If a significant problem develops, we put an alternate plan in place so you stay functional.",
  },
  {
    title: "Going live",
    body: "Your lead engineer stays on site for as long as necessary to ensure a smooth transition and quickly resolve anything that comes up after the move.",
  },
];

export const relocationTeam = ["Account Manager", "Lead Relocation Engineer", "Secondary Relocation Engineer"];

export const relocationBenefits = [
  "Frees up your staff, because Network Resource makes the moving arrangements",
  "Engineers trained and certified to work with your equipment",
  "A fixed-cost estimate for the move",
  "Your network is completely backed up before a single piece of equipment moves",
  "Your network is fully documented and diagrammed for future maintenance",
];

export const advisoryPhases = [
  {
    title: "Understand",
    body: "With you, we identify the existing philosophy and guidelines for information management, and the software and hardware used to manage that information, for the whole company or a single department.",
  },
  {
    title: "Evaluate",
    body: "We evaluate how information is generated, distributed, updated, consumed and archived across your organization.",
  },
  {
    title: "Define",
    body: "We identify goals for optimizing information management, help establish or improve your philosophy of information management, and set standards to guide implementation.",
  },
  {
    title: "Recommend",
    body: "We recommend specific networking and Internet solutions, identify their potential value to your organization, and can implement them in a timely, secure and affordable manner.",
  },
];

export type PlanFeature = { title: string; body: string; bullets?: string[] };

export const remoteFeatures: PlanFeature[] = [
  {
    title: "Desktop, laptop & server monitoring",
    body: "Monitoring tools give us proactive insight into your systems and alert our Network Operations Center when critical issues are about to cause harm. When reacting to issues, they provide quick diagnosis with limited involvement from the end user, and detailed health reporting to support purchasing and budgeting decisions.",
  },
  {
    title: "24x7 network monitoring",
    body: "Internet connectivity, firewall and router access, server uptime and service availability are monitored around the clock. When a threshold is hit, the system alerts our team and points directly to where the issue started, so it is fixed sooner.",
  },
  {
    title: "Backup monitoring",
    body: "We receive daily reports on every backup success, cancellation and failure. When intervention is required we act immediately, usually resolving the issue remotely without an on-site visit.",
  },
  {
    title: "Managed anti-spyware & anti-virus",
    body: "Industry-leading software, installed locally and managed remotely from our NOC, so definitions update in real time and desktops and servers are continuously protected.",
  },
  {
    title: "Patch management",
    body: "We determine which patches are appropriate for your systems, install them properly, test after installation and document every procedure.",
  },
  {
    title: "Managed e-mail filtering",
    body: "Included in the NR Remote suite as part of protection from the most common causes of network interruption.",
  },
];

export const completeFeatures: PlanFeature[] = [
  {
    title: "Proactive on-site support",
    body: "A small, dedicated team of engineers. Your primary engineer works with you on a prescheduled basis to maintain systems, help end users and align technology with your business goals. A secondary engineer visits less often for redundancy. Your team meets weekly or monthly to share knowledge across our customer base.",
  },
  {
    title: "24x7 help desk",
    body: "Dedicated help desk engineers and state-of-the-art remote access, 24 hours a day, 7 days a week.",
    bullets: [
      "Remote access to your network and workstations from our NOC, wherever you are",
      "Documented best practices, so we answer quickly without complex technical questions",
      "In-depth ticketing and tracking with a knowledge base",
      "24x7 coverage, whenever you need help",
    ],
  },
  {
    title: "Integrated client portal",
    body: "A secure online portal that replaces sticky notes and email strings.",
    bullets: ["Enter service requests", "Monitor the status of existing requests", "Search a knowledge base of previous requests and resolutions"],
  },
  {
    title: "Project implementation",
    body: "A dedicated division that helps you prioritize investments for any budget and builds a strategic roadmap ordered by business impact.",
    bullets: [
      "Proven best practices",
      "A team of over 12 experienced engineers",
      "Detailed project implementation plans",
      "Hardware and software recommendations, procurement and coordination",
      "Pre- and post-project client meetings",
      "Consistent communication and clear expectations",
    ],
  },
  {
    title: "Account management",
    body: "A non-technical, non-sales account manager focused 100% on your service, at no additional cost.",
    bullets: ["Scheduling on-site visits", "Communicating with you", "Providing hardware specifications", "Resolving issues", "Managing vendors"],
  },
  {
    title: "Monitoring, anti-virus & patching",
    body: "Everything in NR Remote: desktop, laptop, server and network monitoring, managed anti-spyware and anti-virus, and patch management from our Network Operations Center.",
  },
];

export const partners = [
  {
    name: "Apple",
    role: "Apple Authorized Business Agent",
    body: "We specialize in technical support, pre-purchase consulting, networking and administration of Macintosh computers, and recommend macOS-based networks for their reliability, scalability and ease of use.",
  },
  {
    name: "Microsoft",
    role: "Microsoft Certified Partner (MCSP)",
    body: "A demonstrated high level of expertise in delivering quality Microsoft solutions, with access to the newest Microsoft software, tools and resources.",
  },
  {
    name: "Cisco",
    role: "Certified services",
    body: "Certified engineers assess, configure, install and remotely manage routers, VPN concentrators and security appliances.",
  },
  {
    name: "SonicWALL",
    role: "Certified · Internet security",
    body: "Appliance-based security and value-added services that protect networks and provide secure remote access for companies of every size.",
  },
  {
    name: "Dell",
    role: "Hardware partner",
    body: "Listed among our partners on the Network Resource homepage.",
  },
  {
    name: "Check Point",
    role: "Internet security",
    body: "Secure Virtual Network architecture for seamless, secure connectivity between networks, systems, applications and users.",
  },
  {
    name: "Aladdin",
    role: "Authentication & content security",
    body: "eToken two-factor USB authentication, the eSafe anti-virus and content security suite, HASP / Hardlock software protection, and Privilege software commerce solutions.",
  },
  {
    name: "EVault",
    role: "Online backup & disaster recovery",
    body: "Online data backup and recovery built to save time and money and give customers more control over their data.",
  },
  {
    name: "CipherTrust",
    role: "Email security",
    body: "The IronMail appliance protects enterprise email against viruses, spam and intruders, with message privacy and policy enforcement.",
  },
  {
    name: "Entercept",
    role: "Server intrusion prevention",
    body: "Protects the entire server against known and unknown attacks such as worms and buffer overflows.",
  },
  {
    name: "InReach Internet",
    role: "Colocation",
    body: "We collocate servers at InReach for secure, reliable, burstable Internet connectivity, with dual-grid power, generator backup and data center UPS.",
  },
  {
    name: "MegaPath",
    role: "Business broadband",
    body: "DSL broadband for small and medium-sized businesses, built around customer care.",
  },
  {
    name: "Vonage",
    role: "Internet telephony",
    body: "Phone service over an existing high-speed Internet connection, bundled with IP communications features.",
  },
  {
    name: "Expertcity",
    role: "Remote support technology",
    body: "Desktop-streaming technology for desktop sharing, shared mouse and keyboard control, and chat.",
  },
  {
    name: "The Menlo Computer Guy",
    role: "Home & home-business support",
    body: "Helps home and home-business computer users in Menlo Park and nearby cities.",
  },
];

export const values = [
  { title: "Clients", body: "We are committed to our customers and their interests, and strive to anticipate their changing needs with new services and solutions. If we respect our clients and serve them well, our own success will follow." },
  { title: "Community", body: "The communities in which we operate benefit from our active corporate and personal citizenship." },
  { title: "Creativity", body: "We stress creativity, innovation and imagination. For each unique client situation, we strive to find a unique solution." },
  { title: "Integrity", body: "We put the interests of our clients, our profession and our company ahead of personal career interests, and maintain high ethical standards in everything we do." },
  { title: "Learning", body: "We actively promote lifelong learning for our employees." },
  { title: "Ownership", body: "We control our own destiny by perpetuating the independent ownership of Network Resource." },
  { title: "People", body: "We recruit, develop and retain the very best people, treat everyone fairly and with respect, encourage diversity, and advance people based on ability, performance and contribution." },
  { title: "Profits", body: "Profits are the key measure of how well we follow our beliefs and execute our strategy." },
  { title: "Quality", body: "An uncompromising dedication to quality and excellence in everything we undertake." },
  { title: "Reputation", body: "We actively preserve and enhance our reputation and history of success." },
  { title: "Sense of urgency", body: "Our decisions, actions and follow-through reflect a dynamic sense of urgency." },
  { title: "Teamwork", body: "We stress teamwork in everything we do." },
];
