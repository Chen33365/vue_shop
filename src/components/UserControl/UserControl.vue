<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border stripe style="width: 100%;font-size:14px" :data="userList">
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editShow(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setUserDialogShow(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="分配角色" :visible.sync="setUserDialog" width="50%">
      <el-form label-width="90px">
        <el-form-item label="当前的用户">
          <el-input :value="setUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前的角色">
          <el-input :value="setUserInfo.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select v-model="newUserRoleName" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="savaRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <AddUser :addDialogVisible="addDialogVisible" @isaddDialogVisible="isaddDialogVisible" />
    <EditUser
      :editDialogVisible="editDialogVisible"
      :editUserData="editUserData"
      @isEitDialogVisible="isEitDialogVisible"
    />
  </div>
</template>

<script>
import AddUser from "./addUser";
import EditUser from "./editUser";
export default {
  components: {
    AddUser,
    EditUser,
  },
  data() {
    return {
      userInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      userList: [],
      total: 0,
      editDialogVisible: false,
      addDialogVisible: false,
      setUserDialog: false,
      editUserData: {},
      setUserInfo: {},
      newUserRoleName: "",
      roleList: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.userInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败！");
      this.$message.success("获取用户信息成功！");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(pagesize) {
      this.userInfo.pagesize = pagesize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.userInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.userInfo.mg_state = !this.userInfo.mg_state;
        return this.$message.error("设置用户状态失败！");
      }
      this.$message.success("设置用户状态成功!");
    },
    async editShow(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editDialogVisible = true;
      this.editUserData = res.data;
      this.$message.success("查询用户信息成功");
    },
    isEitDialogVisible(value) {
      this.editDialogVisible = value;
      this.getUserList();
    },
    isaddDialogVisible(value) {
      this.addDialogVisible = value;
      this.getUserList();
    },
    removeUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status !== 200)
            return this.$message.error("删除用户操作失败");
          this.getUserList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async setUserDialogShow(role) {
      this.setUserInfo = role;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return;
      this.roleList = res.data
      this.setUserDialog = true;
    },
    async savaRoleInfo(){
      if(!this.newUserRoleName) return this.$message.error('请选择要分配的角色');
      const {data: res} = await this.$http.put(`users/${this.setUserInfo.id}/role`, {rid:this.newUserRoleName});
      if(res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setUserDialog = false;
    }
  },
};
</script>

<style scoped>
.el-breadcrumb__item {
  font-size: 16px;
}
</style>