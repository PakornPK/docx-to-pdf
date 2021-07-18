<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="fileReport" :search="search">
      <template v-slot:item="{ item }">
        <tr>
          <td class="d-block d-sm-table-cell">{{ item.Id }}</td>
          <td class="d-block d-sm-table-cell">{{ item.name }}</td>
          <td class="d-block d-sm-table-cell">{{ item.datetime }}</td>
          <td class="d-block d-sm-table-cell">
            <v-btn
              class="mr-2"
              color="primary"
              block
              @click.prevent="downloadItem(item)"
            >
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </td>
        </tr>
      </template></v-data-table
    >
  </v-card>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: '#',
          align: 'start',
          filterable: false,
          value: 'Id',
          width: '5%',
        },
        { text: 'File Name', value: 'name', width: '37.5%' },
        { text: 'DateTime', value: 'datetime', width: '37.5%' },
        { text: 'Action', value: '', width: '20%' },
      ],
      fileReport: [],
    }
  },
  mounted() {
    this.getReport()
  },
  methods: {
    getReport() {
      const url = `http://127.0.0.1:5000/api/v1/get-file-list`
      axios
        .get(url)
        .then((response) => {
          this.fileReport = response.data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    downloadItem(item) {
      const url = `http://127.0.0.1:5000/api/v1/download/${item.name}`
      axios
        .get(url, { responseType: 'blob' })
        .then((response) => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', `${item.name}`)
          document.body.appendChild(fileLink)
          fileLink.click()
        })
        .catch(console.error)
    },
  },
}
</script>
