export type ClientStory = {
  id: string;
  name: string;
  industry: string;
  location: string;
  logoSrc?: string;
  logoAlt?: string;
  logoFallback: string;
  project: string;
  summary: string;
  outcomes: string[];
  technologies: string[];
  testimonial?: {
    quote: string;
    person: string;
    role: string;
  };
};

/*
  ADDING A CLIENT
  1. Copy one object below and give it a unique id.
  2. Replace the client, project, outcome, and testimonial details.
  3. Optional: save a logo in public/images/clients and set logoSrc to
     "/images/clients/your-logo.png". Without a logo, logoFallback is shown.
  4. Publish testimonials only after the client has approved the wording.
*/
export const clientStories: ClientStory[] = [
  {
    id: "retail-distribution",
    name: "Confidential Retail & Distribution Client",
    industry: "Retail & distribution",
    location: "Delhi NCR · India",
    logoFallback: "RD",
    project: "Inventory operations platform",
    summary:
      "A practical system designed to bring purchasing, stock, sales, and daily reporting into one dependable workflow.",
    outcomes: [
      "One view of operational inventory data",
      "Faster recurring management reporting",
      "Clearer controls for daily users",
    ],
    technologies: ["SQL Server", "Excel", "Power BI"],
  },
  {
    id: "professional-services",
    name: "Confidential Professional Services Client",
    industry: "Professional services",
    location: "India",
    logoFallback: "PS",
    project: "Client portal & workflow automation",
    summary:
      "A secure web application that organises requests, approvals, documents, notifications, and customer communication.",
    outcomes: [
      "Reduced manual follow-up between teams",
      "Consistent client communication",
      "Improved visibility of work in progress",
    ],
    technologies: ["Next.js", "REST APIs", "Email automation"],
  },
  {
    id: "manufacturing",
    name: "Confidential Manufacturing Client",
    industry: "Manufacturing",
    location: "Delhi NCR · India",
    logoFallback: "MF",
    project: "Desktop & data modernisation",
    summary:
      "A focused modernisation programme connecting established Excel and Access processes with a reliable application and database.",
    outcomes: [
      "Less duplicated data entry",
      "More dependable operational records",
      "A maintainable platform for future changes",
    ],
    technologies: [".NET", "VBA", "SQL Server"],
  },
];
