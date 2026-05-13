export const INDUSTRIES: string[] = [
    "IT", "Software Development", "Web Development", "Mobile Development",
    "AI / Machine Learning", "Cybersecurity", "Cloud Services", "SaaS",
    "Telecommunications", "Hardware", "Data & Analytics",
    "Design", "UI/UX", "Graphic Design", "Product Design",
    "Marketing", "Digital Marketing", "Advertising", "Branding", "PR",
    "Sales", "E-commerce", "Retail",
    "Finance", "Banking", "Fintech", "Insurance", "Accounting", "Investment",
    "Consulting", "Legal", "Human Resources", "Recruiting",
    "Education", "EdTech", "Research",
    "Healthcare", "Pharmaceuticals", "Biotech",
    "Manufacturing", "Construction", "Real Estate", "Architecture",
    "Mining", "Energy", "Renewable Energy",
    "Agriculture", "Food & Beverage",
    "Hospitality", "Tourism", "Transportation", "Logistics", "Automotive",
    "Media", "Publishing", "Entertainment", "Gaming", "Music", "Film",
    "Sports", "Fashion", "Beauty",
    "Non-profit", "Government",
]

export function filterIndustries(query: string): string[] {
    const q = query.trim().toLowerCase()
    if (!q) return INDUSTRIES.slice(0, 8)
    return INDUSTRIES
        .filter(i => i.toLowerCase().includes(q))
        .slice(0, 8)
}
