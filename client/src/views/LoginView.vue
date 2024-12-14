<template>
  <div class="login-view">
      <img class="logo" alt="LibreX logo" :src="logo" @click="this.$router.push('/')">

      <div class="login">
          <div class="form" @keyup.enter="login()">
              <h3>Login</h3>
              <div class="input">
                  <i class="fa-regular fa-user icon"></i>
                  <input type="text" id="email" placeholder="Digite seu login" ref="email">
              </div>

              <div class="input">
                  <i class="fa fa-key icon"></i>
                  <input :type="showPassword ? 'text' : 'password'" id="password" placeholder="Digite sua senha" ref="password">

                  <div>
                      <i class="fa-regular fa-eye icon" @click="showPassword = !showPassword"></i>
                  </div>
              </div>


              <div class="button" @click="login()" id="login">
                  <button>Entrar</button>
              </div>

              <p>Novo usuário? <span @click="registerModalOpen = true">Faça seu cadastro</span></p>
          </div>

          <img :src="imgLogin">
      </div>

      <ModalComponent :modalOpen="registerModalOpen" @closeModal="registerModalOpen = false">
          <div class="register">
              <img class="logo" alt="LibreX icon" :src="icon">
              <h3> Faça seu cadastro </h3>

              <div class="register-content">
                <div class="change-password-container">
                    <div class="register-fields">
                        <label for="nameReg">Nome Completo</label>
                        <input id="nameReg" type="text" placeholder="Nome" ref="nameReg">
                      
                        <label for="emailReg">E-mail</label>
                        <input id="emailReg" type="email" placeholder="E-mail" ref="emailReg">

                        <label for="cellphoneReg">Celular</label>
                        <input id="cellphoneReg" type="text" placeholder="Celular" ref="cellphoneReg" v-maska data-maska="(##) #####-####">

                        <label for="passwordReg">Senha </label>
                        <input id="passwordReg" type="password" placeholder="Senha" ref="passwordReg">
                    </div>
                </div>
                <div class="submit-register-btn">
                    <button @click="registerUser()">Cadastrar</button>
                </div>
            </div>
            
          </div>
      </ModalComponent>
  </div>
</template>

<script>
import ModalComponent from '@/components/modals/ModalComponent.vue'
import { mapActions, mapGetters } from 'vuex'
import logo from '@/assets/images/logo.png'
import imgLogin from '@/assets/images/login-business.png'
import icon from '@/assets/images/icon.png'
import { login, logout, register } from '@/controllers/UserController'
import { vMaska } from 'maska/vue'

export default {
  name: 'LoginView',
  components: {
      ModalComponent
  },
  directives: {
      maska: vMaska 
  },
  data() {
      return {
          logo,
          imgLogin,
          icon,
          registerModalOpen: false,
          showPassword: false,
          registerData: {
              name: '',
              email: '',
              cellphone: '',
              password: ''
          }
      }
  },
  methods: {
      ...mapActions(['setUser']),
      async login (emailParam = null, passwordParam = null) {
        // log inputs
        const email = emailParam || this.$refs.email.value 
        const password = passwordParam || this.$refs.password.value 

        if (email === '' || password === '') {
            this.$toast.open({
                message: 'Preencha todos os campos obrigatórios',
                type: 'error',
                duration: 5000,
                position: 'top-right'
            });
            return
        }

        // logout before login to avoid "already logged in" error
        await logout().catch(() => {
            console.log('Erro ao deslogar usuário.')
        })

        await login(email, password).then(async (res) => {
            if (res.status === 200) {
                  const userData = res.data
                  const user = {
                      id: userData.id,
                      email: userData.email,
                      name: userData.nome,
                      photo: userData.foto,
                      cellphone: userData.celular,
                  }
                  console.log(user)
                  this.setUser(user)
                  localStorage.setItem('user', JSON.stringify(user))
                  this.$toast.open({
                      message: 'Bem vindo(a)!',
                      type: 'success',
                      duration: 4000,
                      position: 'top-right'
                  });
                  this.$router.push('/')
            }
        }).catch(async (err) => {
            console.log(err)
            this.$toast.open({
                message: 'Usuário ou senha incorretos.',
                type: 'error',
                duration: 5000,
                position: 'top-right'
            });
        })
      },
      async registerUser () {
        console.log('registering user') 
        const name = this.$refs.nameReg.value
        const email = this.$refs.emailReg.value
        const cellphone = this.$refs.cellphoneReg.value
        const password = this.$refs.passwordReg.value

        if (name === '' || email === '' || cellphone === '' || password === '') {
            this.$toast.open({
                message: 'Preencha todos os campos obrigatórios',
                type: 'error',
                duration: 5000,
                position: 'top-right'
            });
            return
        }

        await register(name, email, cellphone, password).then(async (res) => {
            if (res.status === 200) {
                this.$toast.open({
                    message: 'Usuário cadastrado com sucesso!',
                    type: 'success',
                    duration: 3000,
                    position: 'top-right'
                });
                this.registerModalOpen = false

                this.login(email, password)
            }
        }).catch(async (err) => {
            console.log(err)
            this.$toast.open({
                message: 'Erro ao cadastrar usuário. Verifique os campos e tente novamente.',
                type: 'error',
                duration: 5000,
                position: 'top-right'
            });
        })
      }
  },
  computed: {
      // ...mapGetters(['loggedInUser'])
  },
  mounted() {
  }
}
</script>

