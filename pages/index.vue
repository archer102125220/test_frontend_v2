<template>
  <div class="index_page">
    <header class="index_page-header">
      <h1 class="index_page-header-title">{{ t('title') }}</h1>
      <p class="index_page-header-subtitle">{{ t('subtitle') }}</p>
    </header>

    <section class="index_page-form_section">
      <h2 class="index_page-form_section-section_title">
        {{ isEditing ? t('form.editUser') : t('form.addUser') }}
      </h2>
      <form class="index_page-form_section-form" @submit.prevent="handleSubmit">
        <ETextField
          id="user-name"
          type="text"
          v-model="newUserName"
          :label="t('form.name')"
          :placeholder="t('form.namePlaceholder')"
        />
        <ETextField
          id="user-age"
          type="number"
          v-model="newUserAge"
          :label="t('form.age')"
          :placeholder="t('form.agePlaceholder')"
        />
        <div class="index_page-form_section-form-actions">
          <EBtn v-if="isEditing" color="warn" :text="t('form.cancel')" @click="cancelEdit" />
          <EBtn
            color="success"
            type="submit"
            :text="isEditing ? t('form.update') : t('form.submit')"
          />
        </div>
      </form>
    </section>

    <section class="index_page-list_section">
      <h2 class="index_page-list_section-section_title">{{ t('list.title') }}</h2>
      <div v-if="userStore.loading" class="index_page-list_section-loading">
        {{ t('list.loading') }}
      </div>
      <div v-else-if="userStore.error" class="index_page-list_section-error">
        {{ t('list.error') }}: {{ userStore.error }}
      </div>
      <div v-else-if="userStore.users.length === 0" class="index_page-list_section-empty">
        {{ t('list.empty') }}
      </div>
      <table v-else class="index_page-list_section-table">
        <thead class="index_page-list_section-table-head">
          <tr class="index_page-list_section-table-row">
            <th class="index_page-list_section-table-header">ID</th>
            <th class="index_page-list_section-table-header">{{ t('form.name') }}</th>
            <th class="index_page-list_section-table-header">{{ t('form.age') }}</th>
            <th class="index_page-list_section-table-header">{{ t('list.actions') }}</th>
          </tr>
        </thead>
        <tbody class="index_page-list_section-table-body">
          <tr
            v-for="user in userStore.users"
            :key="user.id"
            class="index_page-list_section-table-row"
          >
            <td class="index_page-list_section-table-cell">{{ user.id }}</td>
            <td class="index_page-list_section-table-cell">{{ user.name || user }}</td>
            <td class="index_page-list_section-table-cell">{{ user.age }}</td>
            <td class="index_page-list_section-table-cell">
              <div class="index_page-list_section-table-actions">
                <EBtn :text="t('list.edit')" color="warn" @click="startEdit(user)" />
                <EBtn :text="t('list.delete')" color="error" @click="confirmDelete(user)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <dialog ref="dialogRef" class="index_page-dialog">
      <div class="index_page-dialog-content">
        <h3 class="index_page-dialog-title">{{ dialogData.title }}</h3>
        <p class="index_page-dialog-message">{{ dialogData.message }}</p>
        <div class="index_page-dialog-actions">
          <EBtn :text="t('dialog.cancel')" color="warn" @click="closeDialog" />
          <EBtn :text="t('dialog.confirm')" color="success" @click="dialogData.onConfirm" />
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import { createUser, updateUser, deleteUser } from '@/services/user'

const { t } = useI18n()
const userStore = useUserStore()

const newUserName = ref('')
const newUserAge = ref('')

const isEditing = ref(false)
const editingUserId = ref<number | null>(null)

const dialogRef = ref<HTMLDialogElement | null>(null)
const dialogData = reactive({
  title: '',
  message: '',
  onConfirm: () => {},
})

const { data: usersData } = await useGetUsers()

if (usersData.value) {
  userStore.setUsers(usersData.value)
}
console.log(userStore.users)

function validateForm(): boolean {
  console.log(newUserName.value)
  console.log(newUserAge.value)
  if (newUserName.value.trim() === '') {
    alert(t('validation.nameRequired'))
    return false
  }

  if (newUserAge.value.trim() === '' || parseInt(newUserAge.value) <= 0) {
    alert(t('validation.ageInvalid'))
    return false
  }

  return true
}

function resetForm() {
  newUserName.value = ''
  newUserAge.value = ''
  isEditing.value = false
  editingUserId.value = null
}

