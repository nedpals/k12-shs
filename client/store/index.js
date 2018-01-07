import Vue from 'vue'
import Vuex from 'vuex'
import fetchApi from '../helpers/fetch-api'

Vue.use(Vuex)

const state = {
  search: {
    q: '',
    region: '',
    province: '',
    municipality: '',
    programs: [],
    results: []
  },
  schools: [],
  regions: [],
  municipalities: [],
  provinces: [],
  programs: [
    'ABM',
    'HUMSS',
    'GAS',
    'TVL',
    'Arts and Design',
    'Sports'
  ],
  selected_school: []
}

const mutations = {
  LOAD (state, data) {
    state.schools.push(...data)
  },
  LOAD_SCHOOL (state, data) {
    state.selected_school = data
  },
  LOAD_RESULT (state, data) {
    state.search.results = data
  }
}

const actions = {
  loadData ({ commit }, page) {
    fetchApi().get('/schools', { params: { _sort: 'school_name', _page: page.toString() }})
      .then(response => {
        commit('LOAD', response.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  findSchoolById ({ commit }, schoolId) {
    fetchApi().get('/schools', { params: { school_id: schoolId }})
      .then(response => {
        commit('LOAD_SCHOOL', response.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  searchSchool ({ commit }, searchParams) {
    searchParams = Object.keys(searchParams).forEach(key => (searchParams[key] === null) && delete searchParams[key])
    fetchApi().get('/schools', { params: searchParams })
      .then(response => {
        commit('LOAD_RESULT', response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

const getters = {
  limitData: (state, getters) => num => {
    return state.schools.slice(0, num)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
