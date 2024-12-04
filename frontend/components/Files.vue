<template>
    <v-card>
        <v-card-title>
            <div class="w-full flex justify-between items-center pb-2 border-b-2 border-gray-400">
                <div>Files</div>
                <v-btn density="compact" size="small" icon="mdi-plus" @click="triggerFileUpload" />
            </div>
        </v-card-title>
        <v-list>
            <v-list-item v-for="file in files" :key="file.id" @click="selectFile(file.id)"
                :class="{ 'v-list-item--active': localSelectedFileId === file.id }">
                <v-list-item-title class="flex justify-between items-center">
                    <div>{{ file.name }}</div>
                    <div class="text-sm text-slate-500">{{ (file.size / 1048576).toFixed(2) }} MB</div>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
export default {
    props: {
        files: {
            type: Array,
            required: true,
        },
        selectedFileId: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            localSelectedFileId: this.selectedFileId, // Локальная копия selectedFileId
        };
    },
    watch: {
        // Следим за изменениями в props
        selectedFileId(newValue) {
            this.localSelectedFileId = newValue;
        },
        // Следим за локальным выбранным файлом
        localSelectedFileId(newValue) {
            if (newValue) {
                this.selectFile(newValue);
            }
        }
    },
    methods: {
        selectFile(fileId) {
            // Проверяем, что fileId существует и не undefined
            if (fileId) {
                this.localSelectedFileId = fileId;
                this.$emit('selectFile', fileId);
            }
        },
        triggerFileUpload() {
            // Создаем элемент для выбора файла
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf';  // Ограничение выбора только .pdf файлов

            fileInput.onchange = () => {
                const file = fileInput.files[0];
                if (file) {
                    this.$emit('fileSelected', file);  // Отправляем выбранный файл в родительский компонент
                }
            };

            fileInput.click();
        },
    },
};
</script>