async function handleSubmit() {
  if (validateForm() === false) return

  const action = isEditing.value ? t('dialog.updateTitle') : t('dialog.createTitle')
  const message = isEditing.value ? t('dialog.updateMessage') : t('dialog.createMessage')

  showDialog(action, message, async function () {
    try {
      userStore.setLoading(true)
      const userData = {
        name: newUserName.value,
        age: parseInt(newUserAge.value),
      }

      if (isEditing.value && editingUserId.value) {
        const updated = await updateUser({
          id: editingUserId.value,
          ...userData,
        })
        userStore.updateUser(updated)
      } else {
        const created = await createUser(userData)
        userStore.addUser(created)
      }

      resetForm()
      closeDialog()
    } catch (error: any) {
      userStore.setError(error.message || 'Operation failed')
      alert(t('error.operationFailed'))
    } finally {
      userStore.setLoading(false)
    }
  })
}

function startEdit(user: User) {
  if (typeof user.id !== 'number') return
  newUserName.value = user.name || ''
  newUserAge.value = user.age?.toString() || ''
  isEditing.value = true
  editingUserId.value = user.id

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  resetForm()
}

function confirmDelete(user: User) {
  if (!user.id) return
  showDialog(t('dialog.deleteTitle'), t('dialog.deleteMessage', { name: user.name }), async () => {
    try {
      userStore.setLoading(true)
      await deleteUser(user.id!)
      userStore.removeUser(user.id!)
      closeDialog()
    } catch (error: any) {
      userStore.setError(error.message || 'Delete failed')
      alert(t('error.deleteFailed'))
    } finally {
      userStore.setLoading(false)
    }
  })
}

function showDialog(title: string, message: string, onConfirm: () => void) {
  dialogData.title = title
  dialogData.message = message
  dialogData.onConfirm = onConfirm
  dialogRef.value?.showModal()
}

function closeDialog() {
  dialogRef.value?.close()
}
</script>

<style scoped lang="scss">
%data_block {
  padding: 40px;
  text-align: center;
  border-radius: 8px;

  font-size: 16px;
}
%section_block {
  max-width: 85dvw;
  margin: auto;
  margin-bottom: 40px;
}
%section_title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 20px 0;

  @include tablet {
    font-size: 20px;
  }
  @include mobile {
    font-size: 18px;
  }
}
%data_field {
  padding: 16px;

  text-align: left;

  @include tablet {
    padding: 12px 8px;
  }
  @include mobile {
    padding: 8px 4px;
  }
}

.index_page {
  min-height: 100dvh;
  padding: 20px;

  background-color: #2a2a2a;

  @include tablet {
    padding: 12px;
  }
  @include mobile {
    padding: 8px;
  }

  &-header {
    max-width: 1200px;
    margin-bottom: 40px;
    text-align: center;

    &-title {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;

      @include tablet {
        font-size: 24px;
      }
      @include mobile {
        font-size: 20px;
      }
    }

    &-subtitle {
      font-size: 16px;
      color: #ffffff;
      margin: 0;

      @include mobile {
        font-size: 14px;
      }
    }
  }

  &-form_section {
    @extend %section_block;

    &-section_title {
      @extend %section_title;
    }

    &-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px;
      border-radius: 12px;

      border: 1px solid #ffffff;

      @include mobile {
        padding: 16px;
      }

      &-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
    }
  }
  &-list_section {
    @extend %section_block;

    &-section_title {
      @extend %section_title;
    }

    &-loading {
      @extend %data_block;

      background-color: #e3f2fd;
      color: #1976d2;
    }

    &-error {
      @extend %data_block;

      background-color: #ffebee;
      color: #c62828;
    }

    &-empty {
      @extend %data_block;

      background-color: #f5f5f5;
      color: #666;
    }

    &-table {
      width: 100%;

      border: 1px solid #e0e0e0;
      border-radius: 8px;
      border-collapse: collapse;

      background-color: #2a2a2a;

      @include tablet {
        font-size: 14px;
      }
      @include mobile {
        font-size: 12px;
      }

      &-head {
        background-color: #5f5f5f;
      }

      &-row {
        border-bottom: 1px solid #e0e0e0;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #7a7a7a;
        }
      }

      &-header {
        @extend %data_field;

        font-weight: 600;
        color: #ffffff;
      }

      &-cell {
        @extend %data_field;
        color: #e1e1e1;
      }

      &-actions {
        display: flex;
        gap: 8px;

        @include tablet {
          flex-direction: column;
        }
        @include mobile {
          flex-direction: column;
        }
      }
    }
  }

  &-dialog {
    padding: 0;
    border: none;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;

    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

    &::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }

    &-content {
      padding: 32px;

      @include mobile {
        padding: 20px;
      }
    }

    &-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;

      @include mobile {
        font-size: 20px;
      }
    }

    &-message {
      font-size: 16px;
      color: #666;
      margin: 0 0 24px 0;
      line-height: 1.5;

      @include mobile {
        font-size: 14px;
      }
    }

    &-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;

      @include mobile {
        flex-direction: column-reverse;
      }
    }
  }
}
</style>
