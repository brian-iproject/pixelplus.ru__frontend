export default class TrafficForecast {
    constructor({container, data, chartScripts, pdfPluginScripts}) {
        this.container = container;
        if (!this.container) return;

        this.data = data;
        this.chartScripts = chartScripts;
        this.pdfPluginScripts = pdfPluginScripts;

        const defaultConfig = {
            monthCount: 12,
            noSeoLegendText: '— без работ по SEO',
            seoLegendText: '— с работами по SEO'
        };

        this.config = Object.assign(defaultConfig, JSON.parse(this.container.dataset.config));

        this.isLoaded = false;

        this.lazyLoadTF();

        window.addEventListener('scroll', this.lazyLoadTF.bind(this));
    }

    deleteSymbols(value) {
        return value.toString().replace(/[^+\d]/g, '');
    }

    numberFormatting(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    formatInput(input) {
        let value = this.deleteSymbols(input.value);
        if (!value) return '';

        const unit = input.getAttribute('data-unit') || '';

        input.value = this.numberFormatting(value) + unit;
    }

    setUserProfit(value) {
        this.data.fields.userProfit = value;
        this.inputs.userProfit.value = value;
        this.formatInput(this.inputs.userProfit);
    }

    saveOrderData() {
        let text = [
            '<b>Выбранные в виджете данные</b>'
        ];

        const subjectId = this.data.fields.subject;
        let subject;

        if (subjectId in this.data.subjectVariants) {
            subject = this.data.subjectVariants[subjectId]
            text.push('Тематика сайта: ' + subject.name);
        }

        const lastMonthTraffic = parseInt(this.data.fields.lastMonthTraffic);

        if (!isNaN(lastMonthTraffic) && lastMonthTraffic > 0) {
            text.push('Трафик за последний месяц: ' + lastMonthTraffic);
        }

        const budgetId = this.data.fields.budget;

        if (budgetId in this.data.budgetVariants) {
            const budget = this.data.budgetVariants[budgetId];
            text.push('Бюджет на SEO в месяц: ' + budget.name);
        }

        const userProfit = parseFloat(this.data.fields.userProfit);

        if (!isNaN(userProfit) && userProfit > 0) {
            text.push('Доход с 1 посетителя: ' + userProfit);
        }

        Cookies.set(
            'PixelSiteComponentsTrafficForecast',
            encodeURIComponent(text.join("\n")),
            {
                path: '/'
            }
        );
    }

    showErrors(errors) {
        this.errorsElement.innerHTML = errors.join('<br>');
        this.errorsElement.classList.add('is-visible');
    }

    hideErrors() {
        this.errorsElement.classList.remove('is-visible');
    }

    getChartsData() {
        const subjectId = this.data.fields.subject;
        let subject;

        if (subjectId in this.data.subjectVariants) {
            subject = this.data.subjectVariants[subjectId];
        }

        const errors = [];

        if (!subject) {
            errors.push('Выберите тематику');
        }

        const lastMonthTraffic = parseInt(this.data.fields.lastMonthTraffic);

        if (isNaN(lastMonthTraffic) || lastMonthTraffic <= 0) {
            errors.push('Укажите трафик за последний месяц');
        }

        const budgetId = this.data.fields.budget;
        let budget;

        if (budgetId in this.data.budgetVariants) {
            budget = this.data.budgetVariants[budgetId];
        }

        if (!budget) {
            errors.push('Укажите бюджет на SEO в месяц');
        }

        const userProfit = parseFloat(this.data.fields.userProfit);

        if (isNaN(userProfit) || userProfit <= 0) {
            errors.push('Укажите доход с 1 посетителя');
        }

        if (errors.length > 0) {
            this.showErrors(errors);
            return;
        }

        const previousMonth = new Date;
        previousMonth.setDate(1);
        previousMonth.setMonth(previousMonth.getMonth() - 1);

        const chartsData = {
            'grow': {
                'noSeo': [],
                'seo': []
            },
            'sales': {
                'noSeo': [],
                'seo': []
            }
        }

        for (var i = 0; i <= this.config.monthCount - 1; i++) {
            const date = new Date(previousMonth.getTime());
            date.setMonth(date.getMonth() + i);
            const monthNumber = date.getMonth();

            const seasonalityFactor = subject.seasonalityCoefficient[monthNumber];

            const noSeoValue = seasonalityFactor * lastMonthTraffic;
            const seoValue = noSeoValue * budget.coefficient[i] / 100;

            chartsData.grow.noSeo.push({
                'date': date.toISOString().slice(0, 10),
                'value': noSeoValue.toFixed(0)
            });

            chartsData.grow.seo.push({
                'date': date.toISOString().slice(0, 10),
                'value': seoValue.toFixed(0)
            });

            chartsData.sales.noSeo.push({
                'date': date.toISOString().slice(0, 10),
                'value': (noSeoValue * userProfit).toFixed(0)
            });

            chartsData.sales.seo.push({
                'date': date.toISOString().slice(0, 10),
                'value': (seoValue * userProfit).toFixed(0)
            });
        }
        return chartsData;
    }

    drawChartsData() {
        this.hideErrors();

        const chartData = this.getChartsData();
        if (!chartData) {
            this.tabs.chartWrapper.forEach(x => x.classList.remove('is-visible'));
            return;
        }

        const chartsSettings = [
            {
                chartContainer: 'traffic-forecast-chart',
                legendContainer: 'traffic-forecast-chart-legend',
                series: [
                    {
                        name: this.config.noSeoLegendText,
                        type: 'LineSeries',
                        dataFields: {
                            valueY: "value",
                            dateX: "date"
                        },
                        tooltipHTML: "{value}",
                        tensionX: 0.8,
                        strokeWidth: 3,
                        stroke: am4core.color("#CC0000"),
                        bullets: [
                            {
                                type: 'CircleBullet',
                                circle: {
                                    fill: am4core.color("#fff"),
                                    strokeWidth: 3
                                }
                            }
                        ],
                        data: chartData.grow.noSeo
                    },
                    {
                        name: this.config.seoLegendText,
                        type: 'LineSeries',
                        dataFields: {
                            valueY: "value",
                            dateX: "date"
                        },
                        tooltipHTML: "{value}",
                        tensionX: 0.8,
                        strokeWidth: 3,
                        stroke: am4core.color("#018818"),
                        bullets: [
                            {
                                type: 'CircleBullet',
                                circle: {
                                    fill: am4core.color("#fff"),
                                    strokeWidth: 3
                                }
                            }
                        ],
                        data: chartData.grow.seo
                    }
                ]
            },
            {
                chartContainer: 'sales-forecast-chart',
                legendContainer: 'sales-forecast-chart-legend',
                series: [
                    {
                        name: this.config.noSeoLegendText,
                        type: 'LineSeries',
                        dataFields: {
                            valueY: "value",
                            dateX: "date"
                        },
                        tooltipHTML: "{value}",
                        tensionX: 0.8,
                        strokeWidth: 3,
                        stroke: am4core.color("#CC0000"),
                        bullets: [
                            {
                                type: 'CircleBullet',
                                circle: {
                                    fill: am4core.color("#fff"),
                                    strokeWidth: 3
                                }
                            }
                        ],
                        data: chartData.sales.noSeo
                    },
                    {
                        name: this.config.seoLegendText,
                        type: 'LineSeries',
                        tooltipHTML: "{value}",
                        dataFields: {
                            valueY: "value",
                            dateX: "date"
                        },
                        tensionX: 0.8,
                        strokeWidth: 3,
                        stroke: am4core.color("#018818"),
                        bullets: [
                            {
                                type: 'CircleBullet',
                                circle: {
                                    fill: am4core.color("#fff"),
                                    strokeWidth: 3
                                }
                            }
                        ],
                        data: chartData.sales.seo
                    }
                ]
            }
        ];

        const isMobile = window.matchMedia('(max-width: 991px)').matches

        chartsSettings.forEach(chart => {
            if (this.container.querySelector(`#${chart.chartContainer}`) && this.container.querySelector(`#${chart.legendContainer}`)) {
                const legendContainer = am4core.createFromConfig({
                    "width": "100%",
                    "height": "100%"
                }, chart.legendContainer, am4core.Container);

                const config = {
                    yAxes: [
                        {
                            type: 'ValueAxis',
                            dataFields: {
                                value: "value"
                            },
                            renderer: {
                                minGridDistance: 50,
                                labels: {
                                    "fontSize": isMobile ? 10 : 12
                                }
                            }
                        }
                    ],
                    xAxes: [
                        {
                            id: 'd1',
                            type: 'DateAxis',
                            tooltipDateFormat: "dd.MM.yyyy",
                            dataFields: {
                                value: "date"
                            },
                            renderer: {
                                minGridDistance: 25,
                                grid: {
                                    template: {
                                        location: 0
                                    }
                                },
                                labels: {
                                    "fontSize": isMobile ? 10 : 12,
                                    "rotation": isMobile ? -45 : 0,
                                    "dx": isMobile ? -20 : 0,
                                    "dy": isMobile ? -10 : 0
                                }
                            }
                        }
                    ],
                    series: chart.series,
                    cursor: {
                        type: "XYCursor",
                        fullWidthLineX: true,
                        xAxis: 'd1',
                        lineX: {
                            strokeWidth: 0,
                            fill: am4core.color("#000"),
                            fillOpacity: 0.1
                        }
                    },
                    legend: {
                        maxHeight: 150,
                        scrollable: true,
                        position: "absolute",
                        parent: legendContainer
                    },
                    language: {
                        locale: 'ru_RU'
                    }
                };

                am4core.createFromConfig(config, chart.chartContainer, am4charts.XYChart);
            }
        });
    }

    init() {
        this.inputs = {
            unitInput: this.container.querySelectorAll('[data-unit]'),
            subject: this.container.querySelector('select[name="fields[subject]"]'),
            lastMonthTraffic: this.container.querySelector('input[name="fields[lastMonthTraffic]"]'),
            budget: this.container.querySelector('select[name="fields[budget]"]'),
            userProfit: this.container.querySelector('input[name="fields[userProfit]"]'),
            calcButton: this.container.querySelector('.js-traffic-forecast-calc-button'),
            makeOrder: this.container.querySelector('.js-traffic-forecast-make-order-button'),
        }

        this.tabs = {
            label: this.container.querySelectorAll('.js-traffic-forecast-tab'),
            chartWrapper: this.container.querySelectorAll('.js-traffic-forecast-chart'),
        }

        this.details = {
            toggler: this.container.querySelector('.js-traffic-forecast-toggler'),
            content: this.container.querySelector('.js-traffic-forecast-detail-content'),
        }

        this.errorsElement = this.container.querySelector('.js-traffic-forecast-errors');

        const date = new Date();
        let prevMonth = date.getMonth();
        if (prevMonth === 0) { // fix dec-jan crossover
            prevMonth = 11;
        }

        // binding inputs
        this.inputs.unitInput.forEach(input => {
            // initial values inputs and chart
            this.formatInput(input);

            input.addEventListener('input', () => {
                input.value = this.deleteSymbols(input.value);
            });

            input.addEventListener('focus', () => {
                input.value = this.deleteSymbols(input.value);
            });

            input.addEventListener('blur', () => {
                this.formatInput(input);
            });
        });

        this.inputs.subject.addEventListener('change', () => {
            const key = this.inputs.subject.value;
            const subject = this.data.subjectVariants[key];

            this.data.fields.subject = key;
            this.setUserProfit(subject.userProfit);
        });

        this.inputs.lastMonthTraffic.addEventListener('keyup', () => {
            this.data.fields.lastMonthTraffic = this.inputs.lastMonthTraffic.value;
        });

        this.inputs.budget.addEventListener('change', () => {
            this.data.fields.budget = this.inputs.budget.value;
        });

        this.inputs.userProfit.addEventListener('keyup', () => {
            this.data.fields.userProfit = this.inputs.userProfit.value;
        });

        // charts
        am4core.useTheme(am4themes_animated);

        this.inputs.calcButton.addEventListener('click', () => {
            this.drawChartsData();
        })

        this.inputs.makeOrder.addEventListener('click', () => {
            this.saveOrderData();
        })

        this.tabs.label.forEach(label => {
            label.addEventListener('click', () => {
                const activeTab = label.getAttribute('data-tab');

                this.tabs.label.forEach(x => x.classList.remove('is-active'));
                label.classList.add('is-active');

                this.tabs.chartWrapper.forEach(x => x.classList.remove('is-visible'));
                const panel = this.container.querySelector(`[data-chart="${activeTab}"]`);
                if (panel) {
                    panel.classList.add('is-visible');
                }
            });
        });

        this.details.toggler.addEventListener('click', () => {
            this.details.toggler.classList.toggle('is-opened');
            this.details.content.classList.toggle('is-visible');
        });

        this.drawChartsData();
    }

    loadScripts(scripts, callback) {
        for (let i = 0; i < scripts.length; i += 1) {
            if (i === scripts.length - 1) {
                this.affixScriptToHead(scripts[i], callback);
            } else {
                this.affixScriptToHead(scripts[i]);
            }
        }
    }

    lazyLoadTF() {
        if (this.isLoaded) return;

        const targetPos = this.container.getBoundingClientRect().top + window.scrollY;
        const winHeight = window.innerHeight;
        const scrollToElem = targetPos - winHeight;
        const winScrollTop = document.documentElement.scrollTop;
        if (winScrollTop > scrollToElem) {
            this.isLoaded = true;

            // charts
            this.loadScripts(this.chartScripts, this.init.bind(this));

            // pdf
            this.loadScripts(this.pdfPluginScripts, this.initPdfPlugin.bind(this));
        }
    }

    affixScriptToHead(url, onloadFunction) {
        const newScript = document.createElement('script');
        newScript.onerror = (error) => {
            throw new URIError('The script ' + error.target.src + ' didnt load correctly.');
        };
        if (onloadFunction) {
            newScript.onload = onloadFunction;
        }
        newScript.async = false; // defer load
        document.head.appendChild(newScript);
        newScript.src = url;
    }

    initPdfPlugin() {
        const pdfButton = this.container.querySelector('.js-traffic-forecast-download-pdf');
        const chartsContainer = this.container.querySelector('.js-traffic-forecast-charts-container')

        if (pdfButton) {
            pdfButton.addEventListener('click', () => {
                pdfButton.classList.add('is-loading');
                chartsContainer.classList.add('is-locked');

                let chart1;
                let chart2;
                const isMobile = window.matchMedia('(max-width: 991px)').matches;
                const invisibleCharts = this.container.querySelectorAll('.js-traffic-forecast-chart:not(.is-visible)');
                invisibleCharts.forEach(x => x.classList.add('is-visible')); // скрытый график показываем и скриншотим

                setTimeout(() => { // чтобы график успел анимироваться, else: пустой скриншот
                    const snapshot1 = new Promise((resolve) => {
                        const chartContainer = this.container.querySelector('.js-traffic-forecast-traffic-chart');
                        if (chartContainer) {
                            html2canvas(chartContainer)
                                .then((canvas) => {
                                    chart1 = canvas.toDataURL('image/png');
                                    resolve();
                                });
                        }
                    });

                    const snapshot2 = new Promise((resolve) => {
                        const chartContainer = this.container.querySelector('.js-traffic-forecast-sales-chart');
                        if (chartContainer) {
                            html2canvas(chartContainer)
                                .then((canvas) => {
                                    chart2 = canvas.toDataURL('image/png');
                                    resolve();
                                });
                        }
                    });

                    const snapshots = Promise.all([snapshot1, snapshot2]); // ждем оба скриншота

                    snapshots.then(
                        () => {
                            const docDefinition = {
                                content: [
                                    {
                                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6IAAABgCAIAAACIUljyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFF2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYTg3MzFiOSwgMjAyMS8wOS8wOS0wMDozNzozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMi0wM1QxNjo1MDozOCswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTItMDZUMTI6NTA6NTUrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMTItMDZUMTI6NTA6NTUrMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YWM4NGU0MDQtOTZkMy0w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',
                                        width: 550,
                                        alignment: 'center'
                                    },
                                    {
                                        margin: [40, 10, 40, 20],
                                        layout: {
                                            fillColor(rowIndex, node, columnIndex) {
                                                return (rowIndex % 2 === 0) ? '#ebebeb' : '#f5f5f5';
                                            }
                                        },
                                        table: {
                                            widths: ['100%'],
                                            body: [
                                                [
                                                    {
                                                        text: 'Тематика сайта',
                                                        fontSize: 9,
                                                        bold: true,
                                                    }
                                                ],
                                                [
                                                    {
                                                        text: this.inputs.subject.options[this.inputs.subject.selectedIndex].text,
                                                        fontSize: 9,
                                                        bold: true
                                                    }
                                                ],
                                                [
                                                    {
                                                        text: 'Трафик за последний месяц',
                                                        fontSize: 9,
                                                        bold: true,
                                                    }
                                                ],
                                                [
                                                    {
                                                        text: this.inputs.lastMonthTraffic.value,
                                                        fontSize: 9,
                                                        bold: true
                                                    }
                                                ],
                                                [
                                                    {
                                                        text: 'Бюджет на SEO в месяц',
                                                        fontSize: 9,
                                                        bold: true,
                                                    }
                                                ],
                                                [
                                                    {
                                                        text: this.inputs.budget.options[this.inputs.budget.selectedIndex].text,
                                                        fontSize: 9,
                                                        bold: true
                                                    }
                                                ],
                                                [
                                                    {
                                                        text: 'Доход с 1 посетителя',
                                                        fontSize: 9,
                                                        bold: true,
                                                    }
                                                ],
                                                [
                                                    {
                                                        text: this.inputs.userProfit.value,
                                                        fontSize: 9,
                                                        bold: true
                                                    }
                                                ],
                                            ],
                                        }
                                    },
                                    {
                                        text: [{
                                            text: 'Прогноз трафика',
                                            bold: true
                                        }, ' = трафик за последний месяц * коэф. сезонности * коэф. роста'],
                                        style: 'text'
                                    },
                                    {
                                        text: [{
                                            text: 'Прогноз продаж',
                                            bold: true
                                        }, ' = прогноз SEO-трафика (визиты в месяц) * доход с 1 посетителя в тематике'],
                                        style: 'text'
                                    },
                                    {
                                        text: 'Прогноз роста трафика',
                                        style: 'subtitle'
                                    },
                                    {
                                        image: chart1,
                                        fit: [isMobile ? 595 : 500, isMobile ? 500 : 350],
                                        alignment: 'center'
                                    },
                                    {
                                        text: 'Прогноз роста продаж',
                                        style: 'subtitle2',
                                        id: 'sales'
                                    },
                                    {
                                        image: chart2,
                                        fit: [isMobile ? 595 : 500, isMobile ? 500 : 350],
                                        alignment: 'center'
                                    },
                                ],
                                pageSize: {  // A4
                                    width: 595,
                                    height: 842,
                                },
                                pageOrientation: 'portrait',
                                pageMargins: [20, 0, 20, 40],
                                pageBreakBefore(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                                    return currentNode.id === 'sales' && isMobile;
                                },
                                styles: {
                                    subtitle: {
                                        fontSize: 18,
                                        bold: true,
                                        alignment: 'center',
                                        margin: [20, 10, 0, 10]
                                    },
                                    subtitle2: {
                                        fontSize: 18,
                                        bold: true,
                                        alignment: 'center',
                                        margin: [20, isMobile ? 20 : 10, 0, 10]
                                    },
                                    text: {
                                        fontSize: 12,
                                        margin: [10, 0, 0, 10]
                                    }
                                }
                            };

                            invisibleCharts.forEach(x => x.classList.remove('is-visible'));
                            pdfButton.classList.remove('is-loading');
                            chartsContainer.classList.remove('is-locked');
                            pdfMake.createPdf(docDefinition).download('PixelPlus-TrafficForecast.pdf');
                        },
                        (error) => {
                            console.warn(error);
                        }
                    );
                }, 1000);
            });
        }
    }
}
