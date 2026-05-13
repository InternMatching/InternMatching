export const TECH_SKILLS: string[] = [
    "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Ruby",
    "PHP", "Kotlin", "Swift", "Dart", "R", "Scala", "Elixir", "Lua", "Perl", "Bash",
    "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "Styled Components",
    "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SolidJS", "Remix", "Astro",
    "Redux", "Zustand", "Recoil", "React Query", "Apollo Client",
    "Node.js", "Express", "NestJS", "Fastify", "Apollo GraphQL", "Apollo Server",
    "Django", "Flask", "FastAPI", "Spring Boot", "Ruby on Rails", "Laravel", "ASP.NET",
    "React Native", "Flutter", "Expo", "Android", "iOS", "SwiftUI", "Jetpack Compose",
    "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase", "Supabase",
    "DynamoDB", "Elasticsearch", "Prisma", "Mongoose", "TypeORM", "Drizzle",
    "REST API", "GraphQL", "gRPC", "WebSocket", "tRPC",
    "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure", "Vercel", "Netlify",
    "Heroku", "Cloudflare", "Nginx", "CI/CD", "GitHub Actions", "Jenkins", "Terraform",
    "Git", "GitHub", "GitLab", "Bitbucket", "Linux", "VS Code", "Postman", "Vim",
    "Jest", "Vitest", "Cypress", "Playwright", "Mocha", "Selenium",
    "Unit test", "Integration test", "e2e test",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas",
    "NumPy", "Scikit-learn", "OpenAI API", "LangChain", "Hugging Face", "Anthropic API",
    "SQL", "NoSQL", "Webpack", "Vite", "Babel", "ESLint", "Prettier",
    "Figma", "Adobe XD", "Photoshop", "Illustrator", "Sketch",
    "UI/UX", "Wireframing", "Prototyping", "Design Systems",
    "Algorithms", "Data Structures", "OOP", "Functional Programming",
    "Agile", "Scrum", "Kanban",
]

export function filterTechSkills(query: string, exclude: string[]): string[] {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const excludeSet = new Set(exclude.map(s => s.toLowerCase()))
    return TECH_SKILLS
        .filter(s => s.toLowerCase().includes(q) && !excludeSet.has(s.toLowerCase()))
        .slice(0, 8)
}
