import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useWorkouts } from "../context/WorkoutsContext";
import type { TrainingZone, Workout } from "../domain/models/workout";

const ZONE_1_COLOR = "#1C66FF";
const ZONE_3_COLOR = "#EF6C00";
const ZONE_COLORS: Record<TrainingZone, string> = {
  "Zone 1": "#1C66FF",
  "Zone 2": "#2E7D32",
  "Zone 3": "#EF6C00",
  "Zone 4": "#E53935",
  "Zone 5": "#8E24AA",
};
const ZONE_OPTIONS: TrainingZone[] = [
  "Zone 1",
  "Zone 2",
  "Zone 3",
  "Zone 4",
  "Zone 5",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatMinutes(totalSeconds: number) {
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes} min`;
}

export function CreateWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState("Custom Workout");
  const [warmUpMinutes, setWarmUpMinutes] = useState(5);
  const [cooldownMinutes, setCooldownMinutes] = useState(5);
  const [rounds, setRounds] = useState(8);
  const [workMinutes, setWorkMinutes] = useState(1);
  const [restMinutes, setRestMinutes] = useState(1);
  const [workZone, setWorkZone] = useState<TrainingZone>("Zone 3");
  const [restZone, setRestZone] = useState<TrainingZone>("Zone 1");
  const { addWorkout } = useWorkouts();

  const totalSeconds = useMemo(() => {
    return (
      warmUpMinutes * 60 +
      cooldownMinutes * 60 +
      rounds * (workMinutes * 60 + restMinutes * 60)
    );
  }, [warmUpMinutes, cooldownMinutes, rounds, workMinutes, restMinutes]);

  const handleSave = () => {
    const id = `workout-${Date.now()}`;
    const workout: Workout = {
      id,
      name: workoutName.trim() || "Custom Workout",
      warmUp: {
        id: `${id}-warm`,
        type: "warm-up",
        steps: [
          {
            id: `${id}-warm-1`,
            name: "Warm-up",
            type: "recovery",
            durationSeconds: warmUpMinutes * 60,
            zone: "Zone 1",
          },
        ],
      },
      intervals: [
        {
          id: `${id}-int-1`,
          type: "interval",
          rounds,
          work: {
            label: "Work",
            type: "work",
            durationSeconds: workMinutes * 60,
            zone: workZone,
          },
          rest: {
            label: "Rest",
            type: "rest",
            durationSeconds: restMinutes * 60,
            zone: restZone,
          },
        },
      ],
      cooldown: {
        id: `${id}-cool`,
        type: "cooldown",
        steps: [
          {
            id: `${id}-cool-1`,
            name: "Cooldown",
            type: "recovery",
            durationSeconds: cooldownMinutes * 60,
            zone: "Zone 1",
          },
        ],
      },
    };
    addWorkout(workout);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Workout Name</ThemedText>
          <TextInput
            style={styles.nameInput}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Enter workout name"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Warm-up</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Duration</ThemedText>
            <View style={styles.valueGroup}>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setWarmUpMinutes((value) => clamp(value - 1, 0, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>-</ThemedText>
              </Pressable>
              <ThemedText style={styles.valueText}>
                {warmUpMinutes} min
              </ThemedText>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setWarmUpMinutes((value) => clamp(value + 1, 0, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>+</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Intervals</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Rounds</ThemedText>
            <View style={styles.valueGroup}>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() => setRounds((value) => clamp(value - 1, 1, 30))}
              >
                <ThemedText style={styles.roundButtonText}>-</ThemedText>
              </Pressable>
              <ThemedText style={styles.valueText}>{rounds}</ThemedText>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() => setRounds((value) => clamp(value + 1, 1, 30))}
              >
                <ThemedText style={styles.roundButtonText}>+</ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.labelColumn}>
              <ThemedText style={styles.label}>Work</ThemedText>
              <View
                style={[
                  styles.zonePill,
                  { backgroundColor: ZONE_COLORS[workZone] ?? ZONE_3_COLOR },
                ]}
              >
                <ThemedText style={styles.zoneText}>{workZone}</ThemedText>
              </View>
            </View>
            <View style={styles.valueGroup}>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setWorkMinutes((value) => clamp(value - 1, 1, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>-</ThemedText>
              </Pressable>
              <ThemedText style={styles.valueText}>
                {workMinutes} min
              </ThemedText>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setWorkMinutes((value) => clamp(value + 1, 1, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>+</ThemedText>
              </Pressable>
            </View>
          </View>
          <View style={styles.zoneSelector}>
            {ZONE_OPTIONS.map((zone) => {
              const isSelected = zone === workZone;
              return (
                <Pressable
                  key={`work-${zone}`}
                  style={({ pressed }) => [
                    styles.zoneChip,
                    { borderColor: ZONE_COLORS[zone] },
                    isSelected ? styles.zoneChipSelected : null,
                    isSelected ? { backgroundColor: ZONE_COLORS[zone] } : null,
                    pressed ? styles.pressed : null,
                  ]}
                  onPress={() => setWorkZone(zone)}
                >
                  <ThemedText
                    style={[
                      styles.zoneChipText,
                      isSelected ? styles.zoneChipTextSelected : null,
                    ]}
                  >
                    {zone}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.row}>
            <View style={styles.labelColumn}>
              <ThemedText style={styles.label}>Rest</ThemedText>
              <View
                style={[
                  styles.zonePill,
                  { backgroundColor: ZONE_COLORS[restZone] ?? ZONE_1_COLOR },
                ]}
              >
                <ThemedText style={styles.zoneText}>{restZone}</ThemedText>
              </View>
            </View>
            <View style={styles.valueGroup}>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setRestMinutes((value) => clamp(value - 1, 1, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>-</ThemedText>
              </Pressable>
              <ThemedText style={styles.valueText}>
                {restMinutes} min
              </ThemedText>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setRestMinutes((value) => clamp(value + 1, 1, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>+</ThemedText>
              </Pressable>
            </View>
          </View>
          <View style={styles.zoneSelector}>
            {ZONE_OPTIONS.map((zone) => {
              const isSelected = zone === restZone;
              return (
                <Pressable
                  key={`rest-${zone}`}
                  style={({ pressed }) => [
                    styles.zoneChip,
                    { borderColor: ZONE_COLORS[zone] },
                    isSelected ? styles.zoneChipSelected : null,
                    isSelected ? { backgroundColor: ZONE_COLORS[zone] } : null,
                    pressed ? styles.pressed : null,
                  ]}
                  onPress={() => setRestZone(zone)}
                >
                  <ThemedText
                    style={[
                      styles.zoneChipText,
                      isSelected ? styles.zoneChipTextSelected : null,
                    ]}
                  >
                    {zone}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Cooldown</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Duration</ThemedText>
            <View style={styles.valueGroup}>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setCooldownMinutes((value) => clamp(value - 1, 0, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>-</ThemedText>
              </Pressable>
              <ThemedText style={styles.valueText}>
                {cooldownMinutes} min
              </ThemedText>
              <Pressable
                style={({ pressed }) => [
                  styles.roundButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() =>
                  setCooldownMinutes((value) => clamp(value + 1, 0, 30))
                }
              >
                <ThemedText style={styles.roundButtonText}>+</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <ThemedText style={styles.footerLabel}>Estimated Time</ThemedText>
          <ThemedText style={styles.footerValue}>
            {formatMinutes(totalSeconds)}
          </ThemedText>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.pressed : null,
          ]}
          onPress={handleSave}
        >
          <ThemedText style={styles.primaryButtonText}>Save Workout</ThemedText>
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
  appBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4EF",
    backgroundColor: "#F7F7FA",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C66FF",
  },
  appBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#101016",
  },
  appBarSpacer: {
    width: 48,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101016",
  },
  nameInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#101016",
    backgroundColor: "#F8FAFC",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  labelColumn: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F1F26",
  },
  zonePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  zoneText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  zoneSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  zoneChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  zoneChipSelected: {
    borderWidth: 0,
  },
  zoneChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F1F26",
  },
  zoneChipTextSelected: {
    color: "#FFFFFF",
  },
  valueGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 70,
    textAlign: "center",
    color: "#101016",
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ECECF6",
    alignItems: "center",
    justifyContent: "center",
  },
  roundButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#101016",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E4E4EF",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  footerLabel: {
    fontSize: 12,
    color: "#5B5B6B",
  },
  footerValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101016",
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#1C66FF",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
