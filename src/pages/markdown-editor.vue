<template>
  <div class=markdown-container>
    <textarea v-model="txt" style="width:600px;height:200px"></textarea>
    <button type="button" name="button" @click="update">保存</button>
    <div v-html="htmlStr"></div>
  </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import hljs from  'highlight.js'
import 'highlight.js/styles/default.css'
// import './heighlight.css'

console.log(hljs)
console.log(marked)

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(lang, code, true).value;
          } else {
            return hljs.highlightAuto(code).value;
          }
      }

});

export default {
  data() {
    return {
      txt:'',
      htmlStr:''
    }
  },
  watch:{
    txt(val) {
      this.markdownTohtml();
    }
  },
  methods:{
    markdownTohtml() {
      console.log(111)
      // axios.post('/api/markdown',{
      //   str:this.txt
      // }).then((response) => {
      //   this.htmlStr=response.data.data.html;
      // })
      this.htmlStr=marked(this.txt);
    },
    update() {
      axios.post('/api/list/update',{
        id:this.$route.params.id,
        str:this.txt
      }).then((response) => {
        // this.htmlStr=response.data.data.html;
      })
    }
  },
  created() {
    axios.get('/api/list/find',{
      params:{
        id:this.$route.params.id
      }
    }).then((response) => {
    console.log(response)
      this.txt=response.data.data[0].str;
      this.markdownTohtml();
    })

  }
}
</script>

<style lang="css">
h1,h2{
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

code{
  padding: 0.1em 0.2em;
  background-color: #f6f8fa;
  border-radius: 3px;
}
.markdown-container{
  text-align: left;
}
pre{
  padding: 16px;
overflow: auto;
font-size: 85%;
line-height: 1.45;
background-color: #f6f8fa;
border-radius: 3px;
}
</style>
