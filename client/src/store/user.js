export default {
    state: { // data
        user: {
            id: null,
            name: null,
            email: null,
            photo: null,
            cellphone: null,
        }
    },
    mutations: { // methods to change state
        setUser(state, payload) {
            state.user = payload
        },
        setUserPhoto(state, payload) {
            state.user.photo = payload
        },
        doLogout(state) {
            state.user = {
                id: null,
                name: null,
                email: null,
                photo: null,
                cellphone: null,
            }
  
            localStorage.removeItem('user')
        }
    },
    actions: { // methods to call mutations
        setUser({ commit }, payload) {
            commit('setUser', payload)
        },
        setUserPhoto({ commit }, payload) {
            commit('setUserPhoto', payload)
        },
        doLogout({ commit }) {
            commit('doLogout')
        }
    },
    getters: { // return state
        loggedInUser: state => state.user
    }
  }