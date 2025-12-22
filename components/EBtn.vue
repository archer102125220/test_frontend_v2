<template>
  <button class="e_btn" :css-color="color" type="button">
    {{ text || '' }}
    <slot v-if="hasText === false" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  color?: 'success' | 'error' | 'warn'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success',
})

const hasText = computed(() => typeof props.text === 'string' && props.text !== '')
</script>

<style scoped lang="scss">
.e_btn {
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;

  
  font-size: 14px;
  font-weight: 500;
  color: #fff;

  
  background-color: #4caf50;

  /* Animation */
  transition: all 0.3s ease;

  /* Misc */
  cursor: pointer;
  outline: none;

  &[css-color='success'] {
    background-color: #4caf50;

    &:hover {
      background-color: #45a049;
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }

    &:active {
      background-color: #3d8b40;
      transform: translateY(1px);
    }
  }

  &[css-color='error'] {
    background-color: #f44336;

    &:hover {
      background-color: #da190b;
      box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
    }

    &:active {
      background-color: #c41c0c;
      transform: translateY(1px);
    }
  }

  &[css-color='warn'] {
    background-color: #ff9800;

    &:hover {
      background-color: #fb8c00;
      box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
    }

    &:active {
      background-color: #e65100;
      transform: translateY(1px);
    }
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;

    &:hover {
      background-color: #ccc;
      box-shadow: none;
    }
  }
}
</style>
