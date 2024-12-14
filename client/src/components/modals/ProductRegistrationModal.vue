<template>
  <div class="vendor-product-modal">
      <ModalComponent :modalOpen="modalOpen" @closeModal="$emit('closeModal')">
          <h2>Cadastrar Produto</h2>
          
          <div class="top-fields">
              <div class="text-inputs">
                  <h3><span>*</span> Campos obrigatórios</h3>
                  <label for="name">Nome <span>*</span></label>
                  <input type="text" placeholder="Título" required ref="name" >

                  <label for="author">Preço <span>*</span></label>
                  <input type="text" placeholder="Preço" required ref="price"> 
            </div>
          
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
          </div>

        <div class="middle-fields">
              <div>
                  <label for="author">Descricão <span>*</span></label>
                  <textarea type="text"  
                  class="description-area" placeholder="Descrição" required ref="description"></textarea>
              </div>
            </div>

          <div class="buttons">
              <button class="cancel" @click="this.$emit('closeModal')">Cancelar</button>
              <button 
                  class="save" 
                  @click="handleSave" 
                  v-if="!loading" 
                >
                      Salvar
              </button>
              <div class="loading" v-else>
                  <i class="fa fa-spinner fa-spin"></i>
                  <h2>Salvando...</h2>
              </div>
          </div>
      </ModalComponent>
  </div>
</template>

<script>
import ModalComponent from '@/components/modals/ModalComponent.vue'
import { mapGetters } from 'vuex'
import { addUserProduct } from '@/controllers/ProfileController'

export default {
  name: 'VendorProductModal',
  components: {
    ModalComponent
  },
  props: ['modalOpen', 'product'],
  data() {
    return {
      imagePreviewUrl: null,
      imgFile: null,
      fileChanged: false,
      loading: false,
      isDonation: false
    }
  },
  methods: {
    handleFileUpload(event) {
        const file = event.target.files[0];

        // verificar se imagem é jpg ou png, svg ou webp
        if (file?.type !== 'image/jpeg' && file?.type !== 'image/png' && file?.type !== 'image/svg+xml' && file?.type !== 'image/webp') {
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
    async handleSave() {
        this.loading = true
        const name = this.$refs.name.value
        const description = this.$refs.description.value
        const price = this.$refs.price.value
        const idVendedor = this.loggedInUser.id
        console.log('idVendedor', idVendedor)

        if (!name || !price || !description) {
            this.$toast.open({
                message: 'Preencha todos os campos obrigatórios',
                type: 'warning',
                position: 'top-right',
                duration: 5000
            })
            this.loading = false
            return
        }

        const formData = new FormData()
        formData.append('nome', name)
        formData.append('descricao', description)
        formData.append('preco', price)
        formData.append('foto', this.imgFile);
        formData.append('idVendedor', idVendedor)
        await addUserProduct(formData).then((res) => {
          console.log('response', res)
          if (res.status === 200) {
              this.$toast.open({
                  message: 'Produto cadastrado com sucesso',
                  type: 'success',
                  position: 'top-right',
                  duration: 5000
              })
              this.loading = false
              this.$emit('closeModal')
          } else {
              this.$toast.open({
                  message: 'Erro ao cadastrar produto',
                  type: 'error',
                  position: 'top-right',
                  duration: 5000
              })
              this.loading = false
              this.$emit('closeModal')
          }
        }).catch(() => {
            this.$toast.open({
                message: 'Erro ao cadastrar Produto',
                type: 'error',
                position: 'top-right',
                duration: 5000
            })
            this.loading = false
            this.$emit('closeModal')
        })
        
    },
    triggerFileInput() {
        this.$refs.inputfile.click()
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  mounted() {
  },
  watch: {
    // watch isDonation and set price to not editable
    isDonation() {
        if (this.isDonation) {
           this.$refs.price.setAttribute('disabled', true)
           this.$refs.price.value = '0.00' 
           this.$refs.price.style.backgroundColor = '#f2f2f2'
          
        } else {
          this.$refs.price.removeAttribute('disabled')
          this.$refs.price.style.backgroundColor = '#fff'
        }
    },
    modalOpen: {
        handler: function () {
            if (!this.editProduct) {
                this.$nextTick(() => { 
                    this.fileChanged = false
                    this.imagePreviewUrl = null
                    this.isDonation = false
                });
            }
        },
        deep: true
    }
  }
}
</script>

<style lang="less">
.vendor-product-modal {
    * {
        box-sizing: border-box;
    } 

    h2 {
        font-size: 20px;
        font-weight: 500;
    }
    h3 {
        font-size: 12px;
        font-weight: 500;
        text-align: left;
        span {
            color: var(--primaryColor);
        }
    }

    label {
        font-size: 12px;
        font-weight: 500;
        text-align: left;
        margin-bottom: 10px;
        span {
            color: var(--primaryColor);
        }
    }

    input, select {
        width: 180px;
        height: 40px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 0 10px;
        font-size: 14px;
        font-weight: 500;
        color: #232323;
        margin-bottom: 20px;
    }

    .top-fields {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 60px;
        margin-top: 20px;

        .text-inputs {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
        }

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
                margin-top: 30px;
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
                    color: var(--primaryColor);
                    cursor: pointer;
                }
            }
        }
    }

    .middle-fields {
        div {
            display: flex;
            flex-direction: column;
        }

        .description-area {
            width: -webkit-fill-available;
            height: 100px;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 10px;
            font-size: 14px;
            font-weight: 500;
            color: #232323;
            margin-bottom: 20px;
        }

        select {
            width: 180px;
            color: #737373;
        }
    }
    
    .bottom-fields {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        div {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
        }

        & > div:first-child {
            margin-right: 40px;
        }
    } 

    .donation-field {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;

      .donation {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 1px;

          input {
              width: 20px;
              height: 20px;
              margin-right: 10px;
          }

          label {
              font-size: 14px;
              font-weight: 500;
              color: #232323;
          }
      }
    }

    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;

        button {
            width: 100px;
            height: 40px;
            border-radius: 5px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }

        .cancel {
            background-color: #fff;
            border: 1px solid #ccc;
            color: #232323;
        }

        .save {
            background-color: var(--primaryColor);
            color: #fff;
        }

        .loading {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 10px;
            color: var(--primaryColor);

            h2 {
                font-size: 16px;
                font-weight: 500;
            }
        }
    }
}
</style>