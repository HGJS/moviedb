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
						'page-banner__background--blur': backgroundImage
					}"
					class="page-banner__background"
					:style="movieBackgroundImage"
				></div>
				<div class="page-banner__inner">
					<div class="container-fluid app-container-fluid">
						<div class="row">
							<div
								v-if="movie.posterImage"
								class="col-12 col-md-4 mb-30"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${movie.posterImage}`
									"
									:alt="movie.name"
									class="img-fluid md-max-400"
								/>
							</div>
							<div
								class="col-12 mb-30"
								:class="{ 'col-md-8': movie.posterImage }"
							>
								<h1
									class="page-banner__title"
									:class="{
										'page-banner__title--has-certification':
											movie.certification
									}"
								>
									<span class="page-banner__title-text">
										{{ movie.name }}
									</span>
									<span
										v-if="movie.certification"
										class="page-banner__certification-box"
									>
										{{ movie.certification }}
									</span>
								</h1>
								<div
									class="page-banner__content-area mb-20"
									v-if="movie.voteCount"
								>
									<h2>Rating</h2>
									<p class="page-banner__rating">
										<span class="page-banner__rating-box">
											{{ movie.voteAverage }}
										</span>
										based on
										{{ movie.voteCount }} reviews
									</p>
								</div>
								<div class="page-banner__content-area mb-20">
									<h2>Overview</h2>
									<p
										class="page-banner__desc"
										v-html="movie.overview"
									></p>
								</div>

								<div
									v-if="movie.releaseDate || movie.runtime"
									class="row"
								>
									<div
										v-if="movie.releaseDate"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>Release date</h2>
										<p>
											{{ formatDate(movie.releaseDate) }}
										</p>
									</div>
									<div
										v-if="movie.runtime"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>Runtime</h2>
										<p>
											{{ getRuntime(movie.runtime) }}
										</p>
									</div>
								</div>

								<div
									v-if="
										movie.genres.length ||
											movie.directors.length
									"
									class="row"
								>
									<div
										v-if="movie.genres.length"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>Genres</h2>
										<ul>
											<li
												v-for="genre in movie.genres"
												:key="genre.id"
											>
												<nuxt-link
													:to="{
														name: 'movies',
														query: {
															page: 1,
															sort_by:
																'popularity.desc',
															with_genres:
																genre.id
														}
													}"
													>{{ genre.name }}</nuxt-link
												>
											</li>
										</ul>
									</div>
									<div
										v-if="movie.directors.length"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>
											Director{{
												movie.directors.length > 1
													? 's'
													: ''
											}}
										</h2>
										<ul>
											<li
												v-for="director in movie.directors"
												:key="director.id"
											>
												<nuxt-link
													:to="
														`/people/${director.id}`
													"
												>
													{{ director.name }}
												</nuxt-link>
											</li>
										</ul>
									</div>
								</div>

								<div
									v-if="movie.budget || movie.revenue"
									class="row"
								>
									<div
										v-if="movie.budget"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>Budget</h2>
										<p>
											<money-format
												:value="movie.budget"
												locale="en"
												currency-code="USD"
												:hide-subunits="true"
											/>
										</p>
									</div>
									<div
										v-if="movie.revenue"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>Revenue</h2>
										<p>
											<money-format
												:value="movie.revenue"
												locale="en"
												currency-code="USD"
												:hide-subunits="true"
											/>
										</p>
									</div>
								</div>

								<div
									v-if="
										movie.productionCompanies.length ||
											movie.productionCountries.length
									"
									class="row"
								>
									<div
										v-if="movie.productionCompanies"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>Production Companies</h2>
										<ul>
											<li
												v-for="item in movie.productionCompanies"
												:key="item.id"
											>
												{{ item.name }}
											</li>
										</ul>
									</div>
									<div
										v-if="movie.productionCountries"
										class="page-banner__content-area col-6 mb-20"
									>
										<h2>Production Countries</h2>
										<ul>
											<li
												v-for="country in movie.productionCountries"
												:key="country.id"
											>
												{{ country.name }}
											</li>
										</ul>
									</div>
								</div>

								<div
									v-if="movie.homepage || movie.imdbId"
									class="page-banner__content-area mb-20"
								>
									<h2>Links</h2>
									<p v-if="movie.homepage">
										<a
											:href="movie.homepage"
											target="_blank"
											rel="noopener"
											>Visit {{ movie.name }} Website</a
										>
									</p>
									<p v-if="movie.imdbId">
										<a
											:href="
												`https://www.imdb.com/title/${movie.imdbId}`
											"
											target="_blank"
											rel="noopener"
											>View {{ movie.name }} On IMDb</a
										>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="
					movie.images.posters.length || movie.images.backdrops.length
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
									v-if="movie.images.posters.length"
									:class="{
										active: imageTypes == 'posters'
									}"
									@click="imageTypes = 'posters'"
									class="button"
								>
									Posters
								</button>
								<button
									v-if="movie.images.backdrops.length"
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
									:key="image.imagePath"
									:image="
										`https://image.tmdb.org/t/p/w780/${image.imagePath}`
									"
									@click="openPosterGallery(index)"
									orientation="portrait"
									:name="
										`${movie.name} poster image ${index +
											1}`
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
									:key="image.imagePath"
									:image="
										`https://image.tmdb.org/t/p/w1280/${image.imagePath}`
									"
									@click="openBackdropGallery(index)"
									orientation="landscape"
									:name="
										`${movie.name} backdrop image ${index +
											1}`
									"
								/>
							</app-items-slider>
						</div>
					</transition>
				</div>
			</div>
			<div v-if="movie.videos.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Videos</h2>
					<app-items-slider slideOrientation="landscape">
						<app-list-item
							v-for="video in movie.videos"
							:key="video.id"
							:id="video.id"
							:videoKey="video.videoKey"
							:image="video.imagePath"
							:name="video.name"
							mediaType="youTube"
							:sliderItem="true"
							orientation="landscape"
						/>
					</app-items-slider>
				</div>
			</div>

			<div v-if="movie.cast.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Cast</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="person in movie.cast"
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
			<div class="pt-60 pb-30  info-section" v-if="movie.similar.length">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Similar</h2>
					<app-items-slider slideOrientation="portrait">
						<app-list-item
							v-for="movie in movie.similar"
							:key="movie.id"
							:id="movie.id"
							:image="movie.imagePath"
							:name="movie.name"
							mediaType="movie"
							:sliderItem="true"
							orientation="portrait"
							:releaseDate="movie.releaseDate"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					:media="movie.gallery.posters"
					:showThumbs="false"
					:showLightBox="false"
					ref="posterGallery"
					v-if="movie.gallery.posters.length"
				/>
				<app-light-box
					:media="movie.gallery.backdrops"
					:showThumbs="false"
					:showLightBox="false"
					ref="backdropGallery"
					v-if="movie.gallery.backdrops.length"
				/>
			</client-only>
		</template>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppItemsSlider from '@/components/AppItemsSlider'
