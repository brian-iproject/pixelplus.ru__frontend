// Данные с бекенда
window.tfData = {
    subjectVariants: {
        realty: {
            id: "realty",
            name: "Недвижимость",
            userProfit: 65,
            seasonalityCoefficient: [
                1.23,
                1.11,
                1.17,
                1.06,
                0.86,
                0.83,
                0.9,
                0.92,
                0.93,
                1.06,
                1.02,
                0.92
            ]
        },
        auto: {
            id: "auto",
            name: "Авто и транспорт",
            userProfit: 40,
            seasonalityCoefficient: [
                1.02,
                0.96,
                1.09,
                1.04,
                0.95,
                0.99,
                1.04,
                1.09,
                0.97,
                1.01,
                0.92,
                0.92
            ]
        },
        beauty: {
            id: "beauty",
            name: "Красота и здоровье",
            userProfit: 18,
            seasonalityCoefficient: [
                1.04,
                1.01,
                1.07,
                1,
                0.92,
                0.91,
                0.99,
                0.98,
                0.94,
                1.09,
                1.05,
                1.01
            ]
        },
        tourism: {
            id: "tourism",
            name: "Туризм",
            userProfit: 30,
            seasonalityCoefficient: [
                0.88,
                0.88,
                1.01,
                1.04,
                1.07,
                1.21,
                1.29,
                1.12,
                0.96,
                0.95,
                0.85,
                0.75
            ]
        },
        catering: {
            id: "catering",
            name: "Общепит",
            userProfit: 35,
            seasonalityCoefficient: [
                1.01,
                0.99,
                1.04,
                0.86,
                0.9,
                0.93,
                0.96,
                0.95,
                0.93,
                1.11,
                1.15,
                1.17
            ]
        },
        bank: {
            id: "bank",
            name: "Финансовые услуги и банки",
            userProfit: 80,
            seasonalityCoefficient: [
                1.17,
                1.08,
                1.2,
                1.12,
                0.89,
                0.85,
                0.88,
                0.89,
                0.88,
                0.98,
                1,
                1.07
            ]
        },
        eshop: {
            id: "eshop",
            name: "Интернет-магазины",
            userProfit: 35,
            seasonalityCoefficient: [
                1.11,
                1.04,
                1.11,
                0.98,
                0.93,
                0.88,
                0.9,
                0.96,
                0.92,
                1,
                1.08,
                1.07
            ]
        },
        services: {
            id: "services",
            name: "Сайты услуг",
            userProfit: 40,
            seasonalityCoefficient: [
                1.03,
                1.07,
                1.1,
                1.03,
                0.86,
                0.86,
                0.93,
                0.86,
                0.94,
                1.19,
                1.05,
                1.07
            ]
        },
        games: {
            id: "games",
            name: "Онлайн-игры",
            userProfit: 45,
            seasonalityCoefficient: [
                1.59,
                0.84,
                1.22,
                2.03,
                1.21,
                0.97,
                0.6,
                0.45,
                0.56,
                0.6,
                0.6,
                1.34
            ]
        }
    },
    budgetVariants: {
        low: {
            id: "low",
            name: "60 000 - 100 000 руб.",
            coefficient: [
                100,
                102,
                105,
                111,
                122,
                131,
                137,
                142,
                145,
                148,
                150,
                152
            ]
        },
        middle: {
            id: "middle",
            name: "100 000 - 150 000 руб.",
            coefficient: [
                100,
                103,
                107,
                116,
                129,
                141,
                150,
                157,
                163,
                169,
                173,
                177
            ]
        },
        high: {
            id: "high",
            name: "от 150 000 руб.",
            coefficient: [
                100,
                105,
                110,
                122,
                139,
                157,
                172,
                184,
                194,
                201,
                207,
                212
            ]
        }
    },
    fields: {
        subject: "eshop",
        lastMonthTraffic: 10000,
        budget: "middle",
        userProfit: 35
    }
};
