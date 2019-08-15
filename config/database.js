if(process.env.NODE_ENV==='production'){
    module.exports={mongoURI:'mongo "mongodb+srv://cluster0-xibcw.mongodb.net/test" --username Jeevanth'}

}else{
    module.exports={mongoURI:'mongodb://localhost/vidjot-dev'}
}