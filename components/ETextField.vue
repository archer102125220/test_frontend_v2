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
      :css-is-error="`${isError}`"
      class="e_text_field-input"
      @input="handleInput"
    />
    <div class="e_text_field-error" :css-is-visible="`${isError}`">
      <span class="e_text_field-error-text">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  modelValue?: string
  type?: string
  placeholder?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  placeholder: '',
  error: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isError = computed(() => {
  return typeof props.error === 'string' && props.error !== ''
})
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

    transition: all 0.3s ease;

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

    &[css-is-error='true'] {
      border-color: #f44336;
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);

      &:focus {
        border-color: #f44336;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
      }

      &:hover {
        border-color: #d32f2f;
      }
    }
  }

  &-error {
    display: grid;
    grid-template-rows: 0fr;

    transition: grid-template-rows 0.3s ease;

    &[css-is-visible='true'] {
      grid-template-rows: 1fr;
    }

    &-text {
      overflow: hidden;

      font-size: 12px;
      color: #f44336;
    }
  }
}
</style>
