<template>
  <div class="e_text_field">
    <label v-if="label" :for="uniqueId" class="e_text_field-label">
      {{ label }}
    </label>
    <input
      :id="uniqueId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="e_text_field-input"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  modelValue?: string
  type?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  placeholder: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const uniqueId = computed(() => {
  if (props.id) return props.id
  return `e-text-field-${Math.random().toString(36).substring(2, 11)}`
})

const inputValue = computed({
  get: () => props.modelValue,
  set(newValue: string) {
    emit('update:modelValue', newValue)
  },
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
}
</script>

<style scoped lang="scss">
.e_text_field {
  
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  &-label {
    
    font-size: 14px;
    font-weight: 500;
    color: #333;

    /* Misc */
    cursor: pointer;
  }

  &-input {
    
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;

    
    font-size: 14px;
    color: #333;

    
    background-color: #fff;

    /* Animation */
    transition: all 0.3s ease;

    /* Misc */
    outline: none;

    &:focus {
      border-color: #4caf50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }

    &:hover {
      border-color: #bbb;
    }

    &::placeholder {
      color: #999;
    }
  }
}
</style>
