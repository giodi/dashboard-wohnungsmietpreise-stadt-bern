const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("urlToNr", function(str) {
		let nr = '0';
		if(str !== null && str !== '/'){
			nr = str.substring(1,str.length-1);
		}
		return nr;
	});

	eleventyConfig.addWatchTarget("./src/style.css");

	eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	});

	eleventyConfig.addPassthroughCopy("./src/img");
	eleventyConfig.addPassthroughCopy("./src/assets/js");

	return {
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "public"
		}
	}

  };
