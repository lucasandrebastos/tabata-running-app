import type { IntervalSegment, Step, Workout } from "./workout";

function buildStepId(segmentId: string, round: number, kind: "work" | "rest") {
  return `${segmentId}-round-${round}-${kind}`;
}

function expandIntervalSegment(segment: IntervalSegment): Step[] {
  const steps: Step[] = [];

  for (let round = 1; round <= segment.rounds; round += 1) {
    steps.push({
      id: buildStepId(segment.id, round, "work"),
      name: segment.work.label,
      type: segment.work.type,
      durationSeconds: segment.work.durationSeconds,
      zone: segment.work.zone,
    });

    steps.push({
      id: buildStepId(segment.id, round, "rest"),
      name: segment.rest.label,
      type: segment.rest.type,
      durationSeconds: segment.rest.durationSeconds,
      zone: segment.rest.zone,
    });
  }

  return steps;
}

/**
 * Convert a structured workout into a linear sequence of executable steps.
 * Order: warm-up → interval rounds (work/rest) → cooldown.
 */
export function linearizeWorkoutSteps(workout: Workout): Step[] {
  return [
    ...workout.warmUp.steps,
    ...workout.intervals.flatMap(expandIntervalSegment),
    ...workout.cooldown.steps,
  ];
}

