import Vue from 'vue'
import HomePage from '@/components/home-page'

describe('home-page.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HomePage)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Bin Collection Check App')
  })
})
