
<template>
  <div class="about">
    <div class="content">
      <img src="../assets/chengren1.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
      <img src="../assets/chengren2.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
      <img src="../assets/chengren3.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
      <img src="../assets/chengren4.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
      <div class="neibu">
        <div class="neiceng">
          <input type="text" v-model="bodyName" class="input" placeholder="请输入您的昵称或姓名">
          <input type="number" v-model="phone" class="input" placeholder="请输入您的手机号">
          <input type="number" v-model="yanzhengma" class="input" placeholder="请输入验证码">
        </div>
        <van-button type="info" class="bntL" @click="tiJiao">提交资料</van-button>
        <van-button type="info" class="bnt" @click="getUserList">{{content}}</van-button>
        <van-dialog  v-model = "show" :showConfirmButton="false" width="18.87rem" class="img" :close-on-click-overlay=true>
          <img src="../assets/newlist.png" style="width:18.87rem"/>
          <div class="weixin" id="weixini">{{wenxinPhone}}</div>
          <img :src="img" alt="" class="nebImg" id="captureId"/>
          <van-button type="info" class="bntN" v-clipboard:success="downlodeImg"  v-clipboard:copy="message"  v-clipboard:error="onError">复制微信号并打开微信</van-button>
        </van-dialog>
      </div>
      <div class="seamless-warp">
        <van-notice-bar left-icon="volume-o" :scrollable="false" style="background: transparent;">
          <van-swipe
            vertical
            class="notice-swipe"
            :autoplay="8000"
            :show-indicators="false">
            <van-swipe-item class="swipe">
              <span>159****3572</span>
              <span style="margin-left:2.226rem" class="span">3分钟前</span>
              <span>注册成功</span>
            </van-swipe-item>
            <van-swipe-item class="swipe">
              <span>177****1245</span>
              <span style="margin-left:2.226rem" class="span">1分钟前</span>
              <span>注册成功</span>
            </van-swipe-item>
            <van-swipe-item class="swipe">
              <span>166****8946</span>
              <span style="margin-left:2.226rem" class="span">5分钟前</span>
              <span>注册成功</span>
            </van-swipe-item>
          </van-swipe>
        </van-notice-bar>
      </div>
      <div class="pro">限时倒计时:</div>
      <div class="font">剩余21天</div>
      <!-- 进度条 -->
      <div class="progss">
        <van-progress
        :percentage="75"
        :show-pivot="false"
        stroke-width="0.736rem"
        :inactive="false"
        color="linear-gradient(to right, #FFB300, #FF6000)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      content:"获取验证码",
      bodyName: "",
      phone: "",
      yanzhengma: "",
      setInterList:null,
      number:0,
      show: false,
      img:"",
      wenxinPhone:''
    }
  },
  methods:{
    message(){

      },
      onError() {

      },
    downlodeImg() {
      this.$copyText(this.wenxinPhone).then((e) => {
            console.log(this.wenxinPhone);
            console.log(e);
            setTimeout(() => {
              this.goWxchat();
            }, 1000);
          }, (e) => {
            console.log(e);
          });
    },
    goWxchat() {
          document.location.href = 'weixin://';
    },
    getUserList() {
      let reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
      if(this.phone && reg.test(this.phone)) {
        let data= {
          mobile:this.phone
        }
        this.$axios({
          url:"http://101.37.66.151:8768/eg-api/user/sms/send",
          method:"GET",
          params:data
          }).then((res) => {
            console.log(res)
            if(res.status == 200 && res.data.code == 0){
              this.number = 60
              this.times()
            }else {
              this.$toast({
                message:res.data.message
              });
            }
          }).catch((err) => {
            console.log(err)
            this.$toast({
              message:"发送失败"
            });
          })
      }else {
        this.$toast({
          message:"请输入正确的手机号码"
        });
        this.phone = ""
      }
    },

    times() {
      this.setInterList = setInterval(() => {
        if(this.number > 0){
          this.number--;
          this.content = this.number + "s后获取"
        }else {
          clearInterval(this.setInterList)
          this.number = 60;
          this.content = "获取验证码";
          this.setInterList = null
        }
      },1000)
    },

    tiJiao() {
      if(this.phone && this.yanzhengma && this.bodyName) {
        console.log(1)
        let datas = {
          register_platform: "shakeSpeare",
          login_name: this.phone,
          verification_code: this.yanzhengma,
          birth: "2002-01-01 00:00:00",
          age: 18,
          nick_name: this.badyName
        }
        this.$axios({
          url:"http://101.37.66.151:8768/eg-api/user/user/register",
          method:"POST",
          data:datas
        }).then((res) => {
          console.log(res)
          if(res.status == 200 && res.data.code == 0) {
            this.show = true
            this.img = res.data.data.wx_code
            this.wenxinPhone = res.data.data.wx_login_name
          }else {
            this.$toast({
              message: res.data.message
            });
          }
        }).catch((err) => {
          console.log(err)
        })
      }else{
        this.$toast({
          message:"发送失败"
        });
      }
    },

    
  }
}
</script>
<style lang="less" scoped>
  .content{
    position: relative;
    .seamless-warp{
      position: absolute;
      width: 21.324rem;
      height: 2.36rem;
      background:#FFFFFF;
      top: 32.7rem;
      left: 0.89rem;
      border-radius: 1.18rem;
      overflow: hidden;
      font-size: 0.87rem;
      color: #1D63D6;
      line-height: 2.36rem;
       .notice-swipe {
          height: 2.36rem;
          line-height: 2.36rem;
          background: transparent;
          color: #1D63D6;
          .swipe{
            width: 100%;
            height: 100%;
            background: transparent;
            .span{
              margin: 0 2.1rem 0 2.226rem;
            }
          }
        }
    }
    .progss{
      width: 10.492rem;
      height: 0.736rem;
      position: absolute;
      top: 29.1rem;
      left: 8.114rem;
      border-radius: 0.368rem;
      overflow: hidden;
    }
    .pro{
      height: 1.1rem;
      width: 6.17rem;
      line-height: 1.1rem;
      position: absolute;
      font-size:1.1rem ;
      top: 28.9rem;
      left: 0.867rem;
      color: #FFFFFF;
      font-family:"MicrosoftYaHei";
    }
    .font{
      position: absolute;
      top: 29.11rem;
      right: 0.87rem;
      width: 3.3rem;
      height: 0.68rem;
      line-height: 0.68rem;
      font-size: 0.5rem;
      color: #FFFFFF;
    }
    .neibu{
      position: absolute;
      top: 36.666rem;
      width: 21.324rem;
      height: 18.4556rem;
      background:#FFFFFF;
      border-radius: 1rem;
      left: 1.056rem;
      .img{
        position: fixed;
        left: 50%;
        top: 50%;
        .nebImg{
          position: absolute;
          width: 7.4728rem;
          height: 7.454rem;
          top:8.888rem;
          left: 5.7rem;
        }
        .weixin{
          width: 13.42rem;
          height: 2.302rem;
          text-align: center;
          line-height: 2.302rem;
          font-size: 0.85rem;
          color: #2F2F2F;
          position: absolute;
          top: 19rem;
          left: 2.736rem;
          background: rgb(208, 220, 240);
        }
        .bntN{
          position: absolute;
          font-size: 0.8rem;
          color: #EC4D13;
          outline: none;
          border: #EC4D13 0.0187rem solid;
          background: #fff;
          font-family: MicrosoftYaHei-Bold;
          font-weight:bold;
          width: 16.625rem;
          height: 2.453rem;
          top: 24.06rem;
          left: 1.1322rem;
          border-radius:1.18rem ;
        }
      }
      .bntL{
          position: absolute;
          border: none;
          background: rgb(0, 84, 151);
          outline: none;
          color: #FFFFFF;
          width: 17.87rem;
          height: 3.19rem;
          font-size: 1rem;
          border-radius: 1.8rem;
          top: 13.417rem;
          left: 1.7363rem;
        }
      .bnt{
        background:rgb(0, 84, 151);
        outline: none;
        color: #FFFFFF;
        width: 5.831rem;
        height: 1.793rem;
        border: none;
        border-radius: 1.8rem;
        position: absolute;
        left: 13.4rem;
        bottom: 7.152rem;
        font-size: 0.717rem;
        font-family:STHeiti;
      }
      .neiceng{
        margin-top: 1.793rem;
        .input{
          margin-left: 1.7363rem;
          width: 17.8708rem;
          height: 2.359rem;
          margin-bottom: 1.337rem;
          outline: none;
          border-radius: 1.18rem;
          border: #D92530  0.019rem solid;
          box-sizing: border-box;
          padding:0.736rem 1.207rem;
          font-size: 0.868rem;
        }
        
      }
    }
  }
</style>
