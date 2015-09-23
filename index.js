var Metalsmith = require('metalsmith');

var markdown   = require('metalsmith-markdown');

var layouts = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var inPlace = require('metalsmith-in-place');

var collections = require('metalsmith-collections');

var ignore = require('metalsmith-ignore');

var swigHelpers = require('metalsmith-swig-helpers')

var swig = require('swig');

var _ = require('lodash');

Metalsmith(__dirname)

  .source('./content')
  .destination('./dist')

  .use(ignore([
    '.DS_Store',
    '*/.DS_Store',
    '*/*/.DS_Store'
  ]))

  .use(collections({
    posts: {
      sortBy: 'date',
      reverse: true
    }
  }))

  .use(markdown())

  .use(permalinks({
    pattern: ':link',
    relative: false
  }))


  // .use(function(files, metalsmith, done) {
  //   // console.log('fIles: ');
  //   // console.log(files);
  //   Object.keys(files).forEach(function(file){
  //     console.log(file);
  //   });
  //   console.log('\n\n\n');
  //   // console.log('Metalsmith: ');
  //   // console.log(metalsmith);
  // })
  .use(swigHelpers({
    filters: {
      "truncate_list": function(x, y)  {

        return x.slice(0,y);
      },

      // Append a ! at the end of the given content.
      // {{ title|exclamation }}
      "exclamation": function(content) {
        return content + "!"
      }
    }
  }))

  .use(layouts({
    "default": "default.html",
    "engine": "swig"
  }))

  .use(inPlace({
    "engine": "swig",
    "partials": "partials"
  }))

  .build(function(err) {
    if (err) {
      throw err;
    }
  });
