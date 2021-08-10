<template>
	<header class="app-header">
		<div class="app-header__inner">
			<div class="container-fluid app-container-fluid">
				<div class="row app-header__row">
					<div class="app-col app-header__logo-col">
						<nuxt-link
							to="/"
							class="app-header__logo-link"
							@click.native="hideSearch"
						>
							<img
								src="/logo.svg"
								alt="MovieDB"
								width="115"
								height="16"
								class="app-header__logo"
							/>
						</nuxt-link>
					</div>
					<div class="app-col app-header__nav-col">
						<div class="app-header__nav-wrap">
							<ul class="app-header__nav-list">
								<li class="app-header__nav-list-item">
									<nuxt-link
										to="/movies"
										class="app-header__nav-link"
										@click.native="hideSearch"
										>Movies</nuxt-link
									>
								</li>
								<li class="app-header__nav-list-item">
									<nuxt-link
										to="/tv"
										class="app-header__nav-link"
										@click.native="hideSearch"
										>TV Shows</nuxt-link
									>
								</li>
								<li class="app-header__nav-list-item">
									<nuxt-link
										to="/people"
										class="app-header__nav-link"
										@click.native="hideSearch"
										>People</nuxt-link
									>
								</li>
							</ul>
						</div>
					</div>
					<div class="app-col app-header__search-col">
						<button
							class="app-header__search-button"
							title="Search"
							@click="toggleSearch"
						>
							<span
								:class="{
									'fa-times': showSearch,
									'fa-search': !showSearch
								}"
								class="app-header__search-button-icon fa"
							></span>
						</button>
					</div>
				</div>
			</div>
		</div>
		<transition>
			<div v-if="showSearch" class="app-header__search-form-wrap">
				<div class="app-header__search-form-wrap-inner">
					<div class="container-fluid  app-container-fluid">
						<app-header-search-form />
					</div>
				</div>
			</div>
		</transition>
	</header>
</template>

<script>
import AppHeaderSearchForm from '@/components/AppHeaderSearchForm'

export default {
	data() {
		return {
			showSearch: false,
			showDropdown: true
		}
	},
	methods: {
		toggleSearch() {
			this.showSearch = !this.showSearch
			if (!this.showSearch) {
				this.hideSearch()
			} else {
				this.$nuxt.$emit('showSearch')
			}
		},
		hideSearch() {
			if (this.showSearch) {
				this.showSearch = false
				this.searchTerms = ''
			}
		}
	},
	created() {
		this.$nuxt.$on('showFilters', () => {
			this.hideSearch()
		})
		this.$nuxt.$on('processSearch', () => {
			this.hideSearch()
		})
		this.$nuxt.$on('autoCompleteItemClick', () => {
			this.hideSearch()
		})
	},
	components: {
		'app-header-search-form': AppHeaderSearchForm
	}
}
</script>
