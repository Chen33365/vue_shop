<template>
  <el-dialog title="添加用户" :visible.sync="newAddDialogVisible" width="30%" @close="addUserClose">
    <el-form label-width="80px" :model="addUserForm" :rules="addUserRules" ref="addFormRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addUserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="newAddDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addDialogVisible:{
        default: false,
        type: Boolean
    }
  },
  data() {
    // 自定义效验表单项
    let checkEmail = (rule, value, cb) => {
      const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
      if (reg.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    return {
      newAddDialogVisible:false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
    };
  },
  methods: {
    addUserClose() {
      // 重置表单项
      this.$refs.addFormRef.resetFields();
      this.$emit('isaddDialogVisible', false)
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("添加用户成功");
        this.newAddDialogVisible = false;
         this.$emit('isaddDialogVisible', false)
      });
    },
  },
  watch:{
    'addDialogVisible':function(){
      this.newAddDialogVisible = this.addDialogVisible
    }
  }
};
</script>

<style scoped>
</style>