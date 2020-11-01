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
								v-if="show.posterImage"
								class="col-12 col-md-4 mb-30"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${show.posterImage}`
									"
									:alt="show.name"
									class="img-fluid md-max-400"
								/>
							</div>
							<div
								class="col-12 mb-30"
								:class="{ 'col-md-8': show.posterImage }"
							>
								<h1
									class="page-banner__title"
									:class="{
										'page-banner__title--has-certification':
											show.certification
									}"
								>
									<span class="page-banner__title-text">
										{{ show.name }}
									</span>
									<span
										v-if="show.certification"
										class="page-banner__certification-box"
									>
										{{ show.certification }}
									</span>
								</h1>
								<div
									v-if="show.voteCount"
									class="page-banner__content-area mb-20"
								>
									<h2>Rating</h2>
									<p class="page-banner__rating">
										<span class="page-banner__rating-box">
											{{ show.voteAverage }}
										</span>
										based on {{ show.voteCount }} reviews
									</p>
								</div>
								<div class="page-banner__content-area mb-20">
									<h2>Overview</h2>
									<p
										class="page-banner__desc"
										v-html="show.overview"
									></p>
								</div>
								<div class="row">
									<div class="col-6">
										<div class="page-banner__content-area">
											<h2>First aired</h2>
											<p>
												{{
													formatDate(
														show.firstAirDate
													)
												}}
											</p>
											<h2>Number of Seasons</h2>
											<p>{{ show.numberOfSeasons }}</p>
											<h2>Number of Episodes</h2>
											<p>{{ show.numberOfEpisodes }}</p>
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
													<nuxt-link
														:to="{
															name: 'tv',
															query: {
																page: 1,
																sort_by:
																	'popularity.desc',
																with_genres:
																	genre.id
															}
														}"
														>{{
															genre.name
														}}</nuxt-link
													>
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
							v-for="season in show.seasons"
							:key="season.id"
							:id="show.id"
							:image="season.imagePath"
							:name="season.name"
							:season="season.seasonNumber"
							mediaType="tv-season"
							:sliderItem="true"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>

			<div
				v-if="
					show.images.posters.length || show.images.backdrops.length
				"
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
									v-if="show.images.posters.length"
									:class="{ active: imageTypes == 'posters' }"
									@click="imageTypes = 'posters'"
									class="button"
								>
									Posters
								</button>
								<button
									v-if="show.images.backdrops.length"
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
									:key="image.imagePath"
									:image="
										`https://image.tmdb.org/t/p/w780/${image.imagePath}`
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
									:key="image.imagePath"
									:image="
										`https://image.tmdb.org/t/p/w1280/${image.imagePath}`
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
			<div v-if="show.videos.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Videos</h2>
					<app-items-slider slideOrientation="landscape">
						<app-list-item
							v-for="video in show.videos"
							:key="video.id"
							:id="video.id"
							:videoKey="video.videoKey"
							:image="video.imagePath"
							:name="video.name"
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
							v-for="person in show.cast"
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

			<!--SIMILAR-->
			<div class="pt-60 pb-30  info-section" v-if="show.similar.length">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Similar</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="show in show.similar"
							:key="show.id"
							:id="show.id"
							:image="show.imagePath"
							:name="show.name"
							mediaType="tv"
							:sliderItem="true"
							:releaseDate="show.releaseDate"
							orientation="portrait"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					:media="show.gallery.posters"
					:showThumbs="false"
					:showLightBox="false"
					ref="posterGallery"
					v-if="show.gallery.posters.length"
				/>
				<app-light-box
					:media="show.gallery.backdrops"
					:showThumbs="false"
					:showLightBox="false"
					ref="backdropGallery"
					v-if="show.gallery.backdrops.length"
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
			show: {},
			showVideoFallback: false,
			imageTypes: 'posters'
		}
	},
	async fetch() {
		const youTubeApiKey = 'AIzaSyCQILg2l5LOJYF7A7X67R9Ety8kPpuv-qA'
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const showData = await this.$axios
			.get(
				`/tv/${this.$route.params.id}?api_key=${apiKey}&language=en&include_image_language=en&append_to_response=images,videos,credits,similar,release_dates`
			)
			.catch(err => {
				console.log(err)
			})

		const show = showData.data

		const videosData = await this.$axios
			.get(
				`https://www.googleapis.com/youtube/v3/videos?key=${youTubeApiKey}&part=snippet&id=${list.videoKeys(
					show.videos.results
				)}`
			)
			.catch(err => {
				console.log(err)
			})

		const videos = videosData.data

		const certificationsData = await this.$axios
			.get(
				`/tv/${this.$route.params.id}/content_ratings?api_key=${apiKey}&language=en`
			)
			.catch(err => {
				console.log(err)
			})

		const certifications = certificationsData.data.results

		this.show = {
			id: show.id,
			name: show.name,
			overview: show.overview,
			posterImage: show.poster_path,
			voteAverage: Number.parseFloat(show.vote_average).toFixed(1),
			voteCount: show.vote_count,
			numberOfSeasons: show.number_of_seasons,
			numberOfEpisodes: show.number_of_episodes,
			firstAirDate: show.first_air_date,
			cast: list.people(show.credits.cast.slice(0, 20)),
			images: {
				posters: list.images(show.images.posters),
				backdrops: list.images(show.images.backdrops)
			},
			gallery: {
				posters: list.gallery(show.images.posters),
				backdrops: list.gallery(show.images.backdrops)
			},
			backgroundImage: show.backdrop_path,
			productionCompanies: list.productionCompanies(
				show.production_companies
			),
			seasons: list.seasons(show.seasons),
			similar: list.shows(show.similar.results),
			genres: list.genres(show.genres),
			videos: list.videos(videos.items),
			certification: list.tvCertifications(certifications)
		}
	},
	methods: {
		openPosterGallery(index) {
			this.$refs.posterGallery.showImage(index)
		},
		openBackdropGallery(index) {
			this.$refs.backdropGallery.showImage(index)
		},
		formatDate(date) {
			const dateString = new Date(date)
			return dateString.toLocaleDateString()
		}
	},
	computed: {
		hasBackgroundImage() {
			return this.show.backgroundImage
		},
		showBackgroundImage() {
			if (this.show.backgroundImage) {
				return `background-image:url('https://image.tmdb.org/t/p/w1280/${this.show.backgroundImage}')`
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
