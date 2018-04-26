<template lang="html">
  <div class="">
    <div v-for="(item,index) in list">
      {{index}}
      <button type="button" name="button" @click="see(item.id)">查看</button>
      <button type="button" name="button" @click="edit(item.id)">编辑</button>
    </div>
    <button type="button" name="button" @click="create">新增</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      list:[]
    }
  },
  methods:{
    create() {
      axios.post('http://111.230.35.213:3000/api/list/create').then((response) => {
        console.log(response)
        this.list.push({
          id:response.data.data.id
        })
      })
    },
    findAll() {
      axios.get('http://111.230.35.213:3000/api/list/findAll').then((response) => {
        console.log(response)
        this.list=response.data.data;
      })
    },
    see(id) {
      location.hash='/list/see/'+id
    },
    edit(id) {
      location.hash = '/markdown-editor/'+id
    }
  },
  created() {
    this.findAll();
  }

}
</script>

<style lang="css">
</style>
