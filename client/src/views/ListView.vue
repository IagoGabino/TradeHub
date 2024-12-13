<template>
  <div class="list-view">
    <header>
      <MainHeader />
    </header>
           
    <div class="wrapper" v-if="books.length > 0">
      <div class="book-list">
      <div class="list-item" v-for="book in filteredBooks" :key="book.id" @click="goToBook(book.id)">
        <div class="book-container">
          <img :src="book.image" class="book-image" alt="Cover image" />

          <div class="books-info">
            <h2 class="title">{{ book.titulo }}</h2>
            <div class="authors">{{ book.autores }}</div>
            <div class="school-info">
            <div class="major">{{ book.curso }}</div>
            <div class="subject">{{ book.disciplina}}</div>
          
            </div>
              <div v-if="book.preco === 0" class="price">
                <i class="fa-solid fa-hand-holding-heart"></i>
                </div>
                <div v-else class="price">R$ {{ book.preco.toFixed(2) }}</div>

          </div>
        </div>
      </div>
    </div>

    <div class="search" v-if="books.length > 0">
        <input type="text" placeholder="Buscar Livro" v-model="searchText" @input="searchBook()"/>
        <i class="fa fa-search icon" @click="searchBook()"></i>
    </div>
    </div>

    <div class="not-found" v-if="filteredBooks.length === 0">
      <h2>Nenhum produto encontrado :(</h2>
    </div>

    <div class="not-found" v-else-if="books.length === 0">
      <h2>Nenhum produto disponível :(</h2>
    </div>
</div>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainHeader from '@/components/headers/MainHeader.vue';
// import { getAllBooks } from '@/controllers/AllBooksController'


export default {
  name: 'ListView',
  components: {
    MainHeader
  }, 
  data() {
    return {
      books:[],
      filteredBooks: []
    }
  },
  computed: {
      ...mapGetters(['loggedInUser'])
  },
  methods: {
    goToBook(id) {
      this.$router.push(`/book/${id}`)
    },
    normalizeString(string) {
      return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },
    searchBook() {
      if (this.searchText === '') {
        this.filteredBooks = this.books
      } else {
        this.filteredBooks = this.books.filter(book => {
          return this.normalizeString(book.titulo).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) || 
          this.normalizeString(book.autores).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) ||
          this.normalizeString(book.curso).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) ||
          this.normalizeString(book.disciplina).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase())
        })
      }
    }
  },
  
  async mounted() {
    console.log(this.loggedInUser?.id)

    // await getAllBooks().then((response) => {
        
    //     let books = response.data

    //     books.forEach(book => {
    //       const photoLink = book.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
    //       book.image = 'http://localhost:3000/' + photoLink
    //     })

    //     // filtra livros que nao sao do usuario logado
    //     books = books.filter(book => book.idVendedor !== this.loggedInUser.id);

    //     this.books = books
    //     this.filteredBooks = books
    // }).catch((error) => {
    //   console.log(error)
    // })

    console.log(this.books)
  }
}
</script>

<style lang="less">
.list-view {
  header {
    margin-bottom: 120px;
  }
}

.wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;

  .search {
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        border: 1px solid var(--secondaryColor);
        padding: 10px 10px;
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
}


.book-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 50px;
}

.book-image{
    padding: 20px;
    width: 200px;
    height: 270px;
    object-fit: contain;
    // border: 1px solid rgba(0, 0, 0, 0.18);
}
.list-item {
  display: flex;
  align-items: center;
  height: 270px;
  min-width: 900px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.book-container {
  display: flex;
  flex-direction: row;
  grid-template-columns: 200px 1fr;
  height: 270px;
  gap: 20px;
  align-items: center;
//   border: 1px solid rgba(0, 0, 0, 0.18);

}

.books-info {
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
//   border: 1px solid rgba(0, 0, 0, 0.18);
  margin-top:  15px;
  margin-bottom: 15px;
  padding: 10px;
}

.title {
  font-size: 27px;
  font-weight: 600;
  font-family: Gellix;
}

.authors{
    font-size: 22px;
    color: var(--primaryColor);
    margin-bottom: 30px;
}

.school-info {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 37px;
}


.major,.subject{

    border-radius: 15px;
    padding: 3px;
    padding-right: 20px;
    padding-left: 20px;
    font-weight: 200px;
    background-color: #F4F4F4;
    font-size: 19px;
}

.price {
  font-size: 25px;
  color: var(--primaryColor);
  margin-top: 10px;
}

i{
    color: var(--primaryColor);
    font-size: 33px;
}

.not-found {
  margin-top: 120px;
}
</style>