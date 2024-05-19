const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {

	eleventyConfig.addWatchTarget("./src/style.css");

	eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	});

	eleventyConfig.addShortcode("datenow", () => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		month = month < 10  ? '0'+month : month;
		let day = now.getDay() + 1;
		day = day < 10  ? '0'+day : day;

		return `${year}-${month}-${day}`;
	});

	eleventyConfig.addPassthroughCopy("./src/assets/img");
	eleventyConfig.addPassthroughCopy("./src/assets/js");

	return {
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "docs"
		}
	}

  };
