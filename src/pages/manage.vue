<template lang="html">
  <div class="list-container">
    <!-- <div v-for="(item,index) in list">
      {{index}}
      <button type="button" name="button" @click="see(item.id)">查看</button>
      <button type="button" name="button" @click="edit(item.id)">编辑</button>
    </div> -->
    <div v-for="(item,index) in list" class="list-item">
      <!-- {{index}}
      <button type="button" name="button" @click="see(item.id)">查看</button>
      <button type="button" name="button" @click="edit(item.id)">编辑</button> -->
      <h1 @click="see(item.id)">{{item.title}}</h1>
      <div class="time">发表于{{item.time}}</div>
      <p class="abstract">{{item.abstract}}</p>
      <el-button @click="see(item.id)">查看全文</el-button>
      <el-button @click="edit(item.id)">编辑</el-button>
      <el-button @click="remove(item.id,index)">删除</el-button>
    </div>
    <div style="text-align:center;margin:20px 0">
      <el-button @click="create" type="primary">新 增</el-button>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  data() {
    return {
      list:[]
    }
  },
  methods:{
    create() {
      axios.post('http://111.230.35.213:3000/api/manage/create').then((response) => {
        console.log(response)
        this.list.push({
          id:response.data.data.id
        })
        location.hash = '/markdown-editor/'+response.data.data.id
      })
    },
    remove(id,index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('http://111.230.35.213:3000/api/manage/remove',{id:id}).then((response) => {
            this.list.splice(index,1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            console.log(response)
          })
          
        }).catch(() => {
                   
        });
      
    },
    findAll() {
      axios.get('http://111.230.35.213:3000/api/manage/findAll').then((response) => {
        console.log(response)
        if(response.data.code === 0 ){
          this.list=response.data.data;
          this.list.map((item) => {
          item.time=moment(item.id*1).format('YYYY-MM-DD HH:mm:ss');
            return item
          })
        }else{
          bus.$emit('on-login')
        }
        
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

<style lang="css" scoped>
  .list-container{
    max-width:900px;
    margin: 0 auto;
    background: #fff;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .list-item{
    padding:10px;
    border-bottom:#ddd 1px solid;
  }
  .list-item h1{
    cursor: pointer;
    margin: 15px 0;
    font-size: 20px;
  }
  .list-item .time{
    color: #aaa;
    font-size: 14px;
  }
  .list-item .abstract{
    font-size: 14px;
    margin: 10px 0 15px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    overflow: hidden;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
  }
</style>
