<template>
  <div class="ui-dropdown">
    <div class="dropdown" v-if="!creatingItem && labels.length > 0">
      <select v-model="selectedItem" @change="handleChange">
        <option v-for="(label, index) in labels" :key="index" :value="label">
          {{ label }}
        </option>
        <option value="__create__">Create List Item</option>
      </select>
      <button>
        <IconsDownArrow />
      </button>
    </div>

    <div class="create" v-if="creatingItem || labels.length === 0">
      <input v-model="newItemLabel" placeholder="Create Label" />
      <button @click="addItem">Add</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["added", "selected"]);
const props = defineProps({
  labels: {
    default: () => [],
    type: Array,
  },
  selectedLabel: {
    default: "",
    type: String,
  },
});

const { labels } = toRefs(props);
const selectedItem = ref(props.selectedLabel);
const creatingItem = ref(false);
const newItemLabel = ref("");

const handleChange = (e) => {
  if (selectedItem.value === "__create__") {
    creatingItem.value = true;
    newItemLabel.value = ""; // Clear input field
  } else {
    creatingItem.value = false;
    emit("selected", selectedItem.value);
  }
};

const addItem = () => {
  const label = newItemLabel.value.trim();
  if (label !== "") {
    // Add the new item to your list
    // labels.value.push(newItemLabel.value);
    emit("added", label);
    // Reset state
    selectedItem.value = label;
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
