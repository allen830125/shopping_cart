var vm = new Vue({
    el: "#cart-app",
    data: {
        product: [],
        sortProduct: [],
        showProduct: [],
        showPager: [],
        search: '',
        cartProductInfos: [],
        amountProduct: 5,
        amountPage: 0,
        indexPage: 1,
        prePage: [],
        nextPage: [2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    created: function() {
        this.doGetData();
    },
    computed: {
        computSubtotale: function() {
            var sum = 0;

            for (var i = 0; i < this.cartProductInfos.length; i++) {
                sum = sum + this.cartProductInfos[i].price * this.cartProductInfos[i].amount;
            }

            return sum;
        }
    },
    watch: {
        indexPage: function(val) {
            var totalPage = this.sortProduct.length / this.amountProduct;

            this.amountPage = (totalPage % 1 != 0) ? parseInt(totalPage) + 1 : totalPage;
            this.prePage.length = 0;
            this.nextPage.length = 0;

            if (this.indexPage < 6) {
                for (var i = 1; i < this.indexPage; i++) {
                    this.prePage.push(i);
                }
                for (var i = this.indexPage + 1; i <= 10; i++) {
                    this.nextPage.push(i)
                }
            } else if (this.indexPage > this.amountPage - 4) {
                for (var i = this.amountPage - 9; i < this.indexPage; i++) {
                    this.prePage.push(i);
                }
                for (var i = this.indexPage + 1; i <= this.amountPage; i++) {
                    this.nextPage.push(i)
                }
            } else if (this.indexPage >= 6 && this.indexPage <= this.amountPage - 4) {
                for (var i = this.indexPage - 5; i < this.indexPage; i++) {
                    this.prePage.push(i);
                }
                for (var i = this.indexPage + 1; i <= this.indexPage + 4; i++) {
                    this.nextPage.push(i)
                }
            }
        }
    },
    methods: {
        doGetData: function() {
            var self = this;
            axios.get('../pros-list.json').then(function(res) {
                self.product = res.data;
                self.doPutToSortData(res.data);
            }).catch(function(err) {
                console.log(err);
            });
        },
        doPutToSortData: function(obj) {
            this.sortProduct.length = 0;

            for (var i = 0; i < obj.length; i++) {
                this.sortProduct.push(obj[i]);
            }
            this.indexPage = 1;
            this.doShowProduct(this.indexPage);
        },
        doPutCart: function(obj) {
            var productInfo = {
                index: obj.index,
                name: obj.name,
                price: obj.price,
                amount: 1
            };

            this.cartProductInfos.push(productInfo);
        },
        doSearch: function() {
            var self = this;
            this.sortProduct = this.product.filter(function(p) {
                if (this.search === '') {
                    return this.product;
                } else {
                    return p.name.toLowerCase().indexOf(self.search.toLowerCase()) > -1;
                }
            });

            this.indexPage = 1;
            this.doShowProduct(this.indexPage);
        },
        doAddAmount: function(obj) {
            return obj.amount++;
        },
        doReduceAmount: function(obj) {
            if (obj.amount - 1 == 0) {
                return this.cartProductInfos.pop(obj);
            } else {
                return obj.amount--;
            }
        },
        doShowProduct: function(obj) {
            this.showProduct.length = 0;

            this.indexPage = obj;
            this.amountPage = this.sortProduct.length / this.amountProduct;

            var startNum = 5 * (this.indexPage - 1);
            var lastNum = startNum + this.amountProduct;
            console.log(this.sortProduct.length);

            var sortProductLength = this.sortProduct.length - startNum;

            if (sortProductLength == 0) {
                this.showProduct = [];
            } else {
                if (sortProductLength < this.amountProduct) {
                    for (var i = 0; i < sortProductLength; i++) {
                        this.showProduct.push(this.sortProduct[i + startNum]);
                    }
                } else {
                    for (var i = startNum; i < lastNum; i++) {
                        this.showProduct.push(this.sortProduct[i]);
                    }
                }
            }
            console.log(this.indexPage);
        },
        doNextPage: function() {
            if (this.indexPage == this.amountPage) {
                this.indexPage = this.indexPage;
            } else {
                this.indexPage++;
            }
            this.doShowProduct(this.indexPage);
        },
        doPrePage: function() {
            if (this.indexPage == 1) {
                this.indexPage = this.indexPage;
            } else {
                this.indexPage--;
            }
            this.doShowProduct(this.indexPage);
        }
    }
});