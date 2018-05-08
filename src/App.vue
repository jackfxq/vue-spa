<template>
  <div id="app">
    <div class="header">
      <div class="menu-container">
        <div class="home" @click="goHome">首页</div>
      </div>
      <div style="position: absolute;right: 10px;top: 0;">
        <div class="login" v-if="!!userName" @click="logout">注销</div>
        <div class="login" >{{userName}}</div>
        <div class="login" v-if="!userName" @click="login">登录</div>
        <div class="login" v-if="!!userName" @click="manage">管理</div>
      </div>
      
    </div>
    <router-view></router-view>
    <el-dialog
      center
      title="登录"
      :visible.sync="dialogVisible"
      width="350px">
      <el-form :model="form" class="demo-form-inline" label-position="right" label-width="80px" >
        <el-form-item label="用户名:">
          <el-input v-model="form.userName" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input v-model="form.pwd" type="passward"  style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click="onSubmit">登 录</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials=true;

export default {
  name: 'app',
  data() {
    return {
      dialogVisible:false,
      form:{
        userName:'',
        pwd:''
      },
      userName:''
    }
  },
  methods:{
    login() {
      this.dialogVisible=true;
    },
    onSubmit() {
      axios.post('http://111.230.35.213:3000/login',{
                userName:this.form.userName,
                pwd:this.form.pwd
            }).then((response) => {
              if(response.data.code === 0 ){
                this.dialogVisible=false;
                this.userName=response.data.data.userName;
                this.$message({
                message: '登录成功',
                type: 'success'
                });
                // location.reload();
              }else{
                this.$message({
                  message: response.data.data,
                  type: 'fail'
                });
              }
              
                // this.htmlStr=response.data.data.html;
            })
      
    },
    logout() {
      axios.get('http://111.230.35.213:3000/logout').then((response) => {
      if(response.data.code === 0){
        this.$message({
                message: '注销成功',
                type: 'success'
                });
        this.userName='';
        location.reload();
      }
      // this.htmlStr=response.data.data.html;
    })
    },
    manage() {
      location.hash='/manage'
    },
    goHome() {
      location.hash='/list'
    }
  },
  created() {
    axios.get('http://111.230.35.213:3000/getUserInfo').then((response) => {
      if(response.data.code === 0){
        this.userName=response.data.data.userName;
      }
      // this.htmlStr=response.data.data.html;
    })

    bus.$on('on-login',() => {
      this.dialogVisible=true;
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  padding-top: 60px;
}
body{
  background: #eee
}
</style>

<style scoped>
.header{
  height:60px;
  width:100%;
  border-bottom:#eee 1px solid;
  background:#fff;
  position: relative;
  position: fixed;
  top: 0;
  padding-right: calc(100vw - 100%);
}
.header .login{
  float: right;
  margin-right: 20px;
  line-height: 60px;
  cursor: pointer;
}
.login:hover{
  color:#409eff
}
.menu-container{
  width:900px;
  margin: 0 auto;
  padding:0 10px;
  box-sizing:border-box;
  display:flex;
}
.home{
  line-height: 60px;
  padding:0 10px;
  cursor: pointer;
}
.home:hover{
  color:#409eff
}
</style>

