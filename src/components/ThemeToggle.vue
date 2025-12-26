<template>
  <div class="w-full flex items-center justify-between">
    <span class="text-sm font-medium capitalize">{{ themePreference }}</span>
    <div
      @click="togglePosition"
      class="w-16 dark:bg-dark outline outline-gray-300 dark:outline-0 bg-light rounded-full h-8 flex items-center px-1 cursor-pointer"
    >
      <div
        class="rounded-full dark:bg-white bg-gray-50 w-6 h-6 outline outline-gray-300 dark:outline-0 transition-transform duration-300"
        :style="{ transform: `translateX(${position * 16}px)` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
type ThemePreference = 'light' | 'dark' | 'system';

const themePreference = ref<ThemePreference>('system');
const position = ref<number>(1); // 0 = light, 1 = system, 2 = dark

const applyTheme = (theme: ThemePreference) => {
  const html = document.documentElement;

  if (theme === 'system') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  } else if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

const getThemeFromLocalStorage = () => {
  const storedTheme = localStorage.getItem('theme-preference');
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
    themePreference.value = storedTheme;
    // Map theme to position
    position.value = storedTheme === 'light' ? 0 : storedTheme === 'system' ? 1 : 2;
  } else {
    themePreference.value = 'system';
    position.value = 1;
  }
  applyTheme(themePreference.value);
};

const setTheme = (theme: ThemePreference) => {
  themePreference.value = theme;
  localStorage.setItem('theme-preference', theme);
  applyTheme(theme);
};

const togglePosition = () => {
  position.value = (position.value + 1) % 3;
  // Map position to theme
  const themes: ThemePreference[] = ['light', 'system', 'dark'];
  setTheme(themes[position.value]!);
};

onMounted(() => {
  getThemeFromLocalStorage();

  // Listen for system theme changes when in system mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (themePreference.value === 'system') {
      applyTheme('system');
    }
  });
});
</script>
