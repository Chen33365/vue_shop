<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="isAddRolesDialog = true">添加角色</el-button>
      <el-table border stripe style="width: 100%;font-size:14px" :data="rolesList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdBottom', index == 0 ? 'bdTop':'']"
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i == 0 ? '':'bdTop']"
                  v-for="(item2, i) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag closable type="success">{{item2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRoles(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="name" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editShow(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
            >删除</el-button>
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
                @click="allotRolesListShow(scope.row)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="isAddRolesDialog" width="30%" @close="closeAddRoles">
      <el-form label-width="80px" :model="addRolesForm" ref="addRolesRef" :rules="addRolesRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改角色" :visible.sync="isEditRolesDialog" width="30%">
      <el-form label-width="80px" :model="editRolesForm" ref="editRolesRef" :rules="addRolesRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定 修 改</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="isAllotRolesDialog" width="30%" @close="allotRightClose">
      <el-tree
        :data="allotRightList"
        ref="allotTreeRef"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="defKeys"
        :props="defaultProps"
        :default-expand-all="true"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAllotRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      isAddRolesDialog: false,
      isEditRolesDialog: false,
      isAllotRolesDialog: false,
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      editRolesForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      allotRightList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defKeys: [],
      roleId:''
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },
    closeAddRoles() {
      this.$refs.addRolesRef.resetFields();
    },
    // 点击修改 弹出对话框
    editShow(Data) {
      this.isEditRolesDialog = true;
      this.editRolesForm.roleId = +Data.id;
      this.editRolesForm.roleName = Data.roleName;
      this.editRolesForm.roleDesc = Data.roleDesc;
    },
    // 确定修改角色信息
    async editRoles() {
      const { data: res } = await this.$http.put(
        "roles/" + this.editRolesForm.roleId,
        this.editRolesForm
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改角色信息失败");
      }
      this.$message.success("修改角色信息成功");
      this.isEditRolesDialog = false;
      this.getRolesList();
    },
    // 确定添加角色
    addRoles() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.isAddRolesDialog = false;
        this.$message.success("添加角色成功");
        this.getRolesList();
      });
    },
    deleteRoles(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);
          if (res.meta.status !== 200)
            return this.$message.error("删除角色操作失败");
          this.getRolesList();
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
    removeRoles(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "删除权限", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200)
            return this.$message.error("删除权限失败");
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          role.children = res.data;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async allotRolesListShow(role) {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取分配权限列表失败");
      this.allotRightList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.roleId = role.id;
      this.isAllotRolesDialog = true;
    },
    // 通过递归的形式，获取角色下所有权限id
    getLeafKeys(node, arr){
      if(!node.children){
      }
      node.children.forEach((item)=>{
        if(!item.children){
          arr.push(item.id)
        }
        item.children.forEach((i)=>{
          arr.push(i.id)
        })
      })
    },
    async allotRights(){
      const keys = [...this.$refs.allotTreeRef.getCheckedKeys(),...this.$refs.allotTreeRef.getHalfCheckedKeys()]
      const strId = keys.join(',');
      const {data: res} = await this.$http.post('roles/'+ this.roleId +'/rights', {rids:strId});
      if(res.meta.status !== 200)return this.$message.error('更新失败')
      this.$message.success('更新用户权限成功');
      this.isAllotRolesDialog = false;
      this.getRolesList()
    },
    allotRightClose(){
      this.defKeys = [];
    }
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style scoped>
.el-tag {
  margin: 10px;
  margin-right: 20px;
  transform: scale(1.2);
}
.el-row {
  display: flex;
  align-items: center;
}
.bdTop {
  border-top: 1px solid #ccc;
}
.bdBottom {
  border-bottom: 1px solid #ccc;
}
</style>