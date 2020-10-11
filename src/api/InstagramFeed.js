class InstagramFeed{

    constructor(data, nextPageFunction){
        this.data = data.data;
        this.count = this.setCount();
        this.account = this.setAccount();
        this.nextPageUrl = data.paging.next;
        this.nextPageFunction = nextPageFunction;
    }

    async nextPage(){
        return await this.nextPageFunction(this.nextPageUrl);
    }

    setCount(){
        return this.data.length;
    }

    setAccount(){
        return this.data[0].username
    }
}



module.exports = { InstagramFeed };