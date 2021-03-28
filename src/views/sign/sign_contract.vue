<template>
  <div id="pageContent" class="pageContent_2lAGg">
    <div class="leftContent_2NoKi">
      <div class="doc-list-context">
        <div>
          <el-tabs v-model="activeNameLeft" @tab-click="handleClick" :stretch="true">
            <el-tab-pane label="合同" name="1"></el-tab-pane>
            <el-tab-pane label="附件" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <template v-if="activeNameLeft == 1">
          <div class="doc-list-title">合同 <span>(1份)</span></div>
          <div class="doc-list">
            <div class="doc-item">
              <div class="doc-img">
                <img src="../../assets/images/pdfpng.png"
                     alt="">
                <div class="doc-page-num">{{page_count}}</div>
              </div>
              <div class="doc-name">{{contract_info.contract_doc_name}}</div>
            </div>
            <!--<div class="componentsList_1OIrB">-->
            <!--<div class="componentArea">-->
            <!--<div class="itemConentStyle"><span class="need">*</span><span>文本名称</span></div>-->
            <!--<p class="input"></p><div class="errorInfo_3lZie">请填写当前控件</div>-->
            <!--</div>-->
            <!--</div>-->
            <div class="componentSign">
              <p class="sealCompInfo_3v9iQ"><span class="need">*</span><span><span>甲方</span><em>(<span>签署区</span>)</em></span></p><div class="itemConentStyle_2MWEL"><div class="infoMsg_3NkPg">签署区</div><i class="iconfont icon-pm_auction_success"></i></div>
            </div>
          </div>
        </template>
        <template v-if="activeNameLeft == 2">
          <div  class="doc-list-title" v-if="contract_info.contract_attach.length == 0">暂无附件</div>
          <div class="doc-list-title" v-if="contract_info.contract_attach.length > 0">附件 <span>({{contract_info.contract_attach.length}}份)</span></div>
          <div class="doc-list">
            <div class="doc-item" v-for="(item, index) in contract_info.contract_attach" :key="index">
              <div class="doc-img">
                <img src="../../assets/images/pdfpng.png"
                     alt="">
                <div class="doc-page-num">{{page_count}}</div>
              </div>
              <div class="doc-name">{{item.file_name}}</div>
            </div>
          </div>
        </template>

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
      <div class="pdf-container" ref="pdfBox" v-loading="!isShow"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.1)">
        <div class="pdf-box" :style="{width: pdfWidth+'px', left: showEdges? '-60px': ''}">
          <div class="pdfPage_1yRne" :style="{width: pdfWidth+'px',height: pdfHeight+ 'px'}" v-for="page in page_count" :key="page">
            <canvas class="pdf-item" :id="'the-canvas'+page" ></canvas>
            <div class="dragLayer_3ccsq" :id="'can'+ page"></div>
            <transition name="slide-fade">
              <div v-if="showEdges" :id="'edge_'+page" :class="{'es-pdf-page__edges--visible': signEdges}" class="es-pdf-page__edges" style="width: 120px;" :style="{width: slideWidth+'px',height: pdfHeight+ 'px'}"></div>
            </transition>
          </div>
        </div>
        <!--<div class="bottom-btn" @click="showEdges = !showEdges"><span>{{showEdges? '单页盖章':'骑缝签章'}}</span></div>-->
      </div>
    </div>
    <div class="taskInfoArea_3ThxW">
      <div class="tab-bar">
        <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
          <el-tab-pane label="我的印章" name="1"></el-tab-pane>
          <el-tab-pane label="任务信息" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="tab-context">
        <div class="item" v-show="activeName == 1 && can_sign == 1 && is_cc != 1 && auth_status == 1 && contract_info.status < 2 && sign_status != 1">
          <div v-if="company_seals.length>0">
            <p class="title">企业印章</p>
            <div  class="seal-box-wrap">
              <div class="seal-box" v-for="seal in company_seals" :key="seal.id">
                <div class="seal-wrapper-item">
                  <div class="sign-img" :style="{backgroundImage: 'url(' + 'https://www.yunzmall.com/min_img/img/yht_adminimg.png' + ')'}"
                       style="height: 100px;width: 100px" v-bind:id="seal.has_one_seal.id"
                       @mousedown='signPic'>
                    <!--:style="{backgroundImage: 'url(' + seal.has_one_seal.seal_url + ')'}"-->
                    <div class="delete" @click.stop="deleteIt">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="person_seals.length>0">
            <p class="title">个人印章</p>
            <div  class="seal-box-wrap">
              <div class="seal-box" v-for="seal in person_seals" :key="seal.id">
                <div class="seal-wrapper-item">
                  <div class="sign-img" :style="{backgroundImage: 'url(' + seal.seal_url + ')'}"
                       style="height: 100px;width: 100px" v-bind:id="seal.id"
                       @mousedown='signPic'>
                    <!--:style="{backgroundImage: 'url(' + seal.seal_url + ')'}"-->
                    <div class="delete" @click.stop="deleteIt">删除</div>
                  </div>
                </div>
                <p class="seal-box-title">{{seal.name}}</p>
              </div>
              <div class="seal-box">
                <div class="fileAddItem_1Vqb7" @click="toAddSeal">
                  <i class="iconfont icon-adsystem_icon_add"></i>
                  <p class="defaultInfoStyle_2mgdq">添加印章</p>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center;margin-top: 20px;">
            <el-button type="primary" @click="showSign">确定签署</el-button>
          </div>
        </div>

        <div v-if="sign_status == 1 && contract_info.status < 2">
          <div style="margin-top: 40px">
            <img class="finish-img" src="../../assets/images/sign.png" alt="">
          </div>
          <p class="title">已签署</p>
        </div>
        <div v-if="contract_info.status == 2">
          <div style="margin-top: 40px">
            <img class="finish-img" src="../../assets/images/complete.png" alt="">
          </div>
          <p class="title">已完成</p>
        </div>
        <div v-if="contract_info.status == 3">
          <div style="margin-top: 40px">
            <img class="finish-img" src="../../assets/images/cancel.png" alt="">
          </div>
          <p class="title">已撤销</p>
        </div>
        <div v-if="contract_info.status == 4">
          <div style="margin-top: 40px">
            <img class="finish-img" src="../../assets/images/overtime.png" alt="">
          </div>
          <p class="title">已超时</p>
        </div>

        <div class="real" v-show="activeName == 1 && auth_status != 1">
          <div>
            <span class="gray">请先完成个人实名认证</span>
            <el-button type="primary" @click="toPerson">去认证</el-button>
          </div>
        </div>


        <div class="sign-flow-info" v-show="activeName == 2">
          <div class="sign-flow-info-detail">
            <div class="detail-item">
              <span class="detail-item-title">合同名称</span>
              <span class="detail-item-desc wrap">{{contract_info.name}}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item-title">发起方</span>
              <span class="detail-item-desc wrap">{{contract_info.account_name}}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item-title">发起时间</span>
              <span class="detail-item-desc wrap">{{contract_info.created_at}}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item-title">截止时间</span>
              <span class="detail-item-desc wrap">{{contract_info.sign_end_date}}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item-title">文件有效截止时间</span>
              <span class="detail-item-desc wrap">{{contract_info.contract_end_date}}</span>
            </div>
            <p class="detail-item-title">签署方</p>
          </div>
          <div class="userItem" v-for="user in roles_list" :key="user.id">
            <div style="flex: 1;display: flex">
              <div class="user">{{user.name[0]}}</div>
              <div class="user-name"><span style="color: #0099e6">{{user.company_name}}</span><span>{{user.name}}</span></div>
            </div>
            <div class="tag"><span v-if="user.sign_status == 1">已签署</span><span v-else>未签署</span>
              <i v-clipboard:copy="user.sign_short_url"  v-clipboard:success="onCopy"  v-clipboard:error="onError" class="iconfont icon-all_link"></i></div>
          </div>
          <p class="detail-item-title" style="text-align: left;margin: 15px 0">文件时间流</p>
          <div class="block">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp">
                {{activity.content}}
              </el-timeline-item>
            </el-timeline>
          </div>

        </div>

      </div>
    </div>

    <el-dialog
      title="人脸识别意愿签署"
      :visible.sync="faceVisible"
      width="600px" @close="close"
      custom-class="tips-dialog"
      style="margin:0 auto;text-align: center;" :close-on-click-modal="false">
      <div>
        <!--<el-tabs v-model="faceActiveName" @tab-click="tabClick" style="width: 440px;margin-left: 60px">-->
          <!--<el-tab-pane name="1">-->
            <!--<div slot="label" class="tab-title">-->
              <!--<img src="../../assets/images/alipay.png" class="pay-icon" alt="">支付宝人脸识别-->
            <!--</div>-->
            <div class="code-box">
              <div class="img-box">
                <canvas v-show="qrSuccess" id="qrccode-canvas"></canvas>
                <img v-show="!qrSuccess" src="../../assets/images/alipay.png" alt="" class="code"/>
                <div class="img-cover" v-show="!qrSuccess">
                  <p v-show="!qrSuccess">正在生成二维码</p>
                </div>
                <div class="img-cover" v-if="scanSuccess">
                  <img src="../../assets/images/success.png" alt="">
                  <p>扫描成功</p>
                  <p>请在手机端刷脸认证</p>
                  <p class="fresh">刷新二维码</p>
                </div>
              </div>

              <!--<p>使用其他认证方式：<span class="blue_link">手机号码验证</span></p>-->

              <p class="gray">请使用手机扫描二维码</p>
              <el-button type="primary" v-if="scanSuccess" style="margin-top: 20px" @click="companySign">已完成人脸识别
              </el-button>
            </div>
          <!--</el-tab-pane>-->
          <!--<el-tab-pane name="2">-->
            <!--<div slot="label" class="tab-title">-->
              <!--<img src="../../assets/images/tengxun.png" class="pay-icon" alt="">腾讯云人脸识别-->
            <!--</div>-->
            <!--<div class="code-box">-->
              <!--<div class="img-box">-->
                <!--<canvas v-show="qrSuccess" id="qrccode-canvas"></canvas>-->
                <!--<img v-show="!qrSuccess" src="../../assets/images/tengxun.png" alt="" class="code"/>-->
                <!--<div class="img-cover" v-show="!qrSuccess">-->
                  <!--<p v-show="!qrSuccess">正在生成二维码</p>-->
                <!--</div>-->
                <!--<div class="img-cover" v-if="scanSuccess">-->
                  <!--<img src="../../assets/images/success.png" alt="">-->
                  <!--<p>扫描成功</p>-->
                  <!--<p>请在手机端刷脸认证</p>-->
                  <!--<p class="fresh">刷新二维码</p>-->
                <!--</div>-->
              <!--</div>-->

              <!--&lt;!&ndash;<p>使用其他认证方式：<span class="blue_link">手机号码验证</span></p>&ndash;&gt;-->

              <!--<p class="gray">请使用腾讯扫描二维码，并确保腾讯已登录本人账号</p>-->
              <!--<el-button type="primary" v-if="scanSuccess" style="margin-top: 20px" @click="step = 4">已完成人脸识别-->
              <!--</el-button>-->
            <!--</div>-->
          <!--</el-tab-pane>-->
        <!--</el-tabs>-->
      </div>
    </el-dialog>

    <el-dialog
      title="手机短信意愿签署"
      :visible.sync="signVisible"
      width="600px"
      custom-class="tips-dialog"
      style="margin:0 auto;text-align: center;">
      <div class="dialog-box">
        <p class="phone">手机号码：  {{mobile}}</p>
        <div class="send-code">
          <p class="code-title">输入验证码：</p><el-input v-model.trim="code" style="margin-right: 20px"></el-input><el-button type="primary" @click="sendCode" size="small" v-if="count==0">获取手机验证码</el-button><el-button type="primary" disabled v-if="count!=0" size="small">{{count}} 秒后重新获取</el-button>
        </div>
      </div>
      <el-button type="primary" @click="companySign">确定签署</el-button>
    </el-dialog>

    <el-dialog
      title="实名认证"
      :visible.sync="showPerson" :close-on-click-modal="false" :show-close="false"
      width="600px"
      custom-class="tips-dialog"
      style="margin:0 auto;text-align: center;">
      <div class="dialog-box" style="padding: 30px;font-size: 16px;">
        如您已完成认证，请点击签署合同继续完成签署！
      </div>
      <el-button type="primary" @click="getData">签署合同</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import QRCode from "qrcode";
  var canvas = "";
  let PDFJS = require("pdfjs-dist");
  PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.min");

  export default {
    data() {
      return {
        isShow: false,
        setFlag: false,
        user_role_id: '',
        showPerson: false,
        sign_status: 0,
        auth_status: 1,
        is_cc: 0,
        can_sign: 0,
        signEdges: false,
        showEdges: false,
        signVisible: false,
        faceVisible: false,
        count: 0,
        timer: null,
        dom: null,
        scrollTop: 0,
        codeTimer: null,
        bizId: '', //人脸意愿认证
        authUrl: '', //二维码链接
        qrSuccess: false,
        scanSuccess: false, //扫码认证成功
        faceActiveName: '1',
        activeNameLeft: '1',
        activeName: "1",
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
        slideWidth: 120,
        right: true,
        left: true,
        code: "",
        mobile: '',
        pos_x: '',
        pos_y: '',
        posPage: '',
        seal_id: '',
        // href: '',

        activities: [],

        commonStructsList: [],
        company_seals: [],
        contract_info: {},
        contract_logs: [],
        person_seals: [],
        roles_list: [],
        sign_auth_type: ''
      }
    },
    created() {
      this.contract_id = this.$route.params.id;
      this.mobile = localStorage.getItem("siteMobile");
      // this.href = window.location.href;
    },
    destroyed() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (this.codeTimer) {
        clearInterval(this.codeTimer);
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.$refs.pdfBox.addEventListener("scroll", this.handleScroll, false);
        this.getData();
      });
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
          item.style.width = 190 * new1 + "px";
        });
        document.querySelectorAll(".text_mark2").forEach((item) => {
          item.style.left = (parseInt(item.style.left) / (old1 / new1)) + "px";
          item.style.top = (parseInt(item.style.top) / (old1 / new1)) + "px";
          item.style.height = 100 * new1 + "px";
          item.style.width = 100 * new1 + "px";
        });
        this.slideWidth = 120 *new1;
      },
    },
    methods: {
      toPerson() {
        this.showPerson = true;
        window.open(this.fun.getSiteRoot() + "/#/real_people?i="+this.fun.getKeyByI());
      },
      onCopy: function(e) {
        this.$message.success("复制成功")
      },
      onError: function(e) {
        this.$message.error("复制失败")
      },
      close() {
        if (this.codeTimer) {
          clearInterval(this.codeTimer);
        }
      },
      checkFace() {
        // 1：识别成功
        setTimeout(()=>{
          this.companySign();
        }, 5000);
        this.scanSuccess = true;
        if (this.codeTimer) {
          clearInterval(this.codeTimer);
        }
      },
      createQrc() {
        let _url = this.authUrl ;
        this.qrSuccess = false;
        this.$nextTick(function() {
          // DOM操作
          canvas = document.getElementById("qrccode-canvas");
        });
        setTimeout(()=>{
          QRCode.toCanvas(canvas, _url, error => {
            if (error) {
              this.qrSuccess = false;
              console.log(error);
            } else {
              this.qrSuccess = true;
              this.checkFace();
              this.codeTimer = setInterval(() => {
                this.checkFace();
              }, 5000);
              console.log("success");
            }
          });
        },1000);

      },
      tabClick(e) {
        console.log(this.faceActiveName)
      },
      showSign() {
        if (document.querySelectorAll('.mark').length <= 0) {
          this.$message.error("请先拖拽盖章")
          return;
        }
        if(this.sign_auth_type == 1) {
          this.signVisible = true;
        }else {
          console.log("完成")
        }
      },
      // 获取手机验证码
      sendCode() {
      },
      companySign() {
        if (!this.code && this.sign_auth_type == 1) {
          this.$message.error("请输入验证码");
          return
        }
        let sign_type = 1;
        if(this.showEdges) {
          sign_type = 2;
        }else {
          sign_type = 1;
        }

        let json = {};

        if(this.sign_auth_type == 1) {
          json = {
            sign_type: sign_type,
            total_page: this.page_count,
            posPage: this.posPage,
            seal_id: this.seal_id,
            width: 100,
            pos_x: this.pos_x/this.scale,
            pos_y: (this.pdfHeight/this.scale) - (this.pos_y/this.scale)-100,  //转成bottom
            updated_at: this.contract_info.updated_at,
            id: this.contract_id,
            code: this.code,
          };
        }else {
          json = {
            sign_type: sign_type,
            total_page: this.page_count,
            posPage: this.posPage,
            seal_id: this.seal_id,
            width: 100,
            pos_x: this.pos_x/this.scale,
            pos_y: (this.pdfHeight/this.scale) - (this.pos_y/this.scale)-100,  //转成bottom
            updated_at: this.contract_info.updated_at,
            id: this.contract_id,
            bizId: this.bizId,
          };
        }

        this.$alert('签署成功！  点击确认返回合同列表', '签署成功', {
          type: 'success',
          confirmButtonText: '确定',
          center: true,
          callback: action => {
            this.$router.push(this.fun.getUrl("Manage"));
          }
        });
      },
      // 获取模版
      getData() {
        this.showPerson = false;
        this.user_role_id = 2;
        this.sign_status = 0;
        this.auth_status = 1;
        this.is_cc = 0;
        this.can_sign = 1;
        this.company_seals = [
          {
            "id": 9,
            "uniacid": 2,
            "seal_id": 7,
            "worker_id": 9,
            "has_one_seal": {
              "id": 7,
              "uniacid": 2,
              "seal_url": "https://yz-test-1301475685.cos.ap-guangzhou.myqcloud.com//static/yun-sign//company_seal/943cbf2ca862601b8ba4f0e5e76afc5d.png?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDOaU8TZgufBQNREQ20h8IsBDy3qLx8M7c%26q-sign-time%3D1616911355%3B1616912015%26q-key-time%3D1616911355%3B1616912015%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3Daf8a77eeb328d93af33ad2f43462397b52ad285c"
            }
          }
        ]

        this.contract_info = {
          "id": 88,
            "uniacid": 2,
            "name": "测试测试",
            "sign_end_date": "2021-03-19",
            "contract_end_date": "2021-03-20",
            "template_id": 8,
            "uid": 1306,
            "account_name": "测试测试",
            "status": 0,
            "contract_order_id": 0,
            "origin_contract_doc_url": "/static/yun-sign//o_测试合同20210312112055",
            "contract_doc_name": "测试合同20210312112055",
            "contract_attach": [],
            "evid": "C1370213192176971785",
            "spot_evid": null,
            "created_at": "2021-03-12 11:20:55",
            "updated_at": "2021-03-20 02:00:26",
            "deleted_at": null,
            "pdf_width": 595,
            "pdf_height": 842,
            "contract_type": 0
        };

        this.contract_logs = [
          {
            "id": 163,
            "uniacid": 2,
            "uid": 1306,
            "worker_name": "测试测试",
            "status": 0,
            "created_at": "2021-03-12 11:20:55",
            "status_desc": "由测试测试发起"
          },
          {
            "id": 164,
            "uniacid": 2,
            "uid": 1306,
            "worker_name": "测试测试",
            "status": 1,
            "created_at": "2021-03-12 11:23:25",
            "status_desc": "测试测试已填写"
          }
        ];

        this.person_seals = [];
        this.roles_list =  [
          {
            "id": 119,
            "uniacid": 2,
            "role_id": 1,
            "uid": 1306,
            "name": "测试测试",
            "tel": "242342",
            "sign_type": 1,
            "company_name": "测试测试有限公司",
            "contract_id": 88,
            "sign_status": 0,
            "sign_short_url": "https://xxx.com/s/1N"
          },
          {
            "id": 120,
            "uniacid": 2,
            "role_id": 2,
            "uid": 1307,
            "name": "测试测试",
            "tel": "54534534",
            "sign_type": 1,
            "company_name": "测试测试有限公司",
            "contract_id": 88,
            "sign_status": 0,
            "sign_short_url": "https://xxx.com/s/1O"
          }
        ];

        this.sign_auth_type = 1;
        this.pdfUrl = "/static/test.pdf";
        this._loadFile(this.pdfUrl);
        this.commonStructsList = [
          {
            "id": 429,
            "uniacid": 2,
            "contract_id": 88,
            "form_type": 2,
            "form_name": "签署区",
            "form_value": "",
            "is_require": 0,
            "pos_x": 167,
            "pos_y": 325,
            "pdf_pos_x": 0,
            "pdf_pos_y": 0,
            "doc_page": 1,
            "width": 100,
            "height": 100,
            "role_id": 1,
            "is_hidden": 0,
            "created_at": "2021-03-12 11:20:55",
            "updated_at": "2021-03-12 11:20:55",
            "deleted_at": null
          },
          {
            "id": 430,
            "uniacid": 2,
            "contract_id": 88,
            "form_type": 2,
            "form_name": "签署区",
            "form_value": "",
            "is_require": 0,
            "pos_x": 494,
            "pos_y": 333,
            "pdf_pos_x": 0,
            "pdf_pos_y": 0,
            "doc_page": 1,
            "width": 100,
            "height": 100,
            "role_id": 2,
            "is_hidden": 0,
            "created_at": "2021-03-12 11:20:55",
            "updated_at": "2021-03-12 11:20:55",
            "deleted_at": null
          }
        ];

        for(let i=0;i<this.contract_logs.length;i++){
          if(i === this.contract_logs.length-1){
            this.activities.push({
              content: this.contract_logs[i].status_desc,
              timestamp: this.contract_logs[i].created_at,
              color: "#0099e6"
            })
          }else {
            this.activities.push({
              content: this.contract_logs[i].status_desc,
              timestamp: this.contract_logs[i].created_at,
            })
          }
        }
      },
      setTemplate() {
        const that = this;
        for (let i = 0; i < this.commonStructsList.length; i++) {
          if(that.commonStructsList[i].form_type == 2) {
            let Element = document.querySelector(".componentSign").cloneNode(true);
            document.querySelector('#can'+ that.commonStructsList[i].doc_page).appendChild(Element);
            Element.style.left = that.commonStructsList[i].pos_x + "px";
            Element.style.top = that.commonStructsList[i].pos_y + "px";
            Element.style.display = "flex";
            Element.classList.add("text_mark2");
            Element.setAttribute("page", that.commonStructsList[i].doc_page);
            Element.setAttribute('textId', that.commonStructsList[i].id);
            Element.setAttribute('role_id',that.commonStructsList[i].role_id);
            Element.childNodes[0].style.display = "flex";
            Element.childNodes[0].childNodes[1].childNodes[1].childNodes[1].innerText = that.commonStructsList[i].form_name;
            if(that.commonStructsList[i].role_id == '1'){
              Element.childNodes[0].childNodes[1].childNodes[0].innerText = '甲方';
            }else if(that.commonStructsList[i].role_id == '2'){
              Element.childNodes[0].childNodes[1].childNodes[0].innerText = '乙方';
            }else if(that.commonStructsList[i].role_id == '3'){
              Element.childNodes[0].childNodes[1].childNodes[0].innerText = '丙方';
            }
          }
        }
      },
      TextBlur(e) {
        // console.log(e.currentTarget.parentNode.childNodes);
        e.currentTarget.value=e.currentTarget.value.replace(/\s+/g,'');
        if(e.currentTarget.parentNode.childNodes[0].childNodes[0].style.display == "inline-block" && e.currentTarget.value == '') {
          e.currentTarget.parentNode.classList.add("needFill");
          e.currentTarget.parentNode.childNodes[3].style.display = "flex";
        }else {
          e.currentTarget.parentNode.classList.remove("needFill");
          e.currentTarget.parentNode.childNodes[3].style.display = "none";
        }
      },
      TextMouseenter(e) {
        e.currentTarget.childNodes[0].style.display = "flex";
        // e.currentTarget.childNodes[3].style.display = "block";
      },
      TextMouseleave(e) {
        e.currentTarget.childNodes[0].style.display = "none";
        // e.currentTarget.childNodes[3].style.display = "none";
      },
      TextDeleteIt(e) {
        document.querySelector(".dragLayer_3ccsq").removeChild(e.currentTarget.parentNode);
      },
      mouseenter(e) {
        e.currentTarget.childNodes[0].style.display = "block";
      },
      mouseleave(e) {
        e.currentTarget.childNodes[0].style.display = "none";
      },
      deleteIt(e) {
        e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
      },
      deleteIt2(){
        document.querySelectorAll(".slide-sign").forEach((item) => {
          item.parentNode.removeChild(item);
        });
      },
      deleteIt3(e) {
        e.currentTarget.parentNode.parentNode.childNodes[0].style.display = 'block';
        e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
      },
      signPic(e) {
        if (document.querySelectorAll('.mark').length >= 1) {
          this.$message.error("已经盖了印章")
          return;
        }
        let dom = e.currentTarget.cloneNode(true);
        let sidebarWidth = 0;
        if (document.querySelector("#app").clientWidth > 1026) {
          sidebarWidth = document.querySelector(".el-scrollbar__view").clientWidth;
        }
        dom.style.left = (this.getPos(e).x - 50 - sidebarWidth) + "px";
        dom.style.top = (this.getPos(e).y - 100) + "px";
        dom.className = "sign-img mark";
        document.querySelector("#pageContent").appendChild(dom);
        this.signEdges = true;

        document.onmousemove = e => {
          dom.style.left = (this.getPos(e).x - parseInt(dom.clientWidth / 2) - sidebarWidth) + "px";
          dom.style.top = (this.getPos(e).y - parseInt(dom.clientHeight)) + "px";
          dom.className = "sign-img mark";
        };
        // 鼠标抬开
        document.onmouseup = e => {
          let left = (this.getPos(e).x + this.$refs.pdfBox.scrollLeft - parseInt(dom.clientWidth / 2) - document.querySelector(".pdf-box").offsetLeft - sidebarWidth);
          let top = (this.getPos(e).y + this.scrollTop - parseInt(dom.clientHeight / 2) - 100);

          if(this.showEdges) {
            //限制区域
            if (left < document.querySelector(".pdf-box").clientWidth) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("请将印章拖拽到合同区域");
              return;
            } else if (left > (document.querySelector(".pdf-box").clientWidth + 120*this.scale) - (100 * this.scale)) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("印章位置超出了合同区域");
              return;
            }

            if (top < 0) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("请将印章拖拽到合同区域");
              return;
            } else if (top > document.querySelector(".pdf-box").clientHeight - (100 * this.scale)) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("印章位置超出了合同区域");
              return;
            }
          }else {
            //限制区域
            if (left < 0) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("请将印章拖拽到合同区域");
              return;
            } else if (left > document.querySelector(".pdf-box").clientWidth - (100 * this.scale)) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("印章位置超出了合同区域");
              return;
            }

            if (top < 0) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("请将印章拖拽到合同区域");
              return;
            } else if (top > document.querySelector(".pdf-box").clientHeight - (100 * this.scale)) {
              document.onmousemove = null;
              document.onmouseup = null;
              document.querySelector("#pageContent").removeChild(dom);
              this.$message.error("印章位置超出了合同区域");
              return;
            }
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

          this.posPage = index;
          this.seal_id = dom.getAttribute("id");

          document.querySelector("#pageContent").removeChild(dom);

          if(this.showEdges) {
            this.pos_x = left-this.pdfWidth;
            this.pos_y = top;
            dom.style.left = left-this.pdfWidth + "px";
            dom.style.top = top + "px";
            dom.style.height = 100 * this.scale + "px";
            dom.style.width = 100 * this.scale + "px";
            document.onmousemove = null;
            document.onmouseup = null;
            for(let i=1;i<=this.page_count;i++){
              let domNum = dom.cloneNode(true);
              document.querySelector('#edge_'+ i).appendChild(domNum);
              domNum.className = "sign-img mark slide-sign";
              domNum.onmousedown = this.moveTo2;
              domNum.onmouseenter = this.mouseenter;
              domNum.onmouseleave = this.mouseleave;
              domNum.childNodes[0].onclick = this.deleteIt2;
            }
            this.signEdges = false;
          }else {
            for (let i = 0; i < document.querySelectorAll('.text_mark2').length; i++) {
              if(document.querySelectorAll('.text_mark2')[i].getAttribute('role_id') == this.user_role_id){
                this.pos_x = parseInt(document.querySelectorAll('.text_mark2')[i].style.left);
                this.pos_y = parseInt(document.querySelectorAll('.text_mark2')[i].style.top);
                this.posPage = document.querySelectorAll('.text_mark2')[i].getAttribute('page');
                dom.style.left = 0 + "px";
                dom.style.top = 0 + "px";
                dom.style.height = 100 * this.scale + "px";
                dom.style.width = 100 * this.scale + "px";
                document.querySelectorAll('.text_mark2')[i].childNodes[1].childNodes[0].style.display = 'none';
                document.querySelectorAll('.text_mark2')[i].childNodes[1].appendChild(dom);
                document.onmousemove = null;
                document.onmouseup = null;
                dom.onmouseenter = this.mouseenter;
                dom.onmouseleave = this.mouseleave;
                dom.childNodes[0].onclick = this.deleteIt3;
                this.setFlag = true;
              }
            }

            if(!this.setFlag){
              this.pos_x = left;
              this.pos_y = top;
              dom.style.left = left + "px";
              dom.style.top = top + "px";
              dom.style.height = 100 * this.scale + "px";
              dom.style.width = 100 * this.scale + "px";
              document.querySelector('#can'+ index).appendChild(dom);
              document.onmousemove = null;
              document.onmouseup = null;
              dom.onmouseenter = this.mouseenter;
              dom.onmouseleave = this.mouseleave;
              dom.onmousedown = this.moveTo;
              dom.childNodes[0].onclick = this.deleteIt;
            }
          }
        };
      },
      moveTo(e) {
        let odiv = e.currentTarget; //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
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
          this.pos_x = left;
          this.pos_y = top;
          // console.log(this.pos_x,this.pos_y)
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = e => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      moveTo2(e) {
        let odiv = e.currentTarget; //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = e => {
          let left = e.clientX - disX;
          let top = e.clientY - disY;

          //限制区域
          if (left <= 0) {
            left = 0;
          } else if (left >=  120*this.scale - odiv.clientWidth) {
            left = 120*this.scale - odiv.clientWidth;
          }

          if (top <= 0) {
            top = 0;
          } else if (top >= this.pdfHeight - odiv.clientHeight) {
            top = this.pdfHeight - odiv.clientHeight;
          }

          //移动当前元素
          this.pos_x = left;
          this.pos_y = top;
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = e => {
          document.querySelectorAll(".slide-sign").forEach((item) => {
            item.style.left = odiv.style.left;
            item.style.top = odiv.style.top;
          });
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      getPos(ev) {
        return { x: ev.clientX, y: ev.clientY };
      },
      toAddSeal() {
        window.open(this.fun.getSiteRoot() + "/#/seal/index?i="+this.fun.getKeyByI());
        // this.$router.push(this.fun.getUrl("sealIndex"));
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
            this.setTemplate();
            this.isShow = true;
            this._renderPage(1);
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
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(-10px);
    opacity: 0;
  }
  .dialog-box {
    .phone {
      width: 430px;
      margin: 0 auto;
      text-align: left;
      font-size: 16px;
    }
    .send-code {
      display: flex;
      width: 450px;
      margin: 30px auto
    }
    .code-title {
      flex: 0 0 100px;
      align-self: center
    }
  }

  .pageContent_2lAGg {
    display: flex;
    /*max-width: 1200px;*/
    height: 93vh;
    /*margin: 10px auto 0 auto;*/
    overflow: auto;
    user-select: none;
    /*firefox浏览器*/
    -moz-user-select: none;
    /*safari、chrome浏览器*/
    -webkit-user-select: none; /*Safari中不支持该属性值，只能使用none或者text，或者是在html的标签属性中使用*/
    .input {
      border: none;
      outline: none;
      width: 100%;
    }
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
      color: #fff;
      font-size: 12px;
      background: rgba(92, 162, 232, 0.6);
      z-index: 6;
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
    .componentSign-img {
      display: none;
      width: 100px;
      height: 100px;
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
      display: none;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 190px;
      height: 28px;
      margin: 8px auto;
      padding: 0 10px;
      background: hsla(0, 0%, 100%, .85);
      border: 1px solid #409EFF;
      font-size: 12px;
      /*cursor: grab;*/
      position: absolute;
      top: 90px;
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
      color: #fff;
      font-size: 12px;
      background: rgba(92, 162, 232, 0.8);
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
    .needFill{
      border: 1px solid rgb(230, 23, 23);
      -webkit-appearance: none;
    }
    .errorInfo_3lZie {
      display: none;
      position: absolute;
      left: 0;
      bottom: -16px;
      z-index: 10;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 14px;
      color: #e61717;
      font-size: 12px;
      line-height: 18px;
      white-space: nowrap;
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
      /*border-bottom: 1px solid #eaeaea;*/
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
      height: calc(100% - 100px);
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
      .bottom-btn {
        line-height: 0;
        width: 36px;
        border-radius: 26px;
        position: fixed;
        bottom: 50px;
        right: 290px;
        height: 100px;
        letter-spacing: 3px;
        background-color: rgba(0,0,0,.6);
        color: #fff;
        font-size: 14px;
        z-index: 100;
        border: none;
        cursor: pointer;
        text-align: center;
        padding-top: 17px;
        span {
          writing-mode: vertical-rl;
        }
      }
    }
    .pdfPage_1yRne {
      /*transition: left .3s;*/
      position: relative;
      margin: 10px 0;
    }
    .es-pdf-page__edges {
      /*transition: width .3s;*/
      position: absolute;
      top: 0;
      left: 99.5%;
      user-select: none;
      z-index: 0;
      background: url('../../assets/images/page.png');
      background-size: cover;
    }
    .es-pdf-page__edges--visible {
      border: 2px dashed #2981d9;
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
    flex: 0 0 270px;
    width: 270px;
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
      /*padding: 0 15px;*/
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
    .seal-box-wrap {
      display: flex;
      flex-wrap: wrap;
      margin: 0 5px;
    }
    .fileAddItem_1Vqb7 {
      flex-direction: column;
      justify-content: center;
      height: 120px;
      width: 110px;
      margin: 0 5px 10px 5px;
      border: 1px solid #e6e6e6;
      cursor: pointer;
      vertical-align: bottom;
      display: flex;
      align-items: center;
      .defaultInfoStyle_2mgdq {
        font-size: 14px;
        color: #777;
      }
      i {
        font-weight: normal;
        font-size: 30px;
        color: #777;
      }
      &:hover {
        border: 1px solid #409EFF;
        background-color: rgba(64, 158, 255, 0.07);
        .defaultInfoStyle_2mgdq {
          color: #409EFF;
        }
        i {
          color: #409EFF;
        }
      }
    }
    .seal-box {
      margin: 5px 0;
    }
    .seal-wrapper-item {
      position: relative;
      padding: 10px 5px;
      margin: 0 5px;
      height: 120px;
      width: 110px;
      cursor: move;
      border: 1px dotted #e1e1e1;
    }
    .seal-box-title {
      width: 110px;
      margin: 10px 0;
      font-size: 13px;
      font-weight: normal;
      color: #999999;
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
      font-size: 13px;
      color: #333;
      line-height: 22px;
      font-weight: 500;
      text-align: center;
    }
    .sign-flow-info {
      padding: 25px 10px 0 15px;
    }
    .sign-flow-info-detail {
      margin-bottom: 3px;
      text-align: left;
    }
    .detail-item {
      margin-bottom: 15px;
    }
    .detail-item-title {
      color: #777;
      height: 20px;
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
    }
    .detail-item-desc {
      color: #333;
      line-height: 20px;
      width: 100%;
      font-size: 13px;
      display: inline-block;
    }
    .wrap {
      word-wrap: break-word;
      word-break: break-all;
    }
    .userItem {
      padding: 12px 0 0 0;
      display: flex;
      font-weight: normal;
      color: #333333;
    }
    .user {
      background-color: #0099e6;
      flex: 0 0 40px;
      height: 40px;
      color: #fff;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      line-height: 30px;
    }
    .user-name {
      display: flex;
      flex-direction: column;
      text-align: left;
      margin-left: 10px;
      font-size: 12px;
      align-self: center;
    }
    .tag {
      flex: 0 0 72px;
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        background-color: #0099e6;
        color: #fff;
        padding: 3px 6px;
        border-radius: 10px;
      }
      .icon-all_link {
        cursor: pointer;
        margin-left: 3px;
        color: #0099e6;
        font-size: 16px;
      }
    }
    .block {
      margin-top: 20px;
    }
  }

  .tab-title {
    display: flex;
    line-height: 30px;
    width: 200px;
    padding-left: 25px;
  }

  .pay-icon {
    width: 30px;
    height: 30px;
  }

  .code-box {
    text-align: center;
    .code {
      width: 200px;
      height: 200px;
    }
    .gray {
      color: #999999;
    }
  }

  .img-box {
    position: relative;
  }

  .img-cover {
    position: absolute;
    top: 0;
    left: 180px;
    background: rgba(255, 255, 255, 0.6);
    width: 200px;
    height: 200px;
    font-size: 12px;
    img {
      margin-top: 40px;
      width: 40px;
      height: 40px;
    }
    .fresh {
      margin-top: 30px;
      color: #409EFF;
    }
  }

  #qrccode-canvas {
    width: 220px!important;
    height: 220px!important;
  }
</style>
