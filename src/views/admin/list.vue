<template>
    <div class="cart">
        <div class="cart-header">
            <div class="cart-header-line">
                <div class="cart-header-title">商品管理</div>
                <el-button type="primary" size="small" @click="handleCreateItem">添加商品</el-button>
            </div>
            <!-- <div class="cart-header-main">
                <div class="cart-info">商品信息</div>
                <div class="cart-brand">品牌</div>
                <div class="cart-price">价格</div>
                <div class="cart-color">颜色</div>
                <div class="cart-sales">销量</div>
                <div class="cart-sales">状态</div>
                <div class="cart-control">操作</div>
            </div> -->
            <el-table :data="list" style="width: 100%">
                <el-table-column prop="name" label="商品信息" width="250">
                    <template slot-scope="scope">
                        <div style="display:flex;align-items:center;">
                            <img :src="getUrl(scope.row.image)" style="width:50px;height:50px;margin-right:10px;">
                            {{ scope.row.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="brand" label="品牌">
                </el-table-column>
                <el-table-column prop="cost" label="价格">
                    <template slot-scope="scope">
                        ¥ {{ scope.row.cost }}
                    </template>
                </el-table-column>
                <el-table-column prop="color" label="颜色">
                </el-table-column>
                <el-table-column prop="sales" label="销量">
                </el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.state === 1 ? '上架' : '下架' }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-link @click="handleEditItem(scope.row)" type="warning" :underline="false"
                            style="margin-right: 20px;">编辑</el-link>
                        <el-link @click="handleDelete(scope.row)" type="danger" :underline="false">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="cart-content">
            
            <div class="cart-content-main" v-for="(item, index) in list" :key="index">
                <div class="cart-info">
                    <img class="cart-image" :src="getUrl(item.image)">
                    <span>{{ item.name }}</span>
                </div>
                <div class="cart-brand">
                    {{ item.brand }}
                </div>
                <div class="cart-price">
                    ￥ {{ item.cost }}
                </div>
                <div class="cart-color">
                    {{ item.color }}
                </div>
                <div class="cart-sales">
                    {{ item.sales }}
                </div>
                <div class="cart-sales">
                    {{ item.state === 1 ? '上架' : '下架' }}
                </div>
                <div class="cart-control">
                    <span class="cart-control-edit" @click="handleEditItem(item)">编辑</span>
                    <span class="cart-control-delete" @click="handleDelete(item)">删除</span>
                </div>
            </div>
            <div class="cart-empty" v-if="!list.length">商品列表为空</div>
        </div> -->
        <el-dialog :title="title + '商品'" :visible.sync="dialogVisible" width="800px" :before-close="close">
            <el-form :model="form" :rules="rules" ref="form" label-width="160px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="form.name" maxlength="20" show-word-limit clearable></el-input>
                </el-form-item>
                <el-form-item label="商品品牌" prop="brand">
                    <el-select v-model="form.brand" placeholder="请选择商品品牌">
                        <el-option label="Apple" value="Apple"></el-option>
                        <el-option label="Beats" value="Beats"></el-option>
                        <el-option label="Sonos" value="Sonos"></el-option>
                        <el-option label="B&O" value="B&O"></el-option>
                        <el-option label="Bose" value="Bose"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格" prop="cost">
                    <el-input v-model="form.cost" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品颜色" prop="color">
                    <el-select v-model="form.color" placeholder="请选择商品颜色">
                        <el-option label="白色" value="白色"></el-option>
                        <el-option label="金色" value="金色"></el-option>
                        <el-option label="红色" value="红色"></el-option>
                        <el-option label="蓝色" value="蓝色"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品状态" prop="state">
                    <el-select v-model="form.state" placeholder="请选择商品状态">
                        <el-option label="上架" :value="1"></el-option>
                        <el-option label="下架" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品图片" prop="image">
                    <el-upload class="avatar-uploader" :action="adminUrl" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.image" :src="_image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品详情图片" prop="imageDetail">
                    <el-upload class="avatar-uploader" :action="adminUrl" :show-file-list="false"
                        :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload1">
                        <img v-if="form.imageDetail" :src="_imageDetail" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
import baseURL from '../../config/index.js'
import { getGoodsList, addGoods, updateGoods, deleteGoods } from "../../service/api.js";
export default {
    name: "cart",
    data() {
        return {
            // 弹窗相关
            dialogVisible: false,
            btnLoading: false,
            title: "",
            // adminUrl: "https://hpyp-dev.dreamkey.cn/api/document/upload",
            adminUrl: baseURL.uploadFileUrl,
            // headers: {
            //   'Access-Control-Allow-Origin': '*'
            // },
            _image: "",
            _imageDetail: "",
            form: {
                name: "",
                brand: "",
                cost: "",
                color: "",
                state: 1,
                image: "",
                imageDetail: "",
                sales: 0
            },
            rules: {
                name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
                brand: [
                    { required: true, message: "请选择商品品牌", trigger: "change" },
                ],
                cost: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
                color: [
                    { required: true, message: "请选择商品颜色", trigger: "change" },
                ],
                state: [
                    { required: true, message: "请选择商品状态", trigger: "change" },
                ],
                image: [
                    { required: true, message: "请上传商品图片", trigger: "change" },
                ],
                imageDetail: [
                    { required: true, message: "请上传商品详情", trigger: "change" },
                ],
            },
            list: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 图片处理
        getUrl(url) {
            return baseURL.baseUrl + '/' + url;
        },
        // 请求列表
        async getList() {
            const res = await getGoodsList({ page: 1, size: 100 });
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
                name: "",
                brand: "",
                cost: "",
                color: "",
                state: 1,
                image: "",
                imageDetail: "",
                sales: 0
            });
            this._image = "";
            this._imageDetail = "";
        },
        // 编辑
        handleEditItem(row) {
            this.dialogVisible = true;
            this.title = "编辑";
            this.form.id = row.id;
            this.form.name = row.name;
            this.form.brand = row.brand;
            this.form.state = row.state;
            this.form.cost = row.cost;
            this.form.color = row.color;
            this.form.image = row.image;
            this.form.imageDetail = row.imageDetail;
            this.form.sales = row.sales;

            this._image = baseURL.baseUrl + '/' + row.image;
            this._imageDetail = baseURL.baseUrl + '/' + row.imageDetail;
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
                    const res = await deleteGoods(params);
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
                        const res = await updateGoods(this.form);
                        if (res.code === 200) {
                            this.$message.success("操作成功");
                            this.btnLoading = false;
                            this.close();
                            this.getList();
                        } else {
                            this.$message.error(res.msg);
                        }
                    } else {
                        const res = await addGoods(this.form);
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
        handleAvatarSuccess(res, file) {
            this.form.image = res.data;
            this._image = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        handleAvatarSuccess1(res, file) {
            this.form.imageDetail = res.data;
            this._imageDetail = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload1(file) {
            const isJPG = file.type === "image/jpeg" || "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG/PNG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
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

.cart-image {
    float: left;
    margin-right: 12px;
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
    width: 30%;
    text-align: left;
}

.cart-brand {
    width: 10%;
}

.cart-price {
    width: 10%;
}

.cart-color {
    width: 10%;
}

.cart-sales {
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

.cart-content-main img {
    width: 40px;
    height: 40px;
    position: relative;
    top: 10px;
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

.avatar-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>