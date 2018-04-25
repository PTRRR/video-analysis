/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var clusters = __webpack_require__(1);
var width = window.innerWidth * 0.2;
var height = window.innerHeight * 0.2;
// Canvas
var canvas = document.querySelector("#canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
// Video
var video = document.querySelector("#video");

// Timing
var fps = 25;
var frameTime = 1000 / 25;
var time = 0;

// Data
var pixels = null;
var lastPixels = null;

video.play();
requestAnimationFrame(draw);

// Draw and compute difference between frames
function draw() {
  var date = new Date();
  var currentTime = date.getTime();
  var delta = currentTime - time;
  var total = 0;
  var count = 0;
  // New frame
  if (delta >= frameTime) {
    ctx.drawImage(video, 0, 0, width, height);
    var imgData = ctx.getImageData(0, 0, width, height);
    // Clone the typed array
    pixels = imgData.data.slice();
    if (lastPixels) {
      for (var i = 0; i < pixels.length; i += 4) {
        var pixel = [pixels[i + 0], pixels[i + 1], pixels[i + 2]];
        var light = getLight(pixel);
        var lastPixel = [lastPixels[i + 0], lastPixels[i + 1], lastPixels[i + 2]];
        var lastLight = getLight(lastPixel);
        var deltaLight = Math.abs(light - lastLight);
        total += deltaLight;
        count++;
        imgData.data[i + 0] = deltaLight;
        imgData.data[i + 1] = deltaLight;
        imgData.data[i + 2] = deltaLight;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    lastPixels = pixels;
    time = currentTime;
  }

  if (total / count > 14) {
    ctx.drawImage(video, 0, 0, width, height);
    var data = [];
    for (var _i = 0; _i < pixels.length; _i += 4 * 30) {
      data.push([pixels[_i + 0], pixels[_i + 1], pixels[_i + 2]]);
    }
    clusters.k(6);
    clusters.iterations(300);
    clusters.data(data);
    var colors = document.querySelectorAll(".color");
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.entries(clusters.clusters())[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            index = _step$value[0],
            cluster = _step$value[1];

        var centroid = cluster.centroid;

        var rgb = "rgb(" + centroid[0] + "," + centroid[1] + "," + centroid[2] + ")";
        colors[index].style.background = rgb;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  requestAnimationFrame(draw);
}

function getLight(pixel) {
  return (pixel[0] + pixel[1] + pixel[2]) / 3;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {

  data: getterSetter([], function (arrayOfArrays) {
    var n = arrayOfArrays[0].length;
    return arrayOfArrays.map(function (array) {
      return array.length == n;
    }).reduce(function (boolA, boolB) {
      return boolA & boolB;
    }, true);
  }),

  clusters: function clusters() {
    var pointsAndCentroids = kmeans(this.data(), { k: this.k(), iterations: this.iterations() });
    var points = pointsAndCentroids.points;
    var centroids = pointsAndCentroids.centroids;

    return centroids.map(function (centroid) {
      return {
        centroid: centroid.location(),
        points: points.filter(function (point) {
          return point.label() == centroid.label();
        }).map(function (point) {
          return point.location();
        })
      };
    });
  },

  k: getterSetter(undefined, function (value) {
    return value % 1 == 0 & value > 0;
  }),

  iterations: getterSetter(Math.pow(10, 3), function (value) {
    return value % 1 == 0 & value > 0;
  })

};

function kmeans(data, config) {
  // default k
  var k = config.k || Math.round(Math.sqrt(data.length / 2));
  var iterations = config.iterations;

  // initialize point objects with data
  var points = data.map(function (vector) {
    return new Point(vector);
  });

  // intialize centroids randomly
  var centroids = [];
  for (var i = 0; i < k; i++) {
    centroids.push(new Centroid(points[i % points.length].location(), i));
  };

  // update labels and centroid locations until convergence
  for (var iter = 0; iter < iterations; iter++) {
    points.forEach(function (point) {
      point.updateLabel(centroids);
    });
    centroids.forEach(function (centroid) {
      centroid.updateLocation(points);
    });
  };

  // return points and centroids
  return {
    points: points,
    centroids: centroids
  };
};

// objects
function Point(location) {
  var self = this;
  this.location = getterSetter(location);
  this.label = getterSetter();
  this.updateLabel = function (centroids) {
    var distancesSquared = centroids.map(function (centroid) {
      return sumOfSquareDiffs(self.location(), centroid.location());
    });
    self.label(mindex(distancesSquared));
  };
};

function Centroid(initialLocation, label) {
  var self = this;
  this.location = getterSetter(initialLocation);
  this.label = getterSetter(label);
  this.updateLocation = function (points) {
    var pointsWithThisCentroid = points.filter(function (point) {
      return point.label() == self.label();
    });
    if (pointsWithThisCentroid.length > 0) self.location(averageLocation(pointsWithThisCentroid));
  };
};

// convenience functions
function getterSetter(initialValue, validator) {
  var thingToGetSet = initialValue;
  var isValid = validator || function (val) {
    return true;
  };
  return function (newValue) {
    if (typeof newValue === 'undefined') return thingToGetSet;
    if (isValid(newValue)) thingToGetSet = newValue;
  };
};

function sumOfSquareDiffs(oneVector, anotherVector) {
  var squareDiffs = oneVector.map(function (component, i) {
    return Math.pow(component - anotherVector[i], 2);
  });
  return squareDiffs.reduce(function (a, b) {
    return a + b;
  }, 0);
};

function mindex(array) {
  var min = array.reduce(function (a, b) {
    return Math.min(a, b);
  });
  return array.indexOf(min);
};

function sumVectors(a, b) {
  return a.map(function (val, i) {
    return val + b[i];
  });
};

function averageLocation(points) {
  var zeroVector = points[0].location().map(function () {
    return 0;
  });
  var locations = points.map(function (point) {
    return point.location();
  });
  var vectorSum = locations.reduce(function (a, b) {
    return sumVectors(a, b);
  }, zeroVector);
  return vectorSum.map(function (val) {
    return val / points.length;
  });
};

/***/ })
/******/ ]);