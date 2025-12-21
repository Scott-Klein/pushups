<template>
  <div class="select-none bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 min-h-dvh flex flex-col p-6 relative overflow-hidden">
    <!-- Animated background orbs -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

    <div class="flex-1 flex flex-col justify-between relative z-10 max-w-2xl mx-auto w-full">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span class="text-2xl">💪</span>
          </div>
          <h1 class="font-bold text-4xl text-white tracking-tight">Pushups</h1>
        </div>
        <div class="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
          <div class="text-center">
            <p class="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">Day</p>
            <p class="text-white text-3xl font-bold">{{ progressStore.cardinalDay }}</p>
          </div>
          <div class="w-px h-12 bg-white/10"></div>
          <div class="text-center">
            <p class="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">Total</p>
            <p class="text-white text-3xl font-bold">{{ progressStore.dailyTotalPushups }}</p>
          </div>
        </div>
      </div>

      <!-- Sets Display -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-white/60 text-sm font-semibold uppercase tracking-wider">Today's Sets</h2>
          <div class="text-white/40 text-sm font-medium">
            {{ completedSets }} / {{ progressStore.targetSets }}
          </div>
        </div>

        <!-- Focus Area for Current Set -->
        <div class="mb-6 min-h-[140px] flex items-center justify-center">
          <Transition
            name="focus"
            mode="out-in"
          >
            <div
              v-if="completedSets < progressStore.targetSets"
              :key="completedSets"
              @dblclick="handleSetComplete(completedSets)"
              class="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-500/40 cursor-pointer hover:scale-110 transition-transform duration-300 relative overflow-hidden"
            >
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-white text-5xl font-bold mb-1">
                  {{ progressStore.pushupsPerSet[completedSets] }}
                </span>
                <span class="text-white/90 text-xs font-semibold uppercase tracking-wider">
                  Set {{ completedSets + 1 }}
                </span>
              </div>
              <!-- Pulse animation ring -->
              <div class="absolute inset-0 rounded-3xl border-4 border-white/30 animate-ping"></div>
              <!-- Shine effect -->
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
            </div>
          </Transition>
        </div>

        <!-- All Sets Row -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${progressStore.targetSets}, 1fr)` }">
          <TransitionGroup name="set">
            <div
              v-for="(pushups, index) in progressStore.pushupsPerSet"
              :key="index"
              class="relative aspect-square rounded-2xl transition-all duration-300"
              :class="[
                index < completedSets
                  ? 'bg-gradient-to-br from-emerald-500/40 to-teal-600/40 border-2 border-emerald-400/50'
                  : index === completedSets
                  ? 'bg-white/5 border-2 border-white/5 opacity-30'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10'
              ]"
            >
              <div class="absolute inset-0 flex flex-col items-center justify-center p-2">
                <span
                  class="font-bold transition-all duration-300"
                  :class="[
                    index < completedSets
                      ? 'text-emerald-300 text-xl'
                      : 'text-white/50 text-2xl'
                  ]"
                >
                  {{ pushups }}
                </span>
                <Transition name="checkmark">
                  <div
                    v-if="index < completedSets"
                    class="mt-1 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center"
                  >
                    <span class="text-white text-xs">✓</span>
                  </div>
                </Transition>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Settings Section -->
      <div class="mt-auto">
        <div
          v-if="settingsOpen"
          class="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl"
        >
          <!-- Settings Header -->
          <div
            @click="settingsOpen = false"
            class="flex items-center justify-between mb-6 cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <PhGear :size="24" class="text-white/90" />
              </div>
              <p class="text-white font-semibold text-lg">Settings</p>
            </div>
            <span class="text-white/40 text-sm">Tap to close</span>
          </div>

          <div class="space-y-6">
            <!-- Number of Sets -->
            <div>
              <label class="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3 block">
                Number of Sets
              </label>
              <div class="flex items-center gap-3">
                <button
                  @click="progressStore.setTargetSets(progressStore.targetSets - 1)"
                  class="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                  :disabled="progressStore.targetSets <= 1"
                >
                  −
                </button>
                <div class="flex-1 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <span class="text-white text-2xl font-bold">{{ progressStore.targetSets }}</span>
                </div>
                <button
                  @click="progressStore.setTargetSets(progressStore.targetSets + 1)"
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 flex items-center justify-center text-white font-bold transition-all shadow-lg shadow-emerald-500/30"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Difficulty Scale -->
            <div>
              <label class="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3 block">
                Progress Settings
              </label>
              <div class="space-y-3">
                <div>
                  <label class="text-white/40 text-xs font-medium mb-2 block">Current Day</label>
                  <input
                    type="number"
                    :value="progressStore.cardinalDay"
                    @change="(e) => progressStore.setCardinalDay(Number((e.target as HTMLInputElement).value))"
                    class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                    min="1"
                  />
                </div>
                <div>
                  <label class="text-white/40 text-xs font-medium mb-2 block">Starting Total Pushups</label>
                  <input
                    type="number"
                    v-model.number="startingTotal"
                    @change="progressStore.setStartingTotalPushups(startingTotal)"
                    class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                    min="1"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-white/40 text-xs font-medium mb-2 block">Target Day</label>
                    <input
                      type="number"
                      v-model.number="targetDay"
                      @change="progressStore.setDifficultyScale(targetDay, targetTotal)"
                      class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-white/40 text-xs font-medium mb-2 block">Target Total</label>
                    <input
                      type="number"
                      v-model.number="targetTotal"
                      @change="progressStore.setDifficultyScale(targetDay, targetTotal)"
                      class="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                    />
                  </div>
                </div>
                <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <p class="text-emerald-400 text-sm font-medium">
                    Today's target: {{ progressStore.dailyTotalPushups }} pushups
                  </p>
                </div>
              </div>
            </div>

            <!-- Reset Button -->
            <button
              @click="progressStore.setStartDay()"
              class="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 rounded-xl text-white font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
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
            <div class="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <PhGear :size="28" class="text-white/90" />
            </div>
            <p class="text-white font-semibold text-lg">Open Settings</p>
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
