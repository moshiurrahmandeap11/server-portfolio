import { connectDB } from "../database/db.js";

const staticProjects = [
  {
    id: 1,
    title: "BookShelf",
    slug: "book-shelf",
    short_description:
      "BookShelf is a modern full-stack web application that revolutionizes the way people discover, purchase, and manage digital books.",
    description:
      "BookShelf is a modern full-stack web application that revolutionizes the way people discover, purchase, and manage digital books. The platform provides a seamless experience for readers, authors, and administrators with features including user authentication, book listings, shopping cart functionality, wishlist management, reviews and ratings system, AI-powered chatbot assistance, and comprehensive admin dashboard.",
    techStack: [
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "NodeMailer",
      "JWT",
      "GROQ SDK",
      "Firebase",
      "Tailwind CSS",
    ],
    features: [
      "User registration and secure JWT authentication",
      "Book browsing with advanced filters (category, price, search)",
      "Shopping cart and secure checkout process",
      "Personal wishlist and reading history",
      "Book reviews and star ratings system",
      "AI-powered chatbot for book recommendations",
      "Author dashboard for book management",
      "Admin panel for complete platform control",
      "Email notifications via Nodemailer",
      "Google social login integration",
      "Real-time chat history storage",
    ],
    challenges: [
      "Authentication & Authorization System",
      "Real-time AI Chatbot Integration",
      "Image Upload & Cloudinary Integration",
      "Shopping Cart & Wishlist Synchronization",
      "Responsive Admin Dashboard",
      "Email System with Nodemailer",
      "Database Schema Design",
      "Search & Filter Performance",
    ],
    learnings: [
      "Next.js App Router Mastery",
      "JWT Authentication Best Practices",
      "MongoDB Aggregation & Indexing",
      "Cloudinary Image Management",
      "AI Integration with Groq API",
      "Real-time UI Updates",
      "Error Handling & User Feedback",
      "Responsive Design Patterns",
    ],
    links: [
      { name: "Live Demo", url: "https://client-bookshelf.vercel.app/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/client-bookshelf" },
    ],
    screenshots: [
      "https://i.postimg.cc/tgyxgqPR/Screenshot-from-2026-04-28-19-42-08.png",
      "https://i.postimg.cc/fLPyYD3G/Screenshot-from-2026-04-28-19-42-15.png",
      "https://i.postimg.cc/rwT1DN2q/Screenshot-from-2026-04-28-19-42-22.png",
      "https://i.postimg.cc/gc684TYd/Screenshot-from-2026-04-28-19-42-30.png",
      "https://i.postimg.cc/4yCKrXJC/Screenshot-from-2026-04-28-19-42-37.png",
      "https://i.postimg.cc/t4R10SHJ/Screenshot-from-2026-04-28-19-43-14.png",
      "https://i.postimg.cc/5Nbyv7jb/Screenshot-from-2026-04-28-19-43-28.png",
      "https://i.postimg.cc/pVYX2fCQ/Screenshot-from-2026-04-28-19-43-48.png",
      "https://i.postimg.cc/zvJNLQ7M/Screenshot-from-2026-04-28-19-43-56.png",
      "https://i.postimg.cc/Xq2RrYXR/Screenshot-from-2026-04-28-19-44-01.png",
      "https://i.postimg.cc/zvfMYY0r/Screenshot-from-2026-04-28-19-44-08.png",
      "https://i.postimg.cc/tJfr0Zsq/Screenshot-from-2026-04-28-19-44-14.png",
      "https://i.postimg.cc/wxPFjNB7/Screenshot-from-2026-04-28-19-44-22.png",
      "https://i.postimg.cc/yW4FXFgC/Screenshot-from-2026-04-28-19-44-30.png",
    ],
    order: 0,
  },
  {
    id: 2,
    title: "BD BOOK",
    slug: "bd-book",
    short_description:
      "A social media platform for Bangladeshi people to share their thoughts and ideas.",
    description:
      "BD BOOK is a social media platform designed specifically for Bangladeshi people to share their thoughts and ideas. It offers a wide range of features, including posting, commenting, liking, sharing, video calls, audio calls, meetings, and more. The platform is powered by AI and ML technologies, which enable it to provide personalized content recommendations and enhance user engagement through a sophisticated algorithm.",
    techStack: [
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
    ],
    features: [
      "Full stack social media platform",
      "AI and ML-powered content recommendation",
      "Real-time communication with video and audio calls",
      "User engagement algorithm",
      "Responsive design with Tailwind CSS",
      "Secure authentication and authorization",
      "Scalable architecture with Node.js and MongoDB",
      "and many more!",
    ],
    challenges: [
      "Implementing real-time communication features",
      "Designing a scalable architecture to handle a large user base",
      "Integrating AI and ML technologies for content recommendation",
      "Ensuring data security and privacy for users",
      "Creating a user-friendly interface with Tailwind CSS",
    ],
    learnings: [
      "Gained experience in full stack development with Next.js, Node.js, and MongoDB",
      "Learned how to implement real-time communication features using Socket.io",
      "Gained insights into AI and ML technologies for content recommendation",
      "Learned about data security and privacy best practices",
      "Improved skills in responsive design with Tailwind CSS",
    ],
    links: [
      { name: "Live Demo", url: "https://client-bdbook.vercel.app/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/client-bdbook" },
    ],
    screenshots: [
      "https://i.postimg.cc/ZKBnq0P9/Screenshot-2026-04-08-161518.png",
      "https://i.postimg.cc/1zP3MHkN/Screenshot-2026-04-08-161606.png",
      "https://i.postimg.cc/0N897NSy/Screenshot-2026-04-08-161616.png",
      "https://i.postimg.cc/0jJv9KgP/Screenshot-2026-04-08-161625.png",
      "https://i.postimg.cc/nVQMFCYy/Screenshot-2026-04-08-161639.png",
    ],
    order: 1,
  },
  {
    id: 3,
    title: "Career Crafter",
    slug: "career-crafter",
    short_description:
      "Career Crafter is a career guidance platform that helps individuals explore and plan their career paths.",
    description:
      "Career Crafter is an AI powered career guidance platform that helps individuals explore and plan their career paths. The platform offers a wide range of features, including personalized career assessments, job search tools, resume building, interview preparation, and more.",
    techStack: [
      "React.js",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
    ],
    features: [
      "AI Powered career guidance",
      "AI Assistant for career advice",
      "AI Quick job search",
      "AI tools for quick preparation",
      "Personalized career assessments",
      "Job search tools",
      "Resume building",
      "Interview preparation",
      "User-friendly interface",
      "Comprehensive resources",
      "and many more!",
    ],
    challenges: [
      "Designing a platform that provides accurate career guidance",
      "Creating a user-friendly interface that caters to diverse user needs",
      "Integrating various features seamlessly into a single platform",
    ],
    learnings: [
      "Gained experience in creating career guidance platforms",
      "Learned about the importance of personalized recommendations in career development",
      "Improved skills in building user-friendly interfaces with Next.js and Tailwind CSS",
    ],
    links: [
      { name: "Live Demo", url: "https://careercrafter5.web.app/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/careerCrafter-client.git" },
    ],
    screenshots: [
      "https://i.postimg.cc/Kv5dThPt/Screenshot-2026-04-08-170546.png",
      "https://i.postimg.cc/zDCMmYPR/Screenshot-2026-04-08-170557.png",
      "https://i.postimg.cc/x85tXYWW/Screenshot-2026-04-08-170645.png",
      "https://i.postimg.cc/Wbp5QFZD/Screenshot-2026-04-08-170702.png",
      "https://i.postimg.cc/13fJ3kJR/Screenshot-2026-04-08-170714.png",
      "https://i.postimg.cc/25WG4ns0/Screenshot-2026-04-08-170732.png",
      "https://i.postimg.cc/hjb0YcPz/Screenshot-2026-04-08-170747.png",
      "https://i.postimg.cc/SRgfyd9z/Screenshot-2026-04-08-170808.png",
      "https://i.postimg.cc/MpMmSypn/Screenshot-2026-04-08-170819.png",
    ],
    order: 2,
  },
  {
    id: 4,
    title: "Code Circle",
    slug: "code-circle",
    short_description:
      "Code Circle is a collaborative coding platform that allows developers to work together on coding projects in real-time.",
    description:
      "Code Circle is a collaborative coding platform that allows developers to work together on coding projects in real-time. The platform offers features such as code sharing, live collaboration, and integrated development tools.",
    techStack: [
      "React.js",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
    ],
    features: [
      "Real-time collaborative coding",
      "Code sharing",
      "Integrated development tools",
      "User-friendly interface",
      "Powerful collaboration capabilities",
    ],
    challenges: [
      "Designing a platform that facilitates seamless real-time collaboration",
      "Creating a user-friendly interface that caters to diverse user needs",
      "Integrating various development tools into a single platform",
    ],
    learnings: [
      "Gained experience in building collaborative coding platforms",
      "Learned about the importance of real-time features in developer tools",
      "Improved skills in creating user-friendly interfaces with React.js and Tailwind CSS",
    ],
    links: [
      { name: "Live Demo", url: "https://codecircle5.web.app/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/codeCircle-client" },
    ],
    screenshots: [
      "https://i.postimg.cc/zGb6cHmj/Screenshot-2026-04-08-171626.png",
      "https://i.postimg.cc/rmJPrS4G/Screenshot-2026-04-08-171652.png",
      "https://i.postimg.cc/j2SkQLQz/Screenshot-2026-04-08-171731.png",
      "https://i.postimg.cc/gcg7cHmw/Screenshot-2026-04-08-171747.png",
      "https://i.postimg.cc/52CK3cvq/Screenshot-2026-04-08-171800.png",
      "https://i.postimg.cc/0NGtTpV7/Screenshot-2026-04-08-171814.png",
      "https://i.postimg.cc/vTKXrXZ0/Screenshot-2026-04-08-171833.png",
    ],
    order: 3,
  },
  {
    id: 5,
    title: "Coursion",
    slug: "coursion",
    short_description:
      "Coursion is an online learning platform that offers a wide range of courses and resources for learners of all levels.",
    description:
      "Coursion is an online learning platform that offers a wide range of courses and resources for learners of all levels. The platform provides features such as personalized course recommendations, interactive learning materials, and a supportive community.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Personalized course recommendations",
      "Interactive learning materials",
      "Supportive community",
      "User-friendly interface",
      "Comprehensive course offerings",
    ],
    challenges: [
      "Designing a platform that provides personalized course recommendations",
      "Creating interactive learning materials that engage users",
      "Building a supportive community for learners",
    ],
    learnings: [
      "Gained experience in building online learning platforms",
      "Learned about the importance of personalized recommendations in education",
      "Improved skills in creating engaging learning materials with React.js and Tailwind CSS",
    ],
    links: [
      { name: "Live Demo", url: "https://coursion-9faf6.web.app/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/coursion-client" },
    ],
    screenshots: [
      "https://i.postimg.cc/J03ZnqBy/Screenshot-2026-04-08-172214.png",
      "https://i.postimg.cc/rwwxV5y6/Screenshot-2026-04-08-172229.png",
      "https://i.postimg.cc/25PZ7JQL/Screenshot-2026-04-08-172243.png",
      "https://i.postimg.cc/Hnm8fyPT/Screenshot-2026-04-08-172257.png",
      "https://i.postimg.cc/1R0qDvfP/Screenshot-2026-04-08-172308.png",
    ],
    order: 4,
  },
  {
    id: 6,
    title: "School and college management",
    slug: "school-college-management",
    short_description:
      "A school and college management system that helps educational institutions manage their operations efficiently.",
    description:
      "A school and college management system that helps educational institutions manage their operations efficiently. The platform offers features such as student enrollment, attendance tracking, grade management, and communication tools for teachers, students, and parents.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Student enrollment",
      "Attendance tracking",
      "Grade management",
      "Communication tools for teachers, students, and parents",
      "User-friendly interface",
      "Comprehensive features for educational institutions",
    ],
    challenges: [
      "Designing a platform that meets the needs of educational institutions",
      "Creating a user-friendly interface for diverse users",
      "Integrating various features seamlessly into a single platform",
    ],
    learnings: [
      "Gained experience in building management systems for educational institutions",
    ],
    links: [
      { name: "Live Demo", url: "https://school.moshiurrahman.online/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/schoolmanagement-client" },
    ],
    screenshots: [
      "https://i.postimg.cc/hPkRg11J/Screenshot-2026-04-08-172645.png",
      "https://i.postimg.cc/tJs8Gs1L/Screenshot-2026-04-08-172715.png",
      "https://i.postimg.cc/xTbBsbVR/Screenshot-2026-04-08-172738.png",
    ],
    order: 5,
  },
  {
    id: 7,
    title: "Netrakona Pressclub website",
    slug: "netrakona-pressclub-website",
    short_description:
      "Netrakona Pressclub website is a platform that provides news and information about Netrakona district.",
    description:
      "Netrakona Pressclub website is a platform that provides news and information about Netrakona district. The website offers features such as news articles, event updates, and a directory of local businesses and organizations.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    features: [
      "News articles about Netrakona district",
      "Event updates for the local community",
      "Directory of local businesses and organizations",
      "User-friendly interface",
      "Comprehensive content for residents and visitors",
    ],
    challenges: [
      "Designing a platform that effectively serves the local community",
      "Creating a user-friendly interface for diverse users",
      "Integrating various features seamlessly into a single platform",
    ],
    learnings: ["Gained experience in building websites for local communities"],
    links: [
      { name: "Live Demo", url: "https://pressclub-netrakona-client.vercel.app/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/pressclub-netrakona-client" },
    ],
    screenshots: [
      "https://i.postimg.cc/YSkZ81gr/Screenshot-2026-04-08-201538.png",
    ],
    order: 6,
  },
  {
    id: 8,
    title: "Service Provider",
    slug: "service-provider",
    short_description:
      "Service Provider is a platform that connects service providers with customers in need of their services.",
    description:
      "Service Provider is a platform that connects service providers with customers in need of their services. The platform offers features such as service listings, customer reviews, and a secure payment system.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Service listings for various types of services",
      "custom dashboard for service providers to manage their listings and interactions with customers",
      "Customer reviews and ratings",
      "Secure payment system for transactions",
      "User-friendly interface",
      "Comprehensive features for service providers and customers",
    ],
    challenges: [
      "Designing a platform that effectively connects service providers with customers",
      "Creating a user-friendly interface for diverse users",
      "Integrating various features seamlessly into a single platform",
    ],
    learnings: [
      "Gained experience in building platforms for service providers and customers",
    ],
    links: [
      { name: "Live Demo", url: "https://projuktisheba.moshiurrahman.online/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/projukti-sheba-client" },
    ],
    screenshots: [
      "https://i.postimg.cc/j5RWskfs/Screenshot-2026-04-08-202056.png",
      "https://i.postimg.cc/kX22XS2q/Screenshot-2026-04-08-202116.png",
      "https://i.postimg.cc/V64F1tdT/Screenshot-2026-04-08-202128.png",
      "https://i.postimg.cc/T14q5Xjr/Screenshot-2026-04-08-202139.png",
      "https://i.postimg.cc/TYBJRfY7/Screenshot-2026-04-08-202153.png",
      "https://i.postimg.cc/q7xsXKXT/Screenshot-2026-04-08-202208.png",
      "https://i.postimg.cc/4NHp2qbQ/Screenshot-2026-04-08-202220.png",
      "https://i.postimg.cc/HxLywhks/Screenshot-2026-04-08-202233.png",
    ],
    order: 7,
  },
  {
    id: 9,
    title: "Modern Personal Blog Website",
    slug: "modern-personal-blog-website",
    short_description:
      "Modern Personal Blog Website is a platform for individuals to share their thoughts and ideas through blog posts.",
    description:
      "Modern Personal Blog Website is a platform for individuals to share their thoughts and ideas through blog posts. The website offers features such as customizable themes, social media integration, and a user-friendly content management system.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Customizable themes for personalized blog appearance",
      "Social media integration for easy sharing of blog posts",
      "User-friendly content management system for creating and managing blog posts",
      "Responsive design for optimal viewing on various devices",
      "Comprehensive features for bloggers to engage with their audience",
    ],
    challenges: [
      "Designing a platform that allows for easy customization of blog themes",
      "Creating a user-friendly content management system for bloggers",
      "Integrating social media features seamlessly into the blogging platform",
    ],
    learnings: [
      "Gained experience in building blogging platforms with customizable themes",
      "Learned about the importance of social media integration in modern blogging",
      "Improved skills in creating user-friendly content management systems with React.js and Tailwind CSS",
    ],
    links: [
      { name: "Live Demo", url: "https://elmulforqaan.com/" },
      { name: "GitHub", url: "https://github.com/moshiurrahmandeap11/elmul-furqaan" },
    ],
    screenshots: [
      "https://i.postimg.cc/Gmr6xZZ2/Screenshot-2026-04-08-203318.png",
      "https://i.postimg.cc/GpgNr99M/Screenshot-2026-04-08-203330.png",
      "https://i.postimg.cc/dQyXPsF3/Screenshot-2026-04-08-203341.png",
      "https://i.postimg.cc/65VmqMy5/Screenshot-2026-04-08-203350.png",
      "https://i.postimg.cc/YS0nXk8t/Screenshot-2026-04-08-203359.png",
      "https://i.postimg.cc/MH29KBw7/Screenshot-2026-04-08-203420.png",
      "https://i.postimg.cc/bNRmpdBk/Screenshot-2026-04-08-203435.png",
    ],
    order: 8,
  },
  {
    id: 10,
    title: "Miverr - Freelance Marketplace",
    slug: "miverr-freelance-marketplace",
    short_description:
      "Miverr is a freelance marketplace that connects freelancers with clients looking for their services.",
    description:
      "Miverr is a freelance marketplace that connects freelancers with clients looking for their services. The platform offers features such as service listings, secure payment processing, and a review system for both freelancers and clients.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Service listings for various freelance services",
      "Secure payment processing for transactions between freelancers and clients",
      "Review system for both freelancers and clients to provide feedback",
      "User-friendly interface for easy navigation and interaction",
    ],
    challenges: [
      "Designing a platform that effectively connects freelancers with clients",
      "Creating a secure payment system for transactions",
      "Implementing a review system that fosters trust and accountability",
    ],
    learnings: [
      "Gained experience in building freelance marketplace platforms",
      "Learned about the importance of secure payment processing in online marketplaces",
      "Improved skills in creating user-friendly interfaces with React.js and Tailwind CSS",
    ],
    links: [
      { name: "Live Demo", url: "https://miverr-7ac31.web.app/" },
    ],
    screenshots: [
      "https://i.postimg.cc/rpY8bVkb/Screenshot-2026-04-08-203837.png",
      "https://i.postimg.cc/tR6XSGm8/Screenshot-2026-04-08-203907.png",
      "https://i.postimg.cc/pLsxhWpm/Screenshot-2026-04-08-203920.png",
    ],
    order: 9,
  },
];

async function migrate() {
  await connectDB();
  const projectsCollection = db.collection("projects");

  console.log(`Migrating ${staticProjects.length} projects...`);

  for (const project of staticProjects) {
    const existing = await projectsCollection.findOne({ slug: project.slug });
    if (!existing) {
      await projectsCollection.insertOne({
        ...project,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  Inserted: ${project.title}`);
    } else {
      console.log(`  Skipped (exists): ${project.title}`);
    }
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
