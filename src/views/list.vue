<template>
  <div class="home">
     <div class="content">
       <img src="../assets/list1.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
       <img src="../assets/list2.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
       <img src="../assets/list3.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
       <img src="../assets/list4.png" alt="" style="width:100%;height:100%;vertical-align:middle;">
       <!-- 表单输入 -->
       <div class="neibu">
         <div class="neiceng">
           <input type="number" v-model="phone" class="input" placeholder="请输入您的手机号码">
           <input type="number" v-model="yanZhengList" class="input" placeholder="请输入验证码">
           <input type="text" v-model="badyName" class="input" placeholder="请输入宝贝昵称">
           <input type="number" v-model="badyAge" class="input" placeholder="请输入宝贝年龄">
         </div>
         <van-button type="info" class="bnt" @click="getUserList">{{content}}</van-button>
         <van-button type="info" class="bntL" @click="upload">提交资料</van-button>
         <van-dialog  v-model = "show" :showConfirmButton="false" width="18.87rem" class="img" :close-on-click-overlay=true >
            <img src="../assets/newlist.png" style="width:18.87rem"/>
            <div class="weixin" id="weixini">{{wenxinPhone}}</div>
            <img :src="img" alt="" class="nebImg"  id="captureId"/>
            <van-button type="info" class="bntN" v-clipboard:success="downlodeImg"  v-clipboard:copy="message"  v-clipboard:error="onError">保存至相册并打开微信</van-button>
         </van-dialog>
       </div>
     </div>
  </div>
</template>
<script>
export default {
    data() {
      return {
          phone:'',
          yanZhengList:'',
          badyName:'',
          badyAge:'',
          miaoShu:60,
          content:"获取验证码",
          getCodeTimer: null,
          age: "",
          show: false,
          img: "",
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
      // 获取验证码
        getUserList() {
          let reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
          if(this.phone && reg.test(this.phone)){
                let data = {
                  mobile : this.phone
                }
                this.$axios({
                  url:"http://101.37.66.151:8768/eg-api/user/sms/send",
                  method:"GET",
                  params:data
                }).then((res) => {
                  console.log(res.status,res.data.message)
                  if(res.data.code == 0 && res.status == 200){
                      this.isShow = true
                      this.miaoShu = 60
                      this.times()
                  }else if(res.data.code != 0 && res.status == 200){
                      console.log(res.data)
                      this.$toast({
                        message:res.data.message
                      });
                  }
                }).catch((err) => {
                  console.log(err,"请求出错了")
                })
          }else{
            this.$toast({
              message:"请输入正确的手机号码"
            });
            this.phone = ""
          }
        },
       times(){
            this.getCodeTimer = setInterval(() => {
              if (this.miaoShu > 0) {
              this.miaoShu--;
              this.content = this.miaoShu + "s后获取"
              }else {
              clearInterval(this.getCodeTimer);
              this.getCodeTimer = null;
              this.miaoShu = 60
              this.content = "获取验证码"
            }
          },1000)
          } ,
        // 上传用户信息
        upload() {
            let  date=new Date,y = date.getFullYear()
            console.log(y)
            if(!this.phone && !this.yanZhengList && !this.badyName && !this.badyAge){
                this.$toast({
                  message:"请完成信息"
                });
            }else{
              let birth = y - this.badyAge + "-01-01 00:00:00"
              console.log(birth)
              this.ageList()
              let datas = {
                register_platform: "shakeSpeare",
                login_name: this.phone,
                verification_code: this.yanZhengList,
                birth: birth,
                age: this.age,
                nick_name: this.badyName
              }
              console.log(datas)
              this.$axios({
                url:"http://101.37.66.151:8768/eg-api/user/user/register",
                method:"POST",
                data:datas
              }).then((res) => {
                console.log(res)
                console.log(res.data)
                if(res.status == 200 && res.data.code == 0){
                  this.show = true
                  this.img = res.data.data.wx_code
                  this.wenxinPhone = res.data.data.wx_login_name
                }else{
                  this.$toast({
                    message: res.data.message
                  });
                }
              }).catch((err) => {
                console.log(err)
              })
            }
         },

         ageList() {
            let _this = this
            if(_this.badyAge < 12){
                _this.age = 0
            }else if(_this.badyAge >= 12 && _this.badyAge < 18){
                _this.age = 18
            }else {
              _this.age = 20
            }
         }
    },
     // 下载图片
    
    created() {

    }
};
</script>
<style scoped lang="less">
  .content{
    input::-webkit-input-placeholder {
       color:#E4E4E4;
    }
    position: relative;
    .neibu{
      position: absolute;
      top: 30.11rem;
      width: 21.324rem;
      height: 21.8336rem;
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
      .bnt{
          background: linear-gradient(to top, #EF882E , #E3432D);
          outline: none;
          color: #FFFFFF;
          width: 5.831rem;
          height: 1.793rem;
          border: none;
          border-radius: 1.8rem;
          position: absolute;
          left: 13.4rem;
          top: 5.4535rem;
          font-size: 0.717rem;
          font-family:STHeiti;
        }
      .bntL{
          position: absolute;
          border: none;
          background: linear-gradient(to top, #EF882E , #E3432D);
          outline: none;
          color: #FFFFFF;
          width: 17.87rem;
          height: 3.19rem;
          font-size: 0.717rem;
          border-radius: 1.8rem;
          top: 16.44rem;
          left: 1.7363rem;
        }
      .neiceng{
        margin-top: 1.8116rem;
        .input{
          margin-left: 1.7363rem;
          width: 17.8708rem;
          height: 2.359rem;
          margin-bottom: 1rem;
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
