<template>
    <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true" 
    :collapse="iscollapse"
    :collapse-transition="false"
    :router='true'
    :default-active="natate"
    >
      <el-submenu v-for="(item,index) in menuList" :index="item.id+''" :key="item.id">
        <template slot="title">
          <i :class="menuIcon[item.id]"></i>
          <span>
            {{item.authName}}
          </span>
        </template>
        <el-menu-item-group v-if="item.children.length>0" v-for="(ch, i) in item.children" :key="ch.id" >
          <el-menu-item :index="ch.path" @click="saveNavState(ch.path)">
            <i class="el-icon-menu"></i>
            <span>
              {{ch.authName}}
            </span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
</template>

<script>
export default {
  props:{
    iscollapse: {
      default: false,
      type: Boolean,
      required: true
    }
  },
  data(){
    return {
      menuList:[],
      menuIcon: {
        '125': 'el-icon-user',
        '103': 'el-icon-loading',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-shopping-cart-full',
        '145': 'el-icon-s-marketing',
      },
      natate: ''
    }
  },
  created(){
    this.getMenuList();
    this.natate = sessionStorage.getItem('natate') || ''
  },
  methods: {
    async getMenuList(){
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return
      this.menuList =  res.data;
    },
    saveNavState(path){
      this.natate =  path
      sessionStorage.setItem('natate', this.natate)
    }
  }
};
</script>

<style scoped>
.el-menu {
    background: #333744;
}
.el-menu-item{
  min-width: 0!important;
}
</style>