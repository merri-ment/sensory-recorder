// composables/useTimer.js
import { ref, onMounted, onUnmounted, computed } from "vue";

export default function useTimer() {
  const time = ref(0);
  const isTimerRunning = ref(false);

  const startTimer = () => {
    isTimerRunning.value = true;
    timerInterval = setInterval(() => {
      time.value++;
    }, 1000);
  };

  const stopTimer = () => {
    isTimerRunning.value = false;
    clearInterval(timerInterval);
  };

  const formattedTime = computed(() => {
    const minutes = Math.floor(time.value / 60);
    const seconds = time.value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  });

  let timerInterval;

  onMounted(() => {
    // Additional setup on component mount
  });

  onUnmounted(() => {
    // Cleanup on component unmount
    clearInterval(timerInterval);
  });

  return {
    startTimer,
    stopTimer,
    formattedTime,
    isTimerRunning,
  };
}
