export const state = () => ({
	searchTerms: ''
})

export const mutations = {
	SET_SEARCH_TERMS(state, searchTerms) {
		state.searchTerms = searchTerms
	}
}

export const actions = {
	setSearchTerms(context, searchTerms) {
		context.commit('SET_SEARCH_TERMS', searchTerms)
	}
}

export const getters = {
	getSearchTerms(state) {
		return state.searchTerms
	}
}
