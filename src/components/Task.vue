<script setup>
const emit = defineEmits(['update:title', 'update:completed', 'update:delete']);

const { task } = defineProps({
  task: Object
});

</script>

<template>
  <li class="task">
    <!-- Редактирование заданий реализованное с помощью отправки ивентов о изменениях в родительский элемент -->
    <div class="title">
      <input type="text" name="title" id="title" :value="task.title" @input="emit('update:title', $event.target.value)">
    </div>
    <div class="completed">
      <input type="checkbox" name="completed" id="completed" :checked="task.completed"
        @change="emit('update:completed', $event.target.checked)">
    </div>
    <div class="delete">
      <button @click="emit('update:delete', $event.target.checked)">X</button>
    </div>
  </li>
</template>

<style scoped>
.task {
  display: flex;
  gap: 0.25rem;
}

.task .title {
  display: flex;
  flex: 1;
}

.title input {
  place-content: center;
  width: 100%;
}

.completed input, .delete button {
  margin: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.delete button {
  background-color: #972f2f;
  border-radius: 3px;
}
</style>
