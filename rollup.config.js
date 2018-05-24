// import uglify from 'rollup-plugin-uglify';

export default [
	{
		input: 'src/select-mixin.js',
		output: {
			file: 'select-mixin.js',
      name: 'SelectMixin',
			format: 'iife',
			sourcemap: false
		}
	}, {
		input: 'src/selector-mixin.js',
		output: {
			file: 'selector-mixin.js',
      name: 'SelectorMixin',
			format: 'iife',
			sourcemap: false
		}
	}
]
