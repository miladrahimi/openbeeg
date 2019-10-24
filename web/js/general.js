$(document).ready(function () {
    window.baseUrl = 'https://beeg.com/';
    window.proxyUrl = 'https://singlefetch.herokuapp.com/';

    window.proxify = function (target) {
        return proxyUrl + '?' + $.param({
            url: target,
            h_referer: baseUrl,
        });
    };
});
