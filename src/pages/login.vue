<template>
  <div>
      <div class="login-container">
          <h1 style="margin:10px 0;font-weight: normal;font-size:20px;text-align:center;">登录</h1>
          <div style="margin:10px 0">
            <span style="display:inline-block;width:80px;text-align:right">用户名：</span>
            <el-input v-model="userName" style="display:inline-block;width:200px"></el-input>
          </div>
          <div style="margin:10px 0">
              <span style="display:inline-block;width:80px;text-align:right">密码：</span>
              <el-input type="password" v-model="pwd" style="display:inline-block;width:200px"></el-input>
          </div>
          <div style="text-align:center">
            <el-button @click="login" style="margin:10px 0">登录</el-button>
          </div>
          
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
          userName:'',
          pwd:''
        }
    },
    methods:{
        login() {
            axios.post('/login',{
                userName:this.userName,
                pwd:this.pwd
            }).then((response) => {
                this.$message({
                message: '保存成功',
                type: 'success'
                });
                // this.htmlStr=response.data.data.html;
            },() => {
                this.$message({
                message: '保存失败',
                type: 'fail'
                });
            })
        }
    }
}
</script>

<style scoped>
    .login-container{
        position: fixed;
        width: 320px;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #409EFF;
        color: #fff;
        border-radius: 10px;
        font-size: 16px;
        /* text-align: center; */
    }
</style>


