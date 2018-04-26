<template>
  <div class=markdown-container>
    <div class="markdown-tool">
      <h1 @click="addTitle(1)">H1</h1>
      <h1 @click="addTitle(2)">H2</h1>
      <h1 @click="addTitle(3)">H3</h1>
      <h1 @click="addTitle(4)" style="padding-right:10px">H4</h1>
      <div @click="toolChange('**{tpl}**')" class="tool-bold">B</div>
      <div @click="toolChange('~~{tpl}~~')" class="tool-item" style="text-decoration:line-through">S</div>
      <div @click="toolChange('*{tpl}*')" class="tool-item" style="font-style:italic;">I</div>
      <div @click="fristUp" class="tool-item">Aa</div>
      <div @click="strUp" class="tool-item">A</div>
      <div @click="strDown" class="tool-item" style="line-height:30px;border-right:1px rgba(256,256,256,0.5) solid;padding-right:10px">a</div>
      <div @click="toolChange('1. {tpl}')" class="tool-item">
        <Icon type="navicon"></Icon>
      </div>
      <div class="tool-save"><span @click="update">保存</span></div>
    </div>
    <div class=markdown-content>
      <div class=editor-region>
        <!-- <textarea v-model="txt"></textarea> -->
        <div class="code-mirror"></div>
      </div>
      <div class=preview-region>
        <div v-html="htmlStr"></div>
      </div>
    </div>
    <!-- <button class=save-btn type="button" name="button" @click="update">保存</button> -->
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
    addTitle(num) {
      console.log(this.editor.getSelection(),new Array(num+1).join("#"))
      let selection = this.editor.getSelection();
      this.editor.replaceSelection(`${new Array(num+1).join("#")} ${selection}`)
      // this.editor.replaceSelection(`![]()`)
    },
    handleBold() {
      let selection = this.editor.getSelection();
      this.editor.replaceSelection(`**${selection}**`)
    },
    toolChange(str) {
      let selection = this.editor.getSelection();
      this.editor.replaceSelection(str.replace('{tpl}',selection))
    },
    fristUp() {
      let selection = this.editor.getSelection();
      this.editor.replaceSelection(selection.toLowerCase().replace(/^[a-z]/,(a) => a.toUpperCase()));
    },
    strUp() {
      let selection = this.editor.getSelection();
      this.editor.replaceSelection(selection.toUpperCase());
    },
    strDown() {
      let selection = this.editor.getSelection();
      this.editor.replaceSelection(selection.toLowerCase());
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
    margin-top:40px;
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
  }
  .markdown-tool{
    height:40px;
    width:100%;
    background-color:#05355f;
    display:flex;
    flex-direction:row;
    align-items: center;
    /* justify-content:center; */
    padding:0 10px;
    position: fixed;
    top:0;
    left:0;
    color:#fff;
    font-size:16px;
  }
  h1,h2,h3,h4{
    padding:0;
    margin:0;
    color:#fff;
    font-size:16px;
    font-weight:normal;
    border:none;
    line-height:40px;
    cursor: pointer;
    padding:0px 5px

  }
  h1:hover,h2:hover,h3:hover,h4:hover,.tool-bold:hover{
    color:#f57
  }

  .tool-bold{
    color:#fff;
    border-left:1px rgba(256,256,256,0.5) solid;
    cursor: pointer;
    line-height:30px;
    padding:0 5px 0 10px;
  }

  .tool-save{
    color:#fff;
    width:100%;
    padding-right:20px;
    text-align:right;
    cursor: pointer;
  }

  .tool-save span:hover{
    color:#f57
  }

  .tool-item{
    padding:0 5px;
    cursor: pointer;
  }

  .tool-item:hover{
    color:#f57
  }

  .markdown-content{
    display:flex;
    flex-direction: row;
    align-items: stretch;
    width:100%;
    height:100%;
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
