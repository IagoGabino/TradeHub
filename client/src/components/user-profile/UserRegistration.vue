<template>
  <div class="user-reg">
    <div class="section">
          <h2>Dados Pessoais</h2>
          <div class="section-container">
              <div class="section-field">
                <div class="field-label">
                    <label for="name" class="required">Nome Completo</label>
                </div>
                <input id="name" type="text" :placeholder="loggedInUser.name" ref="name"  />
              </div>

              <div class="section-field">
                <div class="field-label">
                    <label for="cellphone" class="required">Celular</label>
                </div>

                <input id="cellphone" type="tel" :placeholder="loggedInUser.cellphone" ref="cellphone" v-maska data-maska="(##) #####-####" />
              </div>
          </div>
      </div>

      <div class="section">
          <h2>Dados de Acesso</h2>
          <div class="section-container">
              
              <div class="section-field">
                <div class="field-label">
                    <label for="email" class="required">E-mail</label>
                </div>
                <input id="email" type="email" :placeholder="loggedInUser.email" ref="email" />
              </div>

              <div class="section-field">
                <div class="field-label">
                    <label for="password" class="required">Senha</label>
                    <p class="change-password" @click="passwordModalOpen = true">Alterar</p>
                </div>  
                <input id="password" type="password" placeholder="Para alterar a senha, clique em Alterar" ref="password" disabled />
              </div>

          </div>
      </div>

      <div class="submit-button">
            <button @click="submitForm">Salvar</button>
        </div>

        <ModalComponent :modalOpen="passwordModalOpen" @closeModal="passwordModalOpen = false">
            <div class="update-password-modal">
                <h2>Alterar senha</h2>
                <div class="change-password-container">
                    <div class="password-fields">
                        <label for="password">Senha Atual</label>
                        <input  id="password" type="password" placeholder="Nova senha" v-model="passwordData.password">
                        
                        <label for="newPassword">Nova Senha</label>
                        <input  id="newPassword" type="password" placeholder="Nova senha" v-model="passwordData.newPassword">

                        <label for="confirmPassword">Confirmar Senha</label>
                        <input  id="confirmPassword" type="password" placeholder="Confirmar senha" v-model="passwordData.confirmPassword">
                    </div>
                </div>
                <div class="submit-button-pss">
                    <button @click="updatePassword()">Alterar</button>
                </div>
            </div>
        </ModalComponent>
  </div>
</template>

<script>
import ModalComponent from '@/components/modals/ModalComponent.vue';
import { mapActions, mapGetters } from 'vuex'
import { updateUser, updatePassword } from '@/controllers/UserController';
import { vMaska } from 'maska/vue';

