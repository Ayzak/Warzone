/**
 *  Loader class
 *
 *  Handles asynchronous image loading with associated callbacks.
 *  This is a singleton.
 *  @Authors : Jeremy Locheron, Damien Cauquil.
 */
function Loader() {

    /* Behave as a Singleton's constructor. */
    if (arguments.callee._instance)
        return arguments.callee._instance;
    arguments.callee._instance = this;

    /* Preloaded images array. */
    this.images = {};
    this.pending_imgs = [];
    this.onLoadCallback = null;
    this.loaded = false;
}

/**
 *  Monitoring callback, keeps track of image loading.
 *  @param url[picture]
 */
Loader.prototype.onImageLoaded = function(image) {

    /* Remove image from pending */
    var img_idx = this.pending_imgs.indexOf(image);
    if (img_idx >= 0) {
        this.pending_imgs.splice(img_idx, 1);
    }

    /* If no more image pending, call onLoadCallback. */
    if (!this.loaded && (this.pending_imgs.length == 0) && this.onLoadCallback != null) {
        this.loaded = true;
        this.onLoadCallback();
    }
}


/**
 *  Loads an array of images, and call the given callback once done.
 *  @param url[picture], function[callback]
 */
Loader.prototype.preload = function(images, callback) {

    /* Save callback. */
    this.onLoadCallback = callback;

    /* Launch image loading. */
    for (var img in images) {
        /* Declare image as pending (loading ...). */
        this.pending_imgs.push(images[img]);

        /* Load the image. */
        var img_obj = new Image();
        this.images[images[img]] = img_obj;

        /* Use our onImageLoaded callback. */
        img_obj.onload = (function(me, i){
            return function(){
                me.onImageLoaded(i);
            };
        })(this, images[img]);
        img_obj.src = images[img];
    }
}

/**
 *  Returns a loaded picture.
 *  @param url[picture]
 *  @return loaded picture
 */
Loader.prototype.getImage = function(image) {
    if (image in this.images) {
        return this.images[image];
    } else {
        return null;
    }
}
