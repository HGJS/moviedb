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
									{{ episode.name }} - {{ show.name }}
								</h1>
								<div class="page-banner__content-area">
									<template v-if="episode.overview">
										<h2>Overview</h2>
										<p class="page-banner__desc">
											{{ episode.overview }}
										</p>
									</template>
									<p class="page-banner__rating">
										<span class="page-banner__rating-box">{{
											episode.voteAverage
										}}</span>
										based on
										{{ episode.voteCount }}
										reviews
									</p>
									<template v-if="episode.airDate">
										<h2>Air Date</h2>
										<p>{{ episode.airDate }}</p>
									</template>
									<p>
										<nuxt-link
											:to="
												`/tv/${show.id}/${season.seasonNumber}`
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

			<div v-if="episode.images.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">
						Images
					</h2>
					<app-items-slider slideOrientation="landscape">
						<app-images-slider-item
							v-for="(image, index) in episode.images"
							:key="image.imagePath"
							:image="
								`https://image.tmdb.org/t/p/w1280/${image.imagePath}`
							"
							@click="openEpisodeGallery(index)"
							orientation="landscape"
							:name="`${episode.name} still image ${index + 1}`"
						/>
					</app-items-slider>
				</div>
			</div>

			<!--CAST-->
			<div v-if="episode.cast.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Cast</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="person in episode.cast"
							:key="person.id"
							:id="person.id"
							:image="person.imagePath"
							:name="person.name"
							:character="person.character"
							mediaType="person"
							:sliderItem="true"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>

			<!--GUEST STARS-->
			<div
				v-if="episode.guestStars.length"
				class="pt-60 pb-30 info-section"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Guest Stars</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="person in episode.guestStars"
							:key="person.id"
							:id="person.id"
							:image="person.imagePath"
							:name="person.name"
							:character="person.character"
							mediaType="person"
							:sliderItem="true"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>

			<div
				class="pt-60 pb-30  info-section"
				v-if="season.episodes.length > 0"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Other Episodes</h2>
					<app-items-slider slideOrientation="landscape">
						<app-list-item
							v-for="episode in season.episodes"
							:key="episode.id"
							:id="show.id"
							:image="episode.imagePath"
							:name="episode.name"
							mediaType="tv-episode"
							:season="season.seasonNumber"
							:episode="episode.episodeNumber"
							:sliderItem="true"
							orientation="landscape"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					:media="episode.gallery"
					:showThumbs="false"
					:showLightBox="false"
					ref="episodeGallery"
					v-if="episode.gallery.length"
				/>
			</client-only>
		</template>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppItemsSlider from '@/components/AppItemsSlider'
import AppImagesSliderItem from '@/components/AppImagesSliderItem'
import list from '~/assets/js/list'

export default {
	data() {
		return {
			episode: [],
			season: [],
			show: []
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'

		const episodeData = await this.$axios
			.get(
				`/tv/${this.$route.params.id}/season/${this.$route.params.season}/episode/${this.$route.params.episode}?api_key=${apiKey}&language=en&append_to_response=credits,images`
			)
			.catch(err => {
				console.log(err)
			})

		const seasonData = await this.$axios
			.get(
				`/tv/${this.$route.params.id}/season/${this.$route.params.season}?api_key=${apiKey}&language=en`
			)
			.catch(err => {
				console.log(err)
			})

		const showData = await this.$axios
			.get(`/tv/${this.$route.params.id}?api_key=${apiKey}&language=en`)
			.catch(err => {
				console.log(err)
			})

		//EPISODE DATA
		const episode = episodeData.data

		this.episode = {
			id: episode.id,
			name: episode.name,
			overview: episode.overview,
			voteAverage: Number.parseFloat(episode.vote_average).toFixed(1),
			voteCount: episode.vote_count,
			airDate: episode.air_date,
			images: list.images(episode.images.stills),
			cast: list.people(episode.credits.cast.slice(0, 20)),
			guestStars: list.people(episode.credits.guest_stars.slice(0, 20)),
			gallery: list.gallery(episode.images.stills),
			episodeNumber: episode.episode_number,
			backgroundImage: episode.still_path
		}

		//SEASON DATA
		const season = seasonData.data

		this.season = {
			id: season.id,
			name: season.name,
			seasonNumber: season.season_number,
			episodes: list.episodes(season.episodes, this.episode.episodeNumber)
		}

		//SHOW DATA
		const show = showData.data

		this.show = {
			id: show.id,
			name: show.name,
			backgroundImage: show.backdrop_path
		}
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
			return this.episode.backgroundImage || this.show.backgroundImage
		},
		showBackgroundImage() {
			if (this.episode.backgroundImage) {
				return `background-image:url('https://image.tmdb.org/t/p/w1280/${this.episode.backgroundImage}')`
			} else if (this.show.backgroundImage) {
				return `background-image:url('https://image.tmdb.org/t/p/w1280/${this.show.backgroundImage}')`
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
