<template>
  <div class="user-products">
    <div class="list-header">
        <div class="user-products-options">
            <div class="left">
                  <div class="search">
                      <input type="text" placeholder="Buscar Produto" v-model="searchText" @input="searchProduct()"/>
                      <i class="fa fa-search icon" @click="searchProduct()"></i>
                  </div>
                
            </div>
            <div class="right" @click="prodModalOpen = true">
              <h2> Cadastrar Produto </h2>
            </div>
        </div>
    </div>
    
    <div class="prod-list-profile" v-if="products.length > 0">
        <div class="product" v-for="product in filteredProducts" :key="product.id">
            <img :src="product.image" />
            <div class="name">{{ fixLength(product.nome) }}</div>
           
            <div v-if="product.preco == 0" class="price">
                <i class="fa-solid fa-hand-holding-heart"></i>
                </div>
            <div v-else class="price"> {{ formatValue(product.preco) }}</div>
        </div>
    </div>

    <div v-else class="not-found">
        <h3> Você ainda não cadastrou nenhum produto </h3>
    </div>

    <ProductRegistrationModal :modalOpen="prodModalOpen" @closeModal="closeProdModal()" />
  </div>
</template>

<script>
import ProductRegistrationModal from '@/components/modals/ProductRegistrationModal.vue'
import { getUserProducts } from '@/controllers/ProfileController'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserProducts',
  components: {
    ProductRegistrationModal
  },
  data() {
    return {
      searchText: '',
      prodModalOpen: false,
      products: [],
      filteredProducts: [],
    }
  },
  methods: {
    formatValue(value) {
        if (!value) return 'R$ 0,00'
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    },
    fixLength: function (text) {
        return text.length > 25 ? text.substr(0, 25) + '...' : text
    },
    searchProduct() {
        // verificar logica para nao resetar a lista de produtos em cada busca
        this.products = this.products.filter(prod => prod.title.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    async closeProdModal() {
      this.prodModalOpen = false
      await getUserProducts(this.loggedInUser?.id).then((response) => {
        // filtra para setar imagem corretamente
        const products = response.data

        products.forEach(prod => {
          const photoLink = prod.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
          prod.image = 'http://localhost:3000/' + photoLink
        })

        this.products = products
        this.filteredProducts = products
        console.log(response)
      })
    },
    normalizeString(string) {
      return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },
    searchProduct() {
      if (this.searchText === '') {
        this.filteredProducts = this.products
      } else {
        this.filteredProducts = this.products.filter(prod => {
          return this.normalizeString(prod.nome).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) || 
          this.normalizeString(prod.descricao).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase())
        })
      }
    },
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  async mounted() {
    const id = this.loggedInUser?.id
    if (id) {
      await getUserProducts(id).then((response) => {
        // filtra para setar imagem corretamente
        const products = response.data

        products.forEach(prod => {
          const photoLink = prod.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
          prod.image = 'http://localhost:3000/' + photoLink
        })

        this.products = products
        this.filteredProducts = products
        console.log(response)
      })
    }
  }
}
</script>

<style lang="less">
.user-products {
  margin-top: 20px;

  .user-products-options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        i {
            font-size: 25px;
            color: var(--secondaryColor);
            cursor: pointer;
        }

        .search {
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 5px;
            box-sizing: border-box;
            border: 1px solid var(--secondaryColor);
            padding: 10px 10px;
            position: relative;
            margin: 0 50px 0 20px;

            //sizing
            width: 400px;
            height: 40px;
            
            input {
                border: none;
                outline: none;
                background-color: transparent;
                font-size: 18px;
                font-family: Gellix;
                width: 100%;
                padding-right: 25px;
            }

            i {
                position: absolute;
                right: 10px;
                color: gray;
            }
        }            
    }

    .right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        h2 {
            font-weight: 500;
            font-size: 22px;
            color: var(--primaryColor);
            cursor: pointer;
        }
    }
  }

  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    margin-top: 40px;

    h3 {
        font-weight: 500;
    }
  }

  .prod-list-profile {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin: 20px 0 40px 20px;
    
    .product {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-items: center;
        min-height: 90px;
        text-align: center;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.18);
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        transition: all linear .2s;
        height: min(300px, 100%);
        padding: 10px;
        cursor: pointer;

        img {
            width: 100%;
            height: 150px;
            border-radius: 5px;
            object-fit: contain;
            margin-top: 10px;
        }

        .name {
            font-size: 18px;
            margin: 10px;
        }

        .price {
            color: var(--primaryColor);
            font-size: 22px;
            padding: 10px 0px;
            font-weight: 600;
        }

        &:active{
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.25);
        }
    }
  }
}
</style>