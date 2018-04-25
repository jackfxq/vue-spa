<template>
  <div class=markdown-container>
    <div class="category">
      <p v-for="item in category" :class="['mk-'+item.tag]" @click="handleClick(item.id)">{{item.text}}</a>
    </div>
    <div class="list-see-content" v-html="htmlStr">
      <!-- <div ></div> -->
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import hljs from  'highlight.js'
import showdown from 'showdown'
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
      txt:'# Marked in the browser\n\nRendered by **marked**.\n```js\n console.log("hello"); \n```',
      htmlStr:'',
      category:[],
      converter:null
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
      // this.htmlStr=marked(this.txt);
      this.converter = new showdown.Converter();
      this.htmlStr = this.converter.makeHtml(this.txt);
    },
    handleClick(id) {
      console.log(this.$el.querySelector('#mk'+id))
      let mk = this.$el.querySelector('#mk'+id);
      this.$nextTick(() => {
        this.$el.querySelector('.list-see-content').scrollTop=mk.offsetTop;
      })
    }
  },
  created() {
    console.log(this.$route.params.id)
    axios.get('/api/list/find',{
      params:{
        id:this.$route.params.id
      }
    }).then((response) => {
    console.log(response)
    this.txt = response.data.data[0].str;
    this.markdownTohtml();
    this.$nextTick(() => {
      console.log(this.$el.querySelectorAll('h2'))
      let titles = this.$el.querySelectorAll('h2,h3');

      titles.forEach((item,index) => {
        item.setAttribute('id','mk'+index)
        // item.setAttribute('class','mk-'+item.localName)
        console.log(item.offsetTop,item.localName)
        this.category.push({
          id:index,
          tag:item.localName,
          text:item.innerHTML,
          height:item.offsetTop-item.offsetHeight
        })
      })
    })
      // this.htmlStr=response.data.data.html;
    })
    // this.markdownTohtml();
  }
}
</script>

<style lang="css">
body{
  margin: 0
}
h1,h2{
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

h2,h3{
  padding:20px 0;
  margin: 0
}

code{
  padding: 0.1em 0.2em;
  background-color: #f6f8fa;
  border-radius: 3px;
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

<style lang="css" scoped>
.markdown-container{
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.category{
  width: 300px;
  border-right: #ddd 5px solid;
  padding:10px
}
.category p{
  cursor: pointer;
  color: #333;
  margin: 10px 0
}

.mk-h3{
  color: #333 !important;
  padding-left: 20px;
  font-size:16px
}
.category p:hover{
  color: #0a951a !important;
}
.list-see-content{
  width: 100%;
  padding:0px 40px;
  height: 100vh;
  overflow-y: auto;
  position: relative;
}
</style>
