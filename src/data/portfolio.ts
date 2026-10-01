import type { PortfolioData } from '../types/portfolio';

export const defaultPortfolio: PortfolioData = {
  "schemaVersion": 1,
  "editorial": {
    "makerTitle": "Developer.\nDesigner.\nCurious human.",
    "dispatchTitle": "From campus\nto craft.",
    "dispatchLabel": "Latest dispatch",
    "statsLabel": "This edition includes",
    "journeyAction": "Read the journey",
    "aboutAction": "Let’s make something worth seeing",
    "archiveAction": "Unfold more work",
    "puzzleEyebrow": "The back-page puzzle",
    "puzzleTitle": "A sharp eye.\nA sharper memory?",
    "puzzleDescription": "The old portfolio had a memory game. Here’s its newspaper edition. Four letters. One growing sequence.",
    "puzzleAction": "Take a little detour"
  },
  "navigation": [
    { "id": "about", "label": "The person", "url": "#about" },
    { "id": "work", "label": "Selected work", "url": "#work" },
    { "id": "journey", "label": "The journey", "url": "#journey" },
    { "id": "archive", "label": "Creative archive", "url": "#archive" },
    { "id": "contact", "label": "Say hello", "url": "#contact" }
  ],
  "sectionOrder": ["about", "work", "journey", "skills", "archive", "credentials", "puzzle", "contact"],
  "theme": { "paper": "#e8e4db", "ink": "#24241e", "accent": "#a33524", "displayFont": "Barlow Condensed", "bodyFont": "DM Sans", "motion": true, "showGallery": true, "showCredentials": true, "showPuzzle": false },
  "artwork": {
    "hero": { "src": "/assets/artwork/developers-eye.webp", "avif": "/assets/artwork/developers-eye.avif", "alt": "An engraved computer with an artist's eye and an ink-red paper airplane", "width": 1200, "height": 800 },
    "archive": { "src": "/assets/artwork/creative-eye.webp", "avif": "/assets/artwork/creative-eye.avif", "alt": "An engraved camera and torn photographic prints", "width": 800, "height": 800 }
  },
  "site": {
    "title": "Saptarshi Ghosh — Code, Design & Everything Between",
    "description": "The portfolio of Saptarshi Ghosh: Associate Software Engineer at Nexaric, AI/ML developer, graphic designer and photographer based in West Bengal, India.",
    "edition": "Vol. 01 · October 2026",
    "masthead": "THE SAPTARSHI GAZETTE",
    "tagline": "An independent publication of code, craft & curiosity.",
    "copyright": "© 2026 Saptarshi Ghosh. All rights reserved.",
    "logo": {
      "src": "/assets/identity/sg-logo.svg",
      "alt": "Saptarshi Ghosh monogram",
      "width": 100,
      "height": 100
    },
    "socialImage": {
      "src": "/assets/portraits/portrait-new-vertical.webp",
      "avif": "/assets/portraits/portrait-new-vertical.avif",
      "alt": "Editorial halftone portrait of Saptarshi Ghosh",
      "width": 1122,
      "height": 1402,
      "srcSet": "/assets/portraits/portrait-new-vertical-600.webp 600w, /assets/portraits/portrait-new-vertical.webp 1122w"
    }
  },
  "person": {
    "name": "Saptarshi Ghosh",
    "firstName": "Saptarshi",
    "lastName": "Ghosh",
    "role": "Associate Software Engineer · Creative Designer",
    "location": "Kolkata, West Bengal, India",
    "hometown": "Hoomgarh, Paschim Medinipur, West Bengal, India",
    "email": "saptarshi0777@gmail.com",
    "phone": "+91 6296770327",
    "resumeUrl": "/assets/resume/saptarshi-ghosh-2026.pdf",
    "portrait": {
      "src": "/assets/portraits/portrait-passport-maker.webp",
      "avif": "/assets/portraits/portrait-passport-maker.avif",
      "alt": "Editorial halftone portrait of Saptarshi Ghosh",
      "width": 1254,
      "height": 1254,
      "srcSet": "/assets/portraits/portrait-passport-maker-600.webp 600w, /assets/portraits/portrait-passport-maker.webp 1254w"
    },
    "aboutPortrait": {
      "src": "/assets/portraits/portrait-reference-about.webp",
      "avif": "/assets/portraits/portrait-reference-about.avif",
      "alt": "Editorial halftone portrait of Saptarshi Ghosh, software engineer and creative designer",
      "width": 1309,
      "height": 1201,
      "srcSet": "/assets/portraits/portrait-reference-about-600.webp 600w, /assets/portraits/portrait-reference-about.webp 1309w"
    }
  },
  "hero": {
    "eyebrow": "Software engineer. Designer. Curious human.",
    "headline": "A little code.",
    "accent": "A lot of character.",
    "description": "I bring engineering and visual storytelling together — building thoughtful web experiences, exploring AI, and giving ideas a distinctive voice.",
    "availability": "Currently building at Nexaric",
    "primaryAction": "Explore my work",
    "secondaryAction": "Download résumé"
  },
  "about": {
    "eyebrow": "The person behind the paper",
    "title": "Logic in my code.\nLife in my design.",
    "introduction": "I'm Saptarshi Ghosh, an Associate Software Engineer at Nexaric and a 2026 B.Tech CSE (AI/ML) graduate from UEM Kolkata, with a CGPA of 8.50.",
    "paragraphs": [
      "I'm passionate about developing AI solutions and creating impactful designs. As a Vice Chancellor's Award recipient and Lead Designer for Ureckon fest, I combine engineering with creative practice to solve real-world problems through technology.",
      "After a three-month frontend web development internship at Nexaric from June to August 2026, working with React.js, TypeScript, Node.js, Tailwind CSS and AI tools, I joined the team as an Associate Software Engineer in September 2026.",
      "Beyond the screen, I photograph everyday stories, explore new places, and experiment with filmmaking. These interests shape the way I see, think and create."
    ],
    "philosophy": "Engineering with intent. Design with a point of view."
  },
  "sectionCopy": {
    "projects": {
      "eyebrow": "Selected dispatches",
      "title": "Made of ideas.\nBuilt with code.",
      "description": "Ten projects across AI, machine learning, interactive web platforms and experiments. Each one, a different question worth exploring."
    },
    "gallery": {
      "eyebrow": "The visual archive",
      "title": "Other ways\nof seeing.",
      "description": "A collection of graphic design, event identities, food branding and photographs from life beyond the keyboard."
    },
    "experience": {
      "eyebrow": "A new chapter",
      "title": "From learning\nto building.",
      "description": "My path into professional software engineering."
    },
    "education": {
      "eyebrow": "The foundation",
      "title": "A curious mind,\nin the making.",
      "description": "From science and mathematics to an AI/ML specialization."
    },
    "skills": {
      "eyebrow": "Tools of the trade",
      "title": "Many tools.\nOne curious mind.",
      "description": "The technologies and creative tools I work with."
    },
    "credentials": {
      "eyebrow": "Notes of distinction",
      "title": "Learning. Leading.\nMaking a mark.",
      "description": "Professional certifications, creative recognition and academic milestones."
    },
    "contact": {
      "eyebrow": "Letters to the editor",
      "title": "Got an idea?\nLet’s make it real.",
      "description": "Have a project in mind? Let’s discuss how we can bring your ideas to life."
    }
  },
  "experience": [
    {
      "id": "infosys-springboard-internship",
      "title": "Virtual Internship 6.0: Predictive Transaction Intelligence for BFSI",
      "organization": "Infosys Springboard",
      "location": "Remote",
      "startDate": "2025-09",
      "endDate": "2025-11",
      "period": "September — November 2025",
      "description": "Built a real-time fraud detection system for banking transactions during the Infosys Springboard Virtual Internship 6.0.",
      "highlights": [
        "Combined LightGBM, XGBoost, Random Forest and Neural Networks in an ensemble machine learning system.",
        "Developed a FastAPI REST API with ONNX deployment, ML and rules-based risk scoring, and sub-millisecond inference."
      ],
      "tags": ["LightGBM", "XGBoost", "Random Forest", "Neural Networks", "FastAPI", "ONNX"],
      "kind": "internship",
      "demoUrl": "https://predictive-transaction-intellegence.vercel.app/login",
      "certificateUrl": "https://drive.google.com/file/d/1AQVf6clk0TniKu-x2RaZ9QnQb1dOhB_j/view"
    },
    {
      "id": "nexaric-internship",
      "title": "Frontend Web Developer Intern",
      "organization": "Nexaric",
      "location": "India",
      "startDate": "2026-06",
      "endDate": "2026-08",
      "period": "June — August 2026 · 3 months",
      "description": "Completed a three-month frontend web development internship, working with modern web technologies and AI tools.",
      "highlights": [
        "Frontend development with React.js, TypeScript and Tailwind CSS.",
        "Worked with Node.js and AI tools."
      ],
      "tags": [
        "React.js",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "AI Tools"
      ],
      "kind": "internship"
    },
    {
      "id": "nexaric-associate",
      "title": "Associate Software Engineer",
      "organization": "Nexaric",
      "location": "India",
      "startDate": "2026-09",
      "endDate": "present",
      "period": "September 2026 — Present",
      "description": "Currently working as an Associate Software Engineer at Nexaric.",
      "highlights": [
        "Joined Nexaric following a three-month frontend web development internship."
      ],
      "tags": [
        "Software Engineering",
        "Web Development"
      ],
      "kind": "work"
    }
  ],
  "education": [
    {
      "id": "uem-btech",
      "title": "B.Tech CSE (AI/ML)",
      "organization": "University of Engineering and Management, Kolkata",
      "location": "Kolkata, India",
      "startDate": "2022",
      "endDate": "2026",
      "period": "2022 — 2026",
      "description": "Graduated in 2026 with a specialization in Artificial Intelligence and Machine Learning.",
      "highlights": [
        "Vice Chancellor’s Award recipient.",
        "Lead Designer for Ureckon techno-management fest."
      ],
      "tags": [
        "Machine Learning",
        "Deep Learning",
        "Python",
        "Data Structures"
      ],
      "kind": "education",
      "score": "CGPA 8.50 / 10"
    },
    {
      "id": "higher-secondary",
      "title": "Higher Secondary · Science",
      "organization": "Hoomgarh Chandabila High School",
      "location": "West Bengal, India",
      "startDate": "2020",
      "endDate": "2022",
      "period": "Class XII · 2022",
      "description": "Excelled in science, developing a passion for technology.",
      "highlights": [
        "Physics, Chemistry and Mathematics."
      ],
      "tags": [
        "Physics",
        "Chemistry",
        "Mathematics"
      ],
      "kind": "education",
      "score": "89%"
    },
    {
      "id": "secondary",
      "title": "Secondary Education · WBBSE",
      "organization": "Hoomgarh Chandabila High School",
      "location": "West Bengal, India",
      "startDate": "",
      "endDate": "2020",
      "period": "Class X · 2020",
      "description": "Built a strong foundation in science and mathematics.",
      "highlights": [
        "Mathematics, Science and English."
      ],
      "tags": [
        "Mathematics",
        "Science",
        "English"
      ],
      "kind": "education",
      "score": "80%"
    }
  ],
  "skillGroups": [
    {
      "id": "frontend",
      "title": "Frontend & Web",
      "skills": [
        "React.js",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
        "Flask",
        "WebSockets",
        "Progressive Web Apps"
      ]
    },
    {
      "id": "programming",
      "title": "Programming",
      "skills": [
        "Python",
        "Java",
        "JavaScript",
        "C",
        "SQL"
      ]
    },
    {
      "id": "ai",
      "title": "AI & Machine Learning",
      "skills": [
        "TensorFlow",
        "Keras",
        "Scikit-learn",
        "OpenCV",
        "Pandas",
        "NumPy",
        "AI Tools"
      ]
    },
    {
      "id": "design",
      "title": "Design & Film",
      "skills": [
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Figma",
        "Premiere Pro"
      ]
    },
    {
      "id": "backend",
      "title": "Backend & Data",
      "skills": [
        "Node.js",
        "MongoDB",
        "MySQL",
        "Docker"
      ]
    },
    {
      "id": "automation",
      "title": "Automation",
      "skills": [
        "n8n Workflows",
        "Process Automation"
      ]
    },
    {
      "id": "tools",
      "title": "Systems & Tools",
      "skills": [
        "Git",
        "GitHub",
        "Linux",
        "n8n"
      ]
    },
    {
      "id": "hardware",
      "title": "Hardware & Embedded",
      "skills": [
        "Arduino",
        "Raspberry Pi",
        "WebRTC"
      ]
    }
  ],
  "projects": [
    {
      "id": "ppe",
      "title": "PPE Detection for Construction Site Safety",
      "shortTitle": "PPE Detection",
      "category": "Computer Vision",
      "status": "Active",
      "description": "Developed a cutting-edge computer vision system using YOLOv8 to detect Personal Protective Equipment on construction sites. This AI-powered solution enhances safety compliance by automating monitoring processes with real-time detection capabilities.",
      "technologies": [
        "YOLOv8",
        "Python",
        "PyTorch",
        "OpenCV"
      ],
      "image": {
        "src": "/assets/projects/ppe.webp",
        "avif": "/assets/projects/ppe.avif",
        "alt": "PPE Detection for Construction Site Safety",
        "width": 667,
        "height": 1000,
        "srcSet": "/assets/projects/ppe-600.webp 600w, /assets/projects/ppe.webp 667w"
      },
      "repository": "https://github.com/eliot-99/PPE-Detection-for-Construction-Site-Safety-using-YoloV8",
      "liveUrl": "",
      "featured": true,
      "facts": [
        "95% accuracy (reported prototype)",
        "Real-time",
        "Safety Focus",
        "Potential 20% reduction in simulated environments",
        "Real-time Detection"
      ]
    },
    {
      "id": "plant",
      "title": "Plant Disease Detection Using CNN",
      "shortTitle": "Plant Disease Detection",
      "category": "Machine Learning",
      "status": "In Development",
      "description": "Designed an advanced CNN-based system to detect plant diseases from leaf images, supporting early diagnosis for agricultural applications. This AI solution helps farmers identify crop diseases quickly and accurately for better yield management.",
      "technologies": [
        "CNN",
        "TensorFlow",
        "Keras",
        "Agriculture"
      ],
      "image": {
        "src": "/assets/projects/plant.webp",
        "avif": "/assets/projects/plant.avif",
        "alt": "Plant Disease Detection Using CNN",
        "width": 1000,
        "height": 667,
        "srcSet": "/assets/projects/plant-600.webp 600w, /assets/projects/plant.webp 1000w"
      },
      "repository": "https://github.com/eliot-99/Plant-Disease-Detection-Using-CNN-",
      "liveUrl": "",
      "featured": false,
      "facts": [
        "Detection",
        "Deep CNN",
        "Agriculture",
        "CNN Deep Learning",
        "Agriculture Application"
      ]
    },
    {
      "id": "photographic-journal",
      "title": "Saptarshi Ghosh — A World Worth Noticing",
      "shortTitle": "Photographic Journal",
      "category": "Photography / Web Experience",
      "status": "Live",
      "description": "A photographic journal of wildlife, places and passing moments. An interactive collection of 115 photographs pairs each frame with its story, with four gallery zoom levels and a visual journey through life beyond the keyboard.",
      "technologies": ["React", "Cloudflare Pages", "AVIF", "Responsive UI"],
      "image": {
        "src": "/assets/projects/portfolio.webp",
        "avif": "/assets/projects/portfolio.avif",
        "alt": "Photographic journal project record",
        "width": 1000,
        "height": 668,
        "srcSet": "/assets/projects/portfolio-600.webp 600w, /assets/projects/portfolio.webp 1000w"
      },
      "repository": "",
      "liveUrl": "https://saptarshi-portfolio.pages.dev/",
      "liveAvailable": true,
      "featured": true,
      "facts": ["115 photographs with individual stories", "Four gallery zoom levels", "Wildlife, places, portraits and everyday moments"]
    },
    {
      "id": "datascope",
      "title": "DataScope - AI-Powered Data Analysis Platform",
      "shortTitle": "DataScope",
      "category": "Data Science",
      "status": "Active",
      "description": "Revolutionary web application that transforms raw data into actionable insights using Google Gemini AI. Features comprehensive statistical analysis, beautiful visualizations, automated data quality assessment, and intelligent ML readiness recommendations with enterprise-grade security.",
      "technologies": [
        "Flask",
        "Python",
        "Gemini AI",
        "Data Science"
      ],
      "image": {
        "src": "/assets/projects/datascope.webp",
        "avif": "/assets/projects/datascope.avif",
        "alt": "DataScope - AI-Powered Data Analysis Platform",
        "width": 1000,
        "height": 667,
        "srcSet": "/assets/projects/datascope-600.webp 600w, /assets/projects/datascope.webp 1000w"
      },
      "repository": "https://github.com/eliot-99/DataScope",
      "liveUrl": "https://web-production-36f6.up.railway.app/",
      "featured": true,
      "facts": [
        "AI Insights",
        "Advanced Viz",
        "Production",
        "AI-Powered Data Analysis",
        "Production Ready"
      ]
    },
    {
      "id": "ai-quiz-hub",
      "title": "AI Quiz Hub - Intelligent Quiz Platform",
      "shortTitle": "AI Quiz Hub",
      "category": "AI Application",
      "status": "Active",
      "description": "An intelligent, interactive quiz platform powered by Meta's Llama 3.1 70B model via OpenRouter API. Features stunning 3D backgrounds with Vanta.js neural networks, immersive audio system, multi-language support (English, Hindi, Bengali), and comprehensive analytics with 50 questions per quiz.",
      "technologies": [
        "Next.js",
        "TypeScript",
        "Llama AI",
        "Vanta.js"
      ],
      "image": {
        "src": "/assets/projects/ai-quiz-hub.webp",
        "avif": "/assets/projects/ai-quiz-hub.avif",
        "alt": "AI Quiz Hub - Intelligent Quiz Platform",
        "width": 500,
        "height": 750,
        "srcSet": "/assets/projects/ai-quiz-hub-600.webp 500w, /assets/projects/ai-quiz-hub.webp 500w"
      },
      "repository": "https://github.com/eliot-99/AI-Quiz-Hub",
      "liveUrl": "https://ai-quiz-hub-pi.vercel.app/",
      "featured": true,
      "facts": [
        "AI-Powered",
        "Multi-Language",
        "3D Graphics",
        "AI-Powered Quiz Generation",
        "Multi-Language Support"
      ]
    },
    {
      "id": "sentinel",
      "title": "Sentinel — Website Security Scanner",
      "shortTitle": "Sentinel",
      "category": "Security / Web Platform",
      "status": "Live",
      "description": "A focused security scanner that checks any website for common flaws in seconds, turning a complex audit into a clear, actionable report.",
      "technologies": [
        "React",
        "TypeScript",
        "Security",
        "SSE"
      ],
      "image": {
        "src": "/assets/projects/portfolio.webp",
        "avif": "/assets/projects/portfolio.avif",
        "alt": "Sentinel project record",
        "width": 1000,
        "height": 668,
        "srcSet": "/assets/projects/portfolio-600.webp 600w, /assets/projects/portfolio.webp 1000w"
      },
      "repository": "",
      "liveUrl": "https://sentinel.nexaric.tech/",
      "liveAvailable": true,
      "featured": true,
      "facts": [
        "Website security scanning",
        "Actionable findings",
        "Live hosted product"
      ]
    },
    {
      "id": "nokiverse",
      "title": "NokiVerSe — Nokia Classics",
      "shortTitle": "NokiVerSe",
      "category": "Interactive Web",
      "status": "Live",
      "description": "A nostalgic arcade on one green screen, bringing Snake II, Space Impact, Tetris, Rapid Roll, Flappy, Tic-Tac-Toe and Turbo Chase into a playful browser experience.",
      "technologies": [
        "React",
        "JavaScript",
        "Game UI",
        "PWA"
      ],
      "image": {
        "src": "/assets/projects/portfolio.webp",
        "avif": "/assets/projects/portfolio.avif",
        "alt": "NokiVerSe project record",
        "width": 1000,
        "height": 668,
        "srcSet": "/assets/projects/portfolio-600.webp 600w, /assets/projects/portfolio.webp 1000w"
      },
      "repository": "",
      "liveUrl": "https://nokiverse.nexaric.tech/",
      "liveAvailable": true,
      "featured": false,
      "facts": [
        "Seven classic games",
        "Responsive touch play",
        "Nostalgic visual system"
      ]
    },
    {
      "id": "anon",
      "title": "Anon — Anonymous Messages with Attitude",
      "shortTitle": "Anon",
      "category": "Social Web App",
      "status": "Live",
      "description": "A bold private inbox for anonymous messages: create a shareable link, collect honest notes and keep the conversation moving without an email address.",
      "technologies": [
        "Web App",
        "Privacy",
        "Responsive UI",
        "Analytics"
      ],
      "image": {
        "src": "/assets/projects/portfolio.webp",
        "avif": "/assets/projects/portfolio.avif",
        "alt": "Anon project record",
        "width": 1000,
        "height": 668,
        "srcSet": "/assets/projects/portfolio-600.webp 600w, /assets/projects/portfolio.webp 1000w"
      },
      "repository": "",
      "liveUrl": "https://anon.wsh.cards/",
      "liveAvailable": true,
      "featured": false,
      "facts": [
        "Private message links",
        "No email required",
        "Mobile-first experience"
      ]
    },
    {
      "id": "redline-reckoning",
      "title": "REDLINE / Reckoning",
      "shortTitle": "Redline / Reckoning",
      "category": "3D Interactive Experience",
      "status": "Live",
      "description": "A 3D highway motorcycle combat racer built for the browser, with solo runs and head-to-head play wrapped in a cinematic dark-road interface.",
      "technologies": [
        "Three.js",
        "WebGL",
        "JavaScript",
        "Multiplayer"
      ],
      "image": {
        "src": "/assets/projects/portfolio.webp",
        "avif": "/assets/projects/portfolio.avif",
        "alt": "Redline Reckoning project record",
        "width": 1000,
        "height": 668,
        "srcSet": "/assets/projects/portfolio-600.webp 600w, /assets/projects/portfolio.webp 1000w"
      },
      "repository": "",
      "liveUrl": "https://redline-reckoning.saptarshi0999.workers.dev/",
      "liveAvailable": true,
      "featured": true,
      "facts": [
        "3D highway racer",
        "Solo and versus modes",
        "Cloudflare Workers deployment"
      ]
    },
    {
      "id": "molecular-design",
      "title": "Graph ML-Enabled Molecular Design Assistant",
      "shortTitle": "MolGNN Tox21 Predictor",
      "category": "AI / Graph ML",
      "status": "Research",
      "description": "An AI-powered molecular toxicity prediction system that represents molecules as graphs and evaluates twelve Tox21 endpoints with GINE, GCN and GATv2 models.",
      "technologies": [
        "Python",
        "PyTorch",
        "Flask",
        "RDKit"
      ],
      "image": {
        "src": "/assets/projects/portfolio.webp",
        "avif": "/assets/projects/portfolio.avif",
        "alt": "Graph machine learning molecular design project record",
        "width": 1000,
        "height": 668,
        "srcSet": "/assets/projects/portfolio-600.webp 600w, /assets/projects/portfolio.webp 1000w"
      },
      "repository": "https://github.com/eliot-99/Graph-ML-Enabled-Molecular-Design-Assistant-using-Graph-Neural-Networks",
      "liveUrl": "https://huggingface.co/spaces/Epion09g/MolGNN-Tox21-Predictor",
      "liveAvailable": true,
      "featured": true,
      "facts": [
        "Twelve Tox21 endpoints",
        "GINE, GCN and GATv2",
        "Interactive molecule visualisation"
      ]
    }
  ],
  "gallery": [
    {
      "id": "ureckon-event-poster",
      "title": "URECKON Event Poster",
      "category": "design",
      "type": "Event Design",
      "image": {
        "src": "/assets/gallery/ureckon-event-poster.webp",
        "avif": "/assets/gallery/ureckon-event-poster.avif",
        "alt": "URECKON Event Poster — Event Design",
        "width": 1080,
        "height": 1350,
        "srcSet": "/assets/gallery/ureckon-event-poster-600.webp 600w, /assets/gallery/ureckon-event-poster.webp 1080w"
      },
      "featured": true
    },
    {
      "id": "t-shirt-design-competition",
      "title": "T-Shirt Design Competition",
      "category": "design",
      "type": "Competition Poster",
      "image": {
        "src": "/assets/gallery/t-shirt-design-competition.webp",
        "avif": "/assets/gallery/t-shirt-design-competition.avif",
        "alt": "T-Shirt Design Competition — Competition Poster",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/t-shirt-design-competition-600.webp 600w, /assets/gallery/t-shirt-design-competition.webp 1080w"
      },
      "featured": true
    },
    {
      "id": "messi-poster",
      "title": "Messi Poster",
      "category": "design",
      "type": "Concept Poster",
      "image": {
        "src": "/assets/gallery/messi-poster.webp",
        "avif": "/assets/gallery/messi-poster.avif",
        "alt": "Messi Poster — Concept Poster",
        "width": 1131,
        "height": 1600,
        "srcSet": "/assets/gallery/messi-poster-600.webp 600w, /assets/gallery/messi-poster.webp 1131w"
      },
      "featured": true
    },
    {
      "id": "trap-music-event",
      "title": "Trap Music Event",
      "category": "branding",
      "type": "Music Poster",
      "image": {
        "src": "/assets/gallery/trap-music-event.webp",
        "avif": "/assets/gallery/trap-music-event.avif",
        "alt": "Trap Music Event — Music Poster",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/trap-music-event-600.webp 600w, /assets/gallery/trap-music-event.webp 1080w"
      },
      "featured": true
    },
    {
      "id": "ananya-chakraborty-and-the-bohemian-baul",
      "title": "Ananya Chakraborty And The Bohemian Baul",
      "category": "branding",
      "type": "Music Poster",
      "image": {
        "src": "/assets/gallery/ananya-chakraborty-and-the-bohemian-baul.webp",
        "avif": "/assets/gallery/ananya-chakraborty-and-the-bohemian-baul.avif",
        "alt": "Ananya Chakraborty And The Bohemian Baul — Music Poster",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/ananya-chakraborty-and-the-bohemian-baul-600.webp 600w, /assets/gallery/ananya-chakraborty-and-the-bohemian-baul.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "through-the-lens",
      "title": "Through The Lens",
      "category": "design",
      "type": "Photography Event",
      "image": {
        "src": "/assets/gallery/through-the-lens.webp",
        "avif": "/assets/gallery/through-the-lens.avif",
        "alt": "Through The Lens — Photography Event",
        "width": 1080,
        "height": 1350,
        "srcSet": "/assets/gallery/through-the-lens-600.webp 600w, /assets/gallery/through-the-lens.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "astronomy-quiz-competition",
      "title": "Astronomy Quiz Competition",
      "category": "design",
      "type": "Educational Event",
      "image": {
        "src": "/assets/gallery/astronomy-quiz-competition.webp",
        "avif": "/assets/gallery/astronomy-quiz-competition.avif",
        "alt": "Astronomy Quiz Competition — Educational Event",
        "width": 1080,
        "height": 1350,
        "srcSet": "/assets/gallery/astronomy-quiz-competition-600.webp 600w, /assets/gallery/astronomy-quiz-competition.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "subho-bijoya-poster",
      "title": "Subho Bijoya Poster",
      "category": "design",
      "type": "Social Event",
      "image": {
        "src": "/assets/gallery/subho-bijoya-poster.webp",
        "avif": "/assets/gallery/subho-bijoya-poster.avif",
        "alt": "Subho Bijoya Poster — Social Event",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/subho-bijoya-poster-600.webp 600w, /assets/gallery/subho-bijoya-poster.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "professor-sonku-o-ufo",
      "title": "Professor Sonku O Ufo",
      "category": "design",
      "type": "Concept Poster",
      "image": {
        "src": "/assets/gallery/professor-sonku-o-ufo.webp",
        "avif": "/assets/gallery/professor-sonku-o-ufo.avif",
        "alt": "Professor Sonku O Ufo — Concept Poster",
        "width": 1131,
        "height": 1600,
        "srcSet": "/assets/gallery/professor-sonku-o-ufo-600.webp 600w, /assets/gallery/professor-sonku-o-ufo.webp 1131w"
      },
      "featured": false
    },
    {
      "id": "social-justice-campaign",
      "title": "Social Justice Campaign",
      "category": "design",
      "type": "Awareness Poster",
      "image": {
        "src": "/assets/gallery/social-justice-campaign.webp",
        "avif": "/assets/gallery/social-justice-campaign.avif",
        "alt": "Social Justice Campaign — Awareness Poster",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/social-justice-campaign-600.webp 600w, /assets/gallery/social-justice-campaign.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "shawarma-design",
      "title": "Shawarma Design",
      "category": "branding",
      "type": "Food Branding",
      "image": {
        "src": "/assets/gallery/shawarma-design.webp",
        "avif": "/assets/gallery/shawarma-design.avif",
        "alt": "Shawarma Design — Food Branding",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/shawarma-design-600.webp 600w, /assets/gallery/shawarma-design.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "momo-design",
      "title": "Momo Design",
      "category": "branding",
      "type": "Food Branding",
      "image": {
        "src": "/assets/gallery/momo-design.webp",
        "avif": "/assets/gallery/momo-design.avif",
        "alt": "Momo Design — Food Branding",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/momo-design-600.webp 600w, /assets/gallery/momo-design.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "red-velvet-shake",
      "title": "Red Velvet Shake",
      "category": "branding",
      "type": "Beverage Design",
      "image": {
        "src": "/assets/gallery/red-velvet-shake.webp",
        "avif": "/assets/gallery/red-velvet-shake.avif",
        "alt": "Red Velvet Shake — Beverage Design",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/red-velvet-shake-600.webp 600w, /assets/gallery/red-velvet-shake.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "cold-coffee",
      "title": "Cold Coffee",
      "category": "branding",
      "type": "Beverage Design",
      "image": {
        "src": "/assets/gallery/cold-coffee.webp",
        "avif": "/assets/gallery/cold-coffee.avif",
        "alt": "Cold Coffee — Beverage Design",
        "width": 1080,
        "height": 1080,
        "srcSet": "/assets/gallery/cold-coffee-600.webp 600w, /assets/gallery/cold-coffee.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "bgmi",
      "title": "BGMI",
      "category": "branding",
      "type": "Gaming Event",
      "image": {
        "src": "/assets/gallery/bgmi.webp",
        "avif": "/assets/gallery/bgmi.avif",
        "alt": "BGMI — Gaming Event",
        "width": 1080,
        "height": 1350,
        "srcSet": "/assets/gallery/bgmi-600.webp 600w, /assets/gallery/bgmi.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "auto-expo",
      "title": "Auto Expo",
      "category": "branding",
      "type": "Auto Expo Event",
      "image": {
        "src": "/assets/gallery/auto-expo.webp",
        "avif": "/assets/gallery/auto-expo.avif",
        "alt": "Auto Expo — Auto Expo Event",
        "width": 1080,
        "height": 1350,
        "srcSet": "/assets/gallery/auto-expo-600.webp 600w, /assets/gallery/auto-expo.webp 1080w"
      },
      "featured": false
    },
    {
      "id": "street-photography",
      "title": "Street Photography",
      "category": "photography",
      "type": "Daily Life",
      "image": {
        "src": "/assets/gallery/street-photography.webp",
        "avif": "/assets/gallery/street-photography.avif",
        "alt": "Street Photography — Daily Life",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/street-photography-600.webp 600w, /assets/gallery/street-photography.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "a-smiling-baba",
      "title": "A Smiling Baba",
      "category": "photography",
      "type": "Portrait Photography",
      "image": {
        "src": "/assets/gallery/a-smiling-baba.webp",
        "avif": "/assets/gallery/a-smiling-baba.avif",
        "alt": "A Smiling Baba — Portrait Photography",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/a-smiling-baba-600.webp 600w, /assets/gallery/a-smiling-baba.webp 1920w"
      },
      "featured": true
    },
    {
      "id": "bird-portrait",
      "title": "Bird Portrait",
      "category": "photography",
      "type": "Wildlife Photography",
      "image": {
        "src": "/assets/gallery/bird-portrait.webp",
        "avif": "/assets/gallery/bird-portrait.avif",
        "alt": "Bird Portrait — Wildlife Photography",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/bird-portrait-600.webp 600w, /assets/gallery/bird-portrait.webp 1920w"
      },
      "featured": true
    },
    {
      "id": "avian-beauty",
      "title": "Avian Beauty",
      "category": "photography",
      "type": "Wildlife Photography",
      "image": {
        "src": "/assets/gallery/avian-beauty.webp",
        "avif": "/assets/gallery/avian-beauty.avif",
        "alt": "Avian Beauty — Wildlife Photography",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/avian-beauty-600.webp 600w, /assets/gallery/avian-beauty.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "maa-er-agomon",
      "title": "Maa er agomon",
      "category": "photography",
      "type": "Street Photography",
      "image": {
        "src": "/assets/gallery/maa-er-agomon.webp",
        "avif": "/assets/gallery/maa-er-agomon.avif",
        "alt": "Maa er agomon — Street Photography",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/maa-er-agomon-600.webp 600w, /assets/gallery/maa-er-agomon.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "lightning",
      "title": "Lightning",
      "category": "photography",
      "type": "Nature Photography",
      "image": {
        "src": "/assets/gallery/lightning.webp",
        "avif": "/assets/gallery/lightning.avif",
        "alt": "Lightning — Nature Photography",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/lightning-600.webp 600w, /assets/gallery/lightning.webp 1920w"
      },
      "featured": true
    },
    {
      "id": "bee",
      "title": "Bee",
      "category": "photography",
      "type": "Macro Photography",
      "image": {
        "src": "/assets/gallery/bee.webp",
        "avif": "/assets/gallery/bee.avif",
        "alt": "Bee — Macro Photography",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/bee-600.webp 600w, /assets/gallery/bee.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "moon",
      "title": "Moon",
      "category": "photography",
      "type": "Moon Photography",
      "image": {
        "src": "/assets/gallery/moon.webp",
        "avif": "/assets/gallery/moon.avif",
        "alt": "Moon — Moon Photography",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/moon-600.webp 600w, /assets/gallery/moon.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "spider",
      "title": "Spider",
      "category": "photography",
      "type": "Macro Photography",
      "image": {
        "src": "/assets/gallery/spider.webp",
        "avif": "/assets/gallery/spider.avif",
        "alt": "Spider — Macro Photography",
        "width": 720,
        "height": 720,
        "srcSet": "/assets/gallery/spider-600.webp 600w, /assets/gallery/spider.webp 720w"
      },
      "featured": false
    },
    {
      "id": "life-struggle-in-mountains",
      "title": "Life struggle in mountains",
      "category": "photography",
      "type": "Daily Life",
      "image": {
        "src": "/assets/gallery/life-struggle-in-mountains.webp",
        "avif": "/assets/gallery/life-struggle-in-mountains.avif",
        "alt": "Life struggle in mountains — Daily Life",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/life-struggle-in-mountains-600.webp 600w, /assets/gallery/life-struggle-in-mountains.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "monkey",
      "title": "Monkey",
      "category": "photography",
      "type": "Wildlife",
      "image": {
        "src": "/assets/gallery/monkey.webp",
        "avif": "/assets/gallery/monkey.avif",
        "alt": "Monkey — Wildlife",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/monkey-600.webp 600w, /assets/gallery/monkey.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "offering-of-the-eyes-of-maa",
      "title": "Offering of the Eyes of Maa",
      "category": "photography",
      "type": "Daily Life",
      "image": {
        "src": "/assets/gallery/offering-of-the-eyes-of-maa.webp",
        "avif": "/assets/gallery/offering-of-the-eyes-of-maa.avif",
        "alt": "Offering of the Eyes of Maa — Daily Life",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/offering-of-the-eyes-of-maa-600.webp 600w, /assets/gallery/offering-of-the-eyes-of-maa.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "the-owl",
      "title": "The Owl",
      "category": "photography",
      "type": "Wildlife",
      "image": {
        "src": "/assets/gallery/the-owl.webp",
        "avif": "/assets/gallery/the-owl.avif",
        "alt": "The Owl — Wildlife",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/the-owl-600.webp 600w, /assets/gallery/the-owl.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "the-bird",
      "title": "The bird",
      "category": "photography",
      "type": "Wildlife",
      "image": {
        "src": "/assets/gallery/the-bird.webp",
        "avif": "/assets/gallery/the-bird.avif",
        "alt": "The bird — Wildlife",
        "width": 1856,
        "height": 1856,
        "srcSet": "/assets/gallery/the-bird-600.webp 600w, /assets/gallery/the-bird.webp 1856w"
      },
      "featured": false
    },
    {
      "id": "the-bird-taking-flight",
      "title": "The bird taking flight",
      "category": "photography",
      "type": "Wildlife",
      "image": {
        "src": "/assets/gallery/the-bird-taking-flight.webp",
        "avif": "/assets/gallery/the-bird-taking-flight.avif",
        "alt": "The bird taking flight — Wildlife",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/the-bird-taking-flight-600.webp 600w, /assets/gallery/the-bird-taking-flight.webp 1920w"
      },
      "featured": false
    },
    {
      "id": "the-boat-in-ganges",
      "title": "The boat in Ganges",
      "category": "photography",
      "type": "Landscape",
      "image": {
        "src": "/assets/gallery/the-boat-in-ganges.webp",
        "avif": "/assets/gallery/the-boat-in-ganges.avif",
        "alt": "The boat in Ganges — Landscape",
        "width": 1920,
        "height": 1920,
        "srcSet": "/assets/gallery/the-boat-in-ganges-600.webp 600w, /assets/gallery/the-boat-in-ganges.webp 1920w"
      },
      "featured": true
    }
  ],
  "certifications": [
    {
      "id": "gfg-ml-ds",
      "title": "Machine Learning & Data Science",
      "organization": "GeeksforGeeks",
      "year": "2024",
      "duration": "40+ hours",
      "skills": [
        "Machine Learning",
        "Data Science",
        "Python"
      ],
      "url": "https://drive.google.com/file/d/1FApuSq34ejQMMrXHg8_-G8LO3gDL-Kq-/view"
    },
    {
      "id": "ibm-python",
      "title": "Python for Data Science, AI & Development",
      "organization": "IBM",
      "year": "2024",
      "duration": "25+ hours",
      "skills": [
        "Python",
        "Data Science",
        "AI Development"
      ],
      "url": "https://drive.google.com/file/d/1vAlAkDDJxQ89AIWmkE65xWWqFiB7W1S-/view"
    },
    {
      "id": "linkedin-cloud",
      "title": "Cloud Computing",
      "organization": "LinkedIn Learning",
      "year": "2024",
      "duration": "15+ hours",
      "skills": [
        "Cloud Computing",
        "AWS",
        "DevOps"
      ],
      "url": "https://drive.google.com/file/d/1hRdEWhfBssgOichYMN1DherrUhisY_6f/view"
    },
    {
      "id": "linkedin-photoshop",
      "title": "Photoshop 2024 Essential Training",
      "organization": "LinkedIn Learning",
      "year": "2024",
      "duration": "12+ hours",
      "skills": [
        "Photoshop",
        "Design",
        "Creative Suite"
      ],
      "url": "https://drive.google.com/file/d/1Fv5aQup0dgsidaB8jXCKQ1ayl8fgkPV3/view"
    }
  ],
  "achievements": [
    {
      "id": "vice-chancellor-award",
      "title": "Vice Chancellor’s Award",
      "organization": "UEM Kolkata",
      "period": "2024",
      "description": "Awarded for outstanding overall performance at the University of Engineering and Management, Kolkata.",
      "tags": [
        "Outstanding Performance",
        "Academic Excellence"
      ],
      "url": "https://drive.google.com/file/d/1iKrvPGfMwMD-flTtJdX6ROjabFrz1AQz/view"
    },
    {
      "id": "ray-imagine",
      "title": "1st Position · Poster Design Competition",
      "organization": "Ray Imagine",
      "period": "2024",
      "description": "Secured first position in the Ray Imagine Poster Design Competition.",
      "tags": [
        "1st Position",
        "Design",
        "Creative"
      ],
      "url": "https://drive.google.com/file/d/1kttAtTQNQbuUi62F0B85XV8mjHF0AIP_/view"
    },
    {
      "id": "ureckon-lead-designer",
      "title": "Lead Designer · Ureckon Fest",
      "organization": "Ureckon, UEM Kolkata",
      "period": "2023 — 2024",
      "description": "Served as Lead Designer for Ureckon, the annual techno-management fest of UEM Kolkata, managing creative direction and the design team.",
      "tags": [
        "Leadership",
        "Team Management",
        "Creative Direction"
      ],
      "url": ""
    }
  ],
  "interests": [
    {
      "id": "photography",
      "title": "Photography",
      "description": "Capturing moments and stories through the lens, exploring the art of visual storytelling."
    },
    {
      "id": "travelling",
      "title": "Travelling",
      "description": "Exploring new places and cultures, discovering inspiration from diverse landscapes and experiences."
    },
    {
      "id": "filmmaking",
      "title": "Filmmaking",
      "description": "Creating visual stories and cinematic experiences, bringing narratives to life through motion."
    }
  ],
  "socials": [
    {
      "id": "github",
      "label": "GitHub",
      "url": "https://github.com/eliot-99"
    },
    {
      "id": "linkedin",
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/saptarshi-ghosh-rana/"
    },
    {
      "id": "instagram",
      "label": "Instagram",
      "url": "https://www.instagram.com/unpopular_chobiwala/"
    },
    {
      "id": "x",
      "label": "X / Twitter",
      "url": "https://x.com/PixelToPython"
    }
  ],
  "contact": {
    "heading": "Let’s write the next chapter.",
    "description": "Have a project in mind? Let’s discuss how we can bring your ideas to life.",
    "emailLabel": "Send a letter",
    "phoneLabel": "Give me a call",
    "locationLabel": "Based in",
    "messageLabel": "Your message",
    "submitLabel": "Compose email",
    "successMessage": "Your email app will open with your message. Send it there to complete your note."
  }
};
