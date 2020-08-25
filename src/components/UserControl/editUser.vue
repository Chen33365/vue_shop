<template>
  <el-dialog title="修改用户" :visible.sync="SuneditDialogVisible" width="30%" @close="editUserClose">
    <el-form label-width="80px" :model="editUserForm" :rules="editUserRules" ref="editFormRef">
      <el-form-item label="用户名">
        <el-input v-model="editUserForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editUserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="SuneditDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    editDialogVisible: {
      default: false,
      type: Boolean,
    },
    editUserData: {
      default: {
        username: "",
        email: "",
        mobile: "",
      },
      type: Object,
    },
  },
  data() {
    let checkEmail = (rule, value, cb) => {
      const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
      if (reg.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    return {
      editUserForm: {
        username: "",
        email: "",
        mobile: "",
      },
      editUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
      SuneditDialogVisible: false,
    };
  },
  methods: {
    editUserClose() {
      this.$refs.editFormRef.resetFields();
      this.$emit("isEitDialogVisible",false)
    },
    editUser() {
        console.log(this.editUserForm);
        this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put("users/"+this.editUserForm.id, this.editUserForm);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("修改用户成功");
        this.SuneditDialogVisible = false;
      });
    },
  },
  watch: {
    editDialogVisible: function () {
      this.SuneditDialogVisible = this.editDialogVisible;
      this.editUserForm.id = this.editUserData.id;
      this.editUserForm.username = this.editUserData.username;
      this.editUserForm.email = this.editUserData.email;
      this.editUserForm.mobile = this.editUserData.mobile;
    },
  },
};
</script>

<style scoped>
</style>