export default {
  name: 'UserRegistration',
  components: {
    ModalComponent
  },
  directives: {
    maska: vMaska
  },
  data() {
    return {
      sections: {
        'Dados Pessoais': [
            {
                ref: 'name',
                label: 'Nome Completo',
                type: 'text',
                placeholder: 'Nome Completo',
                required: true,
                minSize: 3
            },
            {
                ref: 'cellphone',
                label: 'Celular', 
                type: 'tel',
                placeholder: 'Celular',
                required: true,
                format: 'cellphone',
                minSize: 8
            }
        ],
        'Dados de Acesso': [
            {
                ref: 'email',
                label: 'E-mail', 
                type: 'email',
                placeholder: 'E-mail',
                required: true
            },
            {
                ref: 'password',
                label: 'Senha', 
                type: 'password',
                placeholder: 'Para alterar a senha, clique em Alterar',
                required: true,
                changeButton: true,
                disable: true
            }
          ]
        },
        formData: {
        name: '',
        cellphone: '',
        email: '',
       },
       originalData: {},
        passwordData: {
            password: '',
            newPassword: '',
            confirmPassword: ''
        },
        passwordModalOpen: false
    }
  },
  methods: {
    ...mapActions(['setUser']),
    async updatePassword() {
        if (!this.passwordData.password || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
            this.$toast.open({
                message: 'Preencha todos os campos obrigatórios',
                type: 'warning',
                duration: 5000,
                position: 'top-right'
            });
            return;
        }

        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
            this.$toast.open({
                message: 'As senhas não coincidem',
                type: 'warning',
                duration: 5000,
                position: 'top-right'
            });
            return;
        }

        const userId = this.loggedInUser.id;

        await updatePassword(userId, this.passwordData.password, this.passwordData.newPassword).then(() => {
            this.$toast.open({
                message: 'Senha alterada com sucesso',
                type: 'success',
                duration: 5000,
                position: 'top-right'
            });
            this.passwordModalOpen = false;
        }).catch(err => {
            console.log(err);
            this.$toast.open({
                message: 'Senha incorreta.',
                type: 'error',
                duration: 5000,
                position: 'top-right'
            });
        });
    },
    submitForm() {
      const name = this.$refs.name.value;
      const cellphone = this.$refs.cellphone.value;
      const email = this.$refs.email.value;

      // monta payload com os campos que foram alterados
      const payload = {
        nome: name,
        celular: cellphone,
        email: email
      }

      // tira os vazios para nao enviar dados desnecessários
      for (const key in payload) {
        if (!payload[key]) {
          delete payload[key];
        }
      }

      console.log('Payload:', payload);


    updateUser(this.loggedInUser.id, payload)
        .then(response => {
          console.log('Resposta:', response);
        if (response.data && response.status === 200) {
            this.$toast.open({
            message: 'Dados atualizados com sucesso!',
            type: 'success',
            duration: 5000,
            position: 'top-right'
            });
            
            const user = {
                id: response.data.id,
                email: response.data.email,
                name: response.data.nome,
                photo: response.data.foto,
                cellphone: response.data.celular,
            }

            this.setUser(user);
            localStorage.setItem('user', JSON.stringify(user))

            //clear fields
            this.$refs.name.value = '';
            this.$refs.cellphone.value = '';
            this.$refs.email.value = '';
      } else {
        // Se a resposta do servidor não for a esperada
        this.$toast.open({
          message: 'Atualização falhou. Tente novamente.',
          type: 'error',
          duration: 5000,
          position: 'top-right'
        });
      }
    })
    .catch(error => {
      console.error('Erro na atualização:', error);
      this.$toast.open({
        message: 'Erro ao atualizar os dados.',
        type: 'error',
        duration: 5000,
        position: 'top-right'
      });
    });
}


  },
  computed: {
      ...mapGetters(['loggedInUser']),
  },
  async mounted() {
     console.log(this.loggedInUser)
     
     this.formData = {
        name: this.loggedInUser.name,
        cellphone: this.loggedInUser.cellphone,
        email: this.loggedInUser.email
    };
    this.originalData = { ...this.formData };
  },
  watch: {
    passwordModalOpen(val) {
        if (!val) {
            this.passwordData = {
                password: '',
                newPassword: '',
                confirmPassword: ''
            }
        }
    }
  }
  
}

</script>
<style lang="less">
.user-reg {
  margin: 40px 0 0 40px;
  width: 96%;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .section {
        width: 98%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        h2 {
            align-self: flex-start;
        }
    }

    .section-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 50px;
        margin-bottom: 20px;
        align-items: center;

        .section-field {
            padding-bottom: 20px;

            .field-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                p {
                    color: var(--primaryColor);
                    font-size: 16px;
                    cursor: pointer;
                }
            }

            label {
                margin-bottom: 5px;
                font-weight: 500;
                text-align: left;
                &.required:after {
                    content: '*';
                    color: var(--primaryColor);
                    margin-left: 5px;
                }
            }

           

            .change-password {
                color: var(--primaryColor);
                font-size: 16px;
                cursor: pointer;
                margin: 0px;
            }
    
            input {
                padding: 10px 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px;
                margin: 10px 20px 10px 0px;
                width: 100%;
    
                &:focus {
                    outline: none;
                    border-color: var(--primaryColor);
                }
            }
        }
    }

    .submit-button {
        margin-bottom: 50px;

        button {
            width: 250px;
            height: 50px;
            border-radius: 5px;
            border: none;
            background-color: var(--primaryColor);
            color: #FFFFFF;
            font-size: 20px;
            font-weight: 500;
            cursor: pointer;
            margin: 20px 0px;
        }
    }

    .update-password-modal {
        .password-fields {
            display: flex;
            flex-direction: column;
            justify-content: center;

            label {
                margin-bottom: 5px;
                font-weight: 500;
                text-align: left;
                &:after {
                    content: '*';
                    color: var(--primaryColor);
                    margin-left: 5px;
                }
            }
    
            input {
                padding: 10px 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px;
                margin: 10px 0px 10px 0px;
                width: 300px;
    
                &:focus {
                    outline: none;
                    border-color: var(--primaryColor);
                }
            }
        }

        .submit-button-pss {
            button {
                width: 200px;
                height: 50px;
                border-radius: 5px;
                border: none;
                background-color: var(--primaryColor);
                color: #FFFFFF;
                font-size: 20px;
                font-weight: 500;
                cursor: pointer;
                margin: 20px 0px;
            }
        }
    }
}
</style>