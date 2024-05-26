const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {

	// Beobachtet die Datei style.css auf Veränderungen
	eleventyConfig.addWatchTarget("./src/style.css");

	// Funktion um den CSS Code zu komprimieren.
	eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	});

	// Funktion welche das aktuelle Datum zurückliefert.
	eleventyConfig.addShortcode("datenow", (format) => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		month = month < 10  ? '0'+month : month;
		let day = now.getDate();
		day = day < 10  ? '0'+day : day;

		if(format == 'dd.mm.YYYY'){
			return `${day}.${month}.${year}`;
		}

		return `${year}-${month}-${day}`;
		
	});

	// Verzeichnisse welche ins output Verzeichnis rüberkopiert werden sollen.
	eleventyConfig.addPassthroughCopy("./src/assets/img");
	eleventyConfig.addPassthroughCopy("./src/assets/js");
	eleventyConfig.addPassthroughCopy("./src/assets/fonts");

	// Einstellungen zu Renderingengines und Quell- und Destinationsverzeichnis.
	return {
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "docs"
		}
	}

  };
