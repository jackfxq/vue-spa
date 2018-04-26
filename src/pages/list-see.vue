<template>
  <div class=markdown-container>
    <div class="category">
      <div style="width:245px">
        <p v-for="item in category" :class="['mk-'+item.tag]" @click="handleClick(item.id)">{{item.text}}</a>
      </div>
    </div>
    <div class="list-see-content" v-html="htmlStr">
      <!-- <div  class="html-content"></div> -->
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import hljs from  'highlight.js'
import showdown from 'showdown'
import 'highlight.js/styles/xt256.css'
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
          // if (lang && hljs.getLanguage(lang)) {
          //   return hljs.highlight(lang, code, true).value;
          // } else {
          //   return hljs.highlightAuto(code).value;
          // }
          return hljs.highlightAuto(code).value;
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
      this.htmlStr=marked(this.txt);
      // this.converter = new showdown.Converter();
      // this.htmlStr = this.converter.makeHtml(this.txt);
    },
    handleClick(id) {
      console.log(this.$el.querySelector('#mk'+id))
      let mk = this.$el.querySelector('#mk'+id);
      this.$nextTick(() => {
        this.$el.querySelector('.list-see-content').scrollTop=mk.offsetTop;
        // this.$el.querySelector('.html-content').style.top=-mk.offsetTop+'px';
      })
    }
  },
  created() {
    console.log(this.$route.params.id)
    axios.get('http://111.230.35.213:3000/api/list/find',{
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
blockquote{
  margin: 2em 0;
padding-left: 20px;
border-left: 4px solid #42b983;
}
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
    color: #476582;
    padding: .25rem .5rem;
    margin: 0;
    font-size: .85em;
    background-color: rgba(27,31,35,.05);
    border-radius: 3px;
}
code[class*=lang-]{
  color:#eaecef
}
.lang-html::before{
  content:'html';
  position: absolute;
  top: .8em;
  right: 1em;
  font-size: .75rem;
  color: hsla(0,0%,100%,.4);
}
.lang-js::before{
  content:'js';
  position: absolute;
  top: .8em;
  right: 1em;
  font-size: .75rem;
  color: hsla(0,0%,100%,.4);
}
.lang-javaScript::before{
  content:'javaScript';
  position: absolute;
  top: .8em;
  right: 1em;
  font-size: .75rem;
  color: hsla(0,0%,100%,.4);
}
.lang-javascript::before{
  content:'javaScript';
  position: absolute;
  top: .8em;
  right: 1em;
  font-size: .75rem;
  color: hsla(0,0%,100%,.4);
}
pre{
    background-color: #282c34;
    line-height: 1.4;
    border-radius: 6px;
    padding: 1.25rem 1.5rem;
    margin: .85rem 0;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: auto;
    position: relative;
}

/* code{
  padding: 0.1em 0.2em;
  background-color: #282c34;
  border-radius: 3px;
}

pre{
  padding: 16px;
overflow: auto;
font-size: 85%;
line-height: 1.45;
background-color: #282c34;
border-radius: 3px;
} */
</style>

<style lang="css" scoped>
.markdown-container{
  display: flex;
  flex-direction: row;
  align-items: stretch;
  /*max-width: 1000px;*/
  /*margin: 0 auto;*/
}
.category{
  /* width: 300px; */
  border-right: #ddd 5px solid;
  padding:10px 0 0 20px
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
  max-width: 800px
}
</style>