import AppImagesSliderItem from '@/components/AppImagesSliderItem'
import MoneyFormat from 'vue-money-format'
import list from '~/assets/js/list'

export default {
	data() {
		return {
			movie: [],
			imageTypes: 'posters'
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const youTubeApiKey = 'AIzaSyCQILg2l5LOJYF7A7X67R9Ety8kPpuv-qA'
		const movieData = await this.$axios
			.get(
				`/movie/${this.$route.params.id}?api_key=${apiKey}&language=en&include_image_language=en&append_to_response=images,videos,credits,similar,release_dates`
			)
			.catch(err => {
				console.log(err)
			})

		//MOVIE DATA
		const movie = movieData.data

		const videosData = await this.$axios
			.get(
				`https://www.googleapis.com/youtube/v3/videos?key=${youTubeApiKey}&part=snippet&id=${list.videoKeys(
					movie.videos.results
				)}`
			)
			.catch(err => {
				console.log(err)
			})

		const videos = videosData.data

		this.movie = {
			id: movie.id,
			name: movie.title,
			overview: movie.overview,
			imdbId: movie.imdb_id,
			homepage: movie.homepage,
			releaseDate: movie.release_date,
			revenue: movie.revenue,
			runtime: movie.runtime,
			posterImage: movie.poster_path,
			backgroundImage: movie.backdrop_path,
			voteAverage: Number.parseFloat(movie.vote_average).toFixed(1),
			voteCount: movie.vote_count,
			productionCompanies: list.productionCompanies(
				movie.production_companies
			),
			productionCountries: list.productionCountries(
				movie.production_countries
			),
			similar: list.movies(movie.similar.results),
			genres: list.genres(movie.genres),
			images: {
				posters: list.images(movie.images.posters),
				backdrops: list.images(movie.images.backdrops)
			},
			gallery: {
				posters: list.gallery(movie.images.posters),
				backdrops: list.gallery(movie.images.backdrops)
			},
			cast: list.people(movie.credits.cast.slice(0, 20)),
			directors: list.directors(movie.credits.crew),
			videos: list.videos(videos.items),
			certification: list.movieCertifications(movie.release_dates)
		}
	},
	methods: {
		openPosterGallery(index) {
			this.$refs.posterGallery.showImage(index)
		},

		openBackdropGallery(index) {
			this.$refs.backdropGallery.showImage(index)
		},

		getRuntime(time) {
			let hours = Math.floor(time / 60)
			let minutes = Math.round(time - hours * 60)
			let hoursText = hours != 0 ? `${hours}h` : ''
			let minutesText = minutes != 0 ? `${minutes}m` : ''

			return `${hoursText} ${minutesText}`
		},

		formatDate(date) {
			const dateString = new Date(date)
			return dateString.toLocaleDateString()
		}
	},
	computed: {
		backgroundImage() {
			return this.movie.backgroundImage
		},
		movieBackgroundImage() {
			if (this.movie.backgroundImage) {
				return `background-image:url('https://image.tmdb.org/t/p/w1280/${this.movie.backgroundImage}')`
			}
			return ''
		}
	},
	validate({ params }) {
		return /^\d+$/.test(params.id)
	},
	head() {
		return {
			title: this.movie.name ? `${this.movie.name} - MovieDB` : 'MovieDB'
		}
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider,
		'app-images-slider-item': AppImagesSliderItem,
		'money-format': MoneyFormat
	}
}
</script>
