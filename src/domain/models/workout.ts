export type TrainingZone = "Zone 1" | "Zone 2" | "Zone 3" | "Zone 4" | "Zone 5";

export type StepType = "work" | "rest" | "recovery";

export interface Step {
  /** Smallest executable unit in the timer. */
  id: string;
  /** Label shown to the user, e.g. "Warm-up", "Run", "Recovery". */
  name: string;
  type: StepType;
  durationSeconds: number;
  zone: TrainingZone;
}

export interface IntervalStepTemplate {
  /** Template used to generate executable steps per round. */
  label: string;
  type: StepType;
  durationSeconds: number;
  zone: TrainingZone;
}

export interface WarmUpSegment {
  /** Warm-up segment executed once before intervals. */
  id: string;
  type: "warm-up";
  steps: Step[];
}

export interface IntervalSegment {
  /** Repeating interval block with multiple rounds. */
  id: string;
  type: "interval";
  rounds: number;
  work: IntervalStepTemplate;
  rest: IntervalStepTemplate;
}

export interface CooldownSegment {
  /** Cooldown segment executed once after intervals. */
  id: string;
  type: "cooldown";
  steps: Step[];
}

export type Segment = WarmUpSegment | IntervalSegment | CooldownSegment;

export interface Workout {
  /** Full workout definition including warm-up, intervals, and cooldown. */
  id: string;
  name: string;
  warmUp: WarmUpSegment;
  intervals: IntervalSegment[];
  cooldown: CooldownSegment;
}
