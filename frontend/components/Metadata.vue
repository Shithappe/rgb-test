<template>
    <v-card>
        <v-card-title>Metadata</v-card-title>
        <v-card-text>
            <div v-if="metadata">
                <p><strong>File Name:</strong> {{ metadata.name }}</p>
                <p><strong>Size:</strong> {{ metadata.size }} bytes</p>
                <p><strong>Format:</strong> {{ metadata.format }}</p>
                <p><strong>Pages:</strong> {{ metadata.pages }}</p>
            </div>
            <div v-else>
                Выберите файл для отображения метаданных.
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        metadata: {
            type: Object,
            default: null,
        },
    },
};
</script>