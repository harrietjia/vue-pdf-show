<template>
  <div id="pageContent" class="pageContent_2lAGg">
    <div class="leftContent_2NoKi">
      <div class="doc-list-context">
        <div class="doc-list-title">合同 <span>(1份)</span></div>
        <div class="doc-list">
          <div class="doc-item">
            <div class="doc-img">
              <img src="../../assets/images/pdfpng.png"
                   alt="">
              <div class="doc-page-num">{{page_count}}</div>
            </div>
            <div class="doc-name">{{Data.contract_doc_name}}</div>
          </div>
          <div class="componentsList_1OIrB">
            <p class="title_3vpva">控件库</p>
            <!--这个页面不能格式化-->
            <p class="tips_2oKGU">请将控件拖动到合同区域。</p>
            <div class="componentArea" @mousedown='signText' v-if="showType === 'template'">
              <div class="itemConentStyle"><span class="need">*</span><span>文本名称</span></div><p>文本</p><p><i class="iconfont icon-kc_mulu"></i><i class="iconfont icon-pm_auction_success"></i></p><div class="text_delete" @click.stop="TextDeleteIt">删除</div><div class="move-icon"><img src="../../assets/images/all_lrexpand.png" alt=""></div>
            </div>

            <div class="componentSign-show" @mousedown='signSeal'>
              <p>签署区</p><p><i class="iconfont icon-all_sign"></i></p>
            </div>

            <div class="componentSign" @mousedown='signSeal'>
              <p class="sealCompInfo_3v9iQ"><span class="need">*</span><span><span>甲方</span><em>(<span>签署区</span>)</em></span></p><div class="itemConentStyle_2MWEL"><div class="infoMsg_3NkPg">签署区</div><i class="iconfont icon-pm_auction_success"></i></div><div class="text_delete" @click.stop="TextDeleteIt">删除</div>
            </div>
          </div>
          <div style="margin-top: 120px">
            <div style="text-align: center;margin-top: 20px" v-if="showType === 'template'">
              <el-button type="primary" style="width: 120px;" @click="goBack">上一步</el-button>
            </div>
            <div style="text-align: center;margin-top: 20px">
              <el-button type="primary" style="width: 120px;" @click="submitForm('save')">保存</el-button>
            </div>
            <div style="text-align: center;margin-top: 20px" v-if="showType === 'contract'">
              <el-button type="primary" style="width: 120px;" @click="submitForm">下一步</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pdfContent_1PW2f">
      <div class="pdf-header">
        <div class="block">
          <span class="demonstration">{{value1*100}}%</span>
          <div class="slider">
            <el-slider v-model="value1" :min="0.5" :max="2" :step="0.25" @change="handleChange"></el-slider>
          </div>
        </div>
        <div class="input">
          <span>Page: <input type="text" class="input-text" v-model="page_num" placeholder="1"> / {{page_count}}</span>
          <el-button @click="jump" type="text">跳转</el-button>
          <!--<span>全屏</span>-->
        </div>
      </div>
      <div class="pdf-container" ref="pdfBox"  v-loading="!isShow"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.1)">
        <div class="pdf-box" :style="{width: pdfWidth+'px'}">
          <div class="pdfPage_1yRne" :style="{width: pdfWidth+'px',height: pdfHeight+ 'px'}" v-for="page in page_count" :key="page">
            <canvas class="pdf-item" :id="'the-canvas'+page" ></canvas>
            <div @click="clearAll" class="dragLayer_3ccsq" v-bind:id="'can'+ page"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="taskInfoArea_3ThxW">
      <div class="tab-bar">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="文本控件设置" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="tab-context">

        <div class="item" v-show="activeName == 2">
          <div class="testSetting_8FNRp" v-show="hasChoose">
            <div class="item-box">
              <p class="titleh2_3zdht">名称</p>
              <el-input v-model="form_name" ref="input1" placeholder="请输入文本名称"></el-input>
            </div>
            <div class="item-box">
              <p class="titleh2_3zdht">文本域默认值</p>
              <el-input v-model="form_value" ref="input2" placeholder="请输入文本默认值"></el-input>
            </div>
            <div class="item-box">
              <span class="titleh2_3zdht">是否必填项</span>
              <el-switch v-model="form_need"></el-switch>
            </div>
          </div>
          <div class="testSetting_8FNRp" v-show="hasChoose2">
            <div class="item-box">
              <p class="titleh2_3zdht">名称</p>
              <el-input v-model="seal_name" ref="input3" placeholder="请输入签署区名称"></el-input>
            </div>
            <div class="item-box">
              <p class="titleh2_3zdht">填写人设置</p>
              <el-select v-model="role_id" placeholder="请选择填写人">
                <el-option v-for="item in role_idList" :key="item.role_id" :label="item.name" :value="item.role_id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="emptyStyle_wctx0" v-show="!hasChoose && !hasChoose2">
            <p class="emptyP_2N3sX">请从控件库中将控件拖动到合同区域</p>
            <p class="emptyP_2N3sX">或选中已经添加到合同上的控件</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  let PDFJS = require("pdfjs-dist");
  PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.min");
  // 解决mousedown和click的之间的冲突  （利用事件发生时间来判断 点击事件时间短）
  var key = false;//设置了一个标志 false为点击事件 ture为鼠标移动事件
  var firstTime = 0;
  var lastTime = 0;

  export default {
    data() {
      return {
        showType: '',
        isShow: false,
        role_idList: [{name: '甲方',role_id: '1'},{name: '乙方',role_id: '2'},{name: '丙方',role_id: '3'}],
        seal_name: '签署区',
        role_id: '1',
        id: '',
        hasChoose2: false,
        hasChoose: false,
        Data: {},
        dom: null,
        scrollTop: 0,
        activeName: "2",
        pdfUrl: "",// 这里是pdf文件地址，后台给的流文件请求地址也是可以的
        pdfDoc: null,// pdfjs 生成的对象
        pageNum: 1,//
        value1: 1,
        scale: 1.0,// 放大倍数
        page_num: 0,// 当前页数
        page_count: 0,// 总页数
        maxscale: 2,// 最大放大倍数
        minscale: 0.5,// 最小放大倍数
        pdfWidth: 0,
        pdfHeight: 0,
        right: true,
        left: true,
        code: "",
        form_name: "文本名称",
        form_value: "文本",
        form_need: true,
        pos_x: '',
        pos_y: '',
        pos_page: '',
        textId: '',
        commonStructsList: []
      };
    },
    created() {
    },
    beforeRouteLeave (to, from, next) {
      // if(to.path != "/login" && to.path != "/sign/template_manage") {
      //   this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     // 正常跳转
      //     next()
      //   }).catch(() => {
      //     // 如果取消跳转地址栏会变化，这时保持地址栏不变
      //     next(false)
      //   })
      // }else {
        next()
      // }
    },
    mounted() {
      this.id = this.$route.params.id;
      this.getData();
    },
    watch: {
      scale(new1, old1) {
        document.querySelectorAll(".mark").forEach((item) => {
          item.style.left = (parseInt(item.style.left) / (old1 / new1)) + "px";
          item.style.top = (parseInt(item.style.top) / (old1 / new1)) + "px";
          item.style.height = 100 * new1 + "px";
          item.style.width = 100 * new1 + "px";
        });
        document.querySelectorAll(".text_mark").forEach((item) => {
          item.style.left = (parseInt(item.style.left) / (old1 / new1)) + "px";
          item.style.top = (parseInt(item.style.top) / (old1 / new1)) + "px";
          item.style.height = 28 * new1 + "px";
          item.style.width = (item.offsetWidth) / (old1 / new1)  + "px";
        });
        document.querySelectorAll(".text_mark2").forEach((item) => {
          item.style.left = (parseInt(item.style.left) / (old1 / new1)) + "px";
          item.style.top = (parseInt(item.style.top) / (old1 / new1)) + "px";
          item.style.height = 100 * new1 + "px";
          item.style.width = 100 * new1 + "px";
        });
      },
      role_id(now, before) {
        let str = '';
        if(now == '1'){
          str = '甲方'
        }else if(now == '2'){
          str = '乙方'
        }else if(now == '3'){
          str = '丙方'
        }
        document.querySelector(".choose2").setAttribute('role_id',this.role_id);
        document.querySelector(".choose2").childNodes[0].childNodes[1].childNodes[0].innerText = str;
      },
      seal_name(now,before) {
        document.querySelector(".choose2").childNodes[0].childNodes[1].childNodes[1].childNodes[1].innerText =  now;
      },
      form_name(now, before) {
        document.querySelector(".choose").childNodes[0].childNodes[1].innerText = now;
      },
      form_value(now, before) {
        document.querySelector(".choose").childNodes[1].innerText = now;
      },
      form_need(now, before) {
        if(now){
          document.querySelector(".choose").childNodes[0].childNodes[0].style.display = "inline-block";
        }else {
          document.querySelector(".choose").childNodes[0].childNodes[0].style.display = "none";
        }
      },
    },
    methods: {
      goBack() {
        if (window.history.length <= 1) {
          this.$router.push(this.fun.getUrl('homeIndex', {}));
        } else {
          this.$router.go(-1);
        }
      },
      /**
       * px转换为mm
       * @param value
       * @returns {number}
       */
      pxConversionMm (value) {
        return value * 0.35277777777777775;
      },
      deleteText(dom) {
        this.textId = dom.getAttribute('textId');
        if(this.textId) {
          // 会引发鼠标抬起事件  延迟触发删除时间
        }
      },
      setTemplate() {
        const that = this;
        for (let i = 0; i < this.commonStructsList.length; i++) {
          if(that.commonStructsList[i].form_type == 1){
            let Element = document.querySelector(".componentArea").cloneNode(true);
            document.querySelector('#can'+ that.commonStructsList[i].doc_page).appendChild(Element);
            Element.style.left = that.commonStructsList[i].pos_x + "px";
            Element.style.top = that.commonStructsList[i].pos_y + "px";
            Element.style.width = that.commonStructsList[i].width + "px";
            Element.style.display = "flex";
            Element.classList.add("text_mark");
            Element.onmouseenter = that.TextMouseenter;
            Element.onmouseleave = that.TextMouseleave;
            Element.onclick = that.textClick;
            Element.onmousedown = that.moveTo;
            Element.setAttribute("page", that.commonStructsList[i].doc_page);
            Element.setAttribute('textId', that.commonStructsList[i].id);
            if(that.commonStructsList[i].is_require == 1){
              Element.childNodes[0].childNodes[0].style.display = "inline-block";
            }else {
              Element.childNodes[0].childNodes[0].style.display = "none";
            }
            Element.childNodes[0].childNodes[1].innerText = that.commonStructsList[i].form_name;
            Element.childNodes[1].innerText = that.commonStructsList[i].form_value;
            Element.childNodes[2].onblur = that.TextBlur;
            Element.childNodes[3].onclick = that.TextDeleteIt;
            Element.childNodes[4].onmousedown = that.TextWidthChange;
          } else {
            let Element = document.querySelector(".componentSign").cloneNode(true);
            document.querySelector('#can'+ that.commonStructsList[i].doc_page).appendChild(Element);
            Element.style.left = that.commonStructsList[i].pos_x + "px";
            Element.style.top = that.commonStructsList[i].pos_y + "px";
            Element.style.display = "flex";
            Element.classList.add("text_mark2");
            Element.onmouseenter = that.sealMouseenter;
            Element.onmouseleave = that.sealMouseleave;
            Element.onclick = that.sealClick;
            Element.onmousedown = that.sealMoveTo;
            Element.setAttribute("page", that.commonStructsList[i].doc_page);
            Element.setAttribute('textId', that.commonStructsList[i].id);
            Element.setAttribute('role_id',that.commonStructsList[i].role_id);
            Element.childNodes[0].childNodes[1].childNodes[1].childNodes[1].innerText = that.commonStructsList[i].form_name;
            if(that.commonStructsList[i].role_id == '1'){
              Element.childNodes[0].childNodes[1].childNodes[0].innerText = '甲方';
            }else if(that.commonStructsList[i].role_id == '2'){
              Element.childNodes[0].childNodes[1].childNodes[0].innerText = '乙方';
            }else if(that.commonStructsList[i].role_id == '3'){
              Element.childNodes[0].childNodes[1].childNodes[0].innerText = '丙方';
            }
            Element.childNodes[2].onclick = that.sealDeleteIt;
          }
        }
      },
      TextBlur(e) {
        e.currentTarget.value=e.currentTarget.value.replace(/\s+/g,'');
        if(e.currentTarget.parentNode.childNodes[0].childNodes[0].style.display == "inline-block" && e.currentTarget.value == '') {
          e.currentTarget.parentNode.classList.add("needFill");
          e.currentTarget.parentNode.childNodes[3].style.display = "flex";
        }else {
          e.currentTarget.parentNode.classList.remove("needFill");
          e.currentTarget.parentNode.childNodes[3].style.display = "none";
        }
      },
      submitForm(str) {

        let form_info = [];

        // 文本域
        document.querySelectorAll(".text_mark").forEach((item) => {
          let is_require = 0;
          if (item.childNodes[0].childNodes[0].style.display == 'none'){
            is_require = 0
          } else {
            is_require = 1
          }
          let json = {
            id: item.getAttribute('textId'),
            template_id: this.id,
            form_type: 1,
            form_name: item.childNodes[0].childNodes[1].innerText,
            form_value: item.childNodes[1].innerText,
            is_require: is_require,
            pos_x: parseInt(item.style.left)/this.scale,
            pos_y: parseInt(item.style.top)/this.scale,
            pdf_pos_x: this.pxConversionMm(parseInt(item.style.left)+10/this.scale),
            pdf_pos_y: this.pxConversionMm(parseInt(item.style.top)+6/this.scale),
            width: parseInt(item.offsetWidth)/this.scale,
            height: 28,
            doc_page: item.getAttribute("page")
          };
          form_info.push(json);
          // console.log(this.pxConversionMm(parseInt(item.style.left)/this.scale))
          // console.log(item.style.left)
          // console.log(parseInt(item.style.left)/this.scale)
          // console.log(parseInt(item.style.top)/this.scale)
        });

        // 签署区
        document.querySelectorAll(".text_mark2").forEach((item) => {
          let json = {
            id: item.getAttribute('textId'),
            template_id: this.id,
            form_type: 2,
            form_name: item.childNodes[0].childNodes[1].childNodes[1].childNodes[1].innerText,
            role_id: item.getAttribute('role_id'),
            form_value: '',
            is_require: 0,
            pos_x: parseInt(item.style.left)/this.scale,
            pos_y: parseInt(item.style.top)/this.scale,
            width: 100,
            height: 100,
            doc_page: item.getAttribute("page")
          };
          form_info.push(json);
        });
        let url = '';
        let json = {};
        if(this.showType === 'contract') {
          url = "plugin.yun-sign.frontend.contract.create-sign-doc";
          json = {id: this.id, pdfWidth: this.pdfWidth, pdfHeight: this.pdfHeight, contract_sign_forms: form_info, contract_form_params: []};
        }else {
          url = "plugin.yun-sign.frontend.template.save-form";
          json = {template_id: this.id, pdfWidth: this.pdfWidth, pdfHeight: this.pdfHeight, form_info: form_info};
        }
        this.$router.push(this.fun.getUrl("launch"));

      },
      // 获取模版
      getData() {
        this.Data =  {
          "id": 0,
          "name": "",
          "contract_doc_name": "20210328142610",
          "contract_attach": []
        };
        this.pdfUrl = "/static/test.pdf";
        this._loadFile(this.pdfUrl);
      },
      // 获取模板所有文本域信息
      getTextData() {
        this.isShow = true;
        this.commonStructsList = [];
        this.setTemplate();
      },
      signSeal(e) {
        let dom = document.querySelector(".componentSign").cloneNode(true);
        let sidebarWidth = 0;
        if (document.querySelector("#app").clientWidth > 1026) {
          sidebarWidth = document.querySelector(".el-scrollbar__view").clientWidth;
        }
        // dom.style.left = (this.getPos(e).x - 100 - sidebarWidth) + "px";
        // dom.style.top = (this.getPos(e).y - 65) + "px";
        // dom.className = "componentArea text_mark";

        document.onmousemove = e => {
          document.querySelector("#pageContent").appendChild(dom);
          dom.style.display = 'flex';
          dom.style.left = (this.getPos(e).x - parseInt(dom.clientWidth / 2) - sidebarWidth) + "px";
          dom.style.top = (this.getPos(e).y - 100) + "px";
          dom.className = "componentSign text_mark2";
        };
        // 鼠标抬开
        document.onmouseup = e => {
          let left = (this.getPos(e).x + this.$refs.pdfBox.scrollLeft - parseInt(dom.clientWidth / 2) - document.querySelector(".pdf-box").offsetLeft - sidebarWidth);
          let top = (this.getPos(e).y + this.scrollTop - parseInt(dom.clientHeight / 2) - 100);

          //限制区域
          if (left < 0) {
            left = 0;
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("请拖拽到合同区域");
            // return;
          } else if (left > document.querySelector(".pdf-box").clientWidth - (100 * this.scale)) {
            left = document.querySelector(".pdf-box").clientWidth - (100 * this.scale)
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("控件位置超出了合同区域");
            // return;
          }

          if (top < 0) {
            top = 0;
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("请拖拽到合同区域");
            // return;
          } else if (top > document.querySelector(".pdf-box").clientHeight - (100 * this.scale)) {
            top = document.querySelector(".pdf-box").clientHeight - (100 * this.scale)
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("控件位置超出了合同区域");
            // return;
          }

          let index = 0;

          if(top > this.pdfHeight*this.page_num){
            top = top - this.pdfHeight*this.page_num;
            index = this.page_num+1;
          }else {
            top = top - this.pdfHeight*(this.page_num-1);
            index = this.page_num;
          }

          // margin
          top = top - (index-1)*10;

          dom.style.left = left + "px";
          dom.style.top = top + "px";
          dom.style.height = 100 * this.scale + "px";
          dom.style.width = 100 * this.scale + "px";

          document.querySelector("#pageContent").removeChild(dom);
          document.querySelector('#can'+ index).appendChild(dom);
          document.onmousemove = null;
          document.onmouseup = null;
          dom.onclick = this.sealClick;
          dom.onmousedown = this.sealMoveTo;
          dom.onmouseenter = this.sealMouseenter;
          dom.onmouseleave = this.sealMouseleave;
          dom.childNodes[2].onclick = this.sealDeleteIt;
          dom.setAttribute("page", index);
          dom.setAttribute('role_id', 1);

        };
      },
      sealDeleteIt(e) {
        this.hasChoose2 = false;
        this.hasChoose = false;
        this.deleteText(e.currentTarget.parentNode);
        e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
        e.stopPropagation();
        e.preventDefault();
        return false;
      },
      sealClick(e) {
        this.$refs.input3.blur();
        const that = this;
        for (let i = 0; i < document.querySelectorAll('.text_mark').length; i++) {
          document.querySelectorAll(".text_mark")[i].childNodes[0].style.display = "none";
          document.querySelectorAll(".text_mark")[i].childNodes[3].style.display = "none";
          document.querySelectorAll(".text_mark")[i].onmouseleave = that.TextMouseleave;
          document.querySelectorAll(".text_mark")[i].classList.remove("choose");
        }
        for (let i = 0; i < document.querySelectorAll('.text_mark2').length; i++) {
          document.querySelectorAll(".text_mark2")[i].childNodes[0].style.display = "none";
          document.querySelectorAll(".text_mark2")[i].childNodes[2].style.display = "none";
          document.querySelectorAll(".text_mark2")[i].onmouseleave = that.sealMouseleave;
          document.querySelectorAll(".text_mark2")[i].classList.remove("choose2");
        }
        e.currentTarget.childNodes[0].style.display = "flex";
        e.currentTarget.childNodes[2].style.display = "block";
        e.currentTarget.classList.add("choose2");
        e.currentTarget.onmouseleave = null;
        this.seal_name = document.querySelector(".choose2").childNodes[0].childNodes[1].childNodes[1].childNodes[1].innerText;
        if(document.querySelector(".choose2").childNodes[0].childNodes[1].childNodes[0].innerText == '甲方'){
          this.role_id = '1';
        }else if(document.querySelector(".choose2").childNodes[0].childNodes[1].childNodes[0].innerText == '乙方'){
          this.role_id = '2';
        }else {
          this.role_id = '3';
        }
        this.hasChoose2 = true;
        this.hasChoose = false;
        if(key){
          // console.log('click');
          key = false;
          // this.editText(2, e.currentTarget.style.left, e.currentTarget.style.top, e.currentTarget);
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
      },
      sealMouseenter(e) {
        e.currentTarget.childNodes[0].style.display = "flex";
        e.currentTarget.childNodes[2].style.display = "block";
      },
      sealMouseleave(e) {
        e.currentTarget.childNodes[0].style.display = "none";
        e.currentTarget.childNodes[2].style.display = "none";
      },
      sealMoveTo(e) {
        firstTime = new Date().getTime();
        // console.log('mouseDown');
        let that = this;
        let odiv = e.currentTarget; //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        this.sealClick(e);
        document.onmousemove = e => {
          let left = e.clientX - disX;
          let top = e.clientY - disY;

          //限制区域
          if (left <= 0) {
            left = 0;
          } else if (left >= document.querySelector(".pdf-box").clientWidth - odiv.clientWidth) {
            left = document.querySelector(".pdf-box").clientWidth - odiv.clientWidth;
          }

          if (top <= 0) {
            top = 0;
          } else if (top >= this.pdfHeight - odiv.clientHeight) {
            top = this.pdfHeight - odiv.clientHeight;
          }

          //移动当前元素
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = e => {

          //鼠标抬起后 记录时间 超过400ms就是移动事件
          lastTime = new Date().getTime();
          if( (lastTime - firstTime) < 400){
            key = true;
          }else {
            // console.log('mouseUp');
            // that.editText(2, odiv.style.left, odiv.style.top, odiv);
          }

          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      clearAll() {
        const that = this;
        for (let i = 0; i < document.querySelectorAll('.text_mark').length; i++) {
          document.querySelectorAll(".text_mark")[i].childNodes[0].style.display = "none";
          document.querySelectorAll(".text_mark")[i].childNodes[3].style.display = "none";
          document.querySelectorAll(".text_mark")[i].childNodes[4].style.display = "none";
          document.querySelectorAll(".text_mark")[i].onmouseleave = that.TextMouseleave;
          document.querySelectorAll(".text_mark")[i].classList.remove("choose");
        }
        for (let i = 0; i < document.querySelectorAll('.text_mark2').length; i++) {
          document.querySelectorAll(".text_mark2")[i].childNodes[0].style.display = "none";
          document.querySelectorAll(".text_mark2")[i].childNodes[2].style.display = "none";
          document.querySelectorAll(".text_mark2")[i].onmouseleave = that.sealMouseenter;
          document.querySelectorAll(".text_mark2")[i].classList.remove("choose2");
        }
        this.hasChoose = false;
        this.hasChoose2 = false;
      },
      signText(e) {
        let dom = e.currentTarget.cloneNode(true);
        let sidebarWidth = 0;
        if (document.querySelector("#app").clientWidth > 1026) {
          sidebarWidth = document.querySelector(".el-scrollbar__view").clientWidth;
        }
        // dom.style.left = (this.getPos(e).x - 100 - sidebarWidth) + "px";
        // dom.style.top = (this.getPos(e).y - 65) + "px";
        // dom.className = "componentArea text_mark";

        document.onmousemove = e => {
          document.querySelector("#pageContent").appendChild(dom);
          dom.style.left = (this.getPos(e).x - parseInt(dom.clientWidth / 2) - sidebarWidth) + "px";
          dom.style.top = (this.getPos(e).y - 65) + "px";
          dom.className = "componentArea text_mark";
        };
        // 鼠标抬开
        document.onmouseup = e => {
          let left = (this.getPos(e).x + this.$refs.pdfBox.scrollLeft - parseInt(dom.clientWidth / 2) - document.querySelector(".pdf-box").offsetLeft - sidebarWidth);
          let top = (this.getPos(e).y + this.scrollTop - parseInt(dom.clientHeight / 2) - 100);

          //限制区域
          if (left < 0) {
            left = 0;
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("请拖拽到合同区域");
            // return;
          } else if (left > document.querySelector(".pdf-box").clientWidth - (dom.clientWidth * this.scale)) {
            left = document.querySelector(".pdf-box").clientWidth - (dom.clientWidth * this.scale)
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("控件位置超出了合同区域");
            // return;
          }

          if (top < 0) {
            top = 0;
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("请拖拽到合同区域");
            // return;
          } else if (top > document.querySelector(".pdf-box").clientHeight - (28 * this.scale)) {
            top = document.querySelector(".pdf-box").clientHeight - (28 * this.scale)
            // document.onmousemove = null;
            // document.onmouseup = null;
            // document.querySelector("#pageContent").removeChild(dom);
            // this.$message.error("控件位置超出了合同区域");
            // return;
          }

          let index = 0;

          if(top > this.pdfHeight*this.page_num){
            top = top - this.pdfHeight*this.page_num;
            index = this.page_num+1;
          }else {
            top = top - this.pdfHeight*(this.page_num-1);
            index = this.page_num;
          }

          // margin
          top = top - (index-1)*10;

          dom.style.left = left + "px";
          dom.style.top = top + "px";
          dom.style.height = 28 * this.scale + "px";
          dom.style.width = dom.clientWidth * this.scale + "px";

          document.querySelector("#pageContent").removeChild(dom);
          document.querySelector('#can'+ index).appendChild(dom);
          document.onmousemove = null;
          document.onmouseup = null;
          dom.childNodes[1].innerText = '文本';
          dom.onclick = this.textClick;
          dom.onmousedown = this.moveTo;
          dom.onmouseenter = this.TextMouseenter;
          dom.onmouseleave = this.TextMouseleave;
          dom.childNodes[3].onclick = this.TextDeleteIt;
          dom.childNodes[4].onmousedown = this.TextWidthChange;
          dom.setAttribute("page", index);

        };
      },
      TextWidthChange(e) {
        let odivParent = e.currentTarget.parentNode; //获取目标父元素
        let dx= e.clientX;//当你第一次单击的时候，存储x轴的坐标。
        let dw= odivParent.offsetWidth;//存储默认的div的宽度。
        document.onmousemove = e => {
            odivParent.style.width=dw+(e.clientX-dx)+'px';

            if(odivParent.offsetWidth <= 70){//当盒子缩小到一定范围内的时候，让他保持一个固定值，不再继续改变
              odivParent.style.width='70px';
            }

            if(odivParent.offsetWidth + odivParent.offsetLeft >= this.pdfWidth){
              odivParent.style.width = this.pdfWidth - odivParent.offsetLeft + 'px';
            }
        };
        document.onmouseup = e => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
        e.stopPropagation();
        e.preventDefault();
        return false;
      },
      TextDeleteIt(e) {
        this.hasChoose2 = false;
        this.hasChoose = false;
        this.deleteText(e.currentTarget.parentNode);
        e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
        e.stopPropagation();
        e.preventDefault();
        return false;
      },
      textClick(e) {
        this.$refs.input1.blur();
        this.$refs.input2.blur();
        const that = this;
        for (let i = 0; i < document.querySelectorAll('.text_mark').length; i++) {
          document.querySelectorAll(".text_mark")[i].childNodes[0].style.display = "none";
          document.querySelectorAll(".text_mark")[i].childNodes[3].style.display = "none";
          document.querySelectorAll(".text_mark")[i].childNodes[4].style.display = "none";
          document.querySelectorAll(".text_mark")[i].onmouseleave = that.TextMouseleave;
          document.querySelectorAll(".text_mark")[i].classList.remove("choose");
        }
        for (let i = 0; i < document.querySelectorAll('.text_mark2').length; i++) {
          document.querySelectorAll(".text_mark2")[i].childNodes[0].style.display = "none";
          document.querySelectorAll(".text_mark2")[i].childNodes[2].style.display = "none";
          document.querySelectorAll(".text_mark2")[i].onmouseleave = that.sealMouseleave;
          document.querySelectorAll(".text_mark2")[i].classList.remove("choose2");
        }
        e.currentTarget.childNodes[0].style.display = "flex";
        e.currentTarget.childNodes[3].style.display = "block";
        e.currentTarget.childNodes[4].style.display = "block";
        e.currentTarget.classList.add("choose");
        e.currentTarget.onmouseleave = null;
        this.form_name = document.querySelector(".choose").childNodes[0].childNodes[1].innerText;
        this.form_value = document.querySelector(".choose").childNodes[1].innerText;
        if (document.querySelector(".choose").childNodes[0].childNodes[0].style.display == 'none'){
          this.form_need = false
        } else {
          this.form_need = true
        }
        this.hasChoose = true;
        this.hasChoose2 = false;
        if(key){
          // console.log('click');
          key = false;
          // this.editText(1, e.currentTarget.style.left, e.currentTarget.style.top, e.currentTarget);
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
      },
      TextMouseenter(e) {
        e.currentTarget.childNodes[0].style.display = "flex";
        e.currentTarget.childNodes[3].style.display = "block";
      },
      TextMouseleave(e) {
        e.currentTarget.childNodes[0].style.display = "none";
        e.currentTarget.childNodes[3].style.display = "none";
      },
      moveTo(e) {
        firstTime = new Date().getTime();
        // console.log('mouseDown');
        let that = this;
        let odiv = e.currentTarget; //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        this.textClick(e);
        document.onmousemove = e => {
          let left = e.clientX - disX;
          let top = e.clientY - disY;

          //限制区域
          if (left <= 0) {
            left = 0;
          } else if (left >= document.querySelector(".pdf-box").clientWidth - odiv.clientWidth) {
            left = document.querySelector(".pdf-box").clientWidth - odiv.clientWidth;
          }

          if (top <= 0) {
            top = 0;
          } else if (top >= this.pdfHeight - odiv.clientHeight) {
            top = this.pdfHeight - odiv.clientHeight;
          }

          //移动当前元素
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = e => {

          //鼠标抬起后 记录时间 超过400ms就是移动事件
          lastTime = new Date().getTime();
          if( (lastTime - firstTime) < 400){
            key = true;
          }else {
            // console.log('mouseUp');
            // that.editText(1, odiv.style.left, odiv.style.top, odiv);
          }

          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      getPos(ev) {
        return { x: ev.clientX, y: ev.clientY };
      },
      toGetReal() {
        this.$router.push({
          path: "/accredited_institution",
          query: { productId: this.$route.query.productId, order_sn: this.$route.query.order_sn }
        });
      },
      // tab点击事件
      handleClick(tab, event) {
        // console.log(this.activeName,"activeName")
      },
      handleChange(val) {
        this.scale = val;
        this.queueRenderPage(this.pageNum);
      },
      handleScroll(el) {
        this.scrollTop = this.$refs.pdfBox.scrollTop;
        let _pdfs = document.querySelectorAll(".pdfPage_1yRne");
        let arr = [];
        _pdfs.forEach((item, index) => {
          if (this.scrollTop >= item.offsetTop) {
            arr.push(index);
          }
        });
        this.page_num = Math.max.apply(null, arr) + 1;
      },
      jump() {
        let that = this;
        let index = this.page_num - 1;
        if (index > this.page_count) {
          this.$message.error("请输入有效范围内的数字");
          return;
        }
        // 用 class="pdfPage_1yRne" 添加锚点
        let jump = document.querySelectorAll(".pdfPage_1yRne");
        let total = jump[index].offsetTop;
        // console.log('纵坐标', total)
        let distance = this.scrollTop;
        //平滑滚动，时长500ms，每10ms一跳，共50跳
        let step = total / 30 >> 0;
        if (total > distance) {
          smoothDown();
        } else {
          let newTotal = distance - total;
          step = newTotal / 30 >> 0;
          smoothUp();
        }

        function smoothDown() {
          if (distance < total) {
            distance += step;
            that.$refs.pdfBox.scrollTop = distance;
            setTimeout(smoothDown, 10);
          } else {
            that.$refs.pdfBox.scrollTop = total;
          }
        }

        function smoothUp() {
          if (distance > total) {
            distance -= step;
            that.$refs.pdfBox.scrollTop = distance;
            setTimeout(smoothUp, 10);
          } else {
            that.$refs.pdfBox.scrollTop = total;
          }
        }
      },
      _renderPage(num) {
        this.pdfDoc.getPage(num).then((page) => {
          let canvas = document.getElementById("the-canvas" + num);
          let ctx = canvas.getContext("2d");

          let viewport = page.getViewport(this.scale);
          // alert(vm.canvas.height)
          this.pdfHeight = canvas.height = viewport.height;
          this.pdfWidth = canvas.width = viewport.width;
          // Render PDF page into canvas context
          let renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };
          page.render(renderContext);
          if (this.page_count > num) {
            this._renderPage(num + 1);
          }
        });
        this.page_num = this.pageNum;
      },
      _loadFile(url) {
        const CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/cmaps/';
        PDFJS.getDocument({url:url,cMapUrl: CMAP_URL,cMapPacked: true}).then((pdf) => {
          this.pdfDoc = pdf;
          this.page_count = this.pdfDoc.numPages;
          this.$nextTick(() => {
            this._renderPage(1);
            this.getTextData();
          });
          this.pageNum = 1;
        });
      },
      queueRenderPage(num) {
        this._renderPage(num);
      },
      downpdf() {//下载pdf
        window.open(this.pdfUrl);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .pageContent_2lAGg {
    display: flex;
    /*max-width: 1200px;*/
    height: 93vh;
    /*margin: 10px auto 0 auto;*/
    user-select: none;
    /*firefox浏览器*/
    -moz-user-select: none;
    /*safari、chrome浏览器*/
    -webkit-user-select: none; /*Safari中不支持该属性值，只能使用none或者text，或者是在html的标签属性中使用*/
    .sign-img {
      position: absolute;
      cursor: move;
      z-index: 7;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584116150977&di=8c196ff505f980e30039a8794ead2dad&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F20%2F16%2F01%2F3156adf74e970a9.jpg");
    }
    .componentSign {
      display: none;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100px;
      height: 100px;
      padding: 0 10px;
      border: 1px dashed rgba(0, 0, 0, .3);
      background: hsla(0, 0%, 100%, .85);
      font-size: 12px;
      cursor: grab;
      position: absolute;
      top: 95px;
      left: 56px;
    }
    .sealCompInfo_3v9iQ {
      min-width: 100%;
      position: absolute;
      height: 20px;
      top: -21px;
      left: -1px;
      padding: 4px 8px;
      white-space: nowrap;
      text-align: center;
      cursor: grab;
      color: #fff;
      font-size: 12px;
      background: rgba(92, 162, 232, 0.6);
      z-index: 10;
      display: none;
      .need {
        font-size: 16px;
        margin-top: 2px;
        margin-right: 4px;
        display: inline-block;
      }
    }
    .itemConentStyle_2MWEL {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    .infoMsg_3NkPg {
      position: absolute;
      top: 41px;
      width: 100%;
      text-align: center;
    }
    .componentSign-show {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 190px;
      height: 28px;
      padding: 0 10px;
      border: 1px dashed rgba(0, 0, 0, .3);
      background: hsla(0, 0%, 100%, .85);
      font-size: 12px;
      cursor: grab;
      position: absolute;
      top: 95px;
      left: 12px;
    }
    .delete {
      width: 100%;
      position: absolute;
      bottom: -15px;
      text-align: center;
      color: #fff;
      font-size: 15px;
      background-color: hsla(0, 0%, 4%, .6);
      cursor: pointer;
      display: none;
    }
    .componentArea {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 190px;
      height: 28px;
      padding: 0 10px;
      border: 1px dashed rgba(0, 0, 0, .3);
      background: hsla(0, 0%, 100%, .85);
      font-size: 12px;
      cursor: grab;
      position: absolute;
      top: 55px;
      left: 12px;
    }
    .itemConentStyle {
      position: absolute;
      height: 20px;
      top: -21px;
      left: -1px;
      padding: 4px 8px;
      white-space: nowrap;
      text-align: center;
      cursor: grab;
      color: #fff;
      font-size: 12px;
      background: rgba(92, 162, 232, 0.6);
      z-index: 10;
      display: none;
      .need {
        font-size: 16px;
        margin-top: 2px;
        margin-right: 4px;
        display: inline-block;
      }
    }
    .text_delete {
      width: 40%;
      position: absolute;
      bottom: -19px;
      left: 30%;
      text-align: center;
      color: #fff;
      padding: 3px 0;
      font-size: 12px;
      background-color: hsla(0, 0%, 4%, .6);
      cursor: pointer;
      display: none;
    }
    .move-icon {
      display: none;
      position: absolute;
      top: 50%;
      right: -8px;
      z-index: 10;
      width: 14px;
      height: 14px;
      margin-top: -7px;
      cursor: col-resize;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .icon-pm_auction_success {
      color: #409EFF;
      display: none;
    }
    .choose {
      border: 1px solid #409EFF;
      .icon-pm_auction_success {
        display: inline-block;
      }
    }
    .choose2 {
      border: 1px solid #409EFF;
      .icon-pm_auction_success {
        display: inline-block;
        position: absolute;
        right: 0;
      }
    }
  }

  .leftContent_2NoKi {
    display: flex;
    flex-direction: column;
    flex: 0 0 240px;
    width: 240px;
    height: 100%;
    .doc-list-title {
      font-size: 14px;
      font-weight: 800;
      color: #333;
      line-height: 40px;
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #eaeaea;
      span {
        color: #777;
        font-size: 12px;
        line-height: 40px;
        font-weight: normal;
      }
    }
    .doc-list-context {
      height: 100%;
      width: 240px;
      display: inline-block;
      padding: 0 15px;
    }
    .doc-list {
      overflow-y: auto;
      width: 100%;
      height: calc(100% - 51px);
      padding-top: 10px;
    }
    .doc-list::-webkit-scrollbar {
      display: none
    }
    .doc-item {
      margin: 0;
      padding: 20px 45px 0 45px;
      cursor: pointer;
    }
    .doc-img {
      border: 1px solid #333;
      position: relative;
      width: 121px;
      height: 161px;
      margin-bottom: 5px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .doc-page-num {
      z-index: 100;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
      background-color: #333333;
      color: #fff;
    }
    .doc-name {
      color: #333;
      font-size: 12px;
      line-height: 20px;
      word-break: break-all;
    }
    .componentsList_1OIrB {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      margin-top: 50px;
      position: relative;
    }
    .title_3vpva {
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      padding-left: 16px;
      margin-bottom: 4px;
    }
    .tips_2oKGU {
      margin: 0 14px;
      font-size: 12px;
      line-height: 20px;
      color: #999;
      vertical-align: baseline;
    }
  }

  .pdfContent_1PW2f {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    background: #f5f5f5;
    .pdf-header {
      /*position: fixed;*/
      top: 55px;
      left: 240px;
      right: 240px;
      height: 40px;
      border-bottom: 1px solid #eee;
      background-color: #fff;
      z-index: 100;
      text-align: center;
      display: flex;
      .block {
        flex: 1;
        display: flex;
        .demonstration, .slider {
          flex: 0 0 150px;
          line-height: 40px;
          width: 150px;
          text-align: right;
        }
        .demonstration {
          flex: 1;
          margin-right: 20px;
        }
      }
      .input {
        flex: 1;
        text-align: left;
        line-height: 40px;
        margin-left: 20px;
        .input-text {
          border: none;
          outline: none;
          border-bottom: 1px solid #e4e7ed;
          margin-left: 10px;
          width: 25px;
          text-align: center;
        }
      }
    }
    .pdf-container {
      display: inline-block;
      overflow: auto;
      height: 100%;
      width: 100%;
      .pdf-box {
        position: relative;
        margin: 0 auto;
        .sign-img {
          z-index: 4;
        }
      }
    }
    .pdfPage_1yRne {
      position: relative;
      margin: 10px 0;
    }
    .dragLayer_3ccsq {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }

  .taskInfoArea_3ThxW {
    display: flex;
    flex-direction: column;
    flex: 0 0 240px;
    width: 240px;
    height: 100%;
    .tab-bar {
      width: 100%;
      padding: 0 15px;
      height: 40px;
      font-size: 14px;
      line-height: 38px;
      display: flex;
      border-bottom: 1px solid #eaeaea;
      color: #999;
      overflow: hidden;
      justify-content: space-around;
    }
    .tab-context {
      padding: 0 15px;
      height: calc(100% - 51px);
      overflow-y: auto;
      overflow-x: hidden;
      text-align: center;
      font-weight: bold;
    }
    .real {
      .gray {
        color: #999999;
        font-weight: normal;
        margin: 10px 0;
        display: block;
      }
    }
    .item {
      margin-top: 25px;
    }
    .title {
      margin: 10px 0;
    }
    .seal-wrapper-item {
      padding: 20px 10px;
      margin: 0 auto;
      height: 140px;
      width: 120px;
      cursor: move;
      border: 1px dotted #e1e1e1;
    }
    .finish-img {
      width: 100px;
      height: 100px;
    }
    .item-box {
      width: 100%;
      margin-bottom: 20px;
    }
    .testSetting_8FNRp {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
    }
    .titleh2_3zdht {
      margin-bottom: 5px;
      font-size: 12px;
      font-weight: 500;
      line-height: 22px;
      color: #333;
    }
    .emptyStyle_wctx0 {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      margin-top: 200px;
    }
    .emptyP_2N3sX {
      width: 196px;
      font-size: 12px;
      color: #333;
      line-height: 22px;
      font-weight: 500;
      text-align: center;
    }
  }
</style>
