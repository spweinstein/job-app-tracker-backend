require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const Company = require("../models/company");
const Resume = require("../models/resume");
const JobApp = require("../models/jobApp");
const Task = require("../models/task");
const Email = require("../models/email");
const Call = require("../models/call");
const Interview = require("../models/interview");
const Meeting = require("../models/meeting");
const CoverLetter = require("../models/coverLetter");

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Company.deleteMany({});
    await Resume.deleteMany({});
    await JobApp.deleteMany({});
    await Task.deleteMany({});
    await Email.deleteMany({});
    await Call.deleteMany({});
    await Interview.deleteMany({});
    await Meeting.deleteMany({});
    await CoverLetter.deleteMany({});
    console.log("Cleared existing data");

    // Find demo user
    const demoUser = await User.findOne({
      username: process.env.DEMO_USER,
    });
    console.log("Found demo user");

    // Create companies (15+)
    const companies = await Company.insertMany([
      {
        user: demoUser._id,
        name: "TechCorp Solutions",
        website: "https://techcorp.example.com",
        description: "Leading enterprise software company",
        notes: "Met recruiter at job fair",
      },
      {
        user: demoUser._id,
        name: "DataFlow Inc",
        website: "https://dataflow.example.com",
        description: "Data analytics and visualization platform",
        notes: "Employee referral from John",
      },
      {
        user: demoUser._id,
        name: "CloudNine Systems",
        website: "https://cloudnine.example.com",
        description: "Cloud infrastructure services",
      },
      {
        user: demoUser._id,
        name: "StartupXYZ",
        website: "https://startupxyz.example.com",
        description: "Fast-growing fintech startup",
        notes: "Y Combinator backed",
      },
      {
        user: demoUser._id,
        name: "Global Enterprises",
        website: "https://globalent.example.com",
        description: "Fortune 500 consulting firm",
      },
      {
        user: demoUser._id,
        name: "Innovate Labs",
        website: "https://innovatelabs.example.com",
        description: "AI and machine learning research company",
        notes: "Very competitive hiring process",
      },
      {
        user: demoUser._id,
        name: "WebScale Studios",
        website: "https://webscale.example.com",
        description: "Digital agency specializing in web apps",
      },
      {
        user: demoUser._id,
        name: "DevOps Dynamics",
        website: "https://devopsdynamics.example.com",
        description: "Infrastructure automation and DevOps consultancy",
      },
      {
        user: demoUser._id,
        name: "RemoteFirst Inc",
        website: "https://remotefirst.example.com",
        description: "Fully remote software company",
        notes: "No office - distributed team worldwide",
      },
      {
        user: demoUser._id,
        name: "FinTech Ventures",
        website: "https://fintechventures.example.com",
        description: "Financial technology and blockchain solutions",
      },
      {
        user: demoUser._id,
        name: "HealthTech Solutions",
        website: "https://healthtech.example.com",
        description: "Healthcare software and patient management systems",
      },
      {
        user: demoUser._id,
        name: "EduPlatform Co",
        website: "https://eduplatform.example.com",
        description: "Online learning and education technology",
      },
      {
        user: demoUser._id,
        name: "GreenEnergy Tech",
        website: "https://greenenergy.example.com",
        description: "Renewable energy monitoring and analytics",
      },
      {
        user: demoUser._id,
        name: "Quantum Computing Corp",
        website: "https://quantumcorp.example.com",
        description: "Cutting-edge quantum computing research",
      },
      {
        user: demoUser._id,
        name: "Social Connect",
        website: "https://socialconnect.example.com",
        description: "Social networking platform for professionals",
      },
      {
        user: demoUser._id,
        name: "GameDev Studios",
        website: "https://gamedev.example.com",
        description: "Video game development and publishing",
      },
    ]);
    console.log(`Created ${companies.length} companies`);

    // Create resumes with versioning hierarchy
    const resumes = [];

    // TREE A: Software Engineer hierarchy
    const rootA = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - General",
      parent: null,
      root: null,
      summary: "Versatile software engineer with experience across the full stack",
      experience: [
        {
          company: companies[0]._id,
          title: "Software Engineer",
          startDate: new Date("2020-06-01"),
          endDate: new Date("2025-12-31"),
          description: "Developed web applications using various technologies. Collaborated with cross-functional teams.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["JavaScript", "Python", "Git", "SQL"],
    });
    resumes.push(rootA);

    // 2nd generation from rootA
    const fullStack = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Full Stack",
      parent: rootA._id,
      root: rootA._id,
      summary: "Experienced full-stack developer with 5+ years in web development",
      experience: [
        {
          company: companies[0]._id,
          title: "Senior Software Engineer",
          startDate: new Date("2022-01-15"),
          endDate: new Date("2025-12-31"),
          description: "Led development of microservices architecture. Built RESTful APIs using Node.js and Express. Implemented CI/CD pipelines.",
        },
        {
          company: companies[1]._id,
          title: "Software Engineer",
          startDate: new Date("2020-06-01"),
          endDate: new Date("2021-12-31"),
          description: "Developed data visualization dashboards using React and D3.js. Optimized database queries resulting in 40% performance improvement.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "E-commerce Platform",
          year: 2024,
          link: "https://github.com/demo/ecommerce",
          description: "Built full-stack e-commerce platform with payment integration",
        },
      ],
      certifications: [
        {
          title: "AWS Certified Developer",
          company: companies[2]._id,
          year: 2024,
        },
      ],
      skills: ["JavaScript", "Node.js", "React", "MongoDB", "PostgreSQL", "Docker", "AWS", "Git"],
    });
    resumes.push(fullStack);

    const backend = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Backend Focused",
      parent: rootA._id,
      root: rootA._id,
      summary: "Backend engineer specializing in scalable API development and microservices",
      experience: [
        {
          company: companies[2]._id,
          title: "Backend Engineer",
          startDate: new Date("2021-08-01"),
          description: "Design and implement RESTful and GraphQL APIs. Work with microservices architecture. Optimize database performance.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
        {
          degree: "M.S. Software Engineering",
          school: "Tech Institute",
          year: 2021,
        },
      ],
      certifications: [
        {
          title: "MongoDB Certified Developer",
          year: 2023,
        },
      ],
      skills: ["Node.js", "Express", "GraphQL", "MongoDB", "Redis", "Docker", "Kubernetes"],
    });
    resumes.push(backend);

    // Additional direct children of rootA (13 more to make 15 total)
    const directChild3 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Mobile Development",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer specializing in mobile app development",
      experience: [
        {
          company: companies[1]._id,
          title: "Mobile Developer",
          startDate: new Date("2021-01-01"),
          description: "Built cross-platform mobile applications using React Native and Flutter.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["React Native", "Flutter", "iOS", "Android", "JavaScript", "Dart"],
    });
    resumes.push(directChild3);

    const directChild4 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Data Engineering",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer focused on data pipelines and ETL processes",
      experience: [
        {
          company: companies[1]._id,
          title: "Data Engineer",
          startDate: new Date("2021-06-01"),
          description: "Built and maintained data pipelines. Worked with Spark and Airflow.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["Python", "Apache Spark", "Airflow", "SQL", "AWS", "ETL"],
    });
    resumes.push(directChild4);

    const directChild5 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - DevOps Focus",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer with DevOps and infrastructure expertise",
      experience: [
        {
          company: companies[7]._id,
          title: "DevOps Engineer",
          startDate: new Date("2021-03-01"),
          description: "Managed CI/CD pipelines and cloud infrastructure.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform", "Linux"],
    });
    resumes.push(directChild5);

    const directChild6 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Security Focused",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer specializing in application security",
      experience: [
        {
          company: companies[0]._id,
          title: "Security Engineer",
          startDate: new Date("2021-09-01"),
          description: "Conducted security audits and implemented secure coding practices.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["Security", "Penetration Testing", "OWASP", "Python", "Cryptography"],
    });
    resumes.push(directChild6);

    const directChild7 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - QA/Testing",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer focused on quality assurance and test automation",
      experience: [
        {
          company: companies[6]._id,
          title: "QA Engineer",
          startDate: new Date("2021-02-01"),
          description: "Developed automated test suites and improved test coverage.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["Selenium", "Jest", "Cypress", "Test Automation", "JavaScript", "Python"],
    });
    resumes.push(directChild7);

    const directChild8 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Game Development",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer specializing in game development",
      experience: [
        {
          company: companies[15]._id,
          title: "Game Developer",
          startDate: new Date("2021-07-01"),
          description: "Developed game mechanics and optimized performance for Unity games.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["Unity", "C#", "Game Physics", "3D Graphics", "Optimization"],
    });
    resumes.push(directChild8);

    const directChild9 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Embedded Systems",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer working with embedded systems and IoT",
      experience: [
        {
          company: companies[12]._id,
          title: "Embedded Software Engineer",
          startDate: new Date("2021-04-01"),
          description: "Developed firmware for IoT devices and sensor systems.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["C", "C++", "Embedded C", "RTOS", "IoT", "Hardware Integration"],
    });
    resumes.push(directChild9);

    const directChild10 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Machine Learning",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer with machine learning and AI focus",
      experience: [
        {
          company: companies[5]._id,
          title: "ML Engineer",
          startDate: new Date("2021-11-01"),
          description: "Built and deployed machine learning models for production systems.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "ML Ops", "Data Science"],
    });
    resumes.push(directChild10);

    const directChild11 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Database Specialist",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer specializing in database design and optimization",
      experience: [
        {
          company: companies[4]._id,
          title: "Database Engineer",
          startDate: new Date("2021-05-01"),
          description: "Designed database schemas and optimized query performance.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Database Design"],
    });
    resumes.push(directChild11);

    const directChild12 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - API Development",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer focused on API design and development",
      experience: [
        {
          company: companies[2]._id,
          title: "API Developer",
          startDate: new Date("2021-08-15"),
          description: "Designed and implemented RESTful APIs and GraphQL endpoints.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["REST", "GraphQL", "Node.js", "API Design", "OpenAPI", "Documentation"],
    });
    resumes.push(directChild12);

    const directChild13 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - UI/UX Focus",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer with strong UI/UX design skills",
      experience: [
        {
          company: companies[6]._id,
          title: "Frontend Engineer",
          startDate: new Date("2021-10-01"),
          description: "Built user interfaces with focus on user experience and accessibility.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["HTML", "CSS", "JavaScript", "Figma", "User Research", "Accessibility"],
    });
    resumes.push(directChild13);

    const directChild14 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - E-commerce",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer specializing in e-commerce platforms",
      experience: [
        {
          company: companies[0]._id,
          title: "E-commerce Developer",
          startDate: new Date("2021-12-01"),
          description: "Built shopping cart systems and payment integrations.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["JavaScript", "Shopify", "Stripe", "Payment Processing", "Cart Systems"],
    });
    resumes.push(directChild14);

    const directChild15 = await Resume.create({
      user: demoUser._id,
      name: "Software Engineer - Microservices",
      parent: rootA._id,
      root: rootA._id,
      summary: "Software engineer experienced with microservices architecture",
      experience: [
        {
          company: companies[2]._id,
          title: "Microservices Engineer",
          startDate: new Date("2022-01-15"),
          description: "Designed and implemented microservices using Docker and Kubernetes.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["Microservices", "Docker", "Kubernetes", "Service Mesh", "Event-Driven"],
    });
    resumes.push(directChild15);

    // 3rd generation
    const startupFocus = await Resume.create({
      user: demoUser._id,
      name: "Full Stack - Startup Focus",
      parent: fullStack._id,
      root: rootA._id,
      summary: "Full-stack engineer with startup experience and rapid development skills",
      experience: [
        {
          company: companies[3]._id,
          title: "Full Stack Engineer",
          startDate: new Date("2023-03-01"),
          endDate: new Date("2025-12-31"),
          description: "Built MVP features from scratch. Wore multiple hats including DevOps and product planning. Fast-paced agile environment.",
        },
        {
          company: companies[0]._id,
          title: "Software Engineer",
          startDate: new Date("2020-06-01"),
          endDate: new Date("2023-02-28"),
          description: "Developed web applications and learned full-stack development.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["JavaScript", "Node.js", "React", "MongoDB", "AWS", "Stripe API", "Agile"],
    });
    resumes.push(startupFocus);

    const enterprise = await Resume.create({
      user: demoUser._id,
      name: "Full Stack - Enterprise",
      parent: fullStack._id,
      root: rootA._id,
      summary: "Enterprise-focused full-stack developer experienced with large-scale systems",
      experience: [
        {
          company: companies[4]._id,
          title: "Senior Full Stack Developer",
          startDate: new Date("2022-01-15"),
          endDate: new Date("2025-12-31"),
          description: "Developed enterprise applications serving 100K+ users. Implemented security best practices and compliance requirements. Mentored junior developers.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      certifications: [
        {
          title: "AWS Certified Developer",
          year: 2024,
        },
        {
          title: "Azure Fundamentals",
          year: 2023,
        },
      ],
      skills: ["JavaScript", "Java", "React", "Spring Boot", "PostgreSQL", "AWS", "Azure", "Security"],
    });
    resumes.push(enterprise);

    const cloudInfra = await Resume.create({
      user: demoUser._id,
      name: "Backend - Cloud Infrastructure",
      parent: backend._id,
      root: rootA._id,
      summary: "Backend engineer specializing in cloud-native infrastructure and DevOps",
      experience: [
        {
          company: companies[2]._id,
          title: "Cloud Infrastructure Engineer",
          startDate: new Date("2022-01-01"),
          description: "Built and maintained cloud infrastructure on AWS. Implemented Infrastructure as Code. Optimized costs and performance.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      certifications: [
        {
          title: "AWS Solutions Architect",
          year: 2024,
        },
        {
          title: "Kubernetes Administrator",
          year: 2023,
        },
      ],
      skills: ["Node.js", "Python", "AWS", "Terraform", "Kubernetes", "Docker", "CloudFormation"],
    });
    resumes.push(cloudInfra);

    // 4th generation
    const fintechStartup = await Resume.create({
      user: demoUser._id,
      name: "Full Stack Startup - Fintech",
      parent: startupFocus._id,
      root: rootA._id,
      summary: "Full-stack engineer specializing in fintech and payment systems",
      experience: [
        {
          company: companies[9]._id,
          title: "Senior Full Stack Engineer",
          startDate: new Date("2024-01-01"),
          endDate: new Date("2025-12-31"),
          description: "Built payment processing systems. Integrated with multiple financial APIs. Ensured PCI compliance.",
        },
        {
          company: companies[3]._id,
          title: "Full Stack Engineer",
          startDate: new Date("2023-03-01"),
          endDate: new Date("2023-12-31"),
          description: "Developed web applications in fast-paced startup environment.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["JavaScript", "Node.js", "React", "MongoDB", "Stripe", "Plaid API", "Security", "Compliance"],
    });
    resumes.push(fintechStartup);

    // TREE B: Frontend Developer - Heavy Iteration Branch (10+ versions)
    const frontendRoot = await Resume.create({
      user: demoUser._id,
      name: "Frontend Developer - React",
      parent: null,
      root: null,
      summary: "Frontend developer focused on React and modern web technologies",
      experience: [
        {
          company: companies[1]._id,
          title: "Frontend Developer",
          startDate: new Date("2021-03-01"),
          endDate: new Date("2025-11-30"),
          description: "Built responsive UI components. Improved page load times by 60%.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "Portfolio Website Builder",
          year: 2025,
          link: "https://github.com/demo/portfolio-builder",
          description: "React-based drag-and-drop portfolio builder",
        },
      ],
      skills: ["React", "JavaScript", "CSS", "HTML"],
    });
    resumes.push(frontendRoot);

    // Version 2
    const frontendV2 = await Resume.create({
      user: demoUser._id,
      name: "Frontend Developer - React (v2)",
      parent: frontendRoot._id,
      root: frontendRoot._id,
      summary: "Frontend developer focused on React and modern web technologies",
      experience: [
        {
          company: companies[1]._id,
          title: "Frontend Developer",
          startDate: new Date("2021-03-01"),
          endDate: new Date("2025-11-30"),
          description: "Built responsive UI components. Improved page load times by 60%. Mentored junior developers.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "Portfolio Website Builder",
          year: 2025,
          link: "https://github.com/demo/portfolio-builder",
          description: "React-based drag-and-drop portfolio builder",
        },
      ],
      skills: ["React", "JavaScript", "CSS", "HTML", "Webpack"],
    });
    resumes.push(frontendV2);

    // Version 3 - Added TypeScript
    const frontendTS = await Resume.create({
      user: demoUser._id,
      name: "Frontend Developer - React + TypeScript",
      parent: frontendV2._id,
      root: frontendRoot._id,
      summary: "Frontend developer specializing in React and TypeScript",
      experience: [
        {
          company: companies[1]._id,
          title: "Frontend Developer",
          startDate: new Date("2021-03-01"),
          endDate: new Date("2025-11-30"),
          description: "Built type-safe UI components with React and TypeScript. Improved page load times by 60%. Mentored junior developers.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "Portfolio Website Builder",
          year: 2025,
          link: "https://github.com/demo/portfolio-builder",
          description: "React and TypeScript drag-and-drop portfolio builder",
        },
      ],
      skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Webpack"],
    });
    resumes.push(frontendTS);

    // Version 4 - Added Testing
    const frontendTesting = await Resume.create({
      user: demoUser._id,
      name: "Frontend Developer - React + TS + Testing",
      parent: frontendTS._id,
      root: frontendRoot._id,
      summary: "Frontend developer specializing in React, TypeScript, and test-driven development",
      experience: [
        {
          company: companies[1]._id,
          title: "Frontend Developer",
          startDate: new Date("2021-03-01"),
          endDate: new Date("2025-11-30"),
          description: "Built type-safe UI components with comprehensive test coverage. Improved page load times by 60%. Implemented Jest and React Testing Library.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "Portfolio Website Builder",
          year: 2025,
          link: "https://github.com/demo/portfolio-builder",
          description: "React and TypeScript portfolio builder with 95% test coverage",
        },
      ],
      skills: ["React", "TypeScript", "JavaScript", "Jest", "React Testing Library", "CSS", "Webpack"],
    });
    resumes.push(frontendTesting);

    // Version 5 - Senior Level
    const frontendSenior = await Resume.create({
      user: demoUser._id,
      name: "Senior Frontend Developer - React",
      parent: frontendTesting._id,
      root: frontendRoot._id,
      summary: "Senior frontend developer with expertise in React, TypeScript, and team leadership",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Frontend Developer",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Led frontend team of 5 developers. Established testing standards and code review practices. Built type-safe UI components with comprehensive test coverage.",
        },
        {
          company: companies[6]._id,
          title: "Frontend Developer",
          startDate: new Date("2021-03-01"),
          endDate: new Date("2022-12-31"),
          description: "Developed responsive web applications using React and TypeScript.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["React", "TypeScript", "Jest", "React Testing Library", "Team Leadership", "Code Review", "Webpack"],
    });
    resumes.push(frontendSenior);

    // Version 6 - Design Systems
    const frontendDesign = await Resume.create({
      user: demoUser._id,
      name: "Frontend - React + Design Systems",
      parent: frontendSenior._id,
      root: frontendRoot._id,
      summary: "Senior frontend developer specializing in React and design system architecture",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Frontend Developer",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Built and maintained company-wide design system. Led frontend team of 5 developers. Ensured accessibility standards (WCAG 2.1 AA).",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "Component Library",
          year: 2025,
          link: "https://github.com/demo/design-system",
          description: "Comprehensive design system with 50+ reusable React components",
        },
      ],
      skills: ["React", "TypeScript", "Design Systems", "Storybook", "Figma", "Accessibility", "CSS-in-JS"],
    });
    resumes.push(frontendDesign);

    // Version 7 - Performance Focus
    const frontendPerf = await Resume.create({
      user: demoUser._id,
      name: "Frontend - React + Performance",
      parent: frontendDesign._id,
      root: frontendRoot._id,
      summary: "Senior frontend developer with expertise in React performance optimization",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Frontend Developer",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Optimized application performance, reducing load times by 70%. Built design system. Led frontend team. Implemented lazy loading and code splitting.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      certifications: [
        {
          title: "Web Performance Specialist",
          year: 2024,
        },
      ],
      skills: ["React", "TypeScript", "Performance Optimization", "Webpack", "Lighthouse", "Web Vitals", "Design Systems"],
    });
    resumes.push(frontendPerf);

    // Version 8 - Accessibility Expert
    const frontendA11y = await Resume.create({
      user: demoUser._id,
      name: "Frontend - React + Accessibility",
      parent: frontendPerf._id,
      root: frontendRoot._id,
      summary: "Senior frontend developer specializing in accessible React applications",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Frontend Developer - Accessibility Lead",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Led accessibility initiatives across the organization. Achieved WCAG 2.1 AAA compliance. Built inclusive design system. Conducted accessibility audits and training.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      certifications: [
        {
          title: "IAAP Certified Professional",
          year: 2024,
        },
      ],
      skills: ["React", "TypeScript", "Accessibility (a11y)", "WCAG 2.1", "ARIA", "Screen Readers", "Design Systems"],
    });
    resumes.push(frontendA11y);

    // Version 9 - Next.js Focus
    const frontendNextJS = await Resume.create({
      user: demoUser._id,
      name: "Frontend - React + Next.js",
      parent: frontendA11y._id,
      root: frontendRoot._id,
      summary: "Senior frontend developer specializing in Next.js and server-side rendering",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Frontend Developer",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Migrated application to Next.js, improving SEO and performance. Implemented server-side rendering and static generation. Led accessibility initiatives.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["React", "Next.js", "TypeScript", "Server-Side Rendering", "SEO", "Accessibility", "Vercel"],
    });
    resumes.push(frontendNextJS);

    // Version 10 - Full Stack Frontend
    const frontendFullStack = await Resume.create({
      user: demoUser._id,
      name: "Frontend - Full Stack Capable",
      parent: frontendNextJS._id,
      root: frontendRoot._id,
      summary: "Senior full-stack developer with frontend specialization in React and Next.js",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Full Stack Developer (Frontend Focus)",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Built full-stack applications with Next.js and Node.js. Implemented API routes and database integrations. Led frontend and accessibility initiatives.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      skills: ["React", "Next.js", "TypeScript", "Node.js", "API Development", "PostgreSQL", "Prisma"],
    });
    resumes.push(frontendFullStack);

    // Version 11 - GraphQL Integration
    const frontendGraphQL = await Resume.create({
      user: demoUser._id,
      name: "Frontend - React + GraphQL",
      parent: frontendFullStack._id,
      root: frontendRoot._id,
      summary: "Senior full-stack developer specializing in React, Next.js, and GraphQL",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Full Stack Developer",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Architected GraphQL APIs and integrated with React frontend. Built type-safe full-stack applications. Optimized query performance and caching strategies.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "GraphQL API Platform",
          year: 2025,
          link: "https://github.com/demo/graphql-platform",
          description: "Full-stack application with GraphQL, Next.js, and PostgreSQL",
        },
      ],
      skills: ["React", "Next.js", "TypeScript", "GraphQL", "Apollo Client", "Node.js", "PostgreSQL"],
    });
    resumes.push(frontendGraphQL);

    // Version 12 - React Native
    const frontendMobile = await Resume.create({
      user: demoUser._id,
      name: "Frontend - React + React Native",
      parent: frontendGraphQL._id,
      root: frontendRoot._id,
      summary: "Senior developer specializing in React web and React Native mobile applications",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Full Stack Developer",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Built cross-platform applications with React and React Native. Shared code between web and mobile. Implemented GraphQL APIs and optimized performance.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "Mobile App Platform",
          year: 2025,
          description: "Cross-platform mobile app with React Native and Expo",
        },
      ],
      skills: ["React", "React Native", "TypeScript", "Next.js", "GraphQL", "Expo", "iOS", "Android"],
    });
    resumes.push(frontendMobile);

    // Version 13 - Web3/Blockchain
    const frontendWeb3 = await Resume.create({
      user: demoUser._id,
      name: "Frontend - React + Web3",
      parent: frontendMobile._id,
      root: frontendRoot._id,
      summary: "Senior developer specializing in React and Web3/blockchain applications",
      experience: [
        {
          company: companies[1]._id,
          title: "Senior Full Stack Developer",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2025-11-30"),
          description: "Built decentralized applications (dApps) with React and Web3. Integrated with Ethereum smart contracts. Implemented wallet connections and blockchain interactions.",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          school: "State University",
          year: 2020,
        },
      ],
      projects: [
        {
          title: "NFT Marketplace",
          year: 2025,
          link: "https://github.com/demo/nft-marketplace",
          description: "Decentralized NFT marketplace built with React, Web3, and Solidity",
        },
      ],
      skills: ["React", "TypeScript", "Web3.js", "Ethers.js", "Solidity", "MetaMask", "Ethereum"],
    });
    resumes.push(frontendWeb3);

    console.log(`Created ${resumes.length} resumes (including versioning hierarchy)`);

    // Create cover letters (8+)
    const coverLetters = await CoverLetter.insertMany([
      {
        user: demoUser._id,
        name: "Generic Tech Cover Letter",
        body: "Dear Hiring Manager,\n\nI am writing to express my strong interest in joining your team. With over 5 years of experience in software development, I have developed a robust skill set that aligns well with your requirements.\n\nBest regards,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "Startup Focus Cover Letter",
        body: "Dear Hiring Team,\n\nI'm excited about the opportunity to join a fast-paced startup environment. My experience building MVPs and wearing multiple hats makes me well-suited for this role.\n\nLooking forward to connecting,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "Enterprise Cover Letter",
        body: "Dear Hiring Manager,\n\nI am interested in bringing my enterprise software experience to your organization. I have worked with large-scale systems serving thousands of users and understand the importance of security and compliance.\n\nSincerely,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "Backend Engineering Focus",
        body: "Dear Engineering Manager,\n\nAs a backend engineer with expertise in API development and microservices, I am thrilled about the opportunity to contribute to your infrastructure team.\n\nBest regards,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "Frontend Specialist",
        body: "Dear Hiring Team,\n\nI specialize in building beautiful, accessible, and performant user interfaces with React. I would love to bring my frontend expertise to your team.\n\nThank you for your consideration,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "DevOps Role",
        body: "Dear Hiring Manager,\n\nMy experience with cloud infrastructure, Kubernetes, and CI/CD pipelines has prepared me well for this DevOps role. I'm passionate about automation and reliability.\n\nBest,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "Fintech Application",
        body: "Dear Hiring Team,\n\nI am particularly interested in fintech and have experience building payment systems and ensuring compliance with financial regulations.\n\nLooking forward to hearing from you,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "Remote Position",
        body: "Dear Hiring Manager,\n\nAs someone who thrives in remote environments, I am excited about this opportunity. I have excellent communication skills and experience collaborating with distributed teams.\n\nBest regards,\nDemo User",
      },
      {
        user: demoUser._id,
        name: "Healthcare Tech",
        body: "Dear Hiring Team,\n\nI am passionate about using technology to improve healthcare outcomes. My technical skills combined with an interest in health tech make me a great fit.\n\nSincerely,\nDemo User",
      },
    ]);
    console.log(`Created ${coverLetters.length} cover letters`);

    // Create job applications (20+) spread over 6 months
    const jobApps = await JobApp.insertMany([
      {
        user: demoUser._id,
        company: companies[0]._id,
        resume: resumes[1]._id, // Full Stack
        title: "Senior Full Stack Developer",
        status: "Interviewing",
        priority: "High",
        source: "LinkedIn",
        appliedAt: new Date("2026-01-10"),
        url: "https://techcorp.example.com/careers/senior-fullstack",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        resume: resumes[1]._id,
        title: "Software Engineer III",
        status: "Applied",
        priority: "Medium",
        source: "Company Site",
        appliedAt: new Date("2026-01-15"),
        url: "https://dataflow.example.com/jobs/se3",
      },
      {
        user: demoUser._id,
        company: companies[2]._id,
        resume: resumes[2]._id, // Backend
        title: "Backend Engineer",
        status: "Offer",
        priority: "High",
        source: "Networking",
        appliedAt: new Date("2025-12-20"),
        url: "https://cloudnine.example.com/careers/backend-eng",
      },
      {
        user: demoUser._id,
        company: companies[3]._id,
        resume: resumes[10]._id, // Frontend version
        title: "Frontend Developer",
        status: "Rejected",
        priority: "Low",
        source: "Indeed",
        appliedAt: new Date("2025-12-05"),
        archived: true,
      },
      {
        user: demoUser._id,
        company: companies[4]._id,
        resume: resumes[1]._id,
        title: "Technology Consultant",
        status: "Applied",
        priority: "Medium",
        source: "LinkedIn",
        appliedAt: new Date("2026-01-18"),
        url: "https://globalent.example.com/careers/tech-consultant",
      },
      {
        user: demoUser._id,
        company: companies[5]._id,
        resume: resumes[2]._id,
        title: "Machine Learning Engineer",
        status: "Applied",
        priority: "High",
        source: "Referral",
        appliedAt: new Date("2025-11-15"),
      },
      {
        user: demoUser._id,
        company: companies[6]._id,
        resume: resumes[12]._id, // Frontend Design
        title: "Senior Frontend Engineer",
        status: "Interviewing",
        priority: "High",
        source: "Recruiter",
        appliedAt: new Date("2026-01-20"),
      },
      {
        user: demoUser._id,
        company: companies[7]._id,
        resume: resumes[5]._id, // Cloud Infra
        title: "DevOps Engineer",
        status: "Applied",
        priority: "Medium",
        source: "LinkedIn",
        appliedAt: new Date("2026-01-05"),
      },
      {
        user: demoUser._id,
        company: companies[8]._id,
        resume: resumes[1]._id,
        title: "Remote Full Stack Developer",
        status: "Interviewing",
        priority: "High",
        source: "Company Site",
        appliedAt: new Date("2025-12-28"),
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        resume: resumes[6]._id, // Fintech
        title: "Fintech Software Engineer",
        status: "Applied",
        priority: "Medium",
        source: "LinkedIn",
        appliedAt: new Date("2025-11-20"),
      },
      {
        user: demoUser._id,
        company: companies[10]._id,
        resume: resumes[1]._id,
        title: "Healthcare Software Developer",
        status: "Rejected",
        priority: "Low",
        source: "Indeed",
        appliedAt: new Date("2025-10-15"),
        archived: true,
      },
      {
        user: demoUser._id,
        company: companies[11]._id,
        resume: resumes[14]._id, // Frontend Next.js
        title: "Next.js Developer",
        status: "Applied",
        priority: "Medium",
        source: "Company Site",
        appliedAt: new Date("2025-12-10"),
      },
      {
        user: demoUser._id,
        company: companies[12]._id,
        resume: resumes[1]._id,
        title: "Full Stack Engineer - Sustainability Tech",
        status: "Applied",
        priority: "Low",
        source: "Networking",
        appliedAt: new Date("2025-09-25"),
      },
      {
        user: demoUser._id,
        company: companies[13]._id,
        resume: resumes[2]._id,
        title: "Quantum Software Researcher",
        status: "Rejected",
        priority: "Medium",
        source: "Company Site",
        appliedAt: new Date("2025-10-05"),
        archived: true,
      },
      {
        user: demoUser._id,
        company: companies[14]._id,
        resume: resumes[17]._id, // Frontend GraphQL
        title: "Frontend Engineer - GraphQL",
        status: "Interviewing",
        priority: "High",
        source: "Referral",
        appliedAt: new Date("2026-01-22"),
      },
      {
        user: demoUser._id,
        company: companies[15]._id,
        resume: resumes[1]._id,
        title: "Game Developer - Backend",
        status: "Applied",
        priority: "Low",
        source: "Indeed",
        appliedAt: new Date("2025-11-01"),
      },
      {
        user: demoUser._id,
        company: companies[0]._id,
        resume: resumes[5]._id,
        title: "Cloud Architect",
        status: "Applied",
        priority: "High",
        source: "LinkedIn",
        appliedAt: new Date("2025-12-15"),
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        resume: resumes[18]._id, // React Native
        title: "Mobile Developer - React Native",
        status: "Interviewing",
        priority: "Medium",
        source: "Recruiter",
        appliedAt: new Date("2026-01-25"),
      },
      {
        user: demoUser._id,
        company: companies[6]._id,
        resume: resumes[13]._id, // Accessibility
        title: "Accessibility Engineer",
        status: "Applied",
        priority: "Medium",
        source: "Company Site",
        appliedAt: new Date("2025-11-28"),
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        resume: resumes[19]._id, // Web3
        title: "Web3 Frontend Developer",
        status: "Applied",
        priority: "High",
        source: "Networking",
        appliedAt: new Date("2026-01-28"),
      },
      {
        user: demoUser._id,
        company: companies[3]._id,
        resume: resumes[3]._id, // Startup Focus
        title: "Full Stack Engineer - Early Stage",
        status: "Offer",
        priority: "High",
        source: "Referral",
        appliedAt: new Date("2025-12-01"),
      },
      {
        user: demoUser._id,
        company: companies[4]._id,
        resume: resumes[4]._id, // Enterprise
        title: "Enterprise Solutions Architect",
        status: "Withdrawn",
        priority: "Low",
        source: "LinkedIn",
        appliedAt: new Date("2025-08-15"),
        archived: true,
      },
      {
        user: demoUser._id,
        company: companies[7]._id,
        resume: resumes[2]._id,
        title: "Site Reliability Engineer",
        status: "Accepted",
        priority: "High",
        source: "Recruiter",
        appliedAt: new Date("2025-11-10"),
      },
    ]);
    console.log(`Created ${jobApps.length} job applications`);

    // Create tasks (15+) with varied due dates
    const tasks = await Task.insertMany([
      {
        user: demoUser._id,
        company: companies[0]._id,
        jobApp: jobApps[0]._id,
        title: "Prepare for technical interview",
        description: "Review system design concepts and practice coding problems",
        startAt: new Date("2026-02-05"),
        priority: "High",
        dueDate: new Date("2026-02-08"),
        state: "Planned",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        jobApp: jobApps[1]._id,
        title: "Follow up with recruiter",
        description: "Send email to check on application status",
        startAt: new Date("2026-02-03"),
        priority: "Medium",
        dueDate: new Date("2026-02-05"),
        state: "Planned",
      },
      {
        user: demoUser._id,
        company: companies[2]._id,
        jobApp: jobApps[2]._id,
        title: "Review offer details",
        description: "Compare compensation package with other offers",
        startAt: new Date("2026-01-25"),
        priority: "High",
        dueDate: new Date("2026-01-30"),
        state: "Done",
      },
      {
        user: demoUser._id,
        company: companies[6]._id,
        jobApp: jobApps[6]._id,
        title: "Research company culture",
        description: "Read Glassdoor reviews and talk to current employees",
        startAt: new Date("2026-01-15"),
        priority: "Medium",
        dueDate: new Date("2026-01-20"),
        state: "Done",
      },
      {
        user: demoUser._id,
        company: companies[8]._id,
        jobApp: jobApps[8]._id,
        title: "Prepare questions for hiring manager",
        description: "Create list of questions about team structure and projects",
        startAt: new Date("2026-02-01"),
        priority: "Medium",
        dueDate: new Date("2026-02-04"),
        state: "Planned",
      },
      {
        user: demoUser._id,
        company: companies[14]._id,
        jobApp: jobApps[14]._id,
        title: "Study GraphQL best practices",
        description: "Review Apollo documentation and common patterns",
        startAt: new Date("2026-01-28"),
        priority: "High",
        dueDate: new Date("2026-02-02"),
        state: "Planned",
      },
      {
        user: demoUser._id,
        company: companies[0]._id,
        title: "Update LinkedIn profile",
        description: "Add recent projects and certifications",
        startAt: new Date("2026-01-10"),
        priority: "Low",
        dueDate: new Date("2026-01-15"),
        state: "Done",
      },
      {
        user: demoUser._id,
        company: companies[5]._id,
        jobApp: jobApps[5]._id,
        title: "Learn ML fundamentals",
        description: "Complete online course on machine learning basics",
        startAt: new Date("2026-01-05"),
        priority: "Medium",
        dueDate: new Date("2026-01-25"),
        state: "Canceled",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        jobApp: jobApps[17]._id,
        title: "Build React Native demo",
        description: "Create small app to demonstrate mobile development skills",
        startAt: new Date("2026-01-20"),
        priority: "High",
        dueDate: new Date("2026-01-28"),
        state: "Done",
      },
      {
        user: demoUser._id,
        company: companies[3]._id,
        jobApp: jobApps[20]._id,
        title: "Negotiate offer",
        description: "Discuss salary and equity package",
        startAt: new Date("2025-12-05"),
        priority: "High",
        dueDate: new Date("2025-12-10"),
        state: "Done",
      },
      {
        user: demoUser._id,
        title: "Attend networking event",
        description: "Local tech meetup on February 10th",
        startAt: new Date("2026-02-10"),
        priority: "Low",
        dueDate: new Date("2026-02-10"),
        state: "Planned",
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        title: "Research Web3 trends",
        description: "Stay updated on blockchain and crypto developments",
        startAt: new Date("2026-02-15"),
        priority: "Low",
        dueDate: new Date("2026-03-01"),
        state: "Planned",
      },
      {
        user: demoUser._id,
        company: companies[11]._id,
        jobApp: jobApps[11]._id,
        title: "Complete take-home assignment",
        description: "Build Next.js application as requested",
        startAt: new Date("2025-12-12"),
        priority: "High",
        dueDate: new Date("2025-12-15"),
        state: "Done",
      },
      {
        user: demoUser._id,
        title: "Update GitHub portfolio",
        description: "Pin best projects and write better READMEs",
        startAt: new Date("2026-01-01"),
        priority: "Medium",
        dueDate: new Date("2026-01-08"),
        state: "Done",
      },
      {
        user: demoUser._id,
        company: companies[7]._id,
        jobApp: jobApps[7]._id,
        title: "Study Kubernetes for interview",
        description: "Review K8s concepts and practice kubectl commands",
        startAt: new Date("2026-01-08"),
        priority: "High",
        dueDate: new Date("2026-01-12"),
        state: "Done",
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        jobApp: jobApps[19]._id,
        title: "Review smart contract code",
        description: "Examine company's open source Solidity contracts",
        startAt: new Date("2026-02-01"),
        priority: "Medium",
        dueDate: new Date("2026-02-06"),
        state: "Planned",
      },
    ]);
    console.log(`Created ${tasks.length} tasks`);

    // Create emails (10+)
    const emails = await Email.insertMany([
      {
        user: demoUser._id,
        company: companies[0]._id,
        jobApp: jobApps[0]._id,
        title: "Thank you email after interview",
        subject: "Thank you for the opportunity",
        recipient: "hiring@techcorp.example.com",
        startAt: new Date("2026-01-12"),
        state: "Done",
        description: "Sent thank you note to hiring manager",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        jobApp: jobApps[1]._id,
        title: "Application follow-up",
        subject: "Following up on Software Engineer III position",
        recipient: "recruiter@dataflow.example.com",
        startAt: new Date("2026-01-22"),
        state: "Done",
        description: "Checked status of application",
      },
      {
        user: demoUser._id,
        company: companies[2]._id,
        jobApp: jobApps[2]._id,
        title: "Offer acceptance",
        subject: "Accepting Backend Engineer offer",
        recipient: "hr@cloudnine.example.com",
        startAt: new Date("2026-01-28"),
        state: "Done",
        description: "Officially accepted the offer",
      },
      {
        user: demoUser._id,
        company: companies[6]._id,
        jobApp: jobApps[6]._id,
        title: "Request for additional information",
        subject: "Questions about team and role",
        recipient: "engineering@webscale.example.com",
        startAt: new Date("2026-01-24"),
        state: "Done",
        description: "Asked about day-to-day responsibilities",
      },
      {
        user: demoUser._id,
        company: companies[8]._id,
        jobApp: jobApps[8]._id,
        title: "Interview scheduling",
        subject: "RE: Interview availability",
        recipient: "talent@remotefirst.example.com",
        startAt: new Date("2026-01-02"),
        state: "Done",
        description: "Confirmed interview time slot",
      },
      {
        user: demoUser._id,
        company: companies[14]._id,
        jobApp: jobApps[14]._id,
        title: "Post-interview thank you",
        subject: "Thank you for the great conversation",
        recipient: "team@socialconnect.example.com",
        ccRecipients: ["interviewer1@socialconnect.example.com", "interviewer2@socialconnect.example.com"],
        startAt: new Date("2026-01-26"),
        state: "Done",
        description: "Thanked panel interviewers",
      },
      {
        user: demoUser._id,
        company: companies[5]._id,
        title: "Networking introduction",
        subject: "Introduction from mutual connection",
        recipient: "engineer@innovatelabs.example.com",
        startAt: new Date("2025-11-18"),
        state: "Done",
        description: "Reached out for informational interview",
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        jobApp: jobApps[9]._id,
        title: "Salary negotiation",
        subject: "Discussing compensation package",
        recipient: "hiring@fintechventures.example.com",
        startAt: new Date("2025-11-25"),
        state: "Done",
        description: "Negotiated base salary and equity",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        jobApp: jobApps[17]._id,
        title: "Portfolio submission",
        subject: "Mobile development portfolio",
        recipient: "jobs@dataflow.example.com",
        attachments: ["portfolio.pdf", "demo-app.apk"],
        startAt: new Date("2026-01-27"),
        state: "Done",
        description: "Sent mobile app samples",
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        jobApp: jobApps[19]._id,
        title: "Technical questions",
        subject: "Questions about Web3 stack",
        recipient: "dev@fintechventures.example.com",
        startAt: new Date("2026-01-30"),
        state: "Planned",
        description: "Asking about blockchain infrastructure",
      },
      {
        user: demoUser._id,
        company: companies[11]._id,
        jobApp: jobApps[11]._id,
        title: "Take-home assignment submission",
        subject: "Completed Next.js coding challenge",
        recipient: "hiring@eduplatform.example.com",
        attachments: ["coding-challenge.zip"],
        startAt: new Date("2025-12-15"),
        state: "Done",
        description: "Submitted take-home project",
      },
    ]);
    console.log(`Created ${emails.length} emails`);

    // Create calls (8+)
    const calls = await Call.insertMany([
      {
        user: demoUser._id,
        company: companies[0]._id,
        jobApp: jobApps[0]._id,
        title: "Recruiter phone screen",
        phoneNumber: "+1-555-0100",
        duration: 30,
        outcome: "Moving to technical interview",
        startAt: new Date("2026-01-11"),
        state: "Done",
        description: "Initial screening call with recruiter",
      },
      {
        user: demoUser._id,
        company: companies[6]._id,
        jobApp: jobApps[6]._id,
        title: "Hiring manager call",
        phoneNumber: "+1-555-0106",
        duration: 45,
        outcome: "Discussed role and team dynamics",
        startAt: new Date("2026-01-23"),
        state: "Done",
        description: "Call with engineering manager",
      },
      {
        user: demoUser._id,
        company: companies[8]._id,
        jobApp: jobApps[8]._id,
        title: "Technical phone interview",
        phoneNumber: "+1-555-0108",
        duration: 60,
        outcome: "Solved coding problems successfully",
        startAt: new Date("2026-01-03"),
        state: "Done",
        description: "Live coding session",
      },
      {
        user: demoUser._id,
        company: companies[2]._id,
        jobApp: jobApps[2]._id,
        title: "Offer discussion",
        phoneNumber: "+1-555-0102",
        duration: 25,
        outcome: "Accepted offer verbally",
        startAt: new Date("2026-01-26"),
        state: "Done",
        description: "Discussed offer details",
      },
      {
        user: demoUser._id,
        company: companies[14]._id,
        jobApp: jobApps[14]._id,
        title: "Recruiter introduction",
        phoneNumber: "+1-555-0114",
        duration: 20,
        outcome: "Scheduled onsite interview",
        startAt: new Date("2026-01-24"),
        state: "Done",
        description: "Initial call about the position",
      },
      {
        user: demoUser._id,
        company: companies[5]._id,
        title: "Networking call",
        phoneNumber: "+1-555-0105",
        duration: 35,
        outcome: "Got referral for open position",
        startAt: new Date("2025-11-20"),
        state: "Done",
        description: "Informational interview with engineer",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        jobApp: jobApps[17]._id,
        title: "Culture fit interview",
        phoneNumber: "+1-555-0117",
        duration: 40,
        outcome: "Great conversation about values",
        startAt: new Date("2026-01-29"),
        state: "Done",
        description: "Call with team lead",
      },
      {
        user: demoUser._id,
        company: companies[3]._id,
        jobApp: jobApps[20]._id,
        title: "Founder call",
        phoneNumber: "+1-555-0103",
        duration: 50,
        outcome: "Discussed vision and received offer",
        startAt: new Date("2025-12-03"),
        state: "Done",
        description: "Call with startup founder",
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        jobApp: jobApps[9]._id,
        title: "Technical screening",
        phoneNumber: "+1-555-0109",
        duration: 30,
        outcome: "Waiting for feedback",
        startAt: new Date("2025-11-23"),
        state: "Done",
        description: "Phone screen with senior engineer",
      },
    ]);
    console.log(`Created ${calls.length} calls`);

    // Create interviews (6+)
    const interviews = await Interview.insertMany([
      {
        user: demoUser._id,
        company: companies[0]._id,
        jobApp: jobApps[0]._id,
        title: "Technical onsite interview",
        interviewers: ["Jane Smith (Tech Lead)", "Bob Chen (Senior Engineer)"],
        interviewType: "Onsite",
        startAt: new Date("2026-02-08"),
        endAt: new Date("2026-02-08T16:00:00"),
        state: "Planned",
        description: "System design and coding rounds",
      },
      {
        user: demoUser._id,
        company: companies[6]._id,
        jobApp: jobApps[6]._id,
        title: "Frontend technical interview",
        interviewers: ["Sarah Johnson (Engineering Manager)", "Mike Davis (Frontend Lead)"],
        interviewType: "Video",
        startAt: new Date("2026-02-03"),
        endAt: new Date("2026-02-03T15:00:00"),
        state: "Planned",
        description: "React and design system discussion",
      },
      {
        user: demoUser._id,
        company: companies[8]._id,
        jobApp: jobApps[8]._id,
        title: "Remote team interview",
        interviewers: ["Alex Wong", "Chris Taylor", "Emily Rodriguez"],
        interviewType: "Video",
        startAt: new Date("2026-01-05"),
        state: "Done",
        description: "Met with distributed team members",
        notes: "Great team chemistry",
      },
      {
        user: demoUser._id,
        company: companies[14]._id,
        jobApp: jobApps[14]._id,
        title: "GraphQL architecture interview",
        interviewers: ["David Lee (CTO)", "Lisa Park (Backend Lead)"],
        interviewType: "Video",
        startAt: new Date("2026-02-05"),
        state: "Planned",
        description: "Deep dive on GraphQL implementation",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        jobApp: jobApps[17]._id,
        title: "Mobile development interview",
        interviewers: ["Tom Anderson (Mobile Lead)"],
        interviewType: "Phone",
        startAt: new Date("2026-01-30"),
        state: "Done",
        description: "Discussed React Native experience",
      },
      {
        user: demoUser._id,
        company: companies[2]._id,
        jobApp: jobApps[2]._id,
        title: "Final round interviews",
        interviewers: ["Engineering VP", "Product Manager", "Team Members"],
        interviewType: "Onsite",
        startAt: new Date("2026-01-18"),
        state: "Done",
        description: "Full day of interviews",
        notes: "Received offer next day",
      },
      {
        user: demoUser._id,
        company: companies[3]._id,
        jobApp: jobApps[20]._id,
        title: "Startup team interview",
        interviewers: ["Founder", "Lead Engineer"],
        interviewType: "Video",
        startAt: new Date("2025-12-04"),
        state: "Done",
        description: "Discussed startup vision and technical challenges",
      },
    ]);
    console.log(`Created ${interviews.length} interviews`);

    // Create meetings (5+)
    const meetings = await Meeting.insertMany([
      {
        user: demoUser._id,
        company: companies[5]._id,
        title: "Coffee chat with engineer",
        attendees: ["John from Innovate Labs"],
        meetingType: "Coffee Chat",
        startAt: new Date("2025-11-21"),
        state: "Done",
        description: "Informal chat about company culture",
        notes: "Very positive impression",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        title: "Informational interview",
        attendees: ["Sarah (Senior Engineer)"],
        meetingType: "Info Interview",
        startAt: new Date("2025-12-12"),
        state: "Done",
        description: "Learned about the team and projects",
      },
      {
        user: demoUser._id,
        company: companies[7]._id,
        title: "DevOps community meetup",
        attendees: ["Various DevOps engineers"],
        meetingType: "Networking Event",
        startAt: new Date("2025-11-05"),
        state: "Done",
        description: "Kubernetes and infrastructure talk",
      },
      {
        user: demoUser._id,
        company: companies[14]._id,
        title: "Coffee with team lead",
        attendees: ["David Lee"],
        meetingType: "Coffee Chat",
        startAt: new Date("2026-01-27"),
        state: "Done",
        description: "Discussed GraphQL architecture",
      },
      {
        user: demoUser._id,
        title: "React conference networking",
        attendees: ["Various React developers"],
        meetingType: "Networking Event",
        startAt: new Date("2025-10-20"),
        state: "Done",
        description: "Met developers from various companies",
      },
      {
        user: demoUser._id,
        company: companies[9]._id,
        title: "FinTech meetup",
        attendees: ["FinTech professionals"],
        meetingType: "Networking Event",
        startAt: new Date("2025-11-30"),
        state: "Done",
        description: "Industry event about blockchain and payments",
      },
    ]);
    console.log(`Created ${meetings.length} meetings`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nSummary:");
    console.log(`- Users: 1 (demo user)`);
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Resumes: ${resumes.length} (including versioning hierarchy)`);
    console.log(`- Cover Letters: ${coverLetters.length}`);
    console.log(`- Job Applications: ${jobApps.length}`);
    console.log(`- Tasks: ${tasks.length}`);
    console.log(`- Emails: ${emails.length}`);
    console.log(`- Calls: ${calls.length}`);
    console.log(`- Interviews: ${interviews.length}`);
    console.log(`- Meetings: ${meetings.length}`);
    console.log(`\nResume versioning hierarchy:`);
    console.log(`- Tree A: Software Engineer (7 versions across 4 generations)`);
    console.log(`- Tree B: Frontend Developer (13 versions - heavily iterated)`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
};

seedDatabase();
