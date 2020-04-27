<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
		<div><img :src="Logo" key="max-logo"></div>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form';
import Logo from '@/assets/images/logo-b.png';
import { mapActions } from 'vuex';
export default {
    data () {
        return {
            Logo
        };
    },
    components: {
        LoginForm
    },
    methods: {
        ...mapActions([
            'handleLogin',
            // 'getUserInfo'
        ]),
        handleSubmit ({ username, password }) {
            this.handleLogin({ username, password }).then(() => {
                this.$router.push({
                    name: this.$config.homeName
                });
                // this.getUserInfo().then(() => {
                //     this.$router.push({
                //         name: this.$config.homeName
                //     });
                // });
            });
        }
    }
};
</script>

<style>

</style>
