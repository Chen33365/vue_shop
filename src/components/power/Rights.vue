<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
            <el-table border stripe style="width: 100%;font-size:14px" :data="rightsList">
      <el-table-column label="#" type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.level == 1">一级权限</el-tag>
              <el-tag v-else-if="scope.row.level == 2" type="success">二级权限</el-tag>
              <el-tag v-else type="warning">三级权限</el-tag>
          </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return {
            rightsList:[]
        }
    },
    async created(){
        const {data:res} = await this.$http.get('rights/list')
        if(res.meta.status !== 200){
            return this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
    }
};
</script>

<style scoped>
.rights {
    
}
.el-breadcrumb__item{
  font-size: 16px;
}
</style>