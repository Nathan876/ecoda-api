export const FIRST_STEP_MIN = 1;
export const POINTS_BADGE_THRESHOLD = 100;
export const CATEGORY_BADGE_THRESHOLD = 5;

export interface UserStats {
    totalScore: number;
    validatedCount: number;
    validatedByGoal: Record<string, number>;
}

export function evaluateBadges(stats: UserStats): string[] {
    const earned: string[] = [];

    if (stats.validatedCount >= FIRST_STEP_MIN) {
        earned.push("premier_pas");
    }
    if (stats.totalScore >= POINTS_BADGE_THRESHOLD){
        earned.push("100_points");
    }
    if ((stats.validatedByGoal["carbone"] ?? 0) >= CATEGORY_BADGE_THRESHOLD) {
        earned.push("eco_mobilite");
    }
    if ((stats.validatedByGoal["alimentation"] ?? 0) >= CATEGORY_BADGE_THRESHOLD) {
        earned.push("assiette_responsable");
    }
    if ((stats.validatedByGoal["dechets"] ?? 0) >= CATEGORY_BADGE_THRESHOLD) {
        earned.push("zero_dechet");
    }

    return earned;
}