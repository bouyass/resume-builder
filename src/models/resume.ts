export type Resume = {
    personal: PersonalData,
    experience: Experience[],
    education: Education[],
    skills: SkillCategory[],
    projects: Project[],
    awards: Award[],
    hobbies: string[]
}

export type PersonalData = {
    fullName: string,
        title: string,
        age: number,
        photo: string,
        email: string,
        phone: string,
        location: string,
        about: string,
        website: string,
        linkedin: string,
        github: string
}


export type Experience = {
    title: string,
    company: string,
    location: string,
    startDate: string,
    endDate: string,
    description: string,
    current: boolean
}

export type Education = {
    institution: string,
    degree: string,
    startDate: string,
    endDate: string,
    gpa: string,
    description: string,
}

export type SkillCategory = {
    name: string,
    withLevel: boolean,
    skills: SkillItem[]
}

export type SkillItem = {
    name: string,
    level: string
}

export type Project = {
    title: string,
    role: string,
    description: string,
    link: string,
    url: string,
    technologies: string[]
}

export type Award = {
    title: string,
    date: string,
    issuer: string,
    expiryDate: string,
    description: string
}
