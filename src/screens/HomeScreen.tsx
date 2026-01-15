import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useWorkout } from "../context/WorkoutContext";
import { linearizeWorkoutSteps } from "../domain/models/linearize-workout";
import type { Workout } from "../domain/models/workout";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const MOCK_WORKOUTS: Workout[] = [
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

function getWorkoutSummary(workout: Workout) {
  const steps = linearizeWorkoutSteps(workout);
  const totalSeconds = steps.reduce(
    (acc, step) => acc + step.durationSeconds,
    0
  );
  const rounds = workout.intervals.reduce(
    (acc, interval) => acc + interval.rounds,
    0
  );
  return {
    minutes: Math.round(totalSeconds / 60),
    rounds,
  };
}

export function HomeScreen({ navigation }: Props) {
  const { start } = useWorkout();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  );
  const workouts = useMemo(() => MOCK_WORKOUTS, []);

  const selectedWorkout = useMemo(
    () => workouts.find((workout) => workout.id === selectedWorkoutId) ?? null,
    [selectedWorkoutId, workouts]
  );

  const handleStartWorkoutPress = () => {
    if (!selectedWorkout) {
      return;
    }
    const steps = linearizeWorkoutSteps(selectedWorkout);
    start(steps);
    navigation.navigate("Workout");
  };

  const handleCreateWorkoutPress = () => {
    navigation.navigate("CreateWorkoutStack");
  };

  const renderWorkoutCard = ({ item }: { item: Workout }) => {
    const summary = getWorkoutSummary(item);
    const isSelected = item.id === selectedWorkoutId;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isSelected ? styles.cardSelected : null,
          pressed ? styles.cardPressed : null,
        ]}
        onPress={() => setSelectedWorkoutId(item.id)}
      >
        <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
        <ThemedText style={styles.cardMeta}>
          {summary.minutes} min · {summary.rounds} rounds
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Your Workouts</ThemedText>
        <ThemedText style={styles.subtitle}>
          Pick a workout to start or create a new one.
        </ThemedText>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.primaryButtonPressed : null,
            !selectedWorkout ? styles.primaryButtonDisabled : null,
          ]}
          onPress={handleStartWorkoutPress}
          disabled={!selectedWorkout}
        >
          <ThemedText style={styles.primaryButtonText}>
            Start Workout
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.secondaryButtonPressed : null,
          ]}
          onPress={handleCreateWorkoutPress}
        >
          <ThemedText style={styles.secondaryButtonText}>
            Create Workout
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#101016",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#5B5B6B",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#1C66FF",
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111118",
  },
  cardMeta: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B6B78",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#1C66FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#1C66FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonPressed: {
    opacity: 0.9,
  },
  secondaryButtonText: {
    color: "#1C66FF",
    fontSize: 16,
    fontWeight: "600",
  },
});
