<template>
  <div>
    <div class="list-control">
      <div class="list-control-filter">
        <span>品牌:</span>
        <span class="list-control-filter-item" :class="{ on: item === brand }" v-for="(item, index) in brands"
          :key="index" @click="handleFilterBrand(item)">{{ item }}</span>
      </div>
      <div class="list-control-filter">
        <span>颜色:</span>
        <span class="list-control-filter-item" :class="{ on: item === color }" v-for="(item, index) in colors"
          :key="index" @click="handleFilterColor(item)">{{ item }}</span>
      </div>

      <div class="list-control-order">
        <span>排序:</span>
        <span class="list-control-order-item" :class="{ on: sort === '' }" @click="handleSortDefault">默认</span>
        <span class="list-control-order-item" :class="{ on: sort === 'sales' }" @click="handleSortSales('sales')">
          销量
          <template v-if="sort === 'sales'">↓</template>
        </span>
        <span class="list-control-order-item" :class="{ on: sort.indexOf('cost') > -1 }" @click="handleSortCost('cost')">
          价格
          <template v-if="sort === 'cost'">↓</template>
        </span>
      </div>
    </div>
    <Product v-for="item in list" :info="item" :key="item.id"></Product>
    <div class="product-not-found" v-show="!list.length">暂无相关商品</div>
  </div>
</template>

<script>
import { getShoppingGoodsList, getCartList } from "@/service/api";
import util from "@/util";
// 导入商品简介组件
import Product from "../../components/product.vue";
export default {
  components: { Product },
  data() {
    return {
      //品牌过滤
      brand: "",
      //颜色过滤
      color: "",
      // 销量/价格过滤
      sort: "",
      // 列表
      list: [],
      brands: [],
      colors: [],
    };
  },
  created() {
    this.getProductList();
    this.getBrandOrColor();
    this.getMyCartListNumber();
  },
  methods: {
    // 获取购物车数量
    async getMyCartListNumber() {
      try {
        const res = await getCartList({});
        let count = 0;
        res.data.forEach((item) => {
          count += item.goodsNumber;
        });
        this.$store.commit("setCartNum", count);
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 获取商品列表
    async getProductList() {
      const res = await getShoppingGoodsList({
        state: 1,
        brand: this.brand || "",
        color: this.color || "",
        sort: this.sort || "",
        page: 1,
        size: 100,
      });
      if (res.code === 200) {
        const data = res.data;
        // 图片处理
        if (data.length) {
          data.map(item => {
            item.image = util.getImgUrl(item.image)
            item.imageDetail = util.getImgUrl(item.imageDetail);
          });
        }
        this.list = data;
      }
    },
    // 获取全部商品的品牌和颜色
    async getBrandOrColor() {
      try {
        const res = await getShoppingGoodsList({
          state: 1,
          page: 1,
          size: 100,
        });
        if (res.data.length) {
          const brands = res.data.map((item) => item.brand);
          this.brands = util.getFilterArray(brands);
          const colors = res.data.map((item) => item.color);
          this.colors = util.getFilterArray(colors);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 品牌筛选
    handleFilterBrand(brand) {
      //点击品牌过滤，再次点击取消
      if (this.brand === brand) {
        this.brand = "";
      } else {
        this.brand = brand;
      }
      this.getProductList();
    },
    //颜色筛选
    handleFilterColor(color) {
      //点击颜色过滤，再次点击取消
      if (this.color === color) {
        this.color = "";
      } else {
        this.color = color;
      }
      this.getProductList();
    },
    // 默认排序
    handleSortDefault() {
      this.sort = "";
    },
    // 销量排序
    handleSortSales(sales) {
      //点击销量倒序，再次点击取消
      if (this.sort === sales) {
        this.sort = "";
      } else {
        this.sort = sales;
      }
      this.getProductList();
    },
    // 价格排序
    handleSortCost(cost) {
      //点击价格倒序，再次点击取消
      if (this.sort === cost) {
        this.sort = "";
      } else {
        this.sort = cost;
      }
      this.getProductList();
    },
  },
};
</script>

<style scoped>
.list-control {
  background: #fff;
  border-radius: 6px;
  margin: 16px;
  padding: 16px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.list-control-filter {
  margin-bottom: 16px;
}

.list-control-filter-item,
.list-control-order-item {
  cursor: pointer;
  display: inline-block;
  border: 1px solid #e9eaec;
  border-radius: 4px;
  margin-right: 6px;
  padding: 2px 6px;
}

.list-control-filter-item.on,
.list-control-order-item.on {
  background: #f2352e;
  border: 1px solid #f2352e;
  color: #fff;
}

.product-not-found {
  text-align: center;
  padding: 32px;
}
</style>