(function(template){
    template.response = function(res,err,data){
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(200).json(data);
        }
        
    }

})(module.exports)




