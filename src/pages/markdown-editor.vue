<template>
  <div class=markdown-container>
    <div class=markdown-content>
      <div class=editor-region>
        <!-- <textarea v-model="txt"></textarea> -->
        <div class="code-mirror"></div>
      </div>
      <div class=preview-region>
        <div v-html="htmlStr"></div>
      </div>
    </div>
    <button class=save-btn type="button" name="button" @click="update">保存</button>
    <!-- <button @click="add">增加###</button> -->
  </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import hljs from  'highlight.js'
import 'highlight.js/styles/vs2015.css'
// import './heighlight.css'
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'

import 'codemirror/mode/markdown/markdown'

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
      htmlStr:'',
      editor:null
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
      axios.post('http://111.230.35.213:3000/api/list/update',{
        id:this.$route.params.id,
        str:this.txt
      }).then((response) => {
        // this.htmlStr=response.data.data.html;
      })
    },
    add() {
      console.log(this.editor.getSelection())
      let selection = this.editor.getSelection();
      // this.editor.replaceSelection(`### ${selection}`)
      this.editor.replaceSelection(`![]()`)
    }
  },
  created() {
    axios.get('http://111.230.35.213:3000/api/list/find',{
      params:{
        id:this.$route.params.id
      }
    }).then((response) => {
      console.log(response)
      this.txt=response.data.data[0].str;
      this.editor.setValue(this.txt)
      this.markdownTohtml();
    })

    this.$nextTick(() => {
      this.editor = CodeMirror(this.$el.querySelector('.code-mirror'),{
        mode:'markdown',
        styleActiveLine: true,
        lineNumbers:true,
        tabSize:2,
        lineWrapping: true,
      
      })

      this.editor.on('change',() => {
        this.txt = this.editor.getValue()
      })
    })

  }
}
</script>

<style lang="css">
h1,h2{
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.CodeMirror{
  height: 100% !important;
}

/* code{
  padding: 0.1em 0.2em;
  background-color: #f6f8fa;
  border-radius: 3px;
} */
.markdown-container{
  text-align: left;
}
/* pre{
  padding: 16px;
overflow: auto;
font-size: 85%;
line-height: 1.45;
background-color: #f6f8fa;
border-radius: 3px;
} */
</style>

<style lang="css" scoped>
  .markdown-container{
    
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
  }
  .markdown-content{
    display:flex;
    flex-direction: row;
    align-items: stretch;
    margin-top:20px;
    width:100%;
    height:90%;
    border-bottom:1px #ccc solid;
    border-top:1px #ccc solid;
  }
  .editor-region{
    /* padding:10px 0 10px 10px; */
    height:100%;
    box-sizing: border-box;
  }
  .editor-region textarea{
    border:none;
    width:600px;
    height:100%;
    outline:none;
  }

  .code-mirror{
    width:700px;
    height:100%;
  }

  .editor-region textarea:focus{
    border:none;
  }
  .preview-region{
    padding:10px 20px;
    width:100%;
    height:100%;
    border-left:1px #ccc solid;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
  }
  .save-btn{
    position: absolute;
    width: 100px;
    bottom: 10px;
    left: 50%;
    margin-left: -50px;
    cursor: pointer;
    background: #00a3cf;
    border: none;
    color:#fff;
    padding: 5px;
    border-radius:5px;
    outline:none;
  }
</style>
