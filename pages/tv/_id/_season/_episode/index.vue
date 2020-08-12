<template>
	<div>
		<div v-if="$fetchState.pending" class="pt-60 pb-30">
			<div class="container-fluid app-container-fluid">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
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
							<div class="col-12 col-md-8 col-lg-9 mb-30">
								<h1 class="page-banner__title">
									{{ episode.name }}
								</h1>
								<div class="page-banner__content-area">
									<template v-if="episode.overview">
										<h2>Overview</h2>
										<p>{{ episode.overview }}</p>
									</template>
									<p class="page-banner__rating">
										<span class="page-banner__rating-box">{{
											Number.parseFloat(
												episode.vote_average
											).toFixed(1)
										}}</span>
										based on
										{{ episode.vote_count }}
										reviews
									</p>
									<template v-if="episode.air_date">
										<h2>Air Date</h2>
										<p>{{ episode.air_date }}</p>
									</template>
									<p>
										<nuxt-link
											:to="
												`/tv/${show.id}/${season.season_number}`
											"
										>
											Back to {{ show.name }}
											{{ season.name }} home page
										</nuxt-link>
									</p>
									<p>
										<nuxt-link :to="`/tv/${show.id}`">
											Back to {{ show.name }} home page
										</nuxt-link>
									</p>
								</div>

								<div class="d-flex"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="episodeImages.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">
						Images
					</h2>
					<app-items-slider slideOrientation="landscape">
						<app-images-slider-item
							v-for="(image, index) in episodeImages"
							:key="image.file_path"
							:image="
								`https://image.tmdb.org/t/p/w780/${image.file_path}`
							"
							@click="openEpisodeGallery(index)"
							orientation="landscape"
							:name="`${episode.name} still image ${index + 1}`"
						/>
					</app-items-slider>
				</div>
			</div>

			<!--CAST-->
			<div v-if="episodeCast.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Cast</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in episodeCast"
							:key="item.id"
							:id="item.id"
							:image="item.profile_path"
							:name="item.name"
							:character="item.character"
							mediaType="person"
							:sliderItem="true"
						/>
					</app-items-slider>
				</div>
			</div>

			<!--GUEST STARS-->
			<div
				v-if="episodeGuestStars.length"
				class="pt-60 pb-30 info-section"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Guest Stars</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in episodeGuestStars"
							:key="item.id"
							:id="item.id"
							:image="item.profile_path"
							:name="item.name"
							:character="item.character"
							mediaType="person"
							:sliderItem="true"
						/>
					</app-items-slider>
				</div>
			</div>

			<div
				class="pt-60 pb-30  info-section"
				v-if="otherEpisodes.length > 0"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Other Episodes</h2>
					<app-items-slider slideOrientation="landscape">
						<app-list-item
							v-for="item in otherEpisodes"
							:key="item.id"
							:id="show.id"
							:image="
								item.still_path ||
									item.poster_path ||
									item.profile_path
							"
							:name="
								item.original_title ||
									item.original_name ||
									item.name
							"
							mediaType="tv-episode"
							:season="season.season_number"
							:episode="item.episode_number"
							:sliderItem="true"
							orientation="landscape"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					:media="episodeGallery"
					:showThumbs="false"
					:showLightBox="false"
					ref="episodeGallery"
					v-if="episodeGallery.length"
				/>
			</client-only>
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
			season: [],
			episode: [],
			episodeCast: [],
			episodeGuestStars: [],
			episodeImages: [],
			episodeGallery: [],
			otherEpisodes: []
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'

		const show = await this.$axios
			.get(
				`/tv/${this.$route.params.id}?api_key=${apiKey}&language=en-US`
			)
			.catch(err => {
				console.log(err)
			})

		const season = await this.$axios
			.get(
				`/tv/${this.$route.params.id}/season/${this.$route.params.season}?api_key=${apiKey}&language=en-US`
			)
			.catch(err => {
				console.log(err)
			})

		const episode = await this.$axios
			.get(
				`/tv/${this.$route.params.id}/season/${this.$route.params.season}/episode/${this.$route.params.episode}?api_key=${apiKey}&language=en-US&append_to_response=credits,images`
			)
			.catch(err => {
				console.log(err)
			})

		this.season = season.data
		this.show = show.data
		this.episode = episode.data
		this.episodeImages = episode.data.images.stills
		this.episodeCast = episode.data.credits.cast.splice(0, 20)
		this.episodeGuestStars = episode.data.credits.guest_stars.splice(0, 20)

		for (const image of this.episodeImages) {
			this.episodeGallery.push({
				src: `https://image.tmdb.org/t/p/w1280/${image.file_path}`
			})
		}

		const currentEpisodeNumber = this.episode.episode_number
		const seasonEpisodes = season.data.episodes

		this.otherEpisodes = seasonEpisodes.filter(
			item => item.episode_number !== currentEpisodeNumber
		)
	},
	validate({ params }) {
		return /^\d+$/.test(params.id)
	},
	head() {
		return {
			title:
				this.episode.name && this.show.name
					? `${this.episode.name} - ${this.show.name} - MovieDB`
					: 'MovieDB'
		}
	},
	methods: {
		openEpisodeGallery(index) {
			this.$refs.episodeGallery.showImage(index)
		}
	},
	computed: {
		hasBackgroundImage() {
			return this.episode.still_path || this.show.backdrop_path
		},
		showBackgroundImage() {
			if (this.episode.still_path) {
				return `background-image:url('https://image.tmdb.org/t/p/w1280/${this.episode.still_path}')`
			} else if (this.show.backdrop_path) {
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