import 'react-native-gesture-handler';

import React from 'react';

import { WorkoutProvider } from './src/context/WorkoutContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <WorkoutProvider>
      <RootNavigator />
    </WorkoutProvider>
  );
}

