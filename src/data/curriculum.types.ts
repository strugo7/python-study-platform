// TypeScript types for the curriculum data structure

export interface TheorySection {
    id: string;
    title: string;
    content_html: string;
}

export interface InteractiveCode {
    title: string;
    description: string;
    concepts_used: string[];
    code: string;
    expected_output: string;
}

export interface QuestionOption {
    id: string;
    label: string; // א, ב, ג, ד
    text: string;
}

export interface PracticeQuestion {
    id: string;
    type: 'code_tracing' | 'multiple_choice' | 'fill_in_blank';
    difficulty: 'easy' | 'medium' | 'hard' | 'exam_level';
    question_text: string;
    code?: string;
    options: QuestionOption[];
    correct_answer: string;
    explanation: string;
    cumulative_concepts: string[];
}

export interface Module {
    id: number;
    title: string;
    subtitle: string;
    isUnlocked: boolean;
    prerequisites: string[];
    learningObjectives: string[];
    theory_sections: TheorySection[];
    interactive_code: InteractiveCode;
    practice_questions: PracticeQuestion[];
    exam_prep_questions: PracticeQuestion[];
}

export interface Curriculum {
    title: string;
    description: string;
    version: string;
    modules: Module[];
}

export interface CurriculumData {
    curriculum: Curriculum;
}

// Helper function to get module by ID
export function getModuleById(curriculum: Curriculum, id: number): Module | undefined {
    return curriculum.modules.find(m => m.id === id);
}

// Helper function to get all unlocked modules
export function getUnlockedModules(curriculum: Curriculum): Module[] {
    return curriculum.modules.filter(m => m.isUnlocked);
}

// Helper function to get practice questions by difficulty
export function getQuestionsByDifficulty(
    module: Module,
    difficulty: PracticeQuestion['difficulty']
): PracticeQuestion[] {
    return [
        ...module.practice_questions.filter(q => q.difficulty === difficulty),
        ...module.exam_prep_questions.filter(q => q.difficulty === difficulty)
    ];
}
