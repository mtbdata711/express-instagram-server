const { getNextPage } = require("./InstagramAPI");

class InstagramFeed{

    constructor(data){
        this.data = data.data;
        this.count = this.setCount();
        this.account = this.setAccount();
        this.nextPageUrl = data.paging.next;
    }

    nextPage(){
        return getNextPage(this.nextPageUrl);
    }

    setCount(){
        return this.data.length;
    }

    setAccount(){
        return this.data[0].username
    }
}



module.exports = { InstagramFeed };