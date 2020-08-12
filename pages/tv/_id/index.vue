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
							<div
								v-if="show.poster_path"
								class="col-12 col-md-6 col-lg-4 mb-30"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${show.poster_path}`
									"
									:alt="show.original_name"
									class="img-fluid md-max-400"
								/>
							</div>
							<div class="col-12 col-md-6 col-lg-8 mb-30">
								<h1 class="page-banner__title">
									{{ show.original_name }}
								</h1>
								<div class="page-banner__content-area mb-20">
									<h2>Overview</h2>
									<p v-html="show.overview"></p>
									<h2>Rating</h2>

									<p class="page-banner__rating">
										<span class="page-banner__rating-box">{{
											show.vote_average
										}}</span>
										based on {{ show.vote_count }} reviews
									</p>
								</div>
								<div class="row">
									<div class="col-6 mb-20">
										<div class="page-banner__content-area">
											<h2>First aired</h2>
											<p>{{ show.first_air_date }}</p>
											<h2>Number of Seasons</h2>
											<p>{{ show.number_of_seasons }}</p>
											<h2>Number of Episodes</h2>
											<p>{{ show.number_of_episodes }}</p>
										</div>
									</div>
									<div class="col-6 mb-20">
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

			<div v-if="showSeasons" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Seasons</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in showSeasons"
							:key="item.id"
							:id="show.id"
							:image="item.poster_path || item.profile_path"
							:name="
								item.original_title ||
									item.original_name ||
									item.name
							"
							:season="item.season_number"
							mediaType="tv-season"
							:sliderItem="true"
						/>
					</app-items-slider>
				</div>
			</div>

			<div
				v-if="showPosters.length || showBackdrops.length"
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
									v-if="showPosters.length"
									:class="{ active: imageTypes == 'posters' }"
									@click="imageTypes = 'posters'"
									class="button"
								>
									Posters
								</button>
								<button
									v-if="showBackdrops.length"
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
									showImages.posters.length
							"
							key="posters"
						>
							<app-items-slider slideOrientation="portrait">
								<app-images-slider-item
									v-for="(image, index) in showImages.posters"
									:key="image.file_path"
									:image="
										`https://image.tmdb.org/t/p/w780/${image.file_path}`
									"
									@click="openPosterGallery(index)"
									orientation="portrait"
									:name="
										`${
											show.original_title
										} poster image ${index + 1}`
									"
								/>
							</app-items-slider>
						</div>
						<div
							v-if="
								imageTypes == 'backdrops' &&
									showImages.backdrops.length
							"
							key="backdrops"
						>
							<app-items-slider slideOrientation="landscape">
								<app-images-slider-item
									v-for="(image,
									index) in showImages.backdrops"
									:key="image.file_path"
									:image="
										`https://image.tmdb.org/t/p/w1280/${image.file_path}`
									"
									@click="openBackdropGallery(index)"
									orientation="landscape"
									:name="
										`${
											show.original_title
										} backdrop image ${index + 1}`
									"
								/>
							</app-items-slider>
						</div>
					</transition>
				</div>
			</div>
			<!-- <div v-if="showVideos.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Videos</h2>
					<app-items-slider  slideOrientation="landscape">
						<app-list-item
							v-for="item in showVideos"
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
			</div> -->
			<!--CAST-->
			<div v-if="showCast.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Cast</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in showCast"
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
				v-if="showSimilar.total_results > 0"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Similar</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="item in showSimilar.results"
							:key="item.id"
							:id="item.id"
							:image="item.poster_path || item.profile_path"
							:name="
								item.original_title ||
									item.original_name ||
									item.name
							"
							mediaType="tv"
							:sliderItem="true"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					:media="showPosters"
					:showThumbs="false"
					:showLightBox="false"
					ref="posterGallery"
					v-if="showPosters.length"
				/>
				<app-light-box
					:media="showBackdrops"
					:showThumbs="false"
					:showLightBox="false"
					ref="backdropGallery"
					v-if="showBackdrops.length"
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
			showSeasons: [],
			showImages: [],
			showVideos: [],
			showCast: [],
			showCrew: [],
			showSimilar: [],
			showPosters: [],
			showBackdrops: [],
			imageTypes: 'posters'
		}
	},
	async fetch() {
		const youTubeApiKey = 'AIzaSyCQILg2l5LOJYF7A7X67R9Ety8kPpuv-qA'
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const show = await this.$axios
			.get(
				`/tv/${this.$route.params.id}?api_key=${apiKey}&language=en-US&include_image_language=en&append_to_response=images,videos,credits,similar`
			)
			.catch(err => {
				console.log(err)
			})

		this.show = show.data
		this.showSeasons = show.data.seasons
		this.showImages = show.data.images
		this.showCast = show.data.credits.cast.splice(0, 20)
		this.showCrew = show.data.credits.crew.splice(0, 20)
		this.showSimilar = show.data.similar

		for (const image of this.showImages.backdrops) {
			this.showBackdrops.push({
				src: `https://image.tmdb.org/t/p/w1280/${image.file_path}`
			})
		}

		for (const image of this.showImages.posters) {
			this.showPosters.push({
				src: `https://image.tmdb.org/t/p/w780/${image.file_path}`
			})
		}

		// if (show.data.videos.results.length) {
		// 	for (const video of show.data.videos.results) {
		// 		if (video.site == 'YouTube' && video.type != 'Bloopers') {
		// 			const youTubeVideo = await this.$axios
		// 				.get(
		// 					`https://www.googleapis.com/youtube/v3/videos?key=${youTubeApiKey}&part=snippet&id=${video.key}`
		// 				)
		// 				.catch(err => {
		// 					console.log(err)
		// 				})
		// 			function getThumbnail() {
		// 				const thumbnailsObject =
		// 					youTubeVideo.data.items[0].snippet.thumbnails
		// 				const sortedThumbnails = Object.keys(
		// 					thumbnailsObject
		// 				).sort(function(a, b) {
		// 					return (
		// 						thumbnailsObject[b].width -
		// 						thumbnailsObject[a].width
		// 					)
		// 				})

		// 				const thumbnailSize = sortedThumbnails[0]

		// 				return thumbnailsObject[thumbnailSize].url
		// 			}
		// 			this.showVideos.push({
		// 				id: youTubeVideo.data.items[0].id,
		// 				name:
		// 					youTubeVideo.data.items[0].snippet.localized.title,
		// 				image: getThumbnail()
		// 			})
		// 		}
		// 	}
		// }
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
			title: this.show.original_name
				? `${this.show.original_name} - MovieDB`
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
