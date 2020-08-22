<template>
  <div class="login_contain">
    <div class="login_box">
      <div class="img_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form :model="loginInfo" ref="loginFormRef" :rules="loginInfoRules" label-width="0px" class="form_login">
        <el-form-item prop="username" >
          <el-input v-model="loginInfo.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginInfo.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            loginInfo: {
                username: 'admin',
                password: '123456',
            },
            loginInfoRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },
        login(){
            this.$refs.loginFormRef.validate(async (res)=>{
                if(!res) return;
                const {data} = await this.$http.post('login', this.loginInfo);
                if(data.meta.status !== 200) {
                    this.$message.error('登录失败！')
                    return
                }
                this.$message.success('登录成功！');
                window.sessionStorage.setItem('token', data.data.token)
                this.$router.push('/home')
            })
        }
    }
};
</script>

<style scoped lang="less">
.login_contain {
  width: 100%;
  height: 100%;
  background: rgb(214, 192, 255);
}
.login_box {
  width: 500px;
  height: 300px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  .img_box {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%) translateY(50%);
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: white;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    img {
      border: 1px solid #eee;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      background: #eee;
    }
  }
  .form_login {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
  }
  .btns {
      float: right;
  }
}
</style>