import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useFungiStore } from '../store/useFungiStore';

interface ModelContextType {
  model: any; // Ideally typing this would be better, but 'any' from useTensorflowModel is common
  state: 'loading' | 'loaded' | 'error';
}

const ModelContext = createContext<ModelContextType>({
  model: null,
  state: 'loading',
});

export const useModel = () => useContext(ModelContext);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const plugin = useTensorflowModel(
    require('../assets/models/yolo11l-cls-fungi-distilled.float16.tflite'),
  );

  // We can track more granular state if needed, but plugin.state is usually sufficient.
  // plugin.state is 'loading' | 'loaded' | 'error'

  return (
    <ModelContext.Provider value={{ model: plugin.model, state: plugin.state }}>
      {children}
    </ModelContext.Provider>
  );
};
