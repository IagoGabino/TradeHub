<template>
  <div class="list-view">
    <header>
      <MainHeader />
    </header>
           
  <div class="search" v-if="products.length > 0">
      <input type="text" placeholder="Buscar Produto" v-model="searchText" @input="searchProduct()" id="search" />
      <i class="fa fa-search icon" @click="searchProduct()"></i>
  </div>
    <div class="wrapper" v-if="products.length > 0">
      <div class="product-list">
      <div class="list-item" v-for="product in filteredProducts" :key="product.id" @click="goToProduct(product.id)">
        <div class="product-container">
          <img :src="product.image" class="product-image" alt="Cover image" />

          <div class="products-info">
            <h2 class="title">{{ product.nome }}</h2>
            <div class="description">{{ fixLength(product.descricao) }}</div>
         
                <div v-if="product.preco === 0" class="price">
                  <i class="fa-solid fa-hand-holding-heart"></i>
                </div>
                <div v-else class="price">R$ {{ product.preco.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="not-found" v-if="filteredProducts.length === 0">
      <h2>Nenhum produto encontrado :(</h2>
    </div>

    <div class="not-found" v-else-if="products.length === 0">
      <h2>Nenhum produto disponível :(</h2>
    </div>
</div>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainHeader from '@/components/headers/MainHeader.vue';
import { getAllProducts } from '@/controllers/ProductController'


export default {
  name: 'ListView',
  components: {
    MainHeader
  }, 
  data() {
    return {
      products:[],
      filteredProducts: []   
    }
  },
  computed: {
      ...mapGetters(['loggedInUser'])
  },
  methods: {
    goToProduct(id) {
      this.$router.push(`/product/${id}`)
    },
    normalizeString(string) {
      console.log(string)
      return string
      // return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },
    searchProduct() {
      if (this.searchText === '') {
        this.filteredProducts = this.products
      } else {
        this.filteredProducts = this.products.filter(product => {
          return this.normalizeString(product.nome).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) || 
          this.normalizeString(product.descricao).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) 
        })
      }
    },
    fixLength: function (text) {
        return text.length > 50 ? text.substr(0, 50) + '...' : text
    }
  },
  
  async mounted() {
    console.log(this.loggedInUser?.id)

    await getAllProducts().then((response) => {
        
        let products = response.data

        products.forEach(product => {
          const photoLink = product.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
          product.image = 'http://localhost:3000/' + photoLink
        })

        // filtra produtos que nao sao do usuario logado
        products = products.filter(product => product.idVendedor !== this.loggedInUser.id);

        this.products = products
        this.filteredProducts = products
    }).catch((error) => {
      console.log(error)
    })

    console.log(this.products)
  }
}
</script>

<style lang="less">
.list-view {
  header {
    margin-bottom: 120px;
  }
}

.search {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid var(--secondaryColor);
    padding: 10px 10px;
    margin: 0 0 20px 40px;
    position: relative;

    //sizing
    width: 300px;
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
        font-size: 20px;
        position: absolute;
        right: 10px;
        color: gray;
    }
}   

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin: 0 0 50px 40px;
}


.product-list {
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-image{
    padding: 5px;
    width: 150px;
    height: 100px;
    object-fit: contain;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 270px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.product-container {
  display: flex;
  flex-direction: column;
  height: 90%;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.products-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
  font-family: Gellix;
  margin: 0;
}

.description {
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
  color: #333;
}

.price {
  font-size: 18px;
  color: var(--primaryColor);
  font-weight: 600;
  margin-top: 15px;
}

i{
    color: var(--primaryColor);
    font-size: 33px;
}

.not-found {
  margin-top: 120px;
}
</style>