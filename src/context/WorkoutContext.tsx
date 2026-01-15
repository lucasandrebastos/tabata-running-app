import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";

import { TimerEngine } from "../domain/timer/timer-engine";
import type { Step } from "../domain/models/workout";

type WorkoutState = {
  steps: Step[];
  currentStep: Step | null;
  currentStepIndex: number;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
};

type StartAction = { type: "START"; steps: Step[] };
type PauseAction = { type: "PAUSE" };
type ResumeAction = { type: "RESUME" };
type StopAction = { type: "STOP" };
type StepChangeAction = {
  type: "STEP_CHANGE";
  step: Step;
  stepIndex: number;
};
type TickAction = {
  type: "TICK";
  remainingSeconds: number;
};
type FinishAction = { type: "FINISH" };

type WorkoutAction =
  | StartAction
  | PauseAction
  | ResumeAction
  | StopAction
  | StepChangeAction
  | TickAction
  | FinishAction;

const initialState: WorkoutState = {
  steps: [],
  currentStep: null,
  currentStepIndex: 0,
  timeLeft: 0,
  isRunning: false,
  isPaused: false,
  isFinished: false,
};

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case "START":
      return {
        ...state,
        steps: action.steps,
        currentStep: null,
        currentStepIndex: 0,
        timeLeft: 0,
        isRunning: true,
        isPaused: false,
        isFinished: false,
      };
    case "PAUSE":
      return {
        ...state,
        isPaused: true,
        isRunning: false,
      };
    case "RESUME":
      return {
        ...state,
        isPaused: false,
        isRunning: true,
      };
    case "STOP":
      if (state.steps.length === 0) {
        return {
          ...initialState,
        };
      }
      return {
        steps: state.steps,
        currentStep: state.steps[0] ?? null,
        currentStepIndex: 0,
        timeLeft: state.steps[0]?.durationSeconds ?? 0,
        isRunning: false,
        isPaused: false,
        isFinished: false,
      };
    case "STEP_CHANGE":
      return {
        ...state,
        currentStep: action.step,
        currentStepIndex: action.stepIndex,
        timeLeft: action.step.durationSeconds,
      };
    case "TICK":
      return {
        ...state,
        timeLeft: action.remainingSeconds,
      };
    case "FINISH":
      return {
        ...state,
        isFinished: true,
        isRunning: false,
        isPaused: false,
        timeLeft: 0,
      };
    default:
      return state;
  }
}

type WorkoutContextValue = {
  state: WorkoutState;
  start: (steps: Step[]) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const engineRef = useRef<TimerEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new TimerEngine({
      onStepChange: ({ step, stepIndex }) => {
        dispatch({ type: "STEP_CHANGE", step, stepIndex });
      },
      onTick: ({ remainingSeconds }) => {
        dispatch({ type: "TICK", remainingSeconds });
      },
      onFinish: () => {
        dispatch({ type: "FINISH" });
      },
    });
  }

  useEffect(() => {
    const engine = engineRef.current;
    return () => {
      engine?.stop();
    };
  }, []);

  const start = (steps: Step[]) => {
    engineRef.current?.start(steps);
    dispatch({ type: "START", steps });
  };

  const pause = () => {
    engineRef.current?.pause();
    dispatch({ type: "PAUSE" });
  };

  const resume = () => {
    engineRef.current?.resume();
    dispatch({ type: "RESUME" });
  };

  const stop = () => {
    engineRef.current?.stop();
    dispatch({ type: "STOP" });
  };

  return (
    <WorkoutContext.Provider value={{ state, start, pause, resume, stop }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
}

