var vmHub = new Vue();

var productComponent = Vue.extend({
    template: "#product",
    props: ['sortPro', 'startPro', 'countPro'],
    methods: {
        doPutCart: function (product) {
            var productInfos = {
                index: product.index,
                name: product.name,
                price: product.price,
                amount: 1
            };
            vmHub.$emit('getProductInfos', productInfos);
        }
    }
});

var searchComponent = Vue.extend({
    template: "#search",
    props: ['searchTerm'],
    methods: {
        doGetProduct: function (search) {
            vmHub.$emit('getSearchTerm', search);
        }
    }
});

var cartComponent = Vue.extend({
    template: "#cart",
    data: function () {
        return {
            product: []
        }
    },
    mounted: function () {
        var self = this;
        vmHub.$on('getProductInfos', function (val) {
            var productIndex = self.product.findIndex(function (p) {
                return p.index == val.index;
            });

            if (productIndex == -1) {
                self.product.push(val);
            }
            else {
                self.product[productIndex].amount++;
            }
        });
    },
    computed: {
        computSubTotal: function () {
            var sum = 0;

            for (var i = 0; i < this.product.length; i++) {
                var sum = sum + this.product[i].amount * this.product[i].price
            }

            return sum;
        }
    },
    methods: {
        add: function (productInfos) {
            this.product[productInfos.index].amount++;
        },
        reduce: function (productInfos) {
            if (productInfos.amount - 1 == 0) {
                var productIndex = this.product.findIndex(function (p) {
                    return p.index == productInfos.index;
                });
                return this.product.splice(productIndex, 1);
            } else {
                return productInfos.amount--;
            }
        }
    }
});

var pagerComponent = Vue.extend({
    template: "#pager",
    props: ['currentPg', 'totalPg'],
    data: function(){
        return{
            showNum: 10,
            preNum: 5,
        }
    },
    watch: {
        currentPg: function (val) {
            vmHub.$emit('getCurrentPage', val);

            return this.setPager(this.preNum, this.showNum, val, this.totalPg);
        },
        totalPg: function (val) {
            return this.setPager(this.preNum, this.showNum, this.currentPg, val);
        }
    },
    computed: {
        computPager: function () {
            return this.setPager(this.preNum, this.showNum, this.currentPg, this.totalPg);
        }
    },
    methods: {
        setPage: function (page) {
            if (page <= 0 || page > this.totalPg) {
                return;
            }
            this.currentPg = page;
        },
        setPager: function (preNum, showNum, currentNum, totalNum) {
            var la_pager = [];
            la_pager.length = 0;

            if (totalNum > showNum) {
                //current page 置中
                if (currentNum < (preNum + 1)) {
                    for (var i = 1; i <= showNum; i++) {
                        la_pager.push(i);
                    }
                }
                else if (currentNum > (totalNum - (showNum - preNum - 1))) {
                    for (var i = (totalNum - (showNum - 1)); i <= totalNum; i++) {
                        la_pager.push(i);
                    }
                }
                else if (currentNum >= (preNum + 1) && currentNum <= (totalNum - (showNum - preNum - 1))) {
                    for (var i = (currentNum - preNum); i <= (currentNum + (showNum - preNum - 1)); i++) {
                        la_pager.push(i);
                    }
                }
            }
            else if (totalNum == 0) {
                for (var i = 1; i <= 1; i++) {
                    la_pager.push(i);
                }
            }
            else {
                for (var i = 1; i <= totalNum; i++) {
                    la_pager.push(i);
                }
            }

            return la_pager;
        }
    }
});

var vm = new Vue({
    el: "#cart-app",
    mounted: function () {
        var self = this;
        self.getData();
        vmHub.$on('getSearchTerm', function (val) {
            self.searchTerms = val;
            self.currentPage = 1;
        });
        vmHub.$on('getCurrentPage', function (val) {
            self.currentPage = val;
        });
    },
    data: {
        product: [],
        searchTerms: "",
        currentPage: 1,
        countOfProduct: 5
    },
    computed: {
        sortProduct: function () {
            var search = this.searchTerms;

            if (search == "") {
                return this.product;
            }
            else {
                return this.product.filter(function (p) {
                    return p.name.toLowerCase().indexOf(search.toLowerCase()) > 1;
                });
            }
        },
        startProduct: function () {
            return (this.currentPage - 1) * this.countOfProduct;
        },
        totalPage: function () {
            return Math.ceil(this.sortProduct.length / this.countOfProduct);
        }
    },
    methods: {
        getData: function () {
            var self = this;
            axios.get('../pros-list.json').then(function (res) {
                self.product = res.data;
            }).catch(function (err) {
                console.log(err);
            });
        }
    },
    components: {
        'product-component': productComponent,
        'search-component': searchComponent,
        'cart-component': cartComponent,
        'pager-component': pagerComponent
    }
});