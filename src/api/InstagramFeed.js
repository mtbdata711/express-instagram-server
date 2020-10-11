class InstagramFeed{

    constructor(data, nextPageFunction){
        this.data = data.data;
        this.count = this.setCount();
        this.username = this.setUsername();
        this.nextPageUrl = data.paging.next;
        this.nextPageFunction = nextPageFunction;
    }

    async nextPage(){
        return await this.nextPageFunction(this.nextPageUrl);
    }

    setCount(){
        return this.data.length;
    }

    setUsername(){
        return this.data[0].username
    }
}



module.exports = { InstagramFeed };