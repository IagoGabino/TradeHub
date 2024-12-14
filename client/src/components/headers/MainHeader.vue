<template>
  <div class="customer-header">
      <img @click="this.$router.push('/')" alt="Vue logo" :src="logo">


      <div class="login-container" @mouseover="showDropdown" @mouseleave="hideDropdown">
          <div class="name-photo">
            <div v-if="loggedInUser">
                Olá, {{ getFirstName(loggedInUser.name) }}
            </div>
              <div class="user-icon">
                  <img :src="userPhoto" alt="User icon" />
              </div>
          </div>

          <div class="options-header" v-if="isDropDownVisible">
              <div class="option" @click="navigateToProfile()">
                  <i class="fa fa-user-circle"></i>
                  Minha conta
              </div>
              <div class="option" @click="logout()">
                  <i class="fa fa-sign-out-alt"></i>
                  Sair
              </div>
          </div>
      </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { logout } from '@/controllers/UserController'
import logo from '@/assets/images/logo.png'
import userDefault from '@/assets/images/user-default-image.png'

export default {
  name: 'CustomerHeader',
  emits: ['input'],
  components: {
  },
  data() {
      return {
          logo,
          userDefault,
          isDropDownVisible: false,
          userPhoto: ''
      }
  },
  methods: {
      showDropdown() {
        this.isDropDownVisible = true
      },
      hideDropdown() {
          this.isDropDownVisible = false
      },
      async logout() {
          this.$router.push('/')
      },
      getFirstName(name) {
          if (!name) return ''
          return name.split(' ')[0]
      },
      navigateToProfile() {
        this.$router.push('/profile')
      },
      async logout () {
        await logout().catch(() => {
          console.log('Erro ao deslogar usuário.')
        })
        this.$router.push('/login')
      }
  },
  computed: {
      ...mapGetters(['loggedInUser'])
  },
  mounted() {
    // user photo is smth like uploads\\1713725475470.webp in api folder
    // need only //1713725475470.webp
    console.log(this.loggedInUser)
    if (!this.loggedInUser?.photo) {
      this.userPhoto = userDefault
      return
    }
    else {
      const photoLink = this.loggedInUser?.photo?.replace(/\\/g, '/').replace('uploads', 'uploads/')
      this.userPhoto = `http://localhost:3000/${photoLink}`
    }
  }
}
</script>
<style lang="less">
.customer-header {
  background: #F4F4F4;
  height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 40px;
  position: fixed;
  z-index: 8;
  top: 0;
  left: 0;
  right: 0;

  img {
      margin-right: 20px;
      cursor: pointer;
  }

  .login-container {
      align-self: center;
     
      .name-photo {
          display: flex;
          align-items: center;
          position: relative;

          div {
              font-size: 16px;
              margin-right: 10px;
          }
      }

      .user-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;

          img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
      }

      .options-header {
          position: absolute;
          background: #FFF;
          border-radius: 5px;
          box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
          z-index: 9;
          right: 0;
          margin-right: 20px;
          cursor: pointer;

          .option {
              padding: 10px 15px;
              display: flex;
              align-items: center;
              font-size: 16px;

              &:hover {
                  background: #F4F4F4;
              }

              i {
                  font-size: 20px;
                  margin-right: 10px;
                  color: var(--secondaryColor);
              }
          }
      }
  }
}
</style>