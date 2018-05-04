<template>
<div style="width:900px;margin:0 auto;padding-top:40px">
  标题：
  <el-input v-model="title" style="padding:10px 0"></el-input>
  摘要：
  <el-input type="textarea" v-model="abstract" resize="none" style="padding:10px 0" :rows="5"></el-input>
  内容：
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
      </div>
      <div class="tool-item" @click="dialogVisible = true">&#60;/&#62;</div>
      <!-- <div class="tool-save"><span @click="update">保存</span></div> -->
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
    <el-button @click="update" type="primary" style="margin:20px">保存</el-button>
    <!-- <button @click="add">增加###</button> -->
  </div>
  <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>语言：</span>
      <el-select v-model="lang" placeholder="请选择" style="width:200px">
        <el-option
          v-for="item in langs"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
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
      editor:null,
      dialogVisible:false,
      langs:[
        {
          value:'html',
          label:'html'
        },{
          value:'javaScript',
          label:'javaScript'
        },{
          value:'css',
          label:'css'
        },{
          value:'json',
          label:'json'
        },{
          value:'markdown',
          label:'markdown'
        }
      ],
      lang:'javaScript',
      title:'',
      abstract:''
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
      console.log(this.abstract)
      axios.post('http://111.230.35.213:3000/api/list/update',{
        id:this.$route.params.id,
        str:this.txt,
        title:this.title,
        abstract:this.abstract
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
    },
    handleOk() {
      this.dialogVisible = false;
      let selection = this.editor.getSelection();
      this.editor.replaceSelection('```'+this.lang+'\n'+selection+'\n```')
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
      this.title=response.data.data[0].title;
      this.abstract=response.data.data[0].abstract;
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
  body{
    font-size:16px;
  }
  .markdown-container{
    width: 900px;
    margin: 10px auto 0 auto;
  .editor-region textarea:focus{
    border:none;
  }
    /* position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%; */
  }
  .markdown-tool{
    height:40px;
    width:100%;
    background-color:#05355f;
    display:flex;
    flex-direction:row;
    align-items: center;
    /* justify-content:center; */
    /* padding:0 10px; */
    /* position: fixed;
    top:0;
    left:0; */
    color:#fff;
    font-size:16px;
        padding: 0 10px;
    box-sizing: border-box;
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
    height:600px;
    /* border-bottom:1px #ccc solid;
    border-top:1px #ccc solid; */
    border: #ccc 1px solid;
    box-sizing: border-box;
  }
  .editor-region{
    /* padding:10px 0 10px 10px; */
    width:450px;
    height:100%;
    box-sizing: border-box;
  }


  .code-mirror{
    width:450px;
    height:100%;
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
