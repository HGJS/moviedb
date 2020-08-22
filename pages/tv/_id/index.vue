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
							<div
								v-if="show.poster_path"
								class="col-12 col-md-4 mb-30"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${show.poster_path}`
									"
									:alt="show.name"
									class="img-fluid md-max-400"
								/>
							</div>
							<div
								class="col-12 mb-30"
								:class="{ 'col-md-8': show.poster_path }"
							>
								<h1 class="page-banner__title">
									{{ show.name }}
								</h1>
								<div class="page-banner__content-area mb-20">
									<h2>Overview</h2>
									<p
										class="page-banner__desc"
										v-html="show.overview"
									></p>
									<h2>Rating</h2>

									<p class="page-banner__rating">
										<span class="page-banner__rating-box">{{
											Number.parseFloat(
												show.vote_average
											).toFixed(1)
										}}</span>
										based on {{ show.vote_count }} reviews
									</p>
								</div>
								<div class="row">
									<div class="col-6">
										<div class="page-banner__content-area">
											<h2>First aired</h2>
											<p>{{ show.first_air_date }}</p>
											<h2>Number of Seasons</h2>
											<p>{{ show.number_of_seasons }}</p>
											<h2>Number of Episodes</h2>
											<p>{{ show.number_of_episodes }}</p>
										</div>
									</div>
									<div class="col-6">
										<div class="page-banner__content-area">
											<h2>Genres</h2>
											<ul>
												<li
													v-for="genre in show.genres"
													:key="genre.id"
												>
													{{ genre.name }}
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="show.seasons.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Seasons</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in show.seasons"
							:key="item.id"
							:id="show.id"
							:image="item.poster_path || item.profile_path"
							:name="item.title || item.name"
							:season="item.season_number"
							mediaType="tv-season"
							:sliderItem="true"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>

			<div
				v-if="show.posters.length || show.backdrops.length"
				class="pt-60 pb-30 info-section"
			>
				<div class="container-fluid app-container-fluid">
					<div class="row items__row">
						<div class="app-col items__title-col mb-30">
							<h2 class="items__title">
								Images
							</h2>
						</div>
						<div class="app-col items__controls-col mb-30">
							<div class="d-flex">
								<button
									v-if="show.posters.length"
									:class="{ active: imageTypes == 'posters' }"
									@click="imageTypes = 'posters'"
									class="button"
								>
									Posters
								</button>
								<button
									v-if="show.backdrops.length"
									:class="{
										active: imageTypes == 'backdrops'
									}"
									@click="imageTypes = 'backdrops'"
									class="button"
								>
									Backdrops
								</button>
							</div>
						</div>
					</div>

					<transition name="fade" mode="out-in">
						<div
							v-if="
								imageTypes == 'posters' &&
									show.images.posters.length
							"
							key="posters"
						>
							<app-items-slider slideOrientation="portrait">
								<app-images-slider-item
									v-for="(image, index) in show.images
										.posters"
									:key="image.file_path"
									:image="
										`https://image.tmdb.org/t/p/w780/${image.file_path}`
									"
									@click="openPosterGallery(index)"
									orientation="portrait"
									:name="
										`${show.name} poster image ${index + 1}`
									"
								/>
							</app-items-slider>
						</div>
						<div
							v-if="
								imageTypes == 'backdrops' &&
									show.images.backdrops.length
							"
							key="backdrops"
						>
							<app-items-slider slideOrientation="landscape">
								<app-images-slider-item
									v-for="(image, index) in show.images
										.backdrops"
									:key="image.file_path"
									:image="
										`https://image.tmdb.org/t/p/w1280/${image.file_path}`
									"
									@click="openBackdropGallery(index)"
									orientation="landscape"
									:name="
										`${show.name} backdrop image ${index +
											1}`
									"
								/>
							</app-items-slider>
						</div>
					</transition>
				</div>
			</div>
			<div v-if="show.videosList.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Videos</h2>
					<app-items-slider slideOrientation="landscape">
						<app-list-item
							v-for="item in show.videosList"
							:key="item.id"
							:id="item.id"
							:videoKey="item.videoKey"
							:image="item.image"
							:name="item.name"
							mediaType="youTube"
							:sliderItem="true"
							orientation="landscape"
							:showVideoFallback="showVideoFallback"
						/>
					</app-items-slider>
				</div>
			</div>
			<div v-if="show.cast.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Cast</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in show.cast"
							:key="item.id"
							:id="item.id"
							:image="item.profile_path"
							:name="item.name"
							:character="item.character"
							mediaType="person"
							:sliderItem="true"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>

			<!--SIMILAR-->
			<div class="pt-60 pb-30  info-section" v-if="show.similar.length">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Similar</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in show.similar"
							:key="item.id"
							:id="item.id"
							:image="item.poster_path || item.profile_path"
							:name="item.title || item.name"
							mediaType="tv"
							:sliderItem="true"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					:media="show.posters"
					:showThumbs="false"
					:showLightBox="false"
					ref="posterGallery"
					v-if="show.posters"
				/>
				<app-light-box
					:media="show.backdrops"
					:showThumbs="false"
					:showLightBox="false"
					ref="backdropGallery"
					v-if="show.backdrops"
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
			show: {},
			showVideoFallback: false,
			imageTypes: 'posters'
		}
	},
	async fetch() {
		const youTubeApiKey = 'AIzaSyCQILg2l5LOJYF7A7X67R9Ety8kPpuv-qA'
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const show = await this.$axios
			.get(
				`/tv/${this.$route.params.id}?api_key=${apiKey}&language=en&include_image_language=en&append_to_response=images,videos,credits,similar`
			)
			.catch(err => {
				console.log(err)
			})

		this.show = show.data
		this.show.seasons = show.data.seasons
		this.show.images = show.data.images
		this.show.cast = show.data.credits.cast.splice(0, 20)
		this.show.similar = show.data.similar.results
		this.show.backdrops = []
		this.show.posters = []
		this.show.videosList = []

		for (const image of this.show.images.backdrops) {
			this.show.backdrops.push({
				src: `https://image.tmdb.org/t/p/w1280/${image.file_path}`
			})
		}

		for (const image of this.show.images.posters) {
			this.show.posters.push({
				src: `https://image.tmdb.org/t/p/w780/${image.file_path}`
			})
		}

		if (show.data.videos.results.length) {
			const videoKeys = []
			for (const video of show.data.videos.results) {
				if (video.site == 'YouTube' && video.type != 'Bloopers') {
					videoKeys.push(video.key)
				}
			}

			const youTubeVideos = await this.$axios
				.get(
					`https://www.googleapis.com/youtube/v3/videos?key=${youTubeApiKey}&part=snippet&id=${videoKeys.join()}`
				)
				.catch(err => {
					console.log(err)
					this.showVideoFallback = true
				})
			if (!this.showVideoFallback) {
				for (const video of youTubeVideos.data.items) {
					function getThumbnail() {
						const thumbnailsObject = video.snippet.thumbnails
						const sortedThumbnails = Object.keys(
							thumbnailsObject
						).sort(function(a, b) {
							return (
								thumbnailsObject[b].width -
								thumbnailsObject[a].width
							)
						})

						const thumbnailSize = sortedThumbnails[0]

						return thumbnailsObject[thumbnailSize].url
					}
					this.show.videosList.push({
						id: video.id,
						videoKey: video.id,
						name: video.snippet.title,
						image: getThumbnail()
					})
				}
			} else {
				for (const video of this.show.videos.results) {
					this.show.videosList.push({
						id: video.id,
						videoKey: video.key,
						name: video.name,
						image: ''
					})
				}
			}
		}
	},
	methods: {
		openPosterGallery(index) {
			this.$refs.posterGallery.showImage(index)
		},
		openBackdropGallery(index) {
			this.$refs.backdropGallery.showImage(index)
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
	validate({ params }) {
		return /^\d+$/.test(params.id)
	},
	head() {
		return {
			title: this.show.name ? `${this.show.name} - MovieDB` : 'MovieDB'
		}
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider,
		'app-images-slider-item': AppImagesSliderItem
	}
}
</script>
