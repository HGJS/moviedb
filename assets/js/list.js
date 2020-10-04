export default {
	images(images) {
		const imagesArray = []
		for (const image of images) {
			imagesArray.push({
				imagePath: image.file_path
			})
		}
		return imagesArray
	},

	people(people) {
		const peopleArray = []
		for (const person of people) {
			peopleArray.push({
				id: person.id,
				name: person.name,
				character: person.character,
				gender: person.gender,
				imagePath: person.profile_path
			})
		}
		return peopleArray
	},

	gallery(images) {
		const imagesArray = []
		for (const image of images) {
			imagesArray.push({
				src: `https://image.tmdb.org/t/p/w1280/${image.file_path}`
			})
		}
		return imagesArray
	},

	genres(genres) {
		const genresArray = []
		for (const genre of genres) {
			genresArray.push({
				id: genre.id,
				name: genre.name
			})
		}
		return genresArray
	},

	directors(directors) {
		const directorsArray = []
		for (const director of directors) {
			if (director.job !== 'Director') {
				continue
			}
			directorsArray.push({
				id: director.id,
				name: director.name
			})
		}
		return directorsArray
	},

	results(results) {
		const resultsArray = []
		for (const result of results) {
			resultsArray.push({
				id: result.id,
				name: result.title || result.name,
				imagePath: result.poster_path || result.profile_path,
				mediaType: result.media_type
			})
		}
		return resultsArray
	},

	movies(movies, credit) {
		const moviesArray = []
		for (const movie of movies) {
			const entry = {
				id: movie.id,
				name: movie.title,
				imagePath: movie.poster_path,
				releaseDate: movie.release_date
			}
			if (credit) {
				entry.character = movie.character
			}
			moviesArray.push(entry)
		}
		return moviesArray
	},

	shows(shows, credit) {
		const showsArray = []
		for (const show of shows) {
			const entry = {
				id: show.id,
				name: show.name,
				imagePath: show.poster_path
			}
			if (credit) {
				entry.character = show.character
			}
			showsArray.push(entry)
		}
		return showsArray
	},

	seasons(seasons) {
		const seasonsArray = []
		for (const season of seasons) {
			seasonsArray.push({
				id: season.id,
				name: season.name,
				seasonNumber: season.season_number,
				imagePath: season.poster_path
			})
		}
		return seasonsArray
	},

	episodes(episodes, skip) {
		const episodesArray = []
		for (const episode of episodes) {
			if (skip && episode.episode_number === skip) {
				continue
			}
			episodesArray.push({
				id: episode.id,
				name: episode.name,
				episodeNumber: episode.episode_number,
				imagePath: episode.still_path
			})
		}
		return episodesArray
	},

	productionCompanies(companies) {
		const companiesArray = []
		for (const company of companies) {
			companiesArray.push({
				id: company.id,
				name: company.name
			})
		}
		return companiesArray
	},

	productionCountries(countries) {
		const countriesArray = []
		for (const country of countries) {
			countriesArray.push({
				id: country.id,
				name: country.name
			})
		}
		return countriesArray
	},

	filterVideos(videos) {
		const videosArray = []
		for (const video of videos) {
			if (video.site == 'YouTube' && video.type != 'Bloopers') {
				videosArray.push(video)
			} else {
				continue
			}
		}
		return videosArray
	},

	videoKeys(videos) {
		this.filterVideos(videos)
		const videoKeys = []

		for (const video of videos) {
			videoKeys.push(video.key)
		}

		return videoKeys.join()
	},

	getThumbnail(thumbnails) {
		const sortedThumbnails = Object.keys(thumbnails).sort(function(a, b) {
			return thumbnails[b].width - thumbnails[a].width
		})
		return thumbnails[sortedThumbnails[0]].url
	},

	videos(videos) {
		const videosArray = []

		for (const video of videos) {
			videosArray.push({
				id: video.id,
				videoKey: video.id,
				name: video.snippet.title,
				imagePath: this.getThumbnail(video.snippet.thumbnails)
			})
		}

		return videosArray
	}
}
