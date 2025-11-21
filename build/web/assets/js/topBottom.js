// Helper to dynamically load a JS file only once
function loadScriptOnce(src) {
    return new Promise(function (resolve, reject) {
        if (document.querySelector('script[src="' + src + '"]')) {
            resolve();
            return;
        }
        var script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

function loadHeaderFooter() {
    // Helper to re-initialize scripts after header/footer load
    function reInitHeaderFooterScripts() {
        // Dynamically load required scripts for header/footer (if not already loaded)
        // List all scripts used in header.html that are needed for interactivity
        var scripts = [
            'assets/js/slick.min.js',
            'assets/js/bootstrap.min.js',
            'assets/js/jquery.magnific-popup.min.js',
            'assets/js/jquery-ui.min.js',
            'assets/js/circle-progress.min.js',
            'assets/js/imagesLoaded.js',
            'assets/js/isotope.js',
            'assets/js/wow.min.js',
            'assets/js/main.js'
        ];
        // Load each script sequentially
        scripts.reduce((p, src) => p.then(() => loadScriptOnce(src)), Promise.resolve()).then(function () {
            // If main.js is already loaded, re-run its init if available
            if (typeof window.vsInit === 'function') {
                window.vsInit();
            }
            // For jQuery-based plugins, trigger document ready again
            if (typeof $ === 'function') {
                $(document).trigger('headerFooterLoaded');
            }
        });
    }

    // Load header
    var headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                var header = tempDiv.querySelector('header');
                if (header) {
                    headerPlaceholder.appendChild(header);
                    reInitHeaderFooterScripts();
                }
            });
    }
    // Load footer
    var footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                var footer = tempDiv.querySelector('footer');
                if (footer) {
                    footerPlaceholder.appendChild(footer);
                    reInitHeaderFooterScripts();
                }
            });
    }
}