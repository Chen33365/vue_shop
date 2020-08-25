<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img src="../assets/logo.png" alt />
        <span class="text">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ?'64px': '200px'">
        <div class="toggle-button" @click="toggleCall">|||</div>
          <HomeMenu :iscollapse="iscollapse"/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeMenu from './Home/HomeMenu'
export default {
  data(){
    return {
      iscollapse: false
    }
  },
  components: {
      HomeMenu
    // HomeHeader,
  },
  methods: {
    loginOut() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    toggleCall(){
      this.iscollapse = !this.iscollapse
    }
  },
};
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
  width: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
}
.left {
  display: flex;
  align-items: center;
  img {
    margin: 0;
    padding: 0;
    float: left;
    width: 50px;
    height: 50px;
  }
  .text {
    color: white;
    font-size: 20px;
    font-weight: bold;
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  height: 25px;
  font-size: 16px;
  line-height: 25px;
  color: white;
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
}
</style>