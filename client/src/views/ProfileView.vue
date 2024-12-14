<template>
  <div class="profile-view">
    <header>
      <img class="logo" alt="LibreX logo" :src="icon" @click="this.$router.push('/')">
    </header>
    
    <div class="user-info">
      <div class="image-container">
        <img class="user-image" :src="userImage" alt="User image" />
        <div class="change-image" @click="changeImageModalOpen = true">
          <i class="fa fa-edit"></i>
        </div>
      </div>
      <h1>{{ loggedInUser?.name }}</h1>
    </div>

    <div class="profile-options">
      <div class="options">
        <h1 :class="{ 'is-bold': selectedOption === 'products' }" @click="selectOption('products')">Meus produtos</h1>
        <h1 :class="{ 'is-bold': selectedOption === 'history' }" @click="selectOption('history')">Histórico</h1>
        <h1 :class="{ 'is-bold': selectedOption === 'registration' }" @click="selectOption('registration')">Cadastro</h1>
      </div>
      
      <div class="separator"></div>
    </div>

    <div v-if="selectedOption === 'products'">
      <UserProducts />
    </div>

    <div v-if="selectedOption === 'history'">
      <UserHistory />
    </div>

    <div v-if="selectedOption === 'registration'">
      <UserRegistration />
    </div>

    <ModalComponent :modalOpen="changeImageModalOpen" @closeModal="changeImageModalOpen = false">
        <div class="buy-prod-modal">
          <div class="image-input">
              <label for="inputfile" class="add-image-label" v-if="!imagePreviewUrl">
                  Adicionar imagem
              </label>
              <input type="file" id="inputfile" @change="handleFileUpload" class="file-input" ref="inputfile" >
              <div class="image-preview" v-if="imagePreviewUrl" @click="triggerFileInput">
                  <img :src="imagePreviewUrl" alt="Preview da imagem">
                  <h2>Alterar imagem</h2>
              </div>
          </div>

          <div class="b-button">
            <button class="btn btn-confirm" @click="updateImage">
                Salvar
            </button>
          </div>
        </div>
    </ModalComponent>

  </div>
</template>

<script>
import icon from '@/assets/images/icon.png'
import userDefault from '@/assets/images/user-default-image.png'
import UserProducts from '@/components/user-profile/UserProducts.vue'
import UserHistory from '@/components/user-profile/UserHistory.vue'
import UserRegistration from '@/components/user-profile/UserRegistration.vue'
import { mapGetters, mapActions } from 'vuex'
import ModalComponent from '@/components/modals/ModalComponent.vue'
import { updatePhoto } from '@/controllers/UserController'

