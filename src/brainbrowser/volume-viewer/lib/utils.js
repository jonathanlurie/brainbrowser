/*
* BrainBrowser: Web-based Neurological Visualization Tools
* (https://brainbrowser.cbrain.mcgill.ca)
*
* Copyright (C) 2011
* The Royal Institution for the Advancement of Learning
* McGill University
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
* Author: Tarek Sherif <tsherif@gmail.com> (http://tareksherif.ca/)
* Author: Nicolas Kassis
*/

(function() {
  "use strict";

  BrainBrowser.VolumeViewer.utils = {
    /**
    * @doc function
    * @name VolumeViewer.utils.nearestNeighbor
    *
    * @param {array} source Source image data.
    * @param {number} width Width of source image.
    * @param {number} height Height of source image.
    * @param {number} target_width Width of scaled image.
    * @param {number} target_height Height of scaled image.
    * @param {object} options Extra options:
    * * **block_size** The size of each unit for scaling (default: 1).
    * * **ArrayType** Constructor for the result array type (default: Uint8ClampedArray).
    *
    * @returns {array} The scaled image array.
    *
    * @description
    * Scale an image using nearest neighbor interpolation.
    * ```js
    * BrainBrowser.VolumeViewer.utils.nearestNeighbor(image_data, 256, 256, 512, 512);
    * ```
    */
    nearestNeighbor: function(source, width, height, target_width, target_height, options) {
      options = options || {};

      var block_size = options.block_size || 1;
      var ArrayType = options.array_type || Uint8ClampedArray;

      var x_ratio, y_ratio;
      var source_y_offset, source_block_offset;
      var target;
      var target_x, target_y;
      var target_y_offset, target_block_offset;
      var k;

      //Do nothing if size is the same
      if(width === target_width && height === target_height) {
        return source;
      }

      target = new ArrayType(target_width * target_height * block_size);
      x_ratio   = width / target_width;
      y_ratio   = height / target_height;
      for (target_y = 0; target_y < target_height; target_y++) {
        source_y_offset = Math.floor(target_y * y_ratio) * width;
        target_y_offset = target_y * target_width;

        for (target_x = 0; target_x < target_width; target_x++)  {
          source_block_offset = (source_y_offset + Math.floor(target_x * x_ratio)) * block_size;
          target_block_offset = (target_y_offset + target_x) * block_size;

          for (k = 0; k < block_size; k++) {
            target[target_block_offset+ k] = source[source_block_offset + k];
          }
        }
      }

      return target;
    },


    /**
    * @doc function
    * @name VolumeViewer.utils.bilinear
    *
    * @param {array} source Source image data.
    * @param {number} width Width of source image.
    * @param {number} height Height of source image.
    * @param {number} target_width Width of scaled image.
    * @param {number} target_height Height of scaled image.
    * @param {object} options Extra options:
    * * **block_size** The size of each unit for scaling (default: 1).
    * * **ArrayType** Constructor for the result array type (default: Uint8ClampedArray).
    *
    * @returns {array} The scaled image array.
    *
    * @description
    * Scale an image using bilinear interpolation interpolation.
    * ```js
    * BrainBrowser.VolumeViewer.utils.bilinear(image_data, 256, 256, 512, 512);
    * ```
    */
    bilinear:  function(source, width, height, target_width, target_height, options) {
      options = options || {};

      var block_size = options.block_size || 1;
      var ArrayType = options.array_type || Uint8ClampedArray;

      var x_ratio, y_ratio;
      var source_y_offset, source_block_offset;
      var target;
      var target_x, target_y;
      var target_y_offset, target_block_offset, target_y_offset_fix;
      var k;

      var colorInSourceTopLeft,
          colorInSourceTopRight,
          colorInSourceBottomLeft,
          colorInSourceBottomRight;

      //Do nothing if size is the same
      if(width === target_width && height === target_height) {
        return source;
      }

      target = new ArrayType(target_width * target_height * block_size);
      x_ratio   = width / target_width;
      y_ratio   = height / target_height;


      // Returns the color of the source dataset at a given position.
      // @param {Object} position - {x, y}
      // @return {Array} color, most likely as [r, g, b, a]
      function getSourcePixel(position){
        var offset = (Math.floor(position.y) * width + Math.floor(position.x)) * block_size;
        return source.slice(offset, offset+block_size);
      }

      var positionInSource = {x:0, y:0};
      var positionInSourceTopLeft = {x:0, y:0};
      var positionInSourceBotomLeft = {x:0, y:0};
      var positionInSourceTopRight = {x:0, y:0};
      var positionInSourceBottomRight = {x:0, y:0};

      for (target_y = 1; target_y < target_height-1; target_y++) {

        target_y_offset = target_y * target_width;
        target_y_offset_fix = (target_y /*+ Math.floor(1/y_ratio)*/ ) * target_width;
        positionInSource.y = target_y * y_ratio;
        positionInSourceTopLeft.y = Math.floor(positionInSource.y)
        positionInSourceBotomLeft.y = Math.ceil(positionInSource.y)
        positionInSourceTopRight.y = positionInSourceTopLeft.y;
        positionInSourceBottomRight.y = positionInSourceBotomLeft.y;

        for (target_x = 1; target_x < target_width-1; target_x++)  {

          //target_block_offset = (target_y_offset + target_x) * block_size;

          target_block_offset = (target_y_offset_fix + target_x /*+ Math.floor(1/x_ratio)*/ ) * block_size;

          positionInSource.x = target_x * x_ratio;
          positionInSourceTopLeft.x = Math.floor(positionInSource.x);
          positionInSourceBotomLeft.x = positionInSourceTopLeft.x;
          positionInSourceTopRight.x = Math.ceil(positionInSource.x);
          positionInSourceBottomRight.x = positionInSourceTopRight.x;

          colorInSourceTopLeft = getSourcePixel(positionInSourceTopLeft);
          colorInSourceTopRight =  getSourcePixel(positionInSourceTopRight);
          colorInSourceBottomLeft = getSourcePixel(positionInSourceBotomLeft);
          colorInSourceBottomRight = getSourcePixel(positionInSourceBottomRight);

          var ratioToLeft = ((positionInSource.x - positionInSourceTopLeft.x) /
                            (positionInSourceTopRight.x - positionInSourceTopLeft.x )) || 0.5;

          var ratioToTop =  (( positionInSource.y - positionInSourceTopLeft.y ) /
                            ( positionInSourceBotomLeft.y - positionInSourceTopLeft.y )) || 0.5;



          for (k = 0; k < block_size; k++) {
            var intermediateTop =    (1-ratioToLeft) * colorInSourceTopLeft[k] +
                                     (ratioToLeft) * colorInSourceTopRight[k];

            var intermediateBottom = (1-ratioToLeft) * colorInSourceBottomLeft[k] +
                                     (ratioToLeft) * colorInSourceBottomRight[k];

            var bandValue = (1-ratioToTop) * intermediateTop +
                            (ratioToTop) * intermediateBottom;

            target[target_block_offset+ k] = bandValue;
          }

        }
      }

      return target;
    },


    /**
    * @doc function
    * @name VolumeViewer.utils.flipArray
    *
    * @param {array} source Source image data.
    * @param {number} width Width of source image.
    * @param {number} height Height of source image.
    * @param {object} options Extra options:
    * * **flipx** Whether or not to flip along the x axis (default: false).
    * * **flipy** Whether or not to flip along the y axis (default: false).
    * * **block_size** The size of each unit for scaling (default: 1).
    *
    * @returns {array} The flipped image array.
    *
    * @description
    * Flip an image array along either the x or y axis.
    * ```js
    * BrainBrowser.VolumeViewer.utils.flipArray(image_data, 256, 256, { flipx: true });
    * ```
    */
    flipArray: function(source, width, height, options) {
      options = options || {};

      var flipx = options.flipx || false;
      var flipy = options.flipy || false;
      var block_size = options.block_size || 1;
      var target = new source.constructor(source.length);
      var i, j, k;
      var x, y;
      var target_row_offset, target_offset;
      var source_row_offset, source_offset;

      if (!flipx && !flipy) {
        for (i = 0, j = source.length; i < j; i++) {
          target[i] = source[i];
        }
        return target;
      }

      for (j = 0; j < height; j++) {
        target_row_offset = j * width;
        y = flipy ? height - j - 1 : j;
        source_row_offset = y * width;

        for (i = 0; i < width; i++) {
          target_offset = (target_row_offset + i) * block_size;
          x = flipx ? width - i - 1 : i;
          source_offset = (source_row_offset + x) * block_size;

          for (k = 0; k < block_size; k++) {
            target[target_offset + k] = source[source_offset + k];
          }
        }
      }

      return target;
    }

  };

})();
