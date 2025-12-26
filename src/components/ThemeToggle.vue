<template>
  <div
    @click="togglePosition"
    class="w-16 bg-dark rounded-full h-8 flex items-center px-1 cursor-pointer"
  >
    <div
      class="rounded-full w-6 h-6 bg-white transition-transform duration-300"
      :style="{ transform: `translateX(${position * 16}px)` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

type ThemePreference = 'light' | 'dark' | 'system';

const themePreference = ref<ThemePreference>('system');
const position = ref<number>(1); // 0 = light, 1 = system, 2 = dark

const getThemeFromLocalStorage = () => {
  const storedTheme = localStorage.getItem('theme-preference');
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
    themePreference.value = storedTheme;
    // Map theme to position
    position.value = storedTheme === 'light' ? 0 : storedTheme === 'system' ? 1 : 2;
  }
};

const setTheme = (theme: ThemePreference) => {
  themePreference.value = theme;
  localStorage.setItem('theme-preference', theme);
};

const togglePosition = () => {
  position.value = (position.value + 1) % 3;
  // Map position to theme
  const themes: ThemePreference[] = ['light', 'system', 'dark'];
  setTheme(themes[position.value]!);
};

onMounted(() => {
  getThemeFromLocalStorage();
});
</script>
