class Extensions {
    static SGDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'SGD',
    });

    static formatCurrency(amount) {
        return this.SGDollar.format(amount);
    }

    static timeDiffInSeconds(beforeDate, afterDate) {
        return (afterDate.getTime() - beforeDate.getTime()) / 1000;
    }
}

export default Extensions;