const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {

	eleventyConfig.addWatchTarget("./src/style.css");

	eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	});

	eleventyConfig.addPassthroughCopy("./src/assets/img");

	return {
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "public"
		}
	}

  };
