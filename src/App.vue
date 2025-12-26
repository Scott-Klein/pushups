<template>
  <div class="dark:bg-gray-950 dark:text-gray-50 text-gray-800 select-none min-h-dvh flex flex-col p-6 relative overflow-hidden">
    <div class="flex-1 flex flex-col justify-between relative z-10 max-w-2xl mx-auto w-full">
      <!-- Header Section -->
      <div class="text-center mb-8 flex flex-col items-center">
        <div class="inline-flex items-center justify-center gap-3 mb-3">
          <h1 class="font-bold text-4xl tracking-tight">Pushups</h1>
        </div>
        <div
          class="inline-flex items-center gap-4 backdrop-blur-xl dark:bg-gray-900 dark:inset-shadow bg-gray-50 rounded-2xl px-6 py-3 shadow-2xl"
        >
          <div class="text-center">
            <p class="text-xs font-semibold uppercase tracking-wider mb-1">Day</p>
            <p class="text-3xl font-bold">{{ progressStore.cardinalDay }}</p>
          </div>
          <div class="w-px h-12 bg-white/10"></div>
          <div class="text-center">
            <p class="text-xs font-semibold uppercase tracking-wider mb-1">Total</p>
            <p class="text-3xl font-bold">{{ progressStore.dailyTotalPushups }}</p>
          </div>
        </div>
      </div>

      <!-- Sets Display -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="/60 text-sm font-semibold uppercase tracking-wider">Today's Sets</h2>
          <div class="/40 text-sm font-medium">
            {{ completedSets }} / {{ progressStore.targetSets }}
          </div>
        </div>

        <!-- Focus Area for Current Set -->
        <div class="mb-6 min-h-35 flex items-center justify-center">
          <Transition name="focus" mode="out-in">
            <div
              v-if="completedSets < progressStore.targetSets"
              :key="completedSets"
              @dblclick="handleSetComplete(completedSets)"
              class="w-32 h-32 rounded-3xl dark:bg-gray-900 dark:inset-shadow shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-300 relative overflow-hidden"
            >
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-5xl font-bold mb-1">
                  {{ progressStore.pushupsPerSet[completedSets] }}
                </span>
                <span class="/90 text-xs font-semibold uppercase tracking-wider">
                  Set {{ completedSets + 1 }}
                </span>
              </div>
            </div>
          </Transition>
        </div>

        <!-- All Sets Row -->
        <div
          class="grid gap-3"
          :style="{ gridTemplateColumns: `repeat(${progressStore.targetSets}, 1fr)` }"
        >
          <TransitionGroup name="set">
            <div
              v-for="(pushups, index) in progressStore.pushupsPerSet"
              :key="index"
              class="relative aspect-square rounded-2xl transition-all duration-300 dark:bg-gray-800 bg-gray-50 dark:inset-shadow cursor-pointer flex items-center justify-center"
              :class="[
                index < completedSets
                  ? ''
                  : index === completedSets
                    ? 'dark:bg-gray-900 bg-gray-50'
                    : 'dark:bg-gray-700 bg-gray-100',
              ]"
            >
              <div class="absolute inset-0 flex flex-col items-center justify-center p-2">
                <span
                  class="font-bold transition-all duration-300"
                  :class="[index < completedSets ? ' text-xl' : '/50 text-2xl']"
                >
                  {{ pushups }}
                </span>
                <Transition name="checkmark">
                  <div
                    v-if="index < completedSets"
                    class="mt-1 w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    <span class="text-xs">✓</span>
                  </div>
                </Transition>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Settings Section -->
      <div class="mt-auto mx-auto max-w-sm">
        <div v-if="settingsOpen" class="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 shadow-lg">
          <!-- Settings Header -->
          <div
            @click="settingsOpen = false"
            class="flex items-center justify-between mb-6 cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"
              >
                <PhGear :size="24" class="/90" />
              </div>
              <p class="font-semibold text-lg">Settings</p>
            </div>
            <span class="/40 text-sm">Tap to close</span>
          </div>

          <div class="flex flex-col gap-12">
            <div>
              <label class="/60 text-sm font-semibold uppercase tracking-wider mb-3 block">
                Appearance
              </label>
              <div class="flex items-center gap-3 justify-end">
                <ThemeToggle />
              </div>
            </div>
            <!-- Number of Sets -->
            <div>
              <label class="/60 text-sm font-semibold uppercase tracking-wider mb-3 block">
                Number of Sets
              </label>
              <div class="flex items-center gap-3">
                <button
                  @click="progressStore.setTargetSets(progressStore.targetSets - 1)"
                  class="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                  :disabled="progressStore.targetSets <= 1"
                >
                  −
                </button>
                <div
                  class="flex-1 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"
                >
                  <span class="text-2xl font-bold">{{ progressStore.targetSets }}</span>
                </div>
                <button
                  @click="progressStore.setTargetSets(progressStore.targetSets + 1)"
                  class="w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all shadow-lg"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Difficulty Scale -->
            <div>
              <label class="/60 text-sm font-semibold uppercase tracking-wider mb-3 block">
                Progress Settings
              </label>
              <div class="space-y-3">
                <div>
                  <label class="/40 text-xs font-medium mb-2 block">Current Day</label>
                  <input
                    type="number"
                    :value="progressStore.cardinalDay"
                    @change="
                      (e) =>
                        progressStore.setCardinalDay(Number((e.target as HTMLInputElement).value))
                    "
                    class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 font-medium focus:outline-none focus:ring-2"
                    min="1"
                  />
                </div>
                <div>
                  <label class="/40 text-xs font-medium mb-2 block">Starting Total Pushups</label>
                  <input
                    type="number"
                    v-model.number="startingTotal"
                    @change="progressStore.setStartingTotalPushups(startingTotal)"
                    class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 font-medium focus:outline-none focus:ring-2 transition-all"
                    min="1"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="/40 text-xs font-medium mb-2 block">Target Day</label>
                    <input
                      type="number"
                      v-model.number="targetDay"
                      @change="progressStore.setDifficultyScale(targetDay, targetTotal)"
                      class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 font-medium focus:outline-none focus:ring-2 transition-all"
                    />
                  </div>
                  <div>
                    <label class="/40 text-xs font-medium mb-2 block">Target Total</label>
                    <input
                      type="number"
                      v-model.number="targetTotal"
                      @change="progressStore.setDifficultyScale(targetDay, targetTotal)"
                      class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 font-medium focus:outline-none focus:ring-2 transition-all"
                    />
                  </div>
                </div>
                <div class="borderrounded-xl px-4 py-3">
                  <p class="text-sm font-medium">
                    Today's target: {{ progressStore.dailyTotalPushups }} pushups
                  </p>
                </div>
              </div>
            </div>

            <!-- Reset Button -->
            <button
              @click="progressStore.setStartDay()"
              class="w-full h-14 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
            >
              Set Start Day to Today
            </button>
          </div>
        </div>

        <!-- Settings Button (Collapsed) -->
        <button
          v-else
          @click="settingsOpen = true"
          class="w-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl p-4 transition-all group shadow-xl"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <PhGear :size="28" class="/90" />
            </div>
            <p class="font-semibold text-lg">Open Settings</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PhGear } from '@phosphor-icons/vue';
import useProgressStore from './stores/progress';
import ThemeToggle from './components/ThemeToggle.vue';
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

<style scoped>
/* Focus area transitions */
.focus-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.focus-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.focus-enter-from {
  opacity: 0;
  transform: translateY(60px) scale(0.6) rotateZ(-10deg);
}

.focus-leave-to {
  opacity: 0;
  transform: translateY(-60px) scale(0.6) rotateZ(10deg);
}

/* Set transitions */
.set-move {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.set-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.set-leave-active {
  transition: all 0.3s ease-out;
  position: absolute;
}

.set-enter-from {
  opacity: 0;
  transform: scale(0.5) rotateZ(-15deg);
}

.set-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Checkmark animation */
.checkmark-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.checkmark-enter-from {
  opacity: 0;
  transform: scale(0) rotateZ(-180deg);
}
</style>
