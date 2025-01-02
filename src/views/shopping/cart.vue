<template>
    <div class="cart">
        <div class="cart-header">
            <div class="cart-header-title">购物清单</div>
            <div class="cart-header-main">
                <div class="cart-info">商品信息</div>
                <div class="cart-price">单价</div>
                <div class="cart-count">数量</div>
                <div class="cart-cost">小计</div>
                <div class="cart-delete">操作</div>
            </div>
        </div>
        <div class="cart-content">
            <!-- 列表显示购物清单 -->
            <div class="cart-content-main" v-for="(item, index) in cartList" :key="index">
                <div class="cart-info">
                    <img :src="getUrl(item.goods.image)">
                    <span>{{ item.goods.name }}</span>
                </div>
                <div class="cart-price">
                    ￥ {{ item.goods.cost }}
                </div>
                <div class="cart-count">
                    <span class="cart-control-minus" @click="handleCount(index, -1)">-</span>
                    {{ item.goodsNumber }}
                    <span class="cart-control-add" @click="handleCount(index, 1)">+</span>
                </div>
                <div class="cart-cost">
                    ￥ {{ item.goods.cost * item.goodsNumber }}
                </div>
                <div class="cart-delete">
                    <span class="cart-control-delete" @click="handleDelete(index)">删除</span>
                </div>
            </div>
            <div class="cart-empty" v-if="!cartList.length">购物车为空</div>
        </div>
        <div class="cart-footer" v-show="cartList.length">
            <div class="cart-footer-desc">
                共计 <span>{{ countAll }}</span>
            </div>
            <div class="cart-footer-desc">
                应付总额 <span>{{ costAll }}</span>
            </div>
            <div class="cart-footer-desc">
                <div class="cart-control-order" @click="handleOrder">现在结算</div>
            </div>
        </div>
    </div>
</template>
<script>
import baseURL from "@/config/index.js";
import { getCartList, updateCart, deleteCart, buyOrder } from "../../service/api";
import product_data from "../../components/product";
export default {
    name: "cart",
    data() {
        return {
            promotion: 0,
            promotionCode: "",
            productList: product_data,
            cartList: [],
        };
    },
    computed: {
        //设置字典对象，方便查询
        productDictList() {
            const dict = {};
            this.productList.forEach((item) => {
                dict[item.id] = item;
            });
            return dict;
        },
        //购物车商品总数
        countAll() {
            let count = 0;
            this.cartList.forEach((item) => {
                count += item.goodsNumber;
            });
            return count;
        },
        //购物车商品总价
        costAll() {
            let cost = 0;
            this.cartList.forEach((item) => {
                cost += item.goods.cost * item.goodsNumber;
            });
            return cost;
        },
    },
    created() {
        this.getMyCartList();
    },
    methods: {
        // 图片处理
        getUrl(url) {
            return baseURL.baseUrl + "/" + url;
        },
        // 获取购物车列表
        async getMyCartList() {
            try {
                const res = await getCartList({});
                this.cartList = res.data;
            } catch (error) {
                this.$message.error(error);
            }
        },
        //通知Vuex,完成下单
        async handleOrder() {
            try {
                let params = [];
                this.cartList.forEach((item) => {
                    params.push(item.id);
                });
                console.log(params);
                const res = await buyOrder(params);
                if (res.code === 200) {
                    this.$message.success("下单成功");
                    this.$store.commit("setCartNum", 0);
                    window.location.href = "/shopping/list";
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        //修改购物车数量
        async handleCount(index, count) {
            //最小值设置1
            if (count < 0 && this.cartList[index].goodsNumber === 1) return;
            try {
                const res = await updateCart({
                    id: this.cartList[index].id,
                    goodsId: this.cartList[index].goods.id,
                    goodsNumber: this.cartList[index].goodsNumber + count,
                });
                if (res.code === 200) {
                    this.getMyCartList();
                    this.$store.commit("setCartNum", this.$store.state.cartNum + count);
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        //根据index查找商品id进行删除
        async handleDelete(index) {
            this.$confirm("确定删除此条数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(async () => {
                    // 调用删除接口
                    const res = await deleteCart(
                        [this.cartList[index].id]
                    );
                    if (res.code === 200) {
                        this.getMyCartList();
                        setTimeout(() => {
                            this.$store.commit("setCartNum", this.countAll);
                        }, 500)
                    }
                })
                .catch(() => { });
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

.cart-header-title {
    padding: 16px 32px;
    border-bottom: 1px solid #dddee1;
    border-radius: 10px 10px 0 0;
    background: #f8f8f9;
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
    width: 60%;
    text-align: left;
}

.cart-price {
    width: 10%;
}

.cart-count {
    width: 10%;
}

.cart-cost {
    width: 10%;
}

.cart-delete {
    width: 10%;
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

.cart-control-minus,
.cart-control-add {
    display: inline-block;
    margin: 0 4px;
    width: 24px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    background: #f8f8f9;
    border-radius: 50%;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.cart-control-delete {
    cursor: pointer;
    color: #2d8cf0;
}

.cart-promotion {
    padding: 16px 32px;
}

.cart-control-promotion,
.cart-control-order {
    display: inline-block;
    padding: 8px 32px;
    border-radius: 6px;
    background: #2d8cf0;
    color: #fff;
    cursor: pointer;
}

.cart-control-promotion {
    padding: 2px 6px;
    font-size: 12px;
    border-radius: 3px;
}

.cart-footer {
    padding: 32px;
    text-align: right;
}

.cart-footer-desc {
    display: inline-block;
    padding: 0 16px;
}

.cart-footer-desc span {
    color: #f2352e;
    font-size: 20px;
}
</style>