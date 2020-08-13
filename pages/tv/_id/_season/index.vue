<template>
	<div>
		<div v-if="$fetchState.pending" class="pt-60 pb-30">
			<div class="container-fluid app-container-fluid">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
		</div>
		<div v-else-if="$fetchState.error">
			<div class="pt-60 pb-60">
				<div class="container-fluid app-container-fluid">
					<h1 class="page-title">Error</h1>
					<div class="content-area">
						<p class="mb-30">
							There was an error fetching content.
						</p>
						<nuxt-link class="button" to="/">Home</nuxt-link>
					</div>
				</div>
			</div>
		</div>
		<template v-else>
			<div class="page-banner">
				<div
					:class="{
						'page-banner__background--blur': hasBackgroundImage
					}"
					class="page-banner__background"
					:style="showBackgroundImage"
				></div>
				<div class="page-banner__inner">
					<div class="container-fluid app-container-fluid">
						<div class="row">
							<div class="col-12 mb-30">
								<h1 class="page-banner__title">
									{{ show.name }} {{ season.name }}
								</h1>
								<div class="page-banner__content-area">
									<template v-if="season.overview">
										<h2>Overview</h2>
										<p>{{ season.overview }}</p>
									</template>
									<p>
										<nuxt-link :to="`/tv/${show.id}`">
											Back to {{ show.name }} home page
										</nuxt-link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="pt-60 pb-30  info-section"
				v-if="season.episodes.length > 0"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Episodes</h2>
					<app-items-slider slideOrientation="landscape">
						<app-list-item
							v-for="item in season.episodes"
							:key="item.id"
							:id="show.id"
							:image="
								item.still_path ||
									item.poster_path ||
									item.profile_path
							"
							:name="item.title || item.name"
							mediaType="tv-episode"
							:season="season.season_number"
							:episode="item.episode_number"
							:sliderItem="true"
							orientation="landscape"
						/>
					</app-items-slider>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppItemsSlider from '@/components/AppItemsSlider'
import AppImagesSliderItem from '@/components/AppImagesSliderItem'

export default {
	data() {
		return {
			show: [],
			season: []
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'

		const show = await this.$axios
			.get(`/tv/${this.$route.params.id}?api_key=${apiKey}&language=en`)
			.catch(err => {
				console.log(err)
			})

		const season = await this.$axios
			.get(
				`/tv/${this.$route.params.id}/season/${this.$route.params.season}?api_key=${apiKey}&language=en`
			)
			.catch(err => {
				console.log(err)
			})

		this.season = season.data
		this.season.episodes = season.data.episodes
		this.show = show.data
	},
	validate({ params }) {
		return /^\d+$/.test(params.id)
	},
	head() {
		return {
			title:
				this.season.name && this.show.name
					? `${this.season.name} - ${this.show.name} - MovieDB`
					: 'MovieDB'
		}
	},
	computed: {
		hasBackgroundImage() {
			return this.show.backdrop_path
		},
		showBackgroundImage() {
			if (this.show.backdrop_path) {
				return `background-image:url('https://image.tmdb.org/t/p/w1280/${this.show.backdrop_path}')`
			}
			return ''
		}
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider,
		'app-images-slider-item': AppImagesSliderItem
	}
}
</script>