<style lang="less">
.login-view {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .logo {
      width: 250px;
      height: 150px;
      object-fit: contain;
      margin-right: 60px;
      cursor: pointer;
  }

  .login {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      justify-content: center;
      gap: 80px;

      img {
          width: 700px;
          height: 500px;
      }

      .form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          height: 500px;
          width: 90%;
          margin-left: 5%;
          max-width: 400px;

          h3 {
              font-size: 35px;
              font-weight: 400;
              margin-bottom: 20px;
              color: #4B4B4B;
          }

          .button {
              button {
                  width: 425px;
                  height: 50px;
                  border-radius: 5px;
                  border: none;
                  background-color: var(--primaryColor);
                  color: #FFFFFF;
                  font-size: 20px;
                  font-weight: bold;
                  cursor: pointer;
              }
          }

          .input {
              display: flex;
              flex-direction: row;
              align-items: center;
              border-radius: 5px;
              border: 1px solid var(--secondaryColor);
              padding: 10px 10px;
              position: relative;
              margin: 5px 20px;

              //sizing
              height: 50px;
              width: 400px;
              
              input {
                  border: none;
                  outline: none;
                  background-color: transparent;
                  font-size: 25px;
                  font-family: Gellix;
                  width: 100%;
              }

              i {
                  color: gray;
                  font-size: 22px;
                  margin: 0px 10px;
              }
          }

          p {
              align-self: flex-end;
              font-size: 20px;
              margin-top: 3px;

              span {
                  color: var(--primaryColor);
                  cursor: pointer;
              }
          }
      }
  }

  // card options
  .register {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;

      .logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
          margin: 0px 0px 20px 0px;
      }
      
      h3 {
          font-size: 25px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #4B4B4B;
      }

      .register-content {
        .register-fields {
            display: flex;
            flex-direction: column;
            justify-content: center;

            label {
                font-weight: 500;
                text-align: left;
                &:after {
                    content: '*';
                    color: var(--primaryColor);
                    margin-left: 5px;
                }
            }
    
            input {
                padding: 10px 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px;
                margin: 10px 0px 10px 0px;
                width: 400px;
    
                &:focus {
                    outline: none;
                    border-color: var(--primaryColor);
                }
            }
        }

        .submit-register-btn {
            button {
                width: 200px;
                height: 50px;
                border-radius: 5px;
                border: none;
                background-color: var(--primaryColor);
                color: #FFFFFF;
                font-size: 20px;
                font-weight: 600;
                cursor: pointer;
                margin: 20px 0px;
            }
        }
    }
  }
}    

</style>