import React, { createContext, useContext, useMemo, useState } from "react";

import type { Workout } from "../domain/models/workout";

type WorkoutsContextValue = {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
};

const initialWorkouts: Workout[] = [
  {
    id: "w1",
    name: "Tabata Sprint",
    warmUp: {
      id: "w1-warm",
      type: "warm-up",
      steps: [
        {
          id: "w1-warm-1",
          name: "Warm-up",
          type: "recovery",
          durationSeconds: 300,
          zone: "Zone 1",
        },
      ],
    },
    intervals: [
      {
        id: "w1-int-1",
        type: "interval",
        rounds: 8,
        work: {
          label: "Run",
          type: "work",
          durationSeconds: 20,
          zone: "Zone 3",
        },
        rest: {
          label: "Recovery",
          type: "rest",
          durationSeconds: 10,
          zone: "Zone 1",
        },
      },
    ],
    cooldown: {
      id: "w1-cool",
      type: "cooldown",
      steps: [
        {
          id: "w1-cool-1",
          name: "Cooldown",
          type: "recovery",
          durationSeconds: 300,
          zone: "Zone 1",
        },
      ],
    },
  },
  {
    id: "w2",
    name: "Hill Intervals",
    warmUp: {
      id: "w2-warm",
      type: "warm-up",
      steps: [
        {
          id: "w2-warm-1",
          name: "Warm-up",
          type: "recovery",
          durationSeconds: 420,
          zone: "Zone 1",
        },
      ],
    },
    intervals: [
      {
        id: "w2-int-1",
        type: "interval",
        rounds: 6,
        work: {
          label: "Uphill",
          type: "work",
          durationSeconds: 60,
          zone: "Zone 3",
        },
        rest: {
          label: "Downhill",
          type: "rest",
          durationSeconds: 60,
          zone: "Zone 1",
        },
      },
    ],
    cooldown: {
      id: "w2-cool",
      type: "cooldown",
      steps: [
        {
          id: "w2-cool-1",
          name: "Cooldown",
          type: "recovery",
          durationSeconds: 300,
          zone: "Zone 1",
        },
      ],
    },
  },
  {
    id: "w3",
    name: "Tempo Run",
    warmUp: {
      id: "w3-warm",
      type: "warm-up",
      steps: [
        {
          id: "w3-warm-1",
          name: "Warm-up",
          type: "recovery",
          durationSeconds: 300,
          zone: "Zone 1",
        },
      ],
    },
    intervals: [
      {
        id: "w3-int-1",
        type: "interval",
        rounds: 4,
        work: {
          label: "Tempo",
          type: "work",
          durationSeconds: 180,
          zone: "Zone 2",
        },
        rest: {
          label: "Recovery",
          type: "rest",
          durationSeconds: 60,
          zone: "Zone 1",
        },
      },
    ],
    cooldown: {
      id: "w3-cool",
      type: "cooldown",
      steps: [
        {
          id: "w3-cool-1",
          name: "Cooldown",
          type: "recovery",
          durationSeconds: 240,
          zone: "Zone 1",
        },
      ],
    },
  },
];

const WorkoutsContext = createContext<WorkoutsContextValue | undefined>(undefined);

export function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);

  const value = useMemo(
    () => ({
      workouts,
      addWorkout: (workout: Workout) => {
        setWorkouts((current) => [workout, ...current]);
      },
    }),
    [workouts]
  );

  return <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>;
}

export function useWorkouts() {
  const context = useContext(WorkoutsContext);
  if (!context) {
    throw new Error("useWorkouts must be used within a WorkoutsProvider");
  }
  return context;
}

