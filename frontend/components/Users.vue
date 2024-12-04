<template>
    <v-card>
        <v-card-title>
            <div class="w-full flex justify-between items-center pb-2 border-b-2 border-gray-400">
                <div>Users</div>
                <v-btn density="compact" size="small" icon="mdi-plus" @click="isCrateUser = !isCrateUser" />
            </div>
        </v-card-title>
        <v-list>
            <v-list-item v-if="isCrateUser">
                <div class="w-full flex gap-x-4 justify-between items-center">
                    <v-text-field v-model="newUsername" label="New user" variant="underlined" :hint="errorMessage"
                        :error-messages="errorMessage" />
                    <div class="flex gap-x-1">
                        <v-btn density="compact" size="small" icon="mdi-checkbox-marked-circle" @click="createUser" />
                        <v-btn density="compact" size="small" icon="mdi-cancel" @click="closeCreateUser" />
                    </div>
                </div>
            </v-list-item>
            <v-list-item v-for="user in users" :key="user._id" @click="selectUser(user._id)"
                :class="{ 'v-list-item--active': selectedUserId === user._id }">
                <v-list-item-title class="flex justify-between items-center">
                    <div>{{ user.username }}</div>
                    <div class="text-sm text-slate-500">{{ user.files.length }} file(s)</div>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selectedUserId: null, // Хранит ID выбранного пользователя
            isCrateUser: false,
            newUsername: "",
            errorMessage: "", // Для отображения ошибки
        };
    },
    methods: {
        selectUser(userId) {
            this.selectedUserId = userId; // Устанавливаем выбранного пользователя
            this.$emit("selectUser", userId); // Отправляем событие на родительский компонент
        },
        createUser() {
            if (this.newUsername) {
                this.$emit("createUser", this.newUsername); // Передаем создание пользователя в родительский компонент
            }
        },
        closeCreateUser() {
            this.isCrateUser = false;
            this.newUsername = "";
            this.errorMessage = ""; // Очищаем сообщение об ошибке при закрытии формы
        },
    },
};
</script>