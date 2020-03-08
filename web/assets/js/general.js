// Global variables
window.baseUrl = 'https://beeg.com/';
window.proxyUrl = 'https://singlefetch.herokuapp.com/';

// Duration constants
window.duration = {
    second: 1,
    minute: 60,
    hour: 60 * 60,
    day: 60 * 60 * 24,
    month: 60 * 60 * 24 * 30,
};

// Cache
window.cache = {
    set: (key, value, ttl) => {
        try {
            localStorage.setItem(key, JSON.stringify({
                v: value,
                e: Date.now() + (ttl * 1000),
            }));
        } catch (e) {
            console.error(e);
        }
    },
    get: key => {
        try {
            let value = localStorage.getItem(key);
            if (value) {
                let cached = JSON.parse(value);
                if (cached && Date.now() < cached.e) {
                    return cached.v;
                }
            }
        } catch (e) {
            console.error(e);
        }

        return null;
    }
};

// Query String Builder
window.query = parameters => new URLSearchParams(Object.entries(parameters)).toString();

// Proxify the given url
window.proxify = url => {
    if (typeof (url) == 'object') {
        if (url.h_referer === undefined) {
            url.h_referer = window.baseUrl;
        }

        return window.proxyUrl + '?' + window.query(url);
    }

    return window.proxyUrl + '?' + window.query({
        url: url,
        h_referer: window.baseUrl,
    });
};

// Load the given url
window.load = (url, callback) => {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.response);
        } else if (this.readyState === 4) {
            alert('Error.');
        }
    };
    ajax.open('GET', window.proxify(url), true);
    ajax.send();
};

// Load the given url with cache
window.loadWithCache = (url, ttl, callback) => {
    let response = window.cache.get(url);
    if (response) {
        callback(response);
    } else {
        window.load(url, response => {
            window.cache.set(url, response, ttl);
            callback(response);
        });
    }
};
