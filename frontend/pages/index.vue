<template>
    <v-container>
        <v-row>
            <v-col cols="4">
                <Users ref="usersComponent" :users="users" @selectUser="handleSelectUser" @createUser="handleCreateUser"
                    :errorMessage="errorMessage" />
            </v-col>
            <v-col cols="4">
                <Files ref="filesComponent" :files="selectedFiles" :selectedUserId="selectedUserId"
                    @fileSelected="handleFileUpload" @selectFile="handleSelectFile" />
            </v-col>
            <v-col cols="4">
                <Metadata v-if="selectedFileMetadata" :metadata="selectedFileMetadata" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";
import Users from "@/components/Users.vue";
import Files from "@/components/Files.vue";
import Metadata from "@/components/Metadata.vue";

// Создаем инстанс axios с базовым URL
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    components: { Users, Files, Metadata },
    data() {
        return {
            users: [],
            selectedUser: null,
            selectedUserId: null,
            selectedFiles: [],
            selectedFileMetadata: null,
            errorMessage: "", 
        };
    },
    async mounted() {
        try {
            const response = await apiClient.get("/api/users");
            this.users = response.data;

            // Устанавливаем первого пользователя и его файлы по умолчанию
            if (this.users.length > 0) {
                this.handleSelectUser(this.users[0]._id);
            }
        } catch (error) {
            this.handleError(error, "Ошибка загрузки пользователей");
        }
    },
    methods: {
        handleError(error, defaultMessage) {
            console.error(defaultMessage, error);
            this.errorMessage = error.response?.data?.error || defaultMessage;
        },

        handleSelectUser(userId) {
            this.selectedUserId = userId;
            this.selectedUser = this.users.find((u) => u._id === userId);
            if (this.selectedUser) {
                this.selectedFiles = this.selectedUser.files.map((file) => ({
                    id: file._id,
                    name: file.name,
                    size: file.size,
                }));
                this.selectedFileMetadata = null;
            }
        },

        async handleCreateUser(username) {
            try {
                const response = await apiClient.post("/api/users", { username });
                const newUser = response.data;

                this.users.push(newUser);
                this.errorMessage = ""; 

                this.$refs.usersComponent.closeCreateUser();
            } catch (error) {
                this.handleError(error, "Ошибка создания пользователя");
            }
        },

        async handleSelectFile(fileId) {
            try {
                const response = await apiClient.get(`/api/files/${fileId}`);
                this.selectedFileMetadata = response.data;
            } catch (error) {
                this.handleError(error, "Ошибка загрузки метаданных файла");
            }
        },

        async fetchUserFiles(userId) {
            try {
                const response = await apiClient.get(`/api/users/${userId}`);
                this.selectedFiles = response.data.files;
            } catch (error) {
                this.handleError(error, 'Ошибка получения файлов пользователя');
            }
        },

        async handleFileUpload(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', this.selectedUserId);

            try {
                const response = await apiClient.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const newFile = {
                    id: response.data._id,
                    name: response.data.name,
                    size: response.data.size
                };
                this.selectedFiles.push(newFile);
                this.handleSelectFile(response.data._id);

            } catch (error) {
                this.handleError(error, 'Ошибка загрузки файла');
            }
        },
    },
};
</script>