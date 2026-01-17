export interface Experience {
    title: string;
    company: string;
    period: string;
    description: string;
    tags?: string[];
    logo?: string;
    
}

export const personalInfo = {
    name: "sofia bodnar" ,
    tagline: "17 y/o highschool student" ,
    belief: {
        text: "we are entering the era of experience"
        link: { text: "experience" , url: "https://storage.googleapis.com/deepmind-media/Era-of-Experience%20/The%20Era%20of%20Experience%20Paper.pdf"}

    }
};

export const experiences: Experience[] = [

{
    title: "Machine Learning Research Intern",
    company: "sentra",
    period: "oct 2025 - current",
    description: "building a self optimizing memory architecture that learns from experience, optimizes policies via online Bayesian Optimization using curated data",
    tags: ["A16Z", "MIT"]
},

{
    title: "Machine Learning Research Intern",
    company: "sentra",
    period: "oct 2025 - current",
    description: "building a self optimizing memory architecture that learns from experience, optimizes policies via online Bayesian Optimization using curated data",
    tags: ["A16Z", "MIT"]
},


{
    title: "Machine Learning Research Intern",
    company: "sentra",
    period: "oct 2025 - current",
    description: "building a self optimizing memory architecture that learns from experience, optimizes policies via online Bayesian Optimization using curated data",
    tags: ["A16Z", "MIT"]
}



];

 