export default {
  name: 'ProfileView',
  components: {
    UserProducts,
    UserHistory,
    UserRegistration,
    ModalComponent
  },
  data() {
    return {
      icon,
      userDefault,
      userImage: '',
      userName: 'Usuário',
      selectedOption: 'products',
      changeImageModalOpen: false,
      imagePreviewUrl: null,
      imgFile: null,
      fileChanged: false
    }
  },
  methods: {
    ...mapActions(['setUserPhoto']),
    selectOption(option) {
      this.selectedOption = option
    },
    handleFileUpload(event) {
        const file = event.target.files[0];

        // verificar se imagem é jpg ou png
        if (file?.type !== 'image/jpeg' && file?.type !== 'image/png') {
            this.$toast.open({
                message: 'Formato de imagem inválido. A imagem deve ser JPG ou PNG.',
                type: 'warning',
                position: 'top-right',
                duration: 5000
            })
            return
        }

        if (file) {
            this.fileChanged = true
            const formData = new FormData()
            formData.append('photo', file)
            this.imagePreviewUrl = URL.createObjectURL(file);
            this.imgFile = file
        }
    },
    triggerFileInput() {
        this.$refs.inputfile.click()
    },
    async updateImage() {
        if (!this.fileChanged) {
            this.$toast.open({
                message: 'Nenhuma imagem foi selecionada.',
                type: 'warning',
                position: 'top-right',
                duration: 5000
            })
            return
        }
        
        const userId = this.loggedInUser?.id
        const formData = new FormData()
        formData.append('foto', this.imgFile)

        await updatePhoto(userId, formData).then((res) => {
            console.log(res)
            const userPhoto = res.data?.foto

            if (userPhoto) {
              const photoLink = userPhoto.replace(/\\/g, '/').replace('uploads', 'uploads/')
              this.userImage = `http://localhost:3000/${photoLink}`
              this.setUserPhoto(userPhoto)
              this.$toast.open({
                  message: 'Imagem atualizada com sucesso.',
                  type: 'success',
                  position: 'top-right',
                  duration: 5000
              })
              this.changeImageModalOpen = false
              this.fileChanged = false
            } else {
              this.$toast.open({
                  message: 'Erro ao atualizar imagem.',
                  type: 'error',
                  position: 'top-right',
                  duration: 5000
              })
            }
        }).catch((err) => {
            console.log(err)
            this.$toast.open({
                message: 'Erro ao atualizar imagem.',
                type: 'error',
                position: 'top-right',
                duration: 5000
            })
        })
    }
  },
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  mounted() {
    console.log(this.loggedInUser)

    if (!this.loggedInUser?.photo) {
      this.userImage = this.userDefault
    }
    else {
      const photoLink = this.loggedInUser?.photo?.replace(/\\/g, '/').replace('uploads', 'uploads/')
      this.userImage = `http://localhost:3000/${photoLink}`
    }
    this.userName = this.loggedInUser?.name
  },
  watch: {
    changeImageModalOpen: function (val) {
      if (!val) {
        this.imagePreviewUrl = null
      }
    }
  }
}
</script>

<style lang="less">
.profile-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  
  header {
    display: flex;
    justify-content: flex-start;
    align-items: center;  

    .logo {
      width: 100px;
      height: 50px;
      object-fit: contain;
      margin-top: 20px;
      cursor: pointer;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .image-container {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: 5px;
      
      .user-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
      }

      .change-image {
        position: absolute;
        top: 0;
        right: 0; 
        cursor: pointer; 

        i {
          font-size: 20px;
          color: var(--primaryColor);
        }
      }
    }
    
    h1 {
      font-size: 22px;
      font-weight: 500;
      color: #333;
    }
  }

  .profile-options {
    .options {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      margin: 20px 0 10px 20px;
      gap: 30px;
  
      h1 {
        font-size: 20px;
        font-weight: 300;
        color: #333;
        margin-bottom: 10px;
        cursor: pointer;  
      }
  
      .is-bold {
        font-weight: 600;
      }
    }
  }

  .separator {
    width: --webkit-fill-available;
    height: 1px;
    background-color: #ccc;
    margin-left: 20px;
  }

  .buy-prod-modal {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;

      .image-input {
          .file-input {
              display: none;
          }

          .add-image-label {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 150px;
              height: 150px;
              border: 2px dashed #828282;
              border-radius: 5px;
              cursor: pointer;
              color: #828282;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
          }

          .image-preview {
              width: 180px;
              height: 170px;
              border-radius: 5px;
              padding: 5px;
              font-size: 14px;
              font-weight: 500;
              color: #232323;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              img {
                  width: 100%;
                  height: 100%;
                  max-width: 150px;
                  max-height: 130px;
                  object-fit: contain;
                  cursor: pointer;
              }

              h2 {
                  font-size: 12px;
                  font-weight: 500;
                  cursor: pointer;
              }
          }
      }

      .b-button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        
        .btn-confirm {
            width: 80px;
            height: 30px;
            border-radius: 5px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer; 
            // background-color: var(--primaryColor);
            color: var(--primaryColor);
            border: 1px solid var(--primaryColor);
        }
      }
  }
}
</style>