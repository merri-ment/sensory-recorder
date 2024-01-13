<template>
  <div class="ui-dropdown">
    <div class="dropdown" v-if="!creatingItem">
      <select
        v-if="!creatingItem"
        v-model="selectedItem"
        @change="handleChange"
      >
        <option v-for="(item, index) in items" :key="index" :value="item">
          {{ item }}
        </option>
        <option value="__create__">Create List Item</option>
      </select>
      <div class="dropdown-btn">
        <IconsDownArrow />
      </div>
    </div>

    <div class="create" v-if="creatingItem">
      <input v-model="newItemLabel" placeholder="Create Label" />
      <button @click="addItem">Add</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const items = ref(["Option One", "Option Two", "Option Three"]);
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

  .dropdown

    .dropdown-btn
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

      .arrow
        padding: 10px
        background-color: #3498db
        color: #fff
        border: none
        cursor: pointer
        position: relative
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiklEQVR42mJ8fPHgoKADAwMT/A4XXPZ5gkCgwGhGKnCkEoQQUwGKwo+qVgzFMPQgA5wMslMZUohCpQwMVEFk5C6QMDAysEBGExAECA2eQkMyaGWGAAAAAElFTkSuQmCC') no-repeat right center
        background-size: 10px

    select
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
