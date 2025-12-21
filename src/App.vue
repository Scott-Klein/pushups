<template>
  <div
    class="select-none bg-linear-to-br from-green-700 to-green-900 h-dvh flex flex-col justify-around text-white/95 px-4"
  >
    <div class="text-center">
      <div class="flex items-center justify-center gap-2">
        <h1 class="font-bold text-2xl">Pushups</h1>
      </div>
      <p>Day {{ progressStore.cardinalDay }}</p>
      <p>Total Pushups: {{ progressStore.dailyTotalPushups }}</p>
    </div>
    <div class="flex justify-between gap-5">
      <div
        class="backdrop-blur-sm text-white font-bold p-4 rounded flex-1 text-center cursor-pointer transition-all"
        :class="index < completedSets ? 'bg-green-500/60 line-through' : 'bg-white/20'"
        v-for="(pushups, index) in progressStore.pushupsPerSet"
        :key="index"
        @dblclick="handleSetComplete(index)"
      >
        {{ pushups }}
      </div>
    </div>
    <div>
      <div
        class="gap-4 hover:bg-white/10 cursor-pointer transition-colors p-4 rounded"
        v-if="settingsOpen"
      >
        <div @click="settingsOpen = false" class="flex items-center gap-4 mb-4">
          <PhGear :size="32" />
          <p>Settings</p>
        </div>

        <div class="mb-4">
          <p class="mb-2">Number of sets: {{ progressStore.targetSets }}</p>
          <div class="flex gap-2">
            <button
              @click="progressStore.setTargetSets(progressStore.targetSets - 1)"
              class="bg-white/20 px-3 py-1 rounded"
              :disabled="progressStore.targetSets <= 1"
            >
              -
            </button>
            <button
              @click="progressStore.setTargetSets(progressStore.targetSets + 1)"
              class="bg-white/20 px-3 py-1 rounded"
            >
              +
            </button>
          </div>
        </div>

        <div class="mb-4">
          <p class="mb-2 font-semibold">Difficulty Scale</p>
          <div class="space-y-2">
            <div>
              <label class="text-sm">Current Day:</label>
              <input
                type="number"
                :value="progressStore.cardinalDay"
                @change="
                  (e) => progressStore.setCardinalDay(Number((e.target as HTMLInputElement).value))
                "
                class="bg-white/20 px-3 py-1 rounded w-full"
                min="1"
              />
            </div>
            <div>
              <label class="text-sm">Starting Total Pushups:</label>
              <input
                type="number"
                v-model.number="startingTotal"
                @change="progressStore.setStartingTotalPushups(startingTotal)"
                class="bg-white/20 px-3 py-1 rounded w-full"
                min="1"
              />
            </div>
            <div>
              <label class="text-sm">Target Day:</label>
              <input
                type="number"
                v-model.number="targetDay"
                @change="progressStore.setDifficultyScale(targetDay, targetTotal)"
                class="bg-white/20 px-3 py-1 rounded w-full"
              />
            </div>
            <div>
              <label class="text-sm">Target Total Pushups:</label>
              <input
                type="number"
                v-model.number="targetTotal"
                @change="progressStore.setDifficultyScale(targetDay, targetTotal)"
                class="bg-white/20 px-3 py-1 rounded w-full"
              />
            </div>
            <p class="text-xs text-white/70">
              Today's total: {{ progressStore.dailyTotalPushups }}
            </p>
          </div>
        </div>

        <p class="bg-blue-500 rounded p-4 cursor-pointer" @click="progressStore.setStartDay()">
          Set start day to today
        </p>
      </div>
      <div
        @click="settingsOpen = true"
        class="flex items-center gap-4 hover:bg-white/10 cursor-pointer transition-colors p-4 rounded"
        v-else
      >
        <PhGear :size="32" />
        <p>Open Settings</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { PhGear } from '@phosphor-icons/vue';
import useProgressStore from './stores/progress';

const progressStore = useProgressStore();

progressStore.loadFromLocalStorage();
const settingsOpen = ref<boolean>(false);
const startingTotal = ref<number>(progressStore.startingTotalPushups);
const targetDay = ref<number>(progressStore.targetDay);
const targetTotal = ref<number>(progressStore.targetTotalPushups);
const completedSets = computed(() => progressStore.getTodaysCompletedSets());

const handleSetComplete = (setIndex: number) => {
  if (setIndex === completedSets.value) {
    progressStore.completeSet();
  }
};
</script>
