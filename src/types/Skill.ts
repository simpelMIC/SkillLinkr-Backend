interface SkillCategory {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
  categoryId: number;
}

export type { SkillCategory, Skill };
