<template>
  <div class="ui-dropdown">
    <div class="dropdown" v-if="!creatingItem && items.length > 0">
      <select v-model="selectedItem" @change="handleChange">
        <option v-for="(item, index) in items" :key="index" :value="item">
          {{ item }}
        </option>
        <option value="__create__">Create List Item</option>
      </select>
      <button>
        <IconsDownArrow />
      </button>
    </div>

    <div class="create" v-if="creatingItem || items.length === 0">
      <input v-model="newItemLabel" placeholder="Create Label" />
      <button @click="addItem">Add</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const items = ref([]);
const selectedItem = ref(null);
const creatingItem = ref(false);
const newItemLabel = ref("");

const handleChange = () => {
  if (selectedItem.value === "__create__") {
    creatingItem.value = true;
    newItemLabel.value = ""; // Clear input field
  } else {
    creatingItem.value = false;
  }
};

const addItem = () => {
  if (newItemLabel.value.trim() !== "") {
    // Add the new item to your list
    items.value.push(newItemLabel.value);
    // Reset state
    selectedItem.value = newItemLabel.value;
    creatingItem.value = false;
  }
};
</script>

<style lang="sass" scoped>
@import "@/styles/shared.sass"

.ui-dropdown
  grid-column: 3/16
  align-self: center
  position: relative
  margin-bottom: 10rem

  button
    width: 23%
    background: $pink
    height: 100%
    position: absolute
    right: 0
    top: 0
    content: ''
    display: flex
    align-items: center
    justify-content: center
    font-family: "Koulen", sans-serif
    font-size: 2rem
    letter-spacing: 0.07em

  .dropdown button
    pointer-events: none

  select, input
    width: 100%
    height: 5rem
    border: none
    border-radius: 0
    background: white
    color: $pink
    font-family: "Koulen", sans-serif
    padding: 0 2rem
    font-size: 2rem
    letter-spacing: 0.07em
</style>
