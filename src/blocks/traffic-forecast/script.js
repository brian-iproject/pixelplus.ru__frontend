document.addEventListener('DOMContentLoaded', () => {
    if (!window.tfData) return;

    const containers = document.querySelectorAll('.js-traffic-forecast:not(.--initialized)');
    containers.forEach(container => {
        // init
        new window.pixelplus.TrafficForecast({
            container,
            data: window.tfData,
            chartScripts: [
                '/assets/js/am-charts/core.js',
                '/assets/js/am-charts/charts.js',
                '/assets/js/am-charts/animated.js',
                '/assets/js/am-charts/ru_RU.js'
            ],
            pdfPluginScripts: [
                '/assets/js/html2canvas.min.js',
                '/assets/js/pdfmake.min.js',
                '/assets/js/vfs_fonts.js',
                '/assets/js/pdf.min.js'
            ]
        });

        container.classList.add('--initialized');
    });
});
