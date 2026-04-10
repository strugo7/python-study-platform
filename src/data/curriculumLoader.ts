import curriculumData from './curriculum.json';
import type { CurriculumData, Module, PracticeQuestion, TheorySection, SimStepState } from './curriculum.types';
import { module2Steps } from './steps/module2Steps';
import { module3Steps } from './steps/module3Steps';
import { module4Steps } from './steps/module4Steps';
import { module5Steps } from './steps/module5Steps';
import { module6Steps } from './steps/module6Steps';
import { module7Steps } from './steps/module7Steps';

// Pre-defined simulation steps by module ID
const moduleSteps: Record<number, SimStepState[]> = {
    2: module2Steps,
    3: module3Steps,
    4: module4Steps,
    5: module5Steps,
    6: module6Steps,
    7: module7Steps,
};

// Type the imported data and merge steps
const data = curriculumData as unknown as CurriculumData;
const curriculum = data.curriculum;

// Merge pre-defined steps into modules
for (const mod of curriculum.modules) {
    if (moduleSteps[mod.id] && mod.interactive_code) {
        mod.interactive_code.steps = moduleSteps[mod.id];
    }
}

/**
 * Get all modules from the curriculum
 */
export function getAllModules(): Module[] {
    return curriculum.modules;
}

/**
 * Get a specific module by ID
 */
export function getModuleById(id: number): Module | undefined {
    return curriculum.modules.find(m => m.id === id);
}

/**
 * Get module by string ID (for URL params)
 */
export function getModuleByStringId(id: string): Module | undefined {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return undefined;
    return getModuleById(numId);
}

/**
 * Get all practice questions from all modules
 */
export function getAllPracticeQuestions(): (PracticeQuestion & { moduleId: number; moduleTitle: string })[] {
    const questions: (PracticeQuestion & { moduleId: number; moduleTitle: string })[] = [];

    for (const module of curriculum.modules) {
        if (module.practice_questions) {
            for (const q of module.practice_questions) {
                questions.push({
                    ...q,
                    moduleId: module.id,
                    moduleTitle: module.title
                });
            }
        }
        if (module.exam_prep_questions) {
            for (const q of module.exam_prep_questions) {
                questions.push({
                    ...q,
                    moduleId: module.id,
                    moduleTitle: module.title
                });
            }
        }
    }

    return questions;
}

/**
 * Get random exam questions
 */
export function getRandomExamQuestions(count: number = 10): (PracticeQuestion & { moduleId: number; moduleTitle: string })[] {
    const allQuestions = getAllPracticeQuestions();
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get questions by module
 */
export function getQuestionsByModule(moduleId: number): PracticeQuestion[] {
    const module = getModuleById(moduleId);
    if (!module) return [];

    return [
        ...(module.practice_questions || []),
        ...(module.exam_prep_questions || [])
    ];
}

/**
 * Convert theory sections to displayable format
 */
export function getTheorySectionsForDisplay(module: Module): TheorySection[] {
    return module.theory_sections || [];
}

/**
 * Get total progress stats
 */
export function getCurriculumStats() {
    const modules = getAllModules();
    const totalQuestions = getAllPracticeQuestions().length;

    return {
        totalModules: modules.length,
        totalQuestions,
        courseTitle: curriculum.title,
        courseDescription: curriculum.description
    };
}

/**
 * Get next module
 */
export function getNextModule(currentId: number): Module | undefined {
    const modules = getAllModules();
    const currentIndex = modules.findIndex(m => m.id === currentId);
    if (currentIndex === -1 || currentIndex === modules.length - 1) return undefined;
    return modules[currentIndex + 1];
}

/**
 * Get previous module
 */
export function getPreviousModule(currentId: number): Module | undefined {
    const modules = getAllModules();
    const currentIndex = modules.findIndex(m => m.id === currentId);
    if (currentIndex <= 0) return undefined;
    return modules[currentIndex - 1];
}
