import type { Step } from "../models/workout";

export type TimerStepChangeEvent = {
  step: Step;
  stepIndex: number;
  totalSteps: number;
};

export type TimerTickEvent = {
  remainingSeconds: number;
  stepIndex: number;
  totalSteps: number;
};

export type TimerEngineCallbacks = {
  onStepChange?: (event: TimerStepChangeEvent) => void;
  onTick?: (event: TimerTickEvent) => void;
  onFinish?: () => void;
};

export type TimerScheduler = {
  setInterval: (handler: () => void, ms: number) => unknown;
  clearInterval: (handle: unknown) => void;
};

const DEFAULT_SCHEDULER: TimerScheduler = {
  setInterval: (handler, ms) => setInterval(handler, ms),
  clearInterval: (handle) => clearInterval(handle as ReturnType<typeof setInterval>),
};

export class TimerEngine {
  private steps: Step[] = [];
  private currentIndex = 0;
  private remainingSeconds = 0;
  private intervalHandle: unknown | null = null;
  private paused = false;
  private callbacks: TimerEngineCallbacks;
  private scheduler: TimerScheduler;

  constructor(
    callbacks: TimerEngineCallbacks = {},
    scheduler: TimerScheduler = DEFAULT_SCHEDULER
  ) {
    this.callbacks = callbacks;
    this.scheduler = scheduler;
  }

  start(steps: Step[]) {
    this.stop();
    this.steps = steps;
    if (this.steps.length === 0) {
      this.callbacks.onFinish?.();
      return;
    }
    this.currentIndex = 0;
    this.beginCurrentStep();
  }

  pause() {
    if (!this.intervalHandle || this.paused) {
      return;
    }
    this.scheduler.clearInterval(this.intervalHandle);
    this.intervalHandle = null;
    this.paused = true;
  }

  resume() {
    if (!this.paused || this.steps.length === 0) {
      return;
    }
    this.paused = false;
    this.intervalHandle = this.scheduler.setInterval(() => {
      this.tick();
    }, 1000);
  }

  stop() {
    if (this.intervalHandle) {
      this.scheduler.clearInterval(this.intervalHandle);
    }
    this.intervalHandle = null;
    this.steps = [];
    this.currentIndex = 0;
    this.remainingSeconds = 0;
    this.paused = false;
  }

  private beginCurrentStep() {
    const step = this.steps[this.currentIndex];
    this.remainingSeconds = step.durationSeconds;
    this.callbacks.onStepChange?.({
      step,
      stepIndex: this.currentIndex,
      totalSteps: this.steps.length,
    });
    this.callbacks.onTick?.({
      remainingSeconds: this.remainingSeconds,
      stepIndex: this.currentIndex,
      totalSteps: this.steps.length,
    });

    this.intervalHandle = this.scheduler.setInterval(() => {
      this.tick();
    }, 1000);
  }

  private tick() {
    if (this.remainingSeconds <= 0) {
      return;
    }

    this.remainingSeconds -= 1;
    this.callbacks.onTick?.({
      remainingSeconds: this.remainingSeconds,
      stepIndex: this.currentIndex,
      totalSteps: this.steps.length,
    });

    if (this.remainingSeconds === 0) {
      this.scheduler.clearInterval(this.intervalHandle);
      this.intervalHandle = null;

      if (this.currentIndex < this.steps.length - 1) {
        this.currentIndex += 1;
        this.beginCurrentStep();
      } else {
        this.callbacks.onFinish?.();
      }
    }
  }
}

