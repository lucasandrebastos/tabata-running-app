import type { NavigatorScreenParams } from "@react-navigation/native";

export type CreateWorkoutStackParamList = {
  CreateWorkoutHome: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  CreateWorkoutStack:
    | NavigatorScreenParams<CreateWorkoutStackParamList>
    | undefined;
};
