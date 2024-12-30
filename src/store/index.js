import Vue from 'vue'
import Vuex from 'vuex'
import style from '../assets/style.css' // 引入公共样式

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前用户账号
    username: window.localStorage.getItem('username'),
    // 登录状态
    loginStatus: window.localStorage.getItem('loginStatus'),
    // 用户 token
    token: window.localStorage.getItem('token'),
    // 登录类型
    loginType: window.localStorage.getItem('loginType'),
    // 购物车数量
    cartNum: parseInt(window.localStorage.getItem('cartNum')),
  },
  getters: {},
  mutations: {
    // 设置用户名
    setUsername(state, username) {
      state.username = username
      window.localStorage.setItem('username', username)
    },
    // 设置登录状态
    setLoginStatus(state, flag) {
      state.loginStatus = flag
      window.localStorage.setItem('loginStatus', flag)
    },
    // 设置 token
    setToken(state, token) {
      state.token = token
      window.localStorage.setItem('token', token)
    },
    // 设置登录类型
    setLoginType(state, type) {
      state.loginType = type
      window.localStorage.setItem('loginType', type)
    },
    // 设置购物车数量
    setCartNum(state, num) {
      state.cartNum = num
      window.localStorage.setItem('cartNum', parseInt(num))
    }
  },
  actions: {},
  modules: {},
})