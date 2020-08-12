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
								<div class="page-banner__content-area">
									<h2>Overview</h2>
									<p v-html="movie.overview"></p>
									<h2>Rating</h2>

									<p class="page-banner__rating">
										<span class="page-banner__rating-box">{{
											movie.vote_average
										}}</span>
										based on {{ movie.vote_count }} reviews
									</p>
									<h2>Genres</h2>
									<ul>
										<li
											v-for="genre in movie.genres"
											:key="genre.id"
										>
											{{ genre.name }}
										</li>
									</ul>
									<h2>Release date</h2>
									<p>{{ movie.release_date }}</p>
									<h2>Runtime</h2>
									<p>{{ getRuntime(movie.runtime) }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="moviePosters.length || movieBackdrops.length"
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
									v-if="moviePosters.length"
									:class="{ active: imageTypes == 'posters' }"
									@click="imageTypes = 'posters'"
									class="button"
								>
									Posters
								</button>
								<button
									v-if="movieBackdrops.length"
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
									movieImages.posters.length
							"
							key="posters"
						>
							<app-items-slider :settings="posterSliderSettings">
								<app-images-slider-item
									v-for="(image,
									index) in movieImages.posters"
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
									movieImages.backdrops.length
							"
							key="backdrops"
						>
							<app-items-slider
								:settings="backdropSliderSettings"
							>
								<app-images-slider-item
									v-for="(image,
									index) in movieImages.backdrops"
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
			<div v-if="movieVideos.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Videos</h2>
					<app-items-slider :settings="videoSliderSettings">
						<app-list-item
							v-for="item in movieVideos"
							:key="item.id"
							:id="item.id"
							:image="item.image"
							:name="item.name"
							mediaType="youTube"
							:sliderItem="true"
							orientation="landscape"
						/>
					</app-items-slider>
				</div>
			</div>
			<!--CAST-->
			<div v-if="movieCast.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Cast</h2>
					<app-items-slider :settings="sliderSettings">
						<app-list-item
							v-for="item in movieCast"
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

			<!--SIMILAR-->
			<div
				class="pt-60 pb-30  info-section"
				v-if="movieSimilar.total_results > 0"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Similar</h2>
					<app-items-slider :settings="sliderSettings">
						<app-list-item
							v-for="item in movieSimilar.results"
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
						/>
					</app-items-slider>
				</div>
			</div>
			<no-ssr>
				<app-light-box
					:media="moviePosters"
					:showThumbs="false"
					:showLightBox="false"
					ref="posterGallery"
				/>
				<app-light-box
					:media="movieBackdrops"
					:showThumbs="false"
					:showLightBox="false"
					ref="backdropGallery"
				/>
			</no-ssr>
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
			movieImages: [],
			movieVideos: [],
			movieCast: [],
			movieSimilar: [],
			moviePosters: [],
			movieBackdrops: [],
			imageTypes: 'posters',
			sliderSettings: {
				arrows: false,
				slidesToShow: 4,
				slidesToScroll: 1,
				lazyLoad: 'ondemand',
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 3
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2
						}
					}
				]
			},
			posterSliderSettings: {
				arrows: false,
				slidesToShow: 4,
				slidesToScroll: 1,
				lazyLoad: 'ondemand',
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 3
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2
						}
					}
				]
			},
			backdropSliderSettings: {
				arrows: false,
				slidesToShow: 2,
				slidesToScroll: 1,
				lazyLoad: 'ondemand',
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 1
						}
					}
				]
			},
			videoSliderSettings: {
				arrows: false,
				slidesToShow: 2,
				slidesToScroll: 1,
				lazyLoad: 'ondemand',
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 1
						}
					}
				]
			}
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
		this.movieImages = movie.data.images
		this.movieCast = movie.data.credits.cast.splice(0, 20)
		this.movieSimilar = movie.data.similar

		for (const image of this.movieImages.backdrops) {
			this.movieBackdrops.push({
				src: `https://image.tmdb.org/t/p/w1280/${image.file_path}`
			})
		}

		for (const image of this.movieImages.posters) {
			this.moviePosters.push({
				src: `https://image.tmdb.org/t/p/w780/${image.file_path}`
			})
		}

		if (movie.data.videos.results.length) {
			for (const video of movie.data.videos.results) {
				if (video.site == 'YouTube' && video.type != 'Bloopers') {
					const youTubeVideo = await this.$axios
						.get(
							`https://www.googleapis.com/youtube/v3/videos?key=${youTubeApiKey}&part=snippet&id=${video.key}`
						)
						.catch(err => {
							console.log(err)
						})
					function getThumbnail() {
						return youTubeVideo.data.items[0].snippet.thumbnails
							.maxres
							? youTubeVideo.data.items[0].snippet.thumbnails
									.maxres.url
							: youTubeVideo.data.items[0].snippet.thumbnails
									.standard.url
					}
					this.movieVideos.push({
						id: youTubeVideo.data.items[0].id,
						name:
							youTubeVideo.data.items[0].snippet.localized.title,
						image: getThumbnail()
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
			title: `${this.movie.original_title} - MovieDB`
		}
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider,
		'app-images-slider-item': AppImagesSliderItem
	}
}
</script>
