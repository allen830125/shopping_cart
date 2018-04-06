var vm = new Vue({
    el: '#cart-app',
    data: {
        items: [],
        searchName: "",
        currPage: 1,
        countOfPage: 7,
        carts:[],
        total: 0

    },
    mounted() {
        this.getProItems();
    },
    computed: {
        pageStart(){
            return (this.currPage - 1) * this.countOfPage;
        },
        totalPage(){
            return Math.ceil(this.filteredItems.length / this.countOfPage);
        },
        filteredItems(){
            var searchName = this.searchName;
            if (searchName === "") {
                return this.items;
            } else {

                return this.items.filter(function (d) {
                    return d.name.indexOf(searchName) > -1;
                })
            }

        }
    },
    watch: {},
    methods: {
        add(item){
            item.qty ++;
            this.total += item.price;
        },
        remove(item){
            item.qty --;
            this.total -= item.price;
            if(item.qty === 0){
                this.carts.splice(this.carts.findIndex((d)=>{
                     return d.id === item.id;
                }),1)
            }
        },
        addItem(index){
            var item = this.items[index];
            var found = false;
            this.total += item.price;

            for(let i =0 ; i < this.carts.length; i++){
                if( this.carts[i].id === item.id){
                    found = true;
                    this.carts[i].qty++;
                    break;
                }
            }

            if(!found){
                this.carts.push({
                    id:item.id,
                    name:item.name,
                    price: item.price,
                    qty:1
                });
            }
        },
        setPage(page){
            if (page <= 0 || page > this.totalPage) {
                return;
            }
            this.currPage = page;
        },
        //取得產品資料
        getProItems: function () {
            axios.get("./pros-list.json")
                .then((respose) => {
                    vm.items = respose.data;
                })
        }
    }
});
