<script setup>
import { ref } from 'vue'

const emit = defineEmits(['input', 'fileEmitted'])

const imageTypes = 'image/';

const previewImage = ref(null);
const fileInput = ref(null);

function selectImage () {
    previewImage.value = null
    fileInput.value.value = null;
    emit('fileEmitted', '', '')
    fileInput.value.click()
}

function pickFile () {
    let input = fileInput.value
    let file = input.files
    if (file && file[0] && file[0].type.startsWith(imageTypes)) {
        let fileName = file[0].name
        let reader = new FileReader()
        reader.onload = (e) => {
            previewImage.value = e.target.result
            emit('fileEmitted', fileName, e.target.result)
        }
        reader.readAsDataURL(file[0])
        emit('input', file[0])
    }
}
</script>

<template>
<div class="card">
    <div
        class="imagePreviewWrapper d-flex justify-content-center align-items-center m-0 p-0"
        :style="{ 'background-image': `url(${previewImage})` }"
        @click="selectImage"
        @drop="selectImage">

        <img v-if="!previewImage" class="upload-placeholder" src="@/assets/upload.svg" alt="upload an image">
    </div>

    <input
        name="image"
        ref="fileInput"
        type="file"
        accept="image/*"
        @input="pickFile"
        hidden>
</div>
</template>

<style scoped>
.card {
    width: 300px;
    height: 500px;
}
.imagePreviewWrapper {
    width: 300px;
    height: 500px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: cover;
    background-position: center center;
}
</style>
