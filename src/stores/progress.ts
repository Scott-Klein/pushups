import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'pushups-progress';

const useProgressStore = defineStore('progress', () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = ref<number>(today.getTime());
  const targetSets = ref<number>(5);
  const startingTotalPushups = ref<number>(1);
  const targetDay = ref<number>(180);
  const targetTotalPushups = ref<number>(335);
  const setsRatio = ref<number[]>([13, 15, 14, 13, 13]);

  const cardinalDay = computed(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(now.getTime() - startDate.value);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  });

  const dailyTotalPushups = computed(() => {
    const day = cardinalDay.value;
    if (day > targetDay.value) {
      return targetTotalPushups.value;
    }
    const increment =
      (targetTotalPushups.value - startingTotalPushups.value) / (targetDay.value - 1);
    return Math.floor(startingTotalPushups.value + increment * (day - 1));
  });

  const pushupsPerSet = computed(() => {
    const total = dailyTotalPushups.value;
    const ratioSum = setsRatio.value.reduce((sum, val) => sum + val, 0);
    return setsRatio.value.map((ratio) => Math.floor((total * ratio) / ratioSum));
  });

  const setStartDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.value = today.getTime();
    saveToLocalStorage();
  };

  const setCardinalDay = (desiredDay: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysToSubtract = desiredDay - 1;
    const newStartDate = new Date(today.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
    startDate.value = newStartDate.getTime();
    saveToLocalStorage();
  };

  const setTargetSets = (count: number) => {
    targetSets.value = count;
    // Adjust ratio array to match new number of sets
    if (count !== setsRatio.value.length) {
      const avgRatio = Math.floor(
        setsRatio.value.reduce((sum, val) => sum + val, 0) / setsRatio.value.length,
      );
      setsRatio.value = Array(count).fill(avgRatio);
    }
    saveToLocalStorage();
  };

  const setDifficultyScale = (day: number, total: number) => {
    targetDay.value = day;
    targetTotalPushups.value = total;
    saveToLocalStorage();
  };

  const setStartingTotalPushups = (total: number) => {
    startingTotalPushups.value = total;
    saveToLocalStorage();
  };

  const setSetsRatio = (ratio: number[]) => {
    setsRatio.value = ratio;
    saveToLocalStorage();
  };

  const progress = ref<Map<number, number>>(new Map());

  const addSet = (dayNumber: number) => {
    const currentCount = progress.value.get(dayNumber) || 0;
    progress.value.set(dayNumber, currentCount + 1);
    saveToLocalStorage();
  };

  const completeSet = () => {
    addSet(cardinalDay.value);
  };

  const getTodaysCompletedSets = (): number => {
    return getProgressForDay(cardinalDay.value);
  };

  const getProgressForDay = (dayNumber: number): number => {
    return progress.value.get(dayNumber) || 0;
  };

  const saveToLocalStorage = () => {
    const data = {
      startDate: startDate.value,
      targetSets: targetSets.value,
      startingTotalPushups: startingTotalPushups.value,
      targetDay: targetDay.value,
      targetTotalPushups: targetTotalPushups.value,
      setsRatio: setsRatio.value,
      progress: Array.from(progress.value.entries()),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        startDate.value = data.startDate;
        targetSets.value = data.targetSets ?? 5;
        startingTotalPushups.value = data.startingTotalPushups ?? 1;
        targetDay.value = data.targetDay ?? 180;
        targetTotalPushups.value = data.targetTotalPushups ?? 335;
        setsRatio.value = data.setsRatio ?? [13, 15, 14, 13, 13];
        progress.value = new Map(data.progress);
      } catch (error) {
        console.error('Failed to load progress from local storage:', error);
      }
    }
  };

  return {
    cardinalDay,
    progress,
    targetSets,
    startingTotalPushups,
    targetDay,
    targetTotalPushups,
    setsRatio,
    dailyTotalPushups,
    pushupsPerSet,
    setStartDay,
    setCardinalDay,
    setTargetSets,
    setDifficultyScale,
    setStartingTotalPushups,
    setSetsRatio,
    addSet,
    completeSet,
    getTodaysCompletedSets,
    getProgressForDay,
    loadFromLocalStorage,
    saveToLocalStorage,
  };
});

export default useProgressStore;
