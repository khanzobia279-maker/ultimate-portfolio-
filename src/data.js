// Edit your content here.
export const profile = {
  name: "Zobia Khan",
  role: "Modern Frontend Developer | AI Enthusiast",
  tagline: "Crafting clean, responsive interfaces that just work.",
  status: "Open to frontend internships and jobs",
  email: "khanzobia279@gmail.com",
  location: "Karachi, Pakistan",
  github: "https://github.com/khanzobia279-maker",
  linkedin: "https://www.linkedin.com/in/zobs-k12",
  bio: [
    "I’m a modern frontend developer crafting fast, responsive websites that look sharp and never lag.",
    "I take on freelance client projects and handle the heavy lifting behind modern web interfaces—clean setups, smooth transitions, and pixel-perfect screens. Beyond coding, I am an AI explorer who loves experimenting with modern AI tools and creating AI crafts. Right now, I’m building with React and Redux Toolkit and learning Express.js to take my work full stack."
  ],
  facts: [
    ["Education", "Modern Web & App Development at SMIT; Computer Science at MMC Govt Girls College"],
    ["Experience", "Frontend Developer Intern, Arch Technologies (May–Jun 2026); Freelance Frontend Developer (2025–present)"],
    ["Certificates", "Cisco Introduction to Modern AI; Cisco Learn-A-Thon 2026; Arch Technologies Web Development"],
    ["Now learning", "Express.js, with Node.js, MongoDB and API integration next"]
  ]
};

export const skills = [["HTML5"], ["CSS3"], ["JavaScript"], ["Tailwind CSS"], ["Bootstrap"], ["GSAP"], ["React"], ["Redux Toolkit"], ["Express.js", "Learning"], ["Firebase"], ["REST APIs"], ["Git & GitHub"], ["AI crafts"]];

// Tip: put your deployed site URL in a project's "live" field to show the real site in its preview window.
const gh = "https://github.com/khanzobia279-maker/";
export const projects = [
  { title: "YARNIFY by Rida", desc: "Responsive website built with modern frontend technologies. My latest project.", tech: "JavaScript", stack: ["HTML", "CSS", "JavaScript"], from: "#e0568a", to: "#4fb8a2", live: "", url: gh + "YARNIFY-by-Rida" },
  { title: "GitHub Dev Finder", desc: "Look up any developer’s GitHub stats, top repos and coding vibe with just a username.", tech: "CSS · JavaScript", stack: ["HTML", "CSS", "JavaScript"], from: "#4fb8a2", to: "#88ce02", live: "", url: gh + "GitHub-Dev-Finder-" },
  { title: "QuickVerse", desc: "A JavaScript project built while learning by doing.", tech: "JavaScript", stack: ["HTML", "CSS", "JavaScript"], from: "#7b5cff", to: "#e0568a", live: "", url: gh + "QuickVerse" },
  { title: "Landing Page with React.js", desc: "A landing page built with React components.", tech: "React · CSS", stack: ["React", "CSS"], from: "#e39b2d", to: "#e0568a", live: "", url: gh + "Landing-Page-with-React.js" },
  { title: "This Portfolio", desc: "The site you’re looking at, built with React.js, Tailwind CSS and GSAP.", tech: "React · Tailwind · GSAP", stack: ["React", "Tailwind CSS", "GSAP"], from: "#88ce02", to: "#4fb8a2", live: "", url: gh + "Portfolio-with-Reactjs" },
  { title: "More on GitHub", desc: "Browse all of my repositories on GitHub.", tech: "GitHub", stack: [], from: "#565b80", to: "#7b5cff", external: true, url: profile.github + "?tab=repositories" }
];

// Optional: paste a Formspree endpoint (https://formspree.io/f/xxxx) to deliver messages straight to your Gmail.
// Leave empty to open a pre-filled Gmail compose window instead.
export const FORM_ENDPOINT = "";

// Services shown in the Services section.
export const services = [
  { title: "Responsive websites", desc: "Fast, mobile-first sites for clients, built with HTML5, CSS3 and JavaScript.", tags: ["HTML5", "CSS3", "JavaScript"] },
  { title: "React interfaces", desc: "Component-based apps with a clean structure and Redux Toolkit for state management.", tags: ["React", "Redux Toolkit"] },
  { title: "Animation & interaction", desc: "Scroll effects, smooth transitions and micro-interactions that make a site feel alive.", tags: ["GSAP", "Micro-interactions"] },
  { title: "AI crafts", desc: "Creative visuals and assets made with modern AI tools, ready to use in your project.", tags: ["AI tools", "Creative"] }
];
