<template>
    <div class="cart">
        <div class="cart-header">
            <div class="cart-header-line">
                <div class="cart-header-title">用户管理</div>
                <el-button type="primary" size="small" @click="handleCreateItem">添加用户</el-button>
            </div>
            <div class="cart-header-main">
                <div class="cart-info">用户信息</div>
                <div class="cart-brand">登录密码</div>
                <div class="cart-control">操作</div>
            </div>
        </div>
        <div class="cart-content">
            <!-- 列表显示购物清单 -->
            <div class="cart-content-main" v-for="(item, index) in list" :key="index">
                <div class="cart-info">
                    <span style="margin-right: 20px;">{{ '用户昵称：' + item.nickname }}</span>
                    <span>{{ '登录账号：' + item.username }}</span>
                </div>
                <div class="cart-brand">
                    {{ item.password || '不显示' }}
                </div>
                <div class="cart-control">
                    <span class="cart-control-edit" @click="handleEditItem(item)">编辑</span>
                    <span class="cart-control-delete" @click="handleDelete(item)">删除</span>
                </div>
            </div>
            <div class="cart-empty" v-if="!list.length">用户列表为空</div>
        </div>
        <el-dialog :title="title + '用户'" :visible.sync="dialogVisible" width="800px" :before-close="close">
            <el-form :model="form" :rules="rules" ref="form" label-width="160px">
                <el-form-item label="用户昵称" prop="nickname">
                    <el-input v-model="form.nickname" maxlength="20" show-word-limit clearable></el-input>
                </el-form-item>
                <el-form-item label="登录账号" prop="username">
                    <el-input v-model="form.username" maxlength="8" show-word-limit clearable
                        :readonly="title === '编辑'"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="form.password" maxlength="8" show-word-limit clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="form.confirmPassword" maxlength="8" show-word-limit clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" v-loading="btnLoading" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getUserList, addUser, updateUser, deleteUser } from "../../service/api.js";
export default {
    name: "user",
    data() {
        return {
            // 弹窗相关
            dialogVisible: false,
            btnLoading: false,
            title: "",
            form: {
                nickname: "",
                username: "",
                password: "",
                confirmPassword: ""
            },
            rules: {
                nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
                username: [
                    { required: true, message: "请输入登录账号", trigger: "blur" },
                ],
                password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
                confirmPassword: [
                    { required: true, message: "请输入确认密码", trigger: "blur" },
                ],
            },
            list: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 请求列表
        async getList() {
            const res = await getUserList({ page: 1, size: 100 });
            if (res.code === 200) {
                this.list = res.data;
            } else {
                this.$message.error(res.msg);
            }
        },
        // 添加
        handleCreateItem() {
            this.dialogVisible = true;
            this.title = "添加";
            Object.assign(this.form, {
                id: "",
                nickname: "",
                username: "",
                password: "",
                confirmPassword: ""
            });
        },
        // 编辑
        handleEditItem(row) {
            this.dialogVisible = true;
            this.title = "编辑";
            this.form.id = row.id;
            this.form.nickname = row.nickname;
            this.form.username = row.username;
            this.form.password = row.password;
            this.form.confirmPassword = row.confirmPassword;
        },
        // 删除
        handleDelete(row) {
            this.$confirm("确定删除此条数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(async () => {
                    // 调用删除接口
                    const params = {
                        id: row.id
                    };
                    const res = await deleteUser(params);
                    if (res.code === 200) {
                        this.$message.success("操作成功");
                        this.getList();
                    }
                })
                .catch(() => { });
        },
        // 重置表单
        close() {
            this.$refs.form.resetFields();
            this.dialogVisible = false;
        },
        // 表单提交
        submitForm() {
            this.btnLoading = true;
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    if (this.form.id) {
                        const res = await updateUser(this.form);
                        if (res.code === 200) {
                            this.$message.success("操作成功");
                            this.btnLoading = false;
                            this.close();
                            this.getList();
                        } else {
                            this.$message.error(res.msg);
                        }
                    } else {
                        const res = await addUser(this.form);
                        if (res.code === 200) {
                            this.$message.success("操作成功");
                            this.btnLoading = false;
                            this.close();
                            this.getList();
                        } else {
                            this.$message.error(res.msg);
                        }
                    }
                } else {
                    this.btnLoading = false;
                }
            });
        },
    },
};
</script>
<style scoped>
.cart {
    margin: 32px;
    background: #fff;
    border: 1px solid #dddee1;
    border-radius: 10px;
}

.cart-header-line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 16px 32px;
    border-bottom: 1px solid #dddee1;
    border-radius: 10px 10px 0 0;
    background: #f8f8f9;
}

.cart-header-title {
    font-weight: 600;
}

.cart-header-main {
    padding: 8px 32px;
    overflow: hidden;
    border-bottom: 1px solid #dddee1;
    background: #eee;
    overflow: hidden;
}

.cart-empty {
    text-align: center;
    padding: 32px;
}

.cart-header-main div {
    text-align: center;
    float: left;
    font-size: 14px;
}

div.cart-info {
    width: 40%;
    text-align: left;
}

.cart-brand {
    width: 10%;
}

.cart-control {
    width: 20%;
}

.cart-content-main {
    padding: 0 32px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-bottom: 1px dashed #e9eaec;
    overflow: hidden;
}

.cart-content-main div {
    float: left;
}

.cart-control-edit {
    cursor: pointer;
    color: #d3b717;
    margin-right: 10px;
}

.cart-control-delete {
    cursor: pointer;
    color: #2d8cf0;
}
</style>