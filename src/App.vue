<template>
  <div>
    <!-- 商城顶部导航 -->
    <template v-if="show && $store.state.loginType === 'shopping'">
      <div class="header">
        <router-link to="/shopping/list">
          <div class="header-title">
            <img class="header-logo" src="@/assets/login/logo.png">
            <span>商城首页</span>
          </div>
        </router-link>
        <div class="header-menu">
          <router-link to="/shopping/cart" class="header-menu-cart">
            购物车
            <span v-if="cartNum">{{ cartNum }}</span>
          </router-link>
        </div>
        <div class="header-menu">
          {{ user }}
        </div>
        <div class="header-menu">
          <div class="header-menu-cart" @click="handleLogout">
            退出登录
          </div>
        </div>
        <div class="header-menu">
          <router-link to="/admin/login/logout" class="header-menu-cart">
            管理后台
          </router-link>
        </div>
      </div>
    </template>
    <!-- 商家端顶部导航 -->
    <template v-else-if="show && $store.state.loginType === 'admin'">
      <div class="header">
        <router-link to="/admin/list">
          <div class="header-title">
            <img class="header-logo" src="@/assets/login/logo.png">
            <span>商城管理后台</span>
          </div>
        </router-link>
        <div class="header-menu">
          {{ user }}
        </div>
        <div class="header-menu">
          <router-link to="/admin/login/logout" class="header-menu-cart">
            退出登录
          </router-link>
        </div>
        <div class="header-menu">
          <router-link to="/shopping/login/logout" class="header-menu-cart">
            购物商城
          </router-link>
        </div>
        <div class="header-menu">
          <router-link to="/admin/list" class="header-menu-cart">
            商品管理
          </router-link>
        </div>
        <div class="header-menu">
          <router-link to="/admin/user" class="header-menu-cart">
            用户管理
          </router-link>
        </div>
      </div>
    </template>
    <!-- 挂载所有路由 -->
    <router-view></router-view>
  </div>
</template>

<script>
import { shoppingLogout } from './service/api';


export default {
  data() {
    return {
      user: this.$store.state.username,
    }
  },
  computed: {
    cartNum() {
      return this.$store.state.cartNum
    },
    show() {
      console.log(this.$store.state)
      return this.$store.state.loginStatus
    },
  },
  methods: {
    async handleLogout() {
      try {

        await shoppingLogout();

        this.$message.success('退出登录成功')

        this.$router.push('/shopping/login/logout')
      } catch (error) {
        this.$message.error(error.message || '退出登录失败')
      }
    }
  }
}
</script>

<style scoped></style>
