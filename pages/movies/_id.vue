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
					:style="movieBackgroundImage"
				></div>
				<div class="page-banner__inner">
					<div class="container-fluid app-container-fluid">
						<div class="row">
							<div
								v-if="movie.poster_path"
								class="col-12 col-md-6 col-lg-4 mb-30"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${movie.poster_path}`
									"
									:alt="movie.original_title"
									class="img-fluid md-max-400"
								/>
							</div>
							<div class="col-12 col-md-6 col-lg-8 mb-30">
								<h1 class="page-banner__title">
									{{ movie.original_title }}
								</h1>
								<div class="page-banner__content-area mb-20">
									<h2>Overview</h2>
									<p v-html="movie.overview"></p>
									<h2>Rating</h2>

									<p class="page-banner__rating">
										<span class="page-banner__rating-box">{{
											movie.vote_average
										}}</span>
										based on
										{{ movie.vote_count }} reviews
									</p>
								</div>
								<div class="row">
									<div class="col-6 mb-20">
										<div class="page-banner__content-area">
											<h2>Release date</h2>
											<p>{{ movie.release_date }}</p>
											<h2>Runtime</h2>
											<p>
												{{ getRuntime(movie.runtime) }}
											</p>
										</div>
									</div>
									<div class="col-6 mb-20">
										<div class="page-banner__content-area">
											<h2>Genres</h2>
											<ul>
												<li
													v-for="genre in movie.genres"
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

			<div
				v-if="movie.posters.length || movie.backdrops.length"
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
									v-if="movie.posters.length"
									:class="{
										active: imageTypes == 'posters'
									}"
									@click="imageTypes = 'posters'"
									class="button"
								>
									Posters
								</button>
								<button
									v-if="movie.backdrops.length"
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
									movie.images.posters.length
							"
							key="posters"
						>
							<app-items-slider slideOrientation="portrait">
								<app-images-slider-item
									v-for="(image, index) in movie.images
										.posters"
									:key="image.file_path"
									:image="
										`https://image.tmdb.org/t/p/w780/${image.file_path}`
									"
									@click="openPosterGallery(index)"
									orientation="portrait"
									:name="
										`${
											movie.original_title
										} poster image ${index + 1}`
									"
								/>
							</app-items-slider>
						</div>
						<div
							v-if="
								imageTypes == 'backdrops' &&
									movie.images.backdrops.length
							"
							key="backdrops"
						>
							<app-items-slider slideOrientation="landscape">
								<app-images-slider-item
									v-for="(image, index) in movie.images
										.backdrops"
									:key="image.file_path"
									:image="
										`https://image.tmdb.org/t/p/w1280/${image.file_path}`
									"
									@click="openBackdropGallery(index)"
									orientation="landscape"
									:name="
										`${
											movie.original_title
										} backdrop image ${index + 1}`
									"
								/>
							</app-items-slider>
						</div>
					</transition>
				</div>
			</div>

			<div
				v-if="movie.videosList.length"
				class="pt-60 pb-30 info-section"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Videos</h2>
					<app-items-slider slideOrientation="landscape">
						<app-list-item
							v-for="item in movie.videosList"
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

			<div v-if="movie.cast.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Cast</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in movie.cast"
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
			<div class="pt-60 pb-30  info-section" v-if="movie.similar.length">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Similar</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in movie.similar"
							:key="item.id"
							:id="item.id"
							:image="item.poster_path || item.profile_path"
							:name="
								item.original_title ||
									item.original_name ||
									item.name
							"
							mediaType="movie"
							:sliderItem="true"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					:media="movie.posters"
					:showThumbs="false"
					:showLightBox="false"
					ref="posterGallery"
					v-if="movie.posters.length"
				/>
				<app-light-box
					:media="movie.backdrops"
					:showThumbs="false"
					:showLightBox="false"
					ref="backdropGallery"
					v-if="movie.backdrops.length"
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
			movie: [],
			showVideoFallback: false,
			imageTypes: 'posters'
		}
	},
	async fetch() {
		const youTubeApiKey = 'AIzaSyCQILg2l5LOJYF7A7X67R9Ety8kPpuv-qA'
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const movie = await this.$axios
			.get(
				`/movie/${this.$route.params.id}?api_key=${apiKey}&language=en-US&include_image_language=en&append_to_response=images,videos,credits,similar`
			)
			.catch(err => {
				console.log(err)
			})

		this.movie = movie.data
		this.movie.images = movie.data.images
		this.movie.cast = movie.data.credits.cast.splice(0, 20)
		this.movie.similar = movie.data.similar.results
		this.movie.backdrops = []
		this.movie.posters = []
		this.movie.videosList = []

		for (const image of this.movie.images.backdrops) {
			this.movie.backdrops.push({
				src: `https://image.tmdb.org/t/p/w1280/${image.file_path}`
			})
		}

		for (const image of this.movie.images.posters) {
			this.movie.posters.push({
				src: `https://image.tmdb.org/t/p/w780/${image.file_path}`
			})
		}

		if (movie.data.videos.results.length) {
			const videoKeys = []
			for (const video of movie.data.videos.results) {
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
					this.movie.videosList.push({
						id: video.id,
						videoKey: video.id,
						name: video.snippet.title,
						image: getThumbnail()
					})
				}
			} else {
				for (const video of this.movie.videos.results) {
					this.movie.videosList.push({
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
		getRuntime(time) {
			let hours = Math.floor(time / 60)
			let minutes = Math.round(time - hours * 60)
			let hoursText = hours != 0 ? `${hours}h` : ''
			let minutesText = minutes != 0 ? `${minutes}m` : ''

			return `${hoursText} ${minutesText}`
		},
		openPosterGallery(index) {
			this.$refs.posterGallery.showImage(index)
		},
		openBackdropGallery(index) {
			this.$refs.backdropGallery.showImage(index)
		}
	},
	computed: {
		hasBackgroundImage() {
			return this.movie.backdrop_path
		},
		movieBackgroundImage() {
			if (this.movie.backdrop_path) {
				return `background-image:url('https://image.tmdb.org/t/p/w1280/${this.movie.backdrop_path}')`
			}
			return ''
		}
	},
	validate({ params }) {
		return /^\d+$/.test(params.id)
	},
	head() {
		return {
			title: this.movie.original_title
				? `${this.movie.original_title} - MovieDB`
				: 'MovieDB'
		}
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider,
		'app-images-slider-item': AppImagesSliderItem
	}
}
</script>
