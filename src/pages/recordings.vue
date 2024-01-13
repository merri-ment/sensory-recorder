<script setup>
const { appStore } = useStores();
const { recordings } = toRefs(appStore);

const enter = (el, done) => {
  done();
};
const leave = (el, done) => {
  done();
};
</script>

<template>
  <Transition @enter="enter" @leave="leave" appear :css="false">
    <main class="recordings">
      <NuxtLink class="home" to="/">Home</NuxtLink>
      <ul>
        <li v-for="(recording, index) in recordings" :key="index">
          <h2>{{ recording.title }}</h2>
          <p>{{ recording.id }}</p>
        </li>
      </ul>
    </main>
  </Transition>
</template>

<style scoped>
.recordings {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .home {
    top: 100px;
    left: 10px;
  }
}
</style>
