<template>
  <v-container fluid fill-height>
    <v-row justify="center" align="center">
      <v-card width="400" elevation="12" style>
        <v-card-title class="justify-center">Docx to PDF</v-card-title>
        <v-card-text class="px-5 pt-10">
          <v-row>
            <v-file-input
              v-model="files"
              chips
              multiple
              show-size
              counter
              rounded
              filled
              accept=".docx"
              label="Upload your file"
            ></v-file-input>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                v-show="canDownload"
                rounded
                text
                to="/loadfile"
                >Dowload file</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                block
                rounded
                :loading="isLoading"
                color="primary"
                @click.prevent="submitFiles()"
                >Uplaod</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      files: null,
      isLoading: null,
      canDownload: false,
    }
  },
  methods: {
    submitFiles() {
      this.isLoading = true
      if (this.files) {
        const formData = new FormData()
        for (const file of this.files) {
          formData.append('files', file, file.name)
        }
        axios
          .post('http://127.0.0.1:5000/api/v1/convert', formData)
          .then((response) => {
            const status = response.data.status
            if (status === 'Finish') {
              this.files = null
              this.isLoading = false
              this.canDownload = true
              // this.$router.push('/loadfile')
            }
          })
          .catch((error) => {
            console.log({ error })
          })
      } else {
        console.log('there are no files.')
      }
    },
  },
}
</script>
<style>
.v-main {
  background: wheat;
}
</style